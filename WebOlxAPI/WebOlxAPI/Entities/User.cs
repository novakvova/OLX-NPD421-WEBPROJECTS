using System.ComponentModel.DataAnnotations;

namespace WebOlxAPI.Entities;

public class User
{
    public int Id { get; set; }



    [Required, MaxLength(100)]
    public string Username { get; set; } = string.Empty;
    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Поля для авторизації

    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }

    // НавігаціЯ

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}