using ASP.NET_CodeNotes.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CodeNotes.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();

        var userManager = services.GetRequiredService<UserManager<User>>();

        // demo user for quick start
        const string demoUserName = "demo";
        const string demoEmail = "demo@demo.local";
        const string demoPassword = "Demo123!";

        var user = await userManager.FindByNameAsync(demoUserName);
        if (user is null)
        {
            user = new User { UserName = demoUserName, Email = demoEmail, EmailConfirmed = true };
            var created = await userManager.CreateAsync(user, demoPassword);
            if (!created.Succeeded)
            {
                return;
            }
        }

        if (await context.Notes.AnyAsync(n => n.OwnerId == user.Id))
        {
            return;
        }

        Tag AddTag(string name)
        {
            var t = new Tag { Name = name, OwnerId = user.Id, CreatedAt = DateTime.UtcNow };
            context.Tags.Add(t);
            return t;
        }

        var tagAspNet = AddTag("aspnet");
        var tagEfCore = AddTag("efcore");
        var tagSprint = AddTag("sprint");
        await context.SaveChangesAsync();

        Note AddNote(string title, string content)
        {
            var n = new Note
            {
                Title = title,
                Content = content,
                OwnerId = user.Id,
                CreatedAt = DateTime.UtcNow
            };
            context.Notes.Add(n);
            return n;
        }

        var note1 = AddNote("Заголовок 1", "код, текст заметки 1 c тегами efcore и aspnet");
        var note2 = AddNote("Заголовок 2", "Код сохраненный в заметке 2 с тегом Sprint");
        var note3 = AddNote("Заголовок 3", "Код сохраненный в заметке 2 с тегом Sprint");
        await context.SaveChangesAsync();

        context.NoteTags.AddRange(
            new NoteTag { NoteId = note1.Id, TagId = tagAspNet.Id },
            new NoteTag { NoteId = note1.Id, TagId = tagEfCore.Id },
            new NoteTag { NoteId = note2.Id, TagId = tagSprint.Id },
            new NoteTag { NoteId = note3.Id, TagId = tagSprint.Id }
        );
        await context.SaveChangesAsync();
    }
}

