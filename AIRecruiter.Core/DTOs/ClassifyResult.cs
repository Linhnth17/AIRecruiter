namespace AIRecruiter.Core.DTOs;

public class ClassifyResult
{
    public ExtractedCandidateInfo CandidateInfo { get; set; } = new();
    public Guid BestMatchJobId { get; set; }
    public int MatchScore { get; set; }
    public string MatchSummary { get; set; } = string.Empty;
    public string Strengths { get; set; } = string.Empty;
    public string Weaknesses { get; set; } = string.Empty;
    public string RedFlags { get; set; } = string.Empty;
    public List<string> Questions { get; set; } = [];
}