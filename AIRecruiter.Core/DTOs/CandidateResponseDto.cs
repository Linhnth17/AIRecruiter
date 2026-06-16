namespace AIRecruiter.Core.DTOs;

public record CandidateResponseDto(
    Guid Id,
    string FullName,
    string Email,
    int MatchScore,
    string MatchSummary,
    string Strengths,
    string Weaknesses,
    string RedFlags,
    string SuggestedQuestions,
    string Status,
    DateTime CreatedAt
);