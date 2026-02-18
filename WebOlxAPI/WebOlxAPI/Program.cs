var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

<<<<<<< HEAD
app.Run();
=======
app.Run();
>>>>>>> 2efdff91b9cef22ba7aaa42cde724e690376c284
