using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIRecruiter.Infrastructure.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _context;

    public CandidateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateResponseDto> CreateAsync(CreateCandidateDto dto)
    {
        var entity = new Candidate
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email,
            CvContent = dto.CvContent,
            CvFileName = dto.CvFileName,
            JobDescriptionId = dto.JobDescriptionId,
            MatchScore = 0,
            MatchSummary = string.Empty,
            Strengths = string.Empty,
            Weaknesses = string.Empty,
            RedFlags = string.Empty,
            SuggestedQuestions = string.Empty,
            Status = "Applied",
            CreatedAt = DateTime.UtcNow,
        };

        _context.Candidates.Add(entity);
        await _context.SaveChangesAsync();

        return ToDto(entity);
    }

    public async Task<List<CandidateResponseDto>> GetByJobDescriptionIdAsync(Guid jobDescriptionId)
    {
        return await _context.Candidates
            .Where(c => c.JobDescriptionId == jobDescriptionId)
            .OrderByDescending(c => c.MatchScore)
            .Select(c => ToDto(c))
            .ToListAsync();
    }

    public async Task<CandidateResponseDto?> GetByIdAsync(Guid id)
    {
        var entity = await _context.Candidates
            .FirstOrDefaultAsync(c => c.Id == id);

        return entity is null ? null : ToDto(entity);
    }

    public async Task UpdateStatusAsync(Guid id, string status)
    {
        var entity = await _context.Candidates.FindAsync(id);
        if (entity is null) return;

        entity.Status = status;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAnalysisAsync(Guid id, CandidateAnalysis analysis, List<string> questions)
    {
        var entity = await _context.Candidates.FindAsync(id);
        if (entity is null) return;

        entity.MatchScore = analysis.MatchScore;
        entity.MatchSummary = analysis.Summary;
        entity.Strengths = analysis.Strengths;
        entity.Weaknesses = analysis.Weaknesses;
        entity.RedFlags = analysis.RedFlags;
        entity.SuggestedQuestions = string.Join("|", questions);

        await _context.SaveChangesAsync();
    }

    private static CandidateResponseDto ToDto(Candidate c) => new(
        c.Id,
        c.FullName,
        c.Email,
        c.MatchScore,
        c.MatchSummary,
        c.Strengths,
        c.Weaknesses,
        c.RedFlags,
        c.SuggestedQuestions,
        c.Status,
        c.CreatedAt
    );
}