using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShopCore.Application.Interfaces;
using ShopCore.Domain.Entities;
using ShopCore.Infrastructure.Persistence;

namespace ShopCore.Infrastructure.Services;

public class OrderProcessingService(
    ShopDbContext db,
    IEmailService emailService,
    ILogger<OrderProcessingService> logger) : IOrderProcessingService
{
    public async Task ProcessOrderAsync(int orderId, CancellationToken cancellationToken = default)
    {
        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
        {
            logger.LogWarning("Order {OrderId} not found during processing.", orderId);
            return;
        }

        logger.LogInformation("Processing order {OrderId}...", orderId);

        // Simulate payment processing delay
        await Task.Delay(TimeSpan.FromSeconds(3), cancellationToken);

        order.Status = OrderStatus.Processing;
        order.ProcessedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        await emailService.SendOrderConfirmationAsync("customer@example.com", order.Id, order.Total);

        logger.LogInformation("Order {OrderId} processed successfully.", orderId);
    }
}
