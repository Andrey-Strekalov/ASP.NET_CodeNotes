namespace ASP.NET_CodeNotes.Dto;

public record TagDto(int Id, string Name, DateTime CreatedAt);

public record CreateTagDto(string Name);

public record UpdateTagDto(string Name);
