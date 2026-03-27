using ASP.NET_CodeNotes.Data;
using ASP.NET_CodeNotes.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

static void SeedData(IServiceProvider serviceProvider)
{
    using var scope = serviceProvider.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    context.Database.Migrate();

    //if (context.Notes.Any() || context.Tags.Any())
    //{
    //    return;
    //}

    using var transaction = context.Database.BeginTransaction();

    try
    {
        var tagAspNet = new Tag { Name = "aspnet" };
        var tagEfCore = new Tag { Name = "efcore" };
        var tagSprint = new Tag { Name = "sprint" };

        context.Tags.AddRange(tagAspNet, tagEfCore, tagSprint);
        context.SaveChanges();

        var notes = new[]
        {
            new Note ()
                {
                    Title = "Заголовок 1",
                    Content = "код, текст заметки 1 c тегами efcore и aspnet",
                    CreatedAt = DateTime.UtcNow,

                },
            new Note()
                {
                    Title = "Заголовок 2",
                    Content = "Код сохраненный в заметке 2 с тегом Sprint",
                    CreatedAt = DateTime.UtcNow,
                },
            new Note()
                {
                    Title = "Заголовок 3",
                    Content = "Код сохраненный в заметке 2 с тегом Sprint",
                    CreatedAt = DateTime.UtcNow,
                }
        };

        context.Notes.AddRange(notes);
        context.SaveChanges();

        var noteTags = new[]
        {
            new NoteTag { NoteId = notes[0].Id, TagId = tagAspNet.Id },
            new NoteTag { NoteId = notes[0].Id, TagId = tagEfCore.Id },
            new NoteTag { NoteId = notes[1].Id, TagId = tagSprint.Id },
            new NoteTag { NoteId = notes[2].Id, TagId = tagSprint.Id }
        };

        context.NoteTags.AddRange(noteTags);
        context.SaveChanges();

        transaction.Commit();
    }
    catch
    {
        transaction.Rollback();
        throw;
    }
}

SeedData(app.Services);

app.Run();
