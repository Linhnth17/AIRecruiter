using System.Text;
using System.Text.Json;
using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using AIRecruiter.Infrastructure.Prompts;
using Microsoft.Extensions.Logging;

namespace AIRecruiter.Infrastructure.Services;

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIService> _logger;
    private const string Model = "llama-3.3-70b-versatile";

    public AIService(HttpClient httpClient, ILogger<AIService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<CandidateAnalysis> AnalyzeCVAsync(string cvContent, string jobDescription)
    {
        string prompt = PromptTemplates.AnalyzeCV(cvContent, jobDescription);
        string json = await CallGroqAsync(prompt);
        _logger.LogDebug("[AI] Analysis response: {Json}", json);
        return ParseAnalysisJson(json);
    }

    public async Task<List<string>> GenerateInterviewQuestionsAsync(string cvContent, string jobDescription)
    {
        string prompt = PromptTemplates.GenerateInterviewQuestions(cvContent, jobDescription);
        string json = await CallGroqAsync(prompt);
        _logger.LogDebug("[AI] Questions response: {Json}", json);
        return ParseQuestionsJson(json);
    }

    public async Task<ClassifyResult> ExtractAndClassifyAsync(string cvContent, List<JobDescriptionDto> jobs)
    {
        string jobList = string.Join("\n", jobs.Select((j, i) =>
            $"JD_{i + 1} (Id={j.Id}): {j.Title} | Skills: {j.RequiredSkills} | Experience: {j.YearsOfExperience}+ years"));

        string prompt = PromptTemplates.ExtractAndClassify(cvContent, jobList);
        string json = await CallGroqAsync(prompt);
        _logger.LogDebug("[AI] Classify response: {Json}", json);
        return ParseClassifyResult(json);
    }

    private async Task<string> CallGroqAsync(string prompt)
    {
        var requestBody = new
        {
            model = Model,
            messages = new[] { new { role = "user", content = prompt } },
            temperature = 0.3,
            max_tokens = 2048
        };

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("openai/v1/chat/completions", content);
        var body = await response.Content.ReadAsStringAsync();

        _logger.LogDebug("[AI] Raw response: {Body}", body[..Math.Min(300, body.Length)]);

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Groq API error {response.StatusCode}: {body}");

        using JsonDocument doc = JsonDocument.Parse(body);
        string text = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        return text.Replace("```json", "").Replace("```", "").Trim();
    }

    private CandidateAnalysis ParseAnalysisJson(string json)
    {
        try
        {
            using JsonDocument doc = JsonDocument.Parse(json);
            JsonElement root = doc.RootElement;

            return new CandidateAnalysis
            {
                MatchScore = root.GetProperty("matchScore").GetInt32(),
                Summary = root.GetProperty("summary").GetString() ?? string.Empty,
                Strengths = root.GetProperty("strengths").GetString() ?? string.Empty,
                Weaknesses = root.GetProperty("weaknesses").GetString() ?? string.Empty,
                RedFlags = root.GetProperty("redFlags").GetString() ?? string.Empty,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AI] ParseAnalysisJson error");
            return new CandidateAnalysis { MatchScore = 0, Summary = "Unable to analyze CV." };
        }
    }

    private List<string> ParseQuestionsJson(string json)
    {
        try
        {
            using JsonDocument doc = JsonDocument.Parse(json);
            return doc.RootElement
                      .GetProperty("questions")
                      .EnumerateArray()
                      .Select(q => q.GetString() ?? string.Empty)
                      .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AI] ParseQuestionsJson error");
            return ["Unable to generate questions."];
        }
    }

    private ClassifyResult ParseClassifyResult(string json)
    {
        try
        {
            using JsonDocument doc = JsonDocument.Parse(json);
            JsonElement root = doc.RootElement;
            JsonElement info = root.GetProperty("candidateInfo");

            return new ClassifyResult
            {
                CandidateInfo = new ExtractedCandidateInfo
                {
                    Name = info.GetProperty("name").GetString() ?? string.Empty,
                    Email = info.GetProperty("email").GetString() ?? string.Empty,
                    Skills = info.GetProperty("skills").GetString() ?? string.Empty,
                    YearsOfExp = info.GetProperty("yearsOfExp").GetInt32(),
                    Summary = info.GetProperty("summary").GetString() ?? string.Empty,
                },
                BestMatchJobId = Guid.Parse(root.GetProperty("bestMatchJobId").GetString() ?? Guid.Empty.ToString()),
                MatchScore = root.GetProperty("matchScore").GetInt32(),
                MatchSummary = root.GetProperty("matchSummary").GetString() ?? string.Empty,
                Strengths = root.GetProperty("strengths").GetString() ?? string.Empty,
                Weaknesses = root.GetProperty("weaknesses").GetString() ?? string.Empty,
                RedFlags = root.GetProperty("redFlags").GetString() ?? string.Empty,
                Questions = root.GetProperty("questions")
                                     .EnumerateArray()
                                     .Select(q => q.GetString() ?? string.Empty)
                                     .ToList(),
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AI] ParseClassifyResult error");
            return new ClassifyResult();
        }
    }
}