using System;
using System.Collections.Generic;

namespace AIRecruiter.Infrastructure.Persistence;

public partial class Candidate
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string CvContent { get; set; } = null!;

    public string CvFileName { get; set; } = null!;

    public int MatchScore { get; set; }

    public string MatchSummary { get; set; } = null!;

    public string Strengths { get; set; } = null!;

    public string Weaknesses { get; set; } = null!;

    public string RedFlags { get; set; } = null!;

    public string SuggestedQuestions { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid JobDescriptionId { get; set; }

    public virtual JobDescription JobDescription { get; set; } = null!;
}
