using System.ComponentModel.DataAnnotations;

namespace ASP.NET_CodeNotes.Models;

public class Tag : IHasUpdatedAt
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Название тега обязательно")]
    [StringLength(50, ErrorMessage = "Название тега не может быть длиннее 50 символов")]
    public string Name { get; set; } = string.Empty;

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [DataType(DataType.DateTime)]
    public DateTime? UpdatedAt { get; set; }

    public ICollection<NoteTag> NoteTags { get; set; } = new List<NoteTag>();
}
