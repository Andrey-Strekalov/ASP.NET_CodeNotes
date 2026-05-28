using System.Security.Claims;
using ASP.NET_CodeNotes.Dto;
using ASP.NET_CodeNotes.Models;
using ASP.NET_CodeNotes.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET_CodeNotes.Controllers;

[ApiController]
[Route("api/notes")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NotesApiController : ControllerBase
{
    private readonly INoteService _noteService;

    public NotesApiController(INoteService noteService)
    {
        _noteService = noteService;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notes = await _noteService.GetUserNotesAsync(UserId);
        return Ok(notes.Select(MapToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var note = await _noteService.GetNoteByIdAsync(id, UserId);
        if (note is null) return NotFound(new { message = "Заметка не найдена" });
        return Ok(MapToDto(note));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNoteDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Заголовок обязателен" });

        var note = new Note { Title = dto.Title, Content = dto.Content };
        var created = await _noteService.CreateNoteAsync(note, UserId, dto.TagIds ?? []);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateNoteDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Заголовок обязателен" });

        var note = new Note { Id = id, Title = dto.Title, Content = dto.Content };
        var updated = await _noteService.UpdateNoteAsync(note, UserId, dto.TagIds ?? []);
        if (updated is null) return NotFound(new { message = "Заметка не найдена" });
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _noteService.DeleteNoteAsync(id, UserId);
        if (!ok) return NotFound(new { message = "Заметка не найдена" });
        return NoContent();
    }

    private static NoteDto MapToDto(Note note) => new(
        note.Id,
        note.Title,
        note.Content,
        note.CreatedAt,
        note.UpdatedAt,
        note.NoteTags.Select(nt => new TagInNoteDto(nt.Tag.Id, nt.Tag.Name)).ToList()
    );
}
