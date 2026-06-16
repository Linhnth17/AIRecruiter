using AIRecruiter.Core.DTOs.Auth;

namespace AIRecruiter.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}