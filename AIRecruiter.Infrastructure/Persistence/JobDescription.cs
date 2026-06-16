using System;
using System.Collections.Generic;

namespace AIRecruiter.Infrastructure.Persistence;

public partial class JobDescription
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string RequiredSkills { get; set; } = null!;

    public int YearsOfExperience { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Candidate> Candidates { get; set; } = new List<Candidate>();
}
