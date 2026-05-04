namespace ShopCore.Application.DTOs;

public record CheckoutItemRequest(int ProductId, int Quantity);

public record CheckoutRequest(IReadOnlyList<CheckoutItemRequest> Items);
