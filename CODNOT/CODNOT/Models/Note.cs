using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace ASP.NET_CodeNotes.Models;

public class Note : IHasUpdatedAt
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Заголовок заметки обязателен")]
    [StringLength(200, ErrorMessage = "Заголовок не может быть длиннее 200 символов")]
    public string Title { get; set; } = string.Empty;

    [StringLength(40000, ErrorMessage = "Текст заметки не может быть длиннее 40000 символов")]
    public string? Content { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [DataType(DataType.DateTime)]
    public DateTime? UpdatedAt { get; set; }

    [BindNever]
    public string OwnerId { get; set; } = string.Empty;

    [ValidateNever]
    public User Owner { get; set; } = null!;

    [ValidateNever]
    public ICollection<NoteTag> NoteTags { get; set; } = new List<NoteTag>();

}
