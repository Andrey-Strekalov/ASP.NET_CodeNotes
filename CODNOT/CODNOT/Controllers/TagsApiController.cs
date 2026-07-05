using System.Security.Claims;
using ASP.NET_CodeNotes.Dto;
using ASP.NET_CodeNotes.Models;
using ASP.NET_CodeNotes.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET_CodeNotes.Controllers;

[ApiController]
[Route("api/tags")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class TagsApiController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagsApiController(ITagService tagService)
    {
        _tagService = tagService;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await _tagService.GetUserTagsAsync(UserId);
        return Ok(tags.Select(MapToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Название тега обязательно" });

        var tag = new Tag { Name = dto.Name.Trim() };
        var created = await _tagService.CreateTagAsync(tag, UserId);
        return CreatedAtAction(nameof(GetAll), MapToDto(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTagDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Название тега обязательно" });

        var tag = new Tag { Id = id, Name = dto.Name.Trim() };
        var updated = await _tagService.UpdateTagAsync(tag, UserId);
        if (updated is null) return NotFound(new { message = "Тег не найден" });
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _tagService.DeleteTagAsync(id, UserId);
        if (!ok) return NotFound(new { message = "Тег не найден" });
        return NoContent();
    }

    private static TagDto MapToDto(Tag tag) => new(tag.Id, tag.Name, tag.CreatedAt);
}
