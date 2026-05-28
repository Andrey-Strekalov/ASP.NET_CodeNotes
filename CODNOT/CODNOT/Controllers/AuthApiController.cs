using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ASP.NET_CodeNotes.Data;
using ASP.NET_CodeNotes.Dto;
using ASP.NET_CodeNotes.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ASP.NET_CodeNotes.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthApiController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthApiController(
        UserManager<User> userManager,
        ApplicationDbContext context,
        IConfiguration config)
    {
        _userManager = userManager;
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (dto.Password != dto.ConfirmPassword)
            return BadRequest(new { message = "Пароли не совпадают" });

        var existing = await _userManager.FindByNameAsync(dto.Username);
        if (existing is not null)
            return BadRequest(new { message = "Пользователь с таким именем уже существует" });

        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { message = string.Join("; ", errors) });
        }

        var accessToken = GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, rememberMe: false);

        return Ok(new AuthResponseDto(
            accessToken,
            refreshToken,
            new UserInfoDto(user.Id, user.UserName!, user.Email)
        ));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { message = "Неверный логин или пароль" });

        var accessToken = GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, dto.RememberMe);

        return Ok(new AuthResponseDto(
            accessToken,
            refreshToken,
            new UserInfoDto(user.Id, user.UserName!, user.Email)
        ));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshDto dto)
    {
        var stored = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);

        if (stored is null || stored.IsRevoked || stored.ExpiresAt <= DateTime.UtcNow)
            return Unauthorized(new { message = "Недействительный или просроченный refresh-токен" });

        stored.IsRevoked = true;
        // CreateRefreshTokenAsync saves all pending changes (including IsRevoked=true) via SaveChangesAsync
        var newRefreshToken = await CreateRefreshTokenAsync(stored.UserId, rememberMe: false);
        var newAccessToken = GenerateAccessToken(stored.User);

        return Ok(new AuthResponseDto(
            newAccessToken,
            newRefreshToken,
            new UserInfoDto(stored.User.Id, stored.User.UserName!, stored.User.Email)
        ));
    }

    [HttpPost("logout")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> Logout([FromBody] RefreshDto dto)
    {
        var stored = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);

        if (stored is not null)
        {
            stored.IsRevoked = true;
            await _context.SaveChangesAsync();
        }

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user is null) return NotFound();

        return Ok(new UserInfoDto(user.Id, user.UserName!, user.Email));
    }

    private string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expiry = int.Parse(_config["Jwt:AccessTokenExpirationMinutes"]!);
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiry),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<string> CreateRefreshTokenAsync(string userId, bool rememberMe)
    {
        var tokenBytes = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(tokenBytes);

        var expiryDays = rememberMe
            ? int.Parse(_config["Jwt:RefreshTokenRememberMeDays"]!)
            : int.Parse(_config["Jwt:RefreshTokenExpirationDays"]!);

        var refreshToken = new RefreshToken
        {
            Token = token,
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return token;
    }
}
