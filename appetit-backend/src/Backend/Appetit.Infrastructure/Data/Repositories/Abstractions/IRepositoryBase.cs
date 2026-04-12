using System.Linq.Expressions;

namespace Appetit.Infrastructure.Data.Repositories.Abstractions;

public interface IRepositoryBase<TEntity> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(int id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> predicate);
    Task<PaginatedResult<TEntity>> GetWithPaginationAsync(
        Expression<Func<TEntity, bool>>? predicate,
        int page,
        int pageSize,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool ascending = true);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null);
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    Task SaveChangesAsync();
}

public record PaginatedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
