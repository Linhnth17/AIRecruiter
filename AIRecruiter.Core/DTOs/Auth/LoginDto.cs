namespace AIRecruiter.Core.DTOs.Auth;

public record LoginDto(
    string Email,
    string Password
);