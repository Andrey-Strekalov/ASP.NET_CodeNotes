namespace ASP.NET_CodeNotes.Dto;

public record TagInNoteDto(int Id, string Name);

public record NoteDto(
    int Id,
    string Title,
    string? Content,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<TagInNoteDto> Tags);

public record CreateNoteDto(string Title, string? Content, int[]? TagIds);

public record UpdateNoteDto(string Title, string? Content, int[]? TagIds);
