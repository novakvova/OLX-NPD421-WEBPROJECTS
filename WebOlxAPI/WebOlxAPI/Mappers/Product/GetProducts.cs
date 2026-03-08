using Mediator;
using Microsoft.EntityFrameworkCore;
using WebOlxAPI.Data;


public record ProductDto(
    int Id,
    string Title,
    decimal Price,
    string Location,
    string Category,
    string ImageUrl,
    string CreatedAt,
    bool IsFavorite
);

public record GetProductsQuery(
    string? Search,
    string? Category,
    int? CurrentUserId
) : IRequest<List<ProductDto>>;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly AppDbContext _db;

    public GetProductsHandler(AppDbContext db) => _db = db;

    public async ValueTask<List<ProductDto>> Handle(GetProductsQuery req, CancellationToken ct)
    {
        var query = _db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(req.Search))
            query = query.Where(p =>
                p.Title.Contains(req.Search) ||
                p.Location.Contains(req.Search));

        if (!string.IsNullOrWhiteSpace(req.Category) && req.Category != "Всі")
            query = query.Where(p => p.Category == req.Category);

        HashSet<int> favIds = req.CurrentUserId is null
            ? new HashSet<int>()
            : (await _db.Favorites
                   .Where(f => f.UserId == req.CurrentUserId)
                   .Select(f => f.ProductId)
                   .ToListAsync(ct))
               .ToHashSet();

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProductDto(
                p.Id,
                p.Title,
                p.Price,
                p.Location,
                p.Category,
                p.ImageUrl,
                p.CreatedAt.ToString("O"),
                favIds.Contains(p.Id)
            ))
            .ToListAsync(ct);
    }
}