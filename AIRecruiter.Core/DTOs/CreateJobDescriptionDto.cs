namespace AIRecruiter.Core.DTOs;

public record CreateJobDescriptionDto(
    string Title,
    string Content,
    string RequiredSkills,
    int YearsOfExperience
);