using AIRecruiter.Core.DTOs;

namespace AIRecruiter.Core.Interfaces;

public interface IJobDescriptionRepository
{
    Task<JobDescriptionDto> CreateAsync(CreateJobDescriptionDto dto);
    Task<List<JobDescriptionDto>> GetAllAsync();
    Task<JobDescriptionDto?> GetByIdAsync(Guid id);
}