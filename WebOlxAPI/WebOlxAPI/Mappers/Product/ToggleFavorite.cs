using Mediator;
using Microsoft.EntityFrameworkCore;
using WebOlxAPI.Data;
using WebOlxAPI.Entities;

namespace WebOlxAPI.Mappers.Products;

public record ToggleFavoriteCommand(int UserId, int ProductId) : IRequest<bool>;

public class ToggleFavoriteHandler : IRequestHandler<ToggleFavoriteCommand, bool>
{
    private readonly AppDbContext _db;

    public ToggleFavoriteHandler(AppDbContext db) => _db = db;

    public async ValueTask<bool> Handle(ToggleFavoriteCommand cmd, CancellationToken ct)
    {
        
        if (cmd.UserId <= 0)
            throw new ArgumentException("UserId must be greater than 0");

        var userExists = await _db.Users.AnyAsync(u => u.Id == cmd.UserId, ct);
        if (!userExists)
            throw new InvalidOperationException($"User with Id={cmd.UserId} not found");

        var existing = await _db.Favorites
            .FirstOrDefaultAsync(f => f.UserId == cmd.UserId && f.ProductId == cmd.ProductId, ct);

        if (existing is not null)
        {
            _db.Favorites.Remove(existing);
            await _db.SaveChangesAsync(ct);
            return false;
        }

        _db.Favorites.Add(new Favorite
        {
            UserId = cmd.UserId,
            ProductId = cmd.ProductId,
            SavedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync(ct);
        return true;
    }
}