namespace ASP.NET_CodeNotes.Models;

public interface IHasUpdatedAt
{
    DateTime? UpdatedAt { get; set; }
}
