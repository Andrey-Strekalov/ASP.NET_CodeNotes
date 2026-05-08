using ASP.NET_CodeNotes.Models;

namespace ASP.NET_CodeNotes.Services;

public interface ITagService
{
    Task<IReadOnlyList<Tag>> GetUserTagsAsync(string userId);
    Task<Tag?> GetTagByIdAsync(int id, string userId);
    Task<Tag> CreateTagAsync(Tag tag, string userId);
    Task<Tag?> UpdateTagAsync(Tag tag, string userId);
    Task<bool> DeleteTagAsync(int id, string userId);
}

