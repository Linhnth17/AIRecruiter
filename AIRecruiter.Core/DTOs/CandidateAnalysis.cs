namespace AIRecruiter.Core.DTOs;

public class CandidateAnalysis
{
    public int MatchScore { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string Strengths { get; set; } = string.Empty;
    public string Weaknesses { get; set; } = string.Empty;
    public string RedFlags { get; set; } = string.Empty;
}