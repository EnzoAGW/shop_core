namespace ShopCore.Application.DTOs;

public record StoreDto(
    int Id,
    string Name,
    string Description,
    string? LogoUrl,
    DateTime CreatedAt,
    int ProductCount
);

public record CreateStoreDto(string Name, string Description, string? LogoUrl);

public record UpdateStoreDto(string Name, string Description, string? LogoUrl);

public record CreateSellerProductDto(
    string Name,
    string Description,
    decimal Price,
    int Stock,
    int CategoryId,
    string? ImageUrl
);

public record UpdateSellerProductDto(
    string Name,
    string Description,
    decimal Price,
    int Stock,
    string? ImageUrl
);
