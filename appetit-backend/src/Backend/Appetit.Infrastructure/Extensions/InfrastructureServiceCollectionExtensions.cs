using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Appetit.Infrastructure
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Registre serviços de infraestrutura aqui.
            // Exemplo:
            // services.AddSingleton<IMyRepository, MyRepository>();
            return services;
        }
    }
}