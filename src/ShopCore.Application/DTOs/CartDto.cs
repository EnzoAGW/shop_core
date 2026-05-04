namespace ShopCore.Application.DTOs;

public record CartItemDto(int ProductId, string ProductName, decimal UnitPrice, int Quantity);

public record CartDto(IReadOnlyList<CartItemDto> Items, decimal Total);
