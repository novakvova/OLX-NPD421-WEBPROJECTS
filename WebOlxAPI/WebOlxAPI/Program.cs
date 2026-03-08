using Microsoft.EntityFrameworkCore;
using WebOlxAPI.Data;
using WebOlxAPI.Mappers.Products;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Controllers & Swagger
// --------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------
// DbContext
// --------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// --------------------
// Services
// --------------------
builder.Services.AddScoped<UserService>();

// --------------------
// Mediator (MediatR)
// --------------------
builder.Services.AddMediator(options =>
{
    options.ServiceLifetime = ServiceLifetime.Scoped;
});

// --------------------
// Handlers
// --------------------
builder.Services.AddScoped<CreateProductHandler>();
builder.Services.AddScoped<GetProductsHandler>();
builder.Services.AddScoped<ToggleFavoriteHandler>();

// --------------------
// File upload limits
// --------------------
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MB
});

// --------------------
// Kestrel limits
// --------------------
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10 MB
});

// --------------------
// CORS
// --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// --------------------
// Build app
// --------------------
var app = builder.Build();

// --------------------
// Create uploads folder
// --------------------
var uploadsPath = Path.Combine(
    app.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
    "uploads"
);
Directory.CreateDirectory(uploadsPath);

// --------------------
// Apply migrations
// --------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// --------------------
// Middleware pipeline
// --------------------

// Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("CorsPolicy");

// Static files
app.UseStaticFiles();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Run the app
app.Run();