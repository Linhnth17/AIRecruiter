namespace AIRecruiter.Core.DTOs.Auth;

public record UserDto(
    Guid Id,
    string Email,
    string PasswordHash,
    string FullName,
    string Role,
    bool IsActive
);