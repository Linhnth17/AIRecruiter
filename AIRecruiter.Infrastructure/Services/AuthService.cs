using AIRecruiter.Core.DTOs.Auth;
using AIRecruiter.Core.Interfaces;
using DocumentFormat.OpenXml.Math;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AIRecruiter.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;

    private static readonly string[] ValidRoles = ["Admin", "Recruiter", "HiringManager"];

    public AuthService(IUserRepository userRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (!ValidRoles.Contains(dto.Role))
            throw new ArgumentException($"Invalid role. Must be: {string.Join(", ", ValidRoles)}");

        if (await _userRepo.ExistsAsync(dto.Email))
            throw new InvalidOperationException("Email already exists.");

        if (dto.Password.Length < 8)
            throw new ArgumentException("Password must be at least 8 characters.");

        var user = new UserDto(
            Id: Guid.NewGuid(),
            Email: dto.Email,
            PasswordHash: BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName: dto.FullName,
            Role: dto.Role,
            IsActive: true
        );

        var created = await _userRepo.CreateAsync(user);
        return GenerateToken(created);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is disabled.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return GenerateToken(user);
    }

    private AuthResponseDto GenerateToken(UserDto user)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key missing.");
        var issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer missing.");
        var expiresAt = DateTime.UtcNow.AddHours(24);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email,          user.Email),
            new Claim(ClaimTypes.Name,           user.FullName),
            new Claim(ClaimTypes.Role,           user.Role),
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: issuer,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        return new AuthResponseDto(
            Token: new JwtSecurityTokenHandler().WriteToken(token),
            FullName: user.FullName,
            Email: user.Email,
            Role: user.Role,
            ExpiresAt: expiresAt);
    }
}