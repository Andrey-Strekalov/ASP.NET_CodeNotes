namespace ASP.NET_CodeNotes.Dto;

public record RegisterDto(string Username, string Email, string Password, string ConfirmPassword);

public record LoginDto(string Username, string Password, bool RememberMe = false);

public record RefreshDto(string RefreshToken);

public record UserInfoDto(string Id, string Username, string? Email);

public record AuthResponseDto(string AccessToken, string RefreshToken, UserInfoDto User);
