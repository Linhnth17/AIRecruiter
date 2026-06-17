namespace AIRecruiter.Core.DTOs;

public class ExtractedCandidateInfo
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public int YearsOfExp { get; set; }
    public string Summary { get; set; } = string.Empty;
}