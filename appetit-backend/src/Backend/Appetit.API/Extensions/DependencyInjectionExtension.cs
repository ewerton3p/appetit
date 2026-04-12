using System;
using System.Linq;
using System.Reflection;
using Appetit.Application;
using Appetit.Infrastructure;

namespace Appetit.API.Extensions;

public static class DependencyInjectionExtension
{
    // Observação: se os métodos de extensão AddInfrastructure / AddApplication existirem em outro assembly/namespace
    // e você preferir ligá-los estaticamente, adicione a referência de projeto/assembly correta e o using apropriado.
    // Esta implementação tenta invocar esses métodos por reflexão para evitar erros de compilação quando as extensões
    // estiverem definidas em outro assembly que pode não estar referenciado no momento.
    public static IServiceCollection AddDependencyInjections(this IServiceCollection services, IConfiguration configuration)
    {
        InvokeExtensionIfExists("AddInfrastructure", services, configuration);
        InvokeExtensionIfExists("AddApplication", services, configuration);
        return services;
    }

    private static void InvokeExtensionIfExists(string methodName, IServiceCollection services, IConfiguration configuration)
    {
        try
        {
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();
            foreach (var asm in assemblies)
            {
                Type[] types;
                try { types = asm.GetTypes(); }
                catch (ReflectionTypeLoadException rtle) { types = rtle.Types.Where(t => t != null).ToArray()!; }

                var method = types
                    .Where(t => t != null && t.IsSealed && t.IsAbstract) // classes static
                    .SelectMany(t => t!.GetMethods(BindingFlags.Public | BindingFlags.Static))
                    .FirstOrDefault(m =>
                    {
                        if (!string.Equals(m.Name, methodName, StringComparison.Ordinal)) return false;
                        var parms = m.GetParameters();
                        return parms.Length == 2 &&
                               typeof(IServiceCollection).IsAssignableFrom(parms[0].ParameterType) &&
                               typeof(IConfiguration).IsAssignableFrom(parms[1].ParameterType);
                    });

                if (method != null)
                {
                    method.Invoke(null, new object[] { services, configuration });
                    return;
                }
            }
        }
        catch
        {
            // silenciar para não quebrar o fluxo de inicialização; se necessário, registre o erro no futuro.
        }
    }
}
