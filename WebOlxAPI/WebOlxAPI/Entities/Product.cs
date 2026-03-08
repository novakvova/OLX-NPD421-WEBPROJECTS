using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebOlxAPI.Entities;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public decimal Price { get; set; }

    [Required, MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}