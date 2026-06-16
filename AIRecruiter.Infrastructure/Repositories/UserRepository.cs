using AIRecruiter.Core.DTOs.Auth;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIRecruiter.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        var entity = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email.ToLower());

        return entity is null ? null : ToDto(entity);
    }

    public async Task<UserDto> CreateAsync(UserDto dto)
    {
        var entity = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email.ToLower(),
            PasswordHash = dto.PasswordHash,
            FullName = dto.FullName,
            Role = dto.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Users.Add(entity);
        await _context.SaveChangesAsync();

        return ToDto(entity);
    }

    public async Task<bool> ExistsAsync(string email)
        => await _context.Users.AnyAsync(u => u.Email == email.ToLower());

    private static UserDto ToDto(User u) => new(
        u.Id,
        u.Email,
        u.PasswordHash,
        u.FullName,
        u.Role,
        u.IsActive
    );
}