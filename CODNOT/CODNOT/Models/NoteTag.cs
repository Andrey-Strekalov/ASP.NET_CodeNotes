using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CodeNotes.Models;

[PrimaryKey(nameof(NoteId), nameof(TagId))]
public class NoteTag : IHasUpdatedAt
{
    public int NoteId { get; set; }
    public int TagId { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Note Note { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}