using ASP.NET_CodeNotes.Models;
using ASP.NET_CodeNotes.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ASP.NET_CodeNotes.Controllers;

[Authorize]
public class TagsController : Controller
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    // GET: /Tags
    public async Task<IActionResult> Index()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var tags = await _tagService.GetUserTagsAsync(userId);
        return View(tags);
    }

    // GET: /Tags/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: /Tags/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Tag tag)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _tagService.CreateTagAsync(tag, userId);
            return RedirectToAction(nameof(Index));
        }
        return View(tag);
    }

    // GET: /Tags/Edit/5
    public async Task<IActionResult> Edit(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var tag = await _tagService.GetTagByIdAsync(id, userId);
        if (tag is null) return NotFound();
        return View(tag);
    }

    // POST: /Tags/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Tag tag)
    {
        if (id != tag.Id) return NotFound();

        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var updated = await _tagService.UpdateTagAsync(tag, userId);
            if (updated is null) return NotFound();
            return RedirectToAction(nameof(Index));
        }
        return View(tag);
    }

    // POST: /Tags/Delete/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var ok = await _tagService.DeleteTagAsync(id, userId);
        if (!ok) return NotFound();
        return RedirectToAction(nameof(Index));
    }
}

