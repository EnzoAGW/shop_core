using ShopCore.Domain.Entities;

namespace ShopCore.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ShopDbContext db)
    {
        if (db.Categories.Any()) return;

        var electronics = new Category { Name = "Electronics" };
        var clothing    = new Category { Name = "Clothing" };
        var books       = new Category { Name = "Books" };
        db.Categories.AddRange(electronics, clothing, books);

        db.Products.AddRange(
            new Product
            {
                Name = "Wireless Headphones", Price = 199.99m, Stock = 50, Category = electronics,
                Description = "Over-ear noise cancelling headphones with 30h battery life.",
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Mechanical Keyboard", Price = 129.99m, Stock = 30, Category = electronics,
                Description = "TKL layout with tactile switches and per-key RGB backlight.",
                ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "4K Webcam", Price = 89.99m, Stock = 20, Category = electronics,
                Description = "Ultra HD webcam with autofocus and built-in noise-cancelling mic.",
                ImageUrl = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "USB-C Hub", Price = 49.99m, Stock = 100, Category = electronics,
                Description = "7-in-1 hub: HDMI 4K, 3× USB-A, SD card, and 100W PD charging.",
                ImageUrl = "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Classic T-Shirt", Price = 24.99m, Stock = 200, Category = clothing,
                Description = "100% ring-spun cotton, pre-shrunk, available in 8 colours.",
                ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Slim Chinos", Price = 59.99m, Stock = 80, Category = clothing,
                Description = "Stretch cotton blend, tapered fit, 5-pocket styling.",
                ImageUrl = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Running Sneakers", Price = 99.99m, Stock = 60, Category = clothing,
                Description = "Engineered mesh upper with responsive foam midsole.",
                ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Clean Code", Price = 39.99m, Stock = 40, Category = books,
                Description = "Robert C. Martin — write code that's readable, maintainable, and elegant.",
                ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "Domain-Driven Design", Price = 44.99m, Stock = 25, Category = books,
                Description = "Eric Evans — tackle complexity at the heart of software.",
                ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop"
            },
            new Product
            {
                Name = "The Pragmatic Programmer", Price = 34.99m, Stock = 35, Category = books,
                Description = "Hunt & Thomas — 20th anniversary edition with timeless pragmatic tips.",
                ImageUrl = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop"
            }
        );

        await db.SaveChangesAsync();
    }
}
