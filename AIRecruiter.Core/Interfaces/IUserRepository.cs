using AIRecruiter.Core.DTOs.Auth;

namespace AIRecruiter.Core.Interfaces;

public interface IUserRepository
{
    Task<UserDto?> GetByEmailAsync(string email);
    Task<UserDto> CreateAsync(UserDto user);
    Task<bool> ExistsAsync(string email);
}