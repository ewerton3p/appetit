using System.Linq.Expressions;
using Appetit.Infrastructure.Data.DataContext;
using Appetit.Infrastructure.Data.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Appetit.Infrastructure.Data.Repositories;

public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public RepositoryBase(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public async Task<TEntity?> GetByIdAsync(int id) =>
        await _dbSet.FindAsync(id);

    public async Task<IEnumerable<TEntity>> GetAllAsync() =>
        await _dbSet.AsNoTracking().ToListAsync();

    public async Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> predicate) =>
        await _dbSet.AsNoTracking().Where(predicate).ToListAsync();

    public async Task<PaginatedResult<TEntity>> GetWithPaginationAsync(
        Expression<Func<TEntity, bool>>? predicate,
        int page,
        int pageSize,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool ascending = true)
    {
        var query = _dbSet.AsNoTracking();

        if (predicate is not null)
            query = query.Where(predicate);

        var totalCount = await query.CountAsync();

        if (orderBy is not null)
            query = ascending ? query.OrderBy(orderBy) : query.OrderByDescending(orderBy);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<TEntity>(items, totalCount, page, pageSize);
    }

    public async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
    {
        if (predicate is null)
            return await _dbSet.CountAsync();

        return await _dbSet.CountAsync(predicate);
    }

    public async Task AddAsync(TEntity entity) =>
        await _dbSet.AddAsync(entity);

    public void Update(TEntity entity) =>
        _dbSet.Update(entity);

    public void Delete(TEntity entity) =>
        _dbSet.Remove(entity);

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}
