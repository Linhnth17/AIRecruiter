namespace AIRecruiter.Core.DTOs;

public record CreateCandidateDto(
    string FullName,
    string Email,
    string CvContent,
    string CvFileName,
    Guid JobDescriptionId
);