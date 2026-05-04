using Microsoft.Extensions.Logging;
using ShopCore.Application.Interfaces;

namespace ShopCore.Infrastructure.Services;

public class MockEmailService(ILogger<MockEmailService> logger) : IEmailService
{
    public Task SendOrderConfirmationAsync(string toEmail, int orderId, decimal total)
    {
        logger.LogInformation(
            "[EMAIL MOCK] Order confirmation sent to {Email} — Order #{OrderId}, Total: ${Total:F2}",
            toEmail, orderId, total);
        return Task.CompletedTask;
    }
}
