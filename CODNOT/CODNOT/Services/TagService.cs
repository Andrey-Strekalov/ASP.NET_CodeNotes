using ASP.NET_CodeNotes.Data;
using ASP.NET_CodeNotes.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CodeNotes.Services;

public class TagService : ITagService
{
    private readonly ApplicationDbContext _context;

    public TagService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Tag>> GetUserTagsAsync(string userId)
    {
        return await _context.Tags
            .Where(t => t.OwnerId == userId)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Tag?> GetTagByIdAsync(int id, string userId)
    {
        return await _context.Tags.FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);
    }

    public async Task<Tag> CreateTagAsync(Tag tag, string userId)
    {
        tag.OwnerId = userId;
        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();
        return tag;
    }

    public async Task<Tag?> UpdateTagAsync(Tag tag, string userId)
    {
        var existing = await _context.Tags.FirstOrDefaultAsync(t => t.Id == tag.Id && t.OwnerId == userId);
        if (existing is null) return null;

        existing.Name = tag.Name;
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteTagAsync(int id, string userId)
    {
        var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);
        if (tag is null) return false;

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
        return true;
    }
}

