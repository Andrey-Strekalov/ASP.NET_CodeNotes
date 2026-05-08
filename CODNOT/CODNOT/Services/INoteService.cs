using ASP.NET_CodeNotes.Models;

namespace ASP.NET_CodeNotes.Services;

public interface INoteService
{
    Task<IReadOnlyList<Note>> GetUserNotesAsync(string userId);
    Task<Note?> GetNoteByIdAsync(int id, string userId);
    Task<Note> CreateNoteAsync(Note note, string userId, int[] selectedTags);
    Task<Note?> UpdateNoteAsync(Note note, string userId, int[] selectedTags);
    Task<bool> DeleteNoteAsync(int id, string userId);
}

