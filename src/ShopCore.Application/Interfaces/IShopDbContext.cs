using Microsoft.EntityFrameworkCore;
using ShopCore.Domain.Entities;

namespace ShopCore.Application.Interfaces;

public interface IShopDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Store> Stores { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
