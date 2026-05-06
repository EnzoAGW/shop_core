using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopCore.Application.DTOs;
using ShopCore.Application.Interfaces;
using ShopCore.Domain.Entities;

namespace ShopCore.Api.Controllers;

[ApiController]
[Route("api/seller")]
[Authorize]
public class SellerController(IShopDbContext db) : ControllerBase
{
    private string UserEmail =>
        User.FindFirstValue(ClaimTypes.Email) ??
        User.FindFirstValue("email") ??
        throw new UnauthorizedAccessException("Email claim not found.");

    // ── Store ────────────────────────────────────────────────────────────────

    [HttpGet("store")]
    public async Task<IActionResult> GetStore(CancellationToken ct)
    {
        var store = await db.Stores
            .Where(s => s.OwnerEmail == UserEmail)
            .Select(s => new StoreDto(
                s.Id, s.Name, s.Description, s.LogoUrl, s.CreatedAt,
                s.Products.Count(p => p.IsActive)))
            .FirstOrDefaultAsync(ct);

        return store is null ? NotFound() : Ok(store);
    }

    [HttpPost("store")]
    public async Task<IActionResult> CreateStore([FromBody] CreateStoreDto dto, CancellationToken ct)
    {
        if (await db.Stores.AnyAsync(s => s.OwnerEmail == UserEmail, ct))
            return Conflict(new { error = "You already have a store." });

        var store = new Store
        {
            Name        = dto.Name,
            Description = dto.Description,
            LogoUrl     = dto.LogoUrl,
            OwnerEmail  = UserEmail,
        };

        db.Stores.Add(store);
        await db.SaveChangesAsync(ct);

        return Ok(new StoreDto(store.Id, store.Name, store.Description, store.LogoUrl, store.CreatedAt, 0));
    }

    [HttpPut("store")]
    public async Task<IActionResult> UpdateStore([FromBody] UpdateStoreDto dto, CancellationToken ct)
    {
        var store = await db.Stores.FirstOrDefaultAsync(s => s.OwnerEmail == UserEmail, ct);
        if (store is null) return NotFound();

        store.Name        = dto.Name;
        store.Description = dto.Description;
        store.LogoUrl     = dto.LogoUrl;

        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Products ─────────────────────────────────────────────────────────────

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts(CancellationToken ct)
    {
        var store = await db.Stores.FirstOrDefaultAsync(s => s.OwnerEmail == UserEmail, ct);
        if (store is null) return NotFound(new { error = "Create a store first." });

        var products = await db.Products
            .Include(p => p.Category)
            .Where(p => p.StoreId == store.Id && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl, p.Category.Name))
            .ToListAsync(ct);

        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateSellerProductDto dto, CancellationToken ct)
    {
        var store = await db.Stores.FirstOrDefaultAsync(s => s.OwnerEmail == UserEmail, ct);
        if (store is null) return NotFound(new { error = "Create a store first." });

        var category = await db.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId, ct);
        if (category is null) return BadRequest(new { error = "Invalid category." });

        var product = new Product
        {
            Name        = dto.Name,
            Description = dto.Description,
            Price       = dto.Price,
            Stock       = dto.Stock,
            CategoryId  = dto.CategoryId,
            ImageUrl    = dto.ImageUrl ?? $"https://picsum.photos/seed/{Guid.NewGuid():N}/600/400",
            StoreId     = store.Id,
            IsActive    = true,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync(ct);

        return Ok(new ProductDto(product.Id, product.Name, product.Description, product.Price, product.Stock, product.ImageUrl, category.Name));
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateSellerProductDto dto, CancellationToken ct)
    {
        var store = await db.Stores.FirstOrDefaultAsync(s => s.OwnerEmail == UserEmail, ct);
        if (store is null) return NotFound();

        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.StoreId == store.Id, ct);
        if (product is null) return NotFound();

        product.Name        = dto.Name;
        product.Description = dto.Description;
        product.Price       = dto.Price;
        product.Stock       = dto.Stock;
        if (!string.IsNullOrWhiteSpace(dto.ImageUrl)) product.ImageUrl = dto.ImageUrl;

        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id, CancellationToken ct)
    {
        var store = await db.Stores.FirstOrDefaultAsync(s => s.OwnerEmail == UserEmail, ct);
        if (store is null) return NotFound();

        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.StoreId == store.Id, ct);
        if (product is null) return NotFound();

        product.IsActive = false;
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
}
