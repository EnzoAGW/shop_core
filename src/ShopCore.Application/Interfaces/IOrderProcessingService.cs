namespace ShopCore.Application.Interfaces;

public interface IOrderProcessingService
{
    Task ProcessOrderAsync(int orderId, CancellationToken cancellationToken = default);
}
