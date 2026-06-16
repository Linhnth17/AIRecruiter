using System.Text;
using System.Text.Json;
using AIRecruiter.Core.DTOs;
using AIRecruiter.Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AIRecruiter.Infrastructure.Services;

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private const string Model = "llama-3.3-70b-versatile";

    public AIService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<CandidateAnalysis> AnalyzeCVAsync(string cvContent, string jobDescription)
    {
        string prompt = "You are a professional AI recruiter. Analyze the CV below and compare it with the Job Description.\n\n"
            + "JOB DESCRIPTION:\n" + jobDescription + "\n\n"
            + "CV:\n" + cvContent + "\n\n"
            + "Reply ONLY in the following JSON format, no extra text, no markdown:\n"
            + "{\n"
            + "  \"matchScore\": <0-100>,\n"
            + "  \"summary\": \"<2-3 sentence summary>\",\n"
            + "  \"strengths\": \"<strengths separated by |>\",\n"
            + "  \"weaknesses\": \"<weaknesses separated by |>\",\n"
            + "  \"redFlags\": \"<red flags if any, separated by |>\"\n"
            + "}";

        string json = await CallGroqAsync(prompt);
        Console.WriteLine($"[AI] Analysis response: {json}");
        return ParseAnalysisJson(json);
    }

    public async Task<List<string>> GenerateInterviewQuestionsAsync(string cvContent, string jobDescription)
    {
        string prompt = "Based on the CV and Job Description below, generate 5 interview questions.\n"
            + "Mix technical and behavioral questions.\n\n"
            + "JOB DESCRIPTION:\n" + jobDescription + "\n\n"
            + "CV:\n" + cvContent + "\n\n"
            + "Reply ONLY in the following JSON format, no extra text, no markdown:\n"
            + "{\n"
            + "  \"questions\": [\"question 1\", \"question 2\", \"question 3\", \"question 4\", \"question 5\"]\n"
            + "}";

        string json = await CallGroqAsync(prompt);
        Console.WriteLine($"[AI] Questions response: {json}");
        return ParseQuestionsJson(json);
    }

    private async Task<string> CallGroqAsync(string prompt)
    {
        var requestBody = new
        {
            model = Model,
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.3,
            max_tokens = 1024
        };

        var content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.PostAsync("openai/v1/chat/completions", content);
        var body = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"[AI] Raw response: {body[..Math.Min(300, body.Length)]}");

        using JsonDocument doc = JsonDocument.Parse(body);
        string text = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        return text.Replace("```json", "").Replace("```", "").Trim();
    }

    private static CandidateAnalysis ParseAnalysisJson(string json)
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
            Console.WriteLine($"[AI] Parse error: {ex.Message}");
            return new CandidateAnalysis { MatchScore = 0, Summary = "Unable to analyze CV." };
        }
    }

    private static List<string> ParseQuestionsJson(string json)
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
            Console.WriteLine($"[AI] Parse questions error: {ex.Message}");
            return ["Unable to generate questions."];
        }
    }
}