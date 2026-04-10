using Appetit.Domain.Common.Constants;

namespace Appetit.Domain.Common.Utils;

public static class PagingUtils
{
    public static int NormalizePage(int page) =>
        page < 1 ? Paging.DefaultPage : page;

    public static int NormalizePageSize(int pageSize) =>
        pageSize < 1 ? Paging.DefaultPageSize
        : pageSize > Paging.MaxPageSize ? Paging.MaxPageSize
        : pageSize;

    public static int GetOffset(int page, int pageSize) =>
        (NormalizePage(page) - 1) * NormalizePageSize(pageSize);
}
