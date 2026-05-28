using System.ComponentModel.DataAnnotations;

namespace ASP.NET_CodeNotes.ViewModels;

public class LoginViewModel
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Запомнить меня")]
    public bool RememberMe { get; set; }
}

