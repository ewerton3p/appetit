namespace Appetit.API.Swagger;

public static class DependencyInjectionSwagger
{
    public static void AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new()
            {
                Title = "Appetit API",
                Version = "v1",
                Description = "API do sistema Appetit"
            });
        });
    }
}
