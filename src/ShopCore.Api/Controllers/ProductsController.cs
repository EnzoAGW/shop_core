using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopCore.Application.DTOs;
using ShopCore.Application.Interfaces;

namespace ShopCore.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IShopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? categoryId,
        [FromQuery] string? search,
        CancellationToken ct)
    {
        var query = db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        var products = await query
            .OrderBy(p => p.Name)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl, p.Category.Name))
            .ToListAsync(ct);

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var p = await db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.Id == id)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl, p.Category.Name))
            .FirstOrDefaultAsync(ct);

        return p is null ? NotFound() : Ok(p);
    }
}
