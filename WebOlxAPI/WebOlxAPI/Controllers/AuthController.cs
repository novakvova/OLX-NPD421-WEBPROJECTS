using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebOlxAPI.Data;
using WebOlxAPI.Models;
using WebOlxAPI.Entities;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserService _userService;

    public AuthController(AppDbContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _userService.UserExists(request.Email))
            return BadRequest("Користувач з таким email уже існує");

        _userService.CreatePasswordHash(request.Password, out var hash, out var salt);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        //  JSON з потрібними полями
        return Ok(new { username = user.Username, email = user.Email, token = "" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !_userService.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
            return BadRequest("Невірний email або пароль");

        //  JSON з username і email
        return Ok(new { username = user.Username, email = user.Email, token = "" });
    }
}
