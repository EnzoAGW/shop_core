using ShopCore.Domain.Entities;

namespace ShopCore.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ShopDbContext db)
    {
        if (db.Categories.Any()) return;

        var electronics = new Category { Name = "Electronics" };
        var clothing = new Category { Name = "Clothing" };
        var books = new Category { Name = "Books" };
        db.Categories.AddRange(electronics, clothing, books);

        db.Products.AddRange(
            new Product { Name = "Wireless Headphones", Description = "Over-ear noise cancelling headphones.", Price = 199.99m, Stock = 50, ImageUrl = "https://placehold.co/400x300?text=Headphones", Category = electronics },
            new Product { Name = "Mechanical Keyboard", Description = "TKL layout with tactile switches.", Price = 129.99m, Stock = 30, ImageUrl = "https://placehold.co/400x300?text=Keyboard", Category = electronics },
            new Product { Name = "4K Webcam", Description = "Ultra HD webcam with autofocus.", Price = 89.99m, Stock = 20, ImageUrl = "https://placehold.co/400x300?text=Webcam", Category = electronics },
            new Product { Name = "USB-C Hub", Description = "7-in-1 hub with HDMI and PD charging.", Price = 49.99m, Stock = 100, ImageUrl = "https://placehold.co/400x300?text=Hub", Category = electronics },
            new Product { Name = "Classic T-Shirt", Description = "100% cotton crew neck.", Price = 24.99m, Stock = 200, ImageUrl = "https://placehold.co/400x300?text=T-Shirt", Category = clothing },
            new Product { Name = "Slim Chinos", Description = "Stretch fabric, tapered fit.", Price = 59.99m, Stock = 80, ImageUrl = "https://placehold.co/400x300?text=Chinos", Category = clothing },
            new Product { Name = "Running Sneakers", Description = "Lightweight mesh upper.", Price = 99.99m, Stock = 60, ImageUrl = "https://placehold.co/400x300?text=Sneakers", Category = clothing },
            new Product { Name = "Clean Code", Description = "Robert C. Martin — craft code that reads.", Price = 39.99m, Stock = 40, ImageUrl = "https://placehold.co/400x300?text=Clean+Code", Category = books },
            new Product { Name = "Domain-Driven Design", Description = "Eric Evans — tackle software complexity.", Price = 44.99m, Stock = 25, ImageUrl = "https://placehold.co/400x300?text=DDD", Category = books },
            new Product { Name = "The Pragmatic Programmer", Description = "Hunt & Thomas — timeless career advice.", Price = 34.99m, Stock = 35, ImageUrl = "https://placehold.co/400x300?text=Pragmatic", Category = books }
        );

        await db.SaveChangesAsync();
    }
}
