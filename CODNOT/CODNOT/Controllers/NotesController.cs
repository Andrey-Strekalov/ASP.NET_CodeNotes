using ASP.NET_CodeNotes.Data;
using ASP.NET_CodeNotes.Models;
using ASP.NET_CodeNotes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ASP.NET_CodeNotes.Controllers;

[Authorize]
public class NotesController : Controller
{
    private readonly INoteService _noteService;
    private readonly ApplicationDbContext _context;

    public NotesController(INoteService noteService, ApplicationDbContext context)
    {
        _noteService = noteService;
        _context = context;
    }

    // GET: /Notes
    public async Task<IActionResult> Index()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var notes = await _noteService.GetUserNotesAsync(userId);
        return View(notes);
    }

    // GET: /Notes/Details/5
    public async Task<IActionResult> Details(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var note = await _noteService.GetNoteByIdAsync(id, userId);
        if (note is null) return NotFound();
        return View(note);
    }

    // GET: /Notes/Create
    public async Task<IActionResult> Create()
    {
        await LoadViewBags();
        return View();
    }

    // POST: /Notes/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Note note, int[] selectedTags)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _noteService.CreateNoteAsync(note, userId, selectedTags);
            return RedirectToAction(nameof(Index));
        }

        await LoadViewBags();
        return View(note);
    }

    // GET: /Notes/Edit/5
    public async Task<IActionResult> Edit(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var note = await _noteService.GetNoteByIdAsync(id, userId);
        if (note is null) return NotFound();

        await LoadViewBags();
        ViewBag.SelectedTags = note.NoteTags.Select(nt => nt.TagId).ToArray();
        return View(note);
    }

    // POST: /Notes/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Note note, int[] selectedTags)
    {
        if (id != note.Id) return NotFound();

        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var updated = await _noteService.UpdateNoteAsync(note, userId, selectedTags);
            if (updated is null) return NotFound();
            return RedirectToAction(nameof(Index));
        }

        await LoadViewBags();
        return View(note);
    }

    // POST: /Notes/Delete/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var ok = await _noteService.DeleteNoteAsync(id, userId);
        if (!ok) return NotFound();
        return RedirectToAction(nameof(Index));
    }

    private async Task LoadViewBags()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var tags = await _context.Tags
            .Where(t => t.OwnerId == userId)
            .OrderBy(t => t.Name)
            .ToListAsync();

        ViewBag.Tags = tags;
        ViewBag.TagsSelectList = new MultiSelectList(tags, "Id", "Name");
    }
}

