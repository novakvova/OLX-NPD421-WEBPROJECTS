using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebOlxAPI.Mappers.Products;

namespace WebOlxAPI.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, IWebHostEnvironment env, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _env = env;
        _logger = logger;
    }

    // Отримати продукти
    [HttpGet]
    [AllowAnonymous] 
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? category,
        CancellationToken ct)
    {
        int? currentUserId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim != null && int.TryParse(claim.Value, out var id))
                currentUserId = id;
        }

        var result = await _mediator.Send(new GetProductsQuery(search, category, currentUserId), ct);
        return Ok(result);
    }

    // Створити продукт
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand cmd, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var product = await _mediator.Send(cmd, ct);
        return CreatedAtAction(nameof(GetAll), new { id = product.Id }, product);
    }

    // зображення
    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken ct)
    {
        try
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { error = "Файл не надано" });

            var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowed.Contains(file.ContentType))
                return BadRequest(new { error = "Дозволені лише зображення" });

            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsDir = Path.Combine(webRoot, "uploads");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            await using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream, ct);

            var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Upload failed");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // favorite
    [HttpPost("{id:int}/favorite")]
    public async Task<IActionResult> ToggleFavorite(int id, CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated");

        var isFav = await _mediator.Send(new ToggleFavoriteCommand(userId, id), ct);
        return Ok(new { isFavorite = isFav });
    }
}