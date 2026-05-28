using ASP.NET_CodeNotes.Data;
using ASP.NET_CodeNotes.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CodeNotes.Services;

public class NoteService : INoteService
{
    private readonly ApplicationDbContext _context;

    public NoteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Note>> GetUserNotesAsync(string userId)
    {
        return await _context.Notes
            .Include(n => n.NoteTags)
            .ThenInclude(nt => nt.Tag)
            .Where(n => n.OwnerId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Note?> GetNoteByIdAsync(int id, string userId)
    {
        return await _context.Notes
            .Include(n => n.NoteTags)
            .ThenInclude(nt => nt.Tag)
            .FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);
    }

    public async Task<Note> CreateNoteAsync(Note note, string userId, int[] selectedTags)
    {
        note.OwnerId = userId;
        note.CreatedAt = DateTime.UtcNow;
        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        await ReplaceTagsAsync(note, userId, selectedTags);
        return note;
    }

    public async Task<Note?> UpdateNoteAsync(Note note, string userId, int[] selectedTags)
    {
        var existing = await _context.Notes
            .Include(n => n.NoteTags)
            .FirstOrDefaultAsync(n => n.Id == note.Id && n.OwnerId == userId);

        if (existing is null) return null;

        existing.Title = note.Title;
        existing.Content = note.Content;

        await ReplaceTagsAsync(existing, userId, selectedTags);
        return existing;
    }

    public async Task<bool> DeleteNoteAsync(int id, string userId)
    {
        var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.OwnerId == userId);
        if (note is null) return false;

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task ReplaceTagsAsync(Note note, string userId, int[] selectedTags)
    {
        note.NoteTags.Clear();

        var tagIds = (selectedTags ?? Array.Empty<int>()).Distinct().ToArray();
        if (tagIds.Length == 0)
        {
            await _context.SaveChangesAsync();
            return;
        }

        var allowedTags = await _context.Tags
            .Where(t => t.OwnerId == userId && tagIds.Contains(t.Id))
            .Select(t => t.Id)
            .ToListAsync();

        foreach (var tagId in allowedTags)
        {
            note.NoteTags.Add(new NoteTag { NoteId = note.Id, TagId = tagId });
        }

        await _context.SaveChangesAsync();
    }
}

