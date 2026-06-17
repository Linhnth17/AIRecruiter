using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIRecruiter.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class CandidatesController : ControllerBase
{
    private readonly ICandidateRepository _candidateRepo;
    private readonly IJobDescriptionRepository _jobDescriptionRepo;
    private readonly IDocumentParser _documentParser;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<CandidatesController> _logger;

    public CandidatesController(
        ICandidateRepository candidateRepo,
        IJobDescriptionRepository jobDescriptionRepo,
        IDocumentParser documentParser,
        IServiceScopeFactory scopeFactory,
        ILogger<CandidatesController> logger)
    {
        _candidateRepo = candidateRepo;
        _jobDescriptionRepo = jobDescriptionRepo;
        _documentParser = documentParser;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    /// <summary>
    /// Recruiter upload nhiều CV — AI tự extract thông tin và classify vào JD phù hợp nhất
    /// </summary>
    [HttpPost("bulk-upload")]
    [Authorize(Roles = "Admin,Recruiter")]
    public async Task<IActionResult> BulkUpload(
        List<IFormFile> cvFiles,
        CancellationToken ct)
    {
        if (cvFiles is null || cvFiles.Count == 0)
            return BadRequest(new { error = "No CV files uploaded." });

        var jobs = await _jobDescriptionRepo.GetAllAsync();
        if (jobs.Count == 0)
            return BadRequest(new { error = "No job descriptions found. Please create JDs first." });

        // Parse stream trước khi return — tránh stream bị dispose
        var cvDataList = new List<(string FileName, string Content)>();
        foreach (var file in cvFiles)
        {
            try
            {
                using var stream = file.OpenReadStream();
                string content = await _documentParser.ParseAsync(stream, file.FileName);
                if (!string.IsNullOrWhiteSpace(content))
                    cvDataList.Add((file.FileName, content));
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Cannot parse file {FileName}: {Error}", file.FileName, ex.Message);
            }
        }

        if (cvDataList.Count == 0)
            return BadRequest(new { error = "Cannot extract text from any uploaded files." });

        // Xử lý AI async sau khi đã return response
        _ = Task.Run(async () =>
        {
            foreach (var (fileName, cvContent) in cvDataList)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var aiService = scope.ServiceProvider.GetRequiredService<IAIService>();
                    var candidateRepo = scope.ServiceProvider.GetRequiredService<ICandidateRepository>();
                    var candidateRepoImpl = scope.ServiceProvider.GetRequiredService<CandidateRepository>();

                    _logger.LogInformation("[BulkUpload] Processing: {FileName}", fileName);

                    var result = await aiService.ExtractAndClassifyAsync(cvContent, jobs);

                    var createDto = new CreateCandidateDto(
                        FullName: result.CandidateInfo.Name,
                        Email: result.CandidateInfo.Email,
                        CvContent: cvContent,
                        CvFileName: fileName,
                        JobDescriptionId: result.BestMatchJobId);

                    var candidate = await candidateRepo.CreateAsync(createDto);

                    var analysis = new CandidateAnalysis
                    {
                        MatchScore = result.MatchScore,
                        Summary = result.MatchSummary,
                        Strengths = result.Strengths,
                        Weaknesses = result.Weaknesses,
                        RedFlags = result.RedFlags,
                    };

                    await candidateRepoImpl.UpdateAnalysisAsync(candidate.Id, analysis, result.Questions);

                    _logger.LogInformation(
                        "[BulkUpload] Done: {FileName} → JD: {JobId} Score: {Score}%",
                        fileName, result.BestMatchJobId, result.MatchScore);
                }
                catch (Exception ex)
                {
                    _logger.LogError("[BulkUpload ERROR] {FileName}: {Error}", fileName, ex.Message);
                }
            }
        }, ct);

        return Ok(new BulkUploadResponseDto(
            Total: cvFiles.Count,
            Processed: cvDataList.Count,
            Failed: cvFiles.Count - cvDataList.Count,
            Message: $"Processing {cvDataList.Count} CVs. AI is classifying against {jobs.Count} job descriptions."
        ));
    }

    [HttpGet("job/{jobDescriptionId:guid}")]
    [Authorize(Roles = "Admin,Recruiter,HiringManager")]
    public async Task<IActionResult> GetByJobDescription(Guid jobDescriptionId)
    {
        var result = await _candidateRepo.GetByJobDescriptionIdAsync(jobDescriptionId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Recruiter,HiringManager")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _candidateRepo.GetByIdAsync(id);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin,Recruiter")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        await _candidateRepo.UpdateStatusAsync(id, request.Status);
        return NoContent();
    }
}

public record UpdateStatusRequest(string Status);