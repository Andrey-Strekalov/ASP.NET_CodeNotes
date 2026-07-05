using ASP.NET_CodeNotes.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CodeNotes.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Note> Notes => Set<Note>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<NoteTag> NoteTags => Set<NoteTag>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tag>()
            .HasIndex(t => new { t.Name, t.OwnerId })
            .IsUnique();

        modelBuilder.Entity<Note>()
            .HasOne(n => n.Owner)
            .WithMany(u => u.Notes)
            .HasForeignKey(n => n.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Tag>()
            .HasOne(t => t.Owner)
            .WithMany(u => u.Tags)
            .HasForeignKey(t => t.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NoteTag>()
            .HasOne(nt => nt.Note)
            .WithMany(n => n.NoteTags)
            .HasForeignKey(nt => nt.NoteId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NoteTag>()
            .HasOne(nt => nt.Tag)
            .WithMany(t => t.NoteTags)
            .HasForeignKey(nt => nt.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is IHasUpdatedAt &&
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            ((IHasUpdatedAt)entry.Entity).UpdatedAt = DateTime.UtcNow;
        }
    }
}