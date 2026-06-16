using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIRecruiter.Infrastructure.Repositories;

public class JobDescriptionRepository : IJobDescriptionRepository
{
    private readonly AppDbContext _context;

    public JobDescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<JobDescriptionDto> CreateAsync(CreateJobDescriptionDto dto)
    {
        var entity = new JobDescription
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Content = dto.Content,
            RequiredSkills = dto.RequiredSkills,
            YearsOfExperience = dto.YearsOfExperience,
            CreatedAt = DateTime.UtcNow,
        };

        _context.JobDescriptions.Add(entity);
        await _context.SaveChangesAsync();

        return ToDto(entity);
    }

    public async Task<List<JobDescriptionDto>> GetAllAsync()
    {
        return await _context.JobDescriptions
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => ToDto(j))
            .ToListAsync();
    }

    public async Task<JobDescriptionDto?> GetByIdAsync(Guid id)
    {
        var entity = await _context.JobDescriptions
            .FirstOrDefaultAsync(j => j.Id == id);

        return entity is null ? null : ToDto(entity);
    }

    private static JobDescriptionDto ToDto(JobDescription j) => new(
        j.Id,
        j.Title,
        j.Content,
        j.RequiredSkills,
        j.YearsOfExperience,
        j.CreatedAt
    );
}