using System.Security.Claims;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopCore.Application.DTOs;
using ShopCore.Application.Interfaces;
using ShopCore.Domain.Entities;

namespace ShopCore.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController(IShopDbContext db, IBackgroundJobClient jobs) : ControllerBase
{
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req, CancellationToken ct)
    {
        if (req.Items.Count == 0)
            return BadRequest(new { error = "Cart is empty." });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub") ?? "anonymous";

        var productIds = req.Items.Select(i => i.ProductId).ToList();
        var products = await db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToListAsync(ct);

        var orderItems = new List<OrderItem>();
        foreach (var item in req.Items)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product is null)
                return BadRequest(new { error = $"Product {item.ProductId} not found." });
            if (product.Stock < item.Quantity)
                return BadRequest(new { error = $"Insufficient stock for '{product.Name}'." });

            product.Stock -= item.Quantity;
            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = item.Quantity,
            });
        }

        var order = new Order
        {
            UserId = userId,
            Total = orderItems.Sum(i => i.UnitPrice * i.Quantity),
            Items = orderItems,
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);

        jobs.Enqueue<IOrderProcessingService>(svc => svc.ProcessOrderAsync(order.Id, CancellationToken.None));

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapOrder(order));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var userId = GetUserId();
        var orders = await db.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);

        return Ok(orders.Select(MapOrder));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var userId = GetUserId();
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId, ct);

        return order is null ? NotFound() : Ok(MapOrder(order));
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? "anonymous";

    private static OrderDto MapOrder(Order o) => new(
        o.Id,
        o.Status.ToString(),
        o.Total,
        o.CreatedAt,
        o.ProcessedAt,
        o.Items.Select(i => new OrderItemDto(i.ProductName, i.UnitPrice, i.Quantity, i.UnitPrice * i.Quantity)).ToList()
    );

}
