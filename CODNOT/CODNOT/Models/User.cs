using Microsoft.AspNetCore.Identity;

namespace ASP.NET_CodeNotes.Models;

public class User : IdentityUser, IHasUpdatedAt
{
    public string? Avatar { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Settings { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Note> Notes { get; set; } = new List<Note>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}