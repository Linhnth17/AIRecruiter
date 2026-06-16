namespace AIRecruiter.Core.DTOs;

public record JobDescriptionDto(
    Guid Id,
    string Title,
    string Content,
    string RequiredSkills,
    int YearsOfExperience,
    DateTime CreatedAt
);