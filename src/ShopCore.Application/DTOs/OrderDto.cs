using ShopCore.Domain.Entities;

namespace ShopCore.Application.DTOs;

public record OrderItemDto(string ProductName, decimal UnitPrice, int Quantity, decimal Subtotal);

public record OrderDto(
    int Id,
    string Status,
    decimal Total,
    DateTime CreatedAt,
    DateTime? ProcessedAt,
    IReadOnlyList<OrderItemDto> Items
);
