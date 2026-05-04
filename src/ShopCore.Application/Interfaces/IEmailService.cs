namespace ShopCore.Application.Interfaces;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(string toEmail, int orderId, decimal total);
}
