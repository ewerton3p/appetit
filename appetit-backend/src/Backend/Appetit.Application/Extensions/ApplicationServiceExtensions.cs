using Appetit.Application.AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace Appetit.Application.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        AddAutoMapper(services);
        AddServices(services);
        return services;
    }

    private static void AddAutoMapper(IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(typeof(AssemblyReference).Assembly));
    }

    private static void AddServices(IServiceCollection services)
    {
        // Registre os serviços aqui
        // services.AddScoped<IExampleService, ExampleService>();
    }
}
