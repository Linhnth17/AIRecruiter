namespace AIRecruiter.Core.DTOs.Auth;

public record AuthResponseDto(
    string Token,
    string FullName,
    string Email,
    string Role,
    DateTime ExpiresAt
);