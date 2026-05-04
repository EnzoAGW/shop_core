using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopCore.Application.Interfaces;

namespace ShopCore.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(IShopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var categories = await db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new { c.Id, c.Name })
            .ToListAsync(ct);

        return Ok(categories);
    }
}
