using Hangfire;
using Hangfire.InMemory;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShopCore.Application.Interfaces;
using ShopCore.Infrastructure.Persistence;
using ShopCore.Infrastructure.Services;

namespace ShopCore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ShopDbContext>(options =>
            options.UseSqlite(config.GetConnectionString("Default") ?? "Data Source=shop_core.db"));

        services.AddScoped<IShopDbContext>(sp => sp.GetRequiredService<ShopDbContext>());
        services.AddScoped<IOrderProcessingService, OrderProcessingService>();
        services.AddScoped<IEmailService, MockEmailService>();

        services.AddHangfire(cfg => cfg.UseInMemoryStorage());
        services.AddHangfireServer();

        return services;
    }
}
