using AIRecruiter.Core.DTOs;

namespace AIRecruiter.Core.Interfaces;

public interface ICandidateRepository
{
    Task<CandidateResponseDto> CreateAsync(CreateCandidateDto dto);
    Task<List<CandidateResponseDto>> GetByJobDescriptionIdAsync(Guid jobDescriptionId);
    Task<CandidateResponseDto?> GetByIdAsync(Guid id);
    Task UpdateStatusAsync(Guid id, string status);
}