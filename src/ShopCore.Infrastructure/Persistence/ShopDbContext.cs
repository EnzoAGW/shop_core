using Microsoft.EntityFrameworkCore;
using ShopCore.Application.Interfaces;
using ShopCore.Domain.Entities;

namespace ShopCore.Infrastructure.Persistence;

public class ShopDbContext(DbContextOptions<ShopDbContext> options) : DbContext(options), IShopDbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Store> Stores => Set<Store>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(e =>
        {
            e.Property(p => p.Price).HasColumnType("decimal(18,2)");
            e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
            e.HasOne(p => p.Store).WithMany(s => s.Products).HasForeignKey(p => p.StoreId)
                .IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.Property(o => o.Total).HasColumnType("decimal(18,2)");
            e.Property(o => o.Status).HasConversion<string>();
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");
            e.Ignore(i => i.Subtotal);
        });
    }
}
