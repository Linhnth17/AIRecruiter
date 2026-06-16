using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AIRecruiter.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CandidatesController : ControllerBase
{
    private readonly ICandidateRepository _candidateRepo;
    private readonly IJobDescriptionRepository _jobDescriptionRepo;
    private readonly IDocumentParser _documentParser;
    private readonly IAIService _aiService;
    private readonly IServiceScopeFactory _scopeFactory;

    public CandidatesController(
        ICandidateRepository candidateRepo,
        IJobDescriptionRepository jobDescriptionRepo,
        IDocumentParser documentParser,
        IAIService aiService,
        IServiceScopeFactory scopeFactory)
    {
        _candidateRepo = candidateRepo;
        _jobDescriptionRepo = jobDescriptionRepo;
        _documentParser = documentParser;
        _aiService = aiService;
        _scopeFactory = scopeFactory;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadCV(
        [FromForm] string fullName,
        [FromForm] string email,
        [FromForm] Guid jobDescriptionId,
        IFormFile cvFile,
        CancellationToken ct)
    {
        // 1. Validate
        if (cvFile is null || cvFile.Length == 0)
            return BadRequest(new { error = "CV file is required." });

        var jd = await _jobDescriptionRepo.GetByIdAsync(jobDescriptionId);
        if (jd is null)
            return NotFound(new { error = "Job description not found." });

        // 2. Parse CV
        using var stream = cvFile.OpenReadStream();
        string cvContent = await _documentParser.ParseAsync(stream, cvFile.FileName);

        if (string.IsNullOrWhiteSpace(cvContent))
            return BadRequest(new { error = "Cannot extract text from CV file." });

        // 3. Lưu candidate
        var createDto = new CreateCandidateDto(
            fullName,
            email,
            cvContent,
            cvFile.FileName,
            jobDescriptionId);

        var candidate = await _candidateRepo.CreateAsync(createDto);

        // 4. AI phân tích async — dùng scope mới tránh DbContext disposed
        _ = Task.Run(async () =>
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();

                var aiService = scope.ServiceProvider.GetRequiredService<IAIService>();
                var candidateRepo = scope.ServiceProvider.GetRequiredService<CandidateRepository>();

                string jdText = $"{jd.Title}\n{jd.Content}\nRequired Skills: {jd.RequiredSkills}\nYears of Experience: {jd.YearsOfExperience}";

                Console.WriteLine($"[AI] Starting analysis for candidate {candidate.Id}");

                var analysis = await aiService.AnalyzeCVAsync(cvContent, jdText);
                var questions = await aiService.GenerateInterviewQuestionsAsync(cvContent, jdText);

                Console.WriteLine($"[AI] Score: {analysis.MatchScore}, updating DB...");

                await candidateRepo.UpdateAnalysisAsync(candidate.Id, analysis, questions);

                Console.WriteLine($"[AI] Done!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI ERROR] {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        });

        return Ok(new
        {
            message = "CV uploaded successfully. AI analysis is in progress.",
            candidate
        });
    }

    [HttpGet("job/{jobDescriptionId:guid}")]
    public async Task<IActionResult> GetByJobDescription(Guid jobDescriptionId)
    {
        var result = await _candidateRepo.GetByJobDescriptionIdAsync(jobDescriptionId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _candidateRepo.GetByIdAsync(id);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        await _candidateRepo.UpdateStatusAsync(id, request.Status);
        return NoContent();
    }
}

public record UpdateStatusRequest(string Status);