using System.Text.RegularExpressions;

namespace Appetit.Utilities.Formatters;

public static partial class DocumentFormatter
{
    public static string FormatCpf(string cpf)
    {
        cpf = OnlyDigits().Replace(cpf, "");
        if (cpf.Length != 11) return cpf;
        return $"{cpf[..3]}.{cpf[3..6]}.{cpf[6..9]}-{cpf[9..]}";
    }

    public static string FormatCnpj(string cnpj)
    {
        cnpj = OnlyDigits().Replace(cnpj, "");
        if (cnpj.Length != 14) return cnpj;
        return $"{cnpj[..2]}.{cnpj[2..5]}.{cnpj[5..8]}/{cnpj[8..12]}-{cnpj[12..]}";
    }

    public static string FormatPhone(string phone)
    {
        phone = OnlyDigits().Replace(phone, "");
        return phone.Length == 11
            ? $"({phone[..2]}) {phone[2..7]}-{phone[7..]}"
            : phone.Length == 10
                ? $"({phone[..2]}) {phone[2..6]}-{phone[6..]}"
                : phone;
    }

    [GeneratedRegex(@"\D")]
    private static partial Regex OnlyDigits();
}
