namespace Appetit.Utilities.Converters;

public static class DateTimeConverter
{
    public static string ToDateString(DateTime date) =>
        date.ToString("dd/MM/yyyy");

    public static string ToDateTimeString(DateTime date) =>
        date.ToString("dd/MM/yyyy HH:mm:ss");

    public static DateTime? Parse(string? value) =>
        DateTime.TryParse(value, out var result) ? result : null;
}
