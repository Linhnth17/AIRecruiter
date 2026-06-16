using AIRecruiter.Core.DTOs;

namespace AIRecruiter.Core.Interfaces;

public interface IAIService
{
    Task<CandidateAnalysis> AnalyzeCVAsync(string cvContent, string jobDescription);
    Task<List<string>> GenerateInterviewQuestionsAsync(string cvContent, string jobDescription);
}