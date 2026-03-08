using Mediator;
using WebOlxAPI.Data;
using WebOlxAPI.Entities;

namespace WebOlxAPI.Mappers.Products;

//  повернення продукту
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

// створення продукту
public record CreateProductCommand(
    string Title,
    decimal Price,
    string Location,
    string Category,
    string ImageUrl
) : IRequest<ProductDto>;


public class CreateProductHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly AppDbContext _db;

    public CreateProductHandler(AppDbContext db)
    {
        _db = db;
    }

    public async ValueTask<ProductDto> Handle(CreateProductCommand cmd, CancellationToken ct)
    {
        var product = new Product
        {
            Title = cmd.Title,
            Price = cmd.Price,
            Location = cmd.Location,
            Category = cmd.Category,
            ImageUrl = cmd.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        return new ProductDto(
            product.Id,
            product.Title,
            product.Price,
            product.Location,
            product.Category,
            product.ImageUrl,
            product.CreatedAt.ToString("O"),
            false
        );
    }
}