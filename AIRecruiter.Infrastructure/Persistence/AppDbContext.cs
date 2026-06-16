using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AIRecruiter.Infrastructure.Persistence;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Candidate> Candidates { get; set; }

    public virtual DbSet<JobDescription> JobDescriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("candidates_pkey");

            entity.ToTable("candidates");

            entity.HasIndex(e => e.JobDescriptionId, "idx_candidates_job_description_id");

            entity.HasIndex(e => e.MatchScore, "idx_candidates_match_score").IsDescending();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CvContent).HasColumnName("cv_content");
            entity.Property(e => e.CvFileName)
                .HasMaxLength(500)
                .HasColumnName("cv_file_name");
            entity.Property(e => e.Email)
                .HasMaxLength(200)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(200)
                .HasColumnName("full_name");
            entity.Property(e => e.JobDescriptionId).HasColumnName("job_description_id");
            entity.Property(e => e.MatchScore).HasColumnName("match_score");
            entity.Property(e => e.MatchSummary)
                .HasDefaultValueSql("''::text")
                .HasColumnName("match_summary");
            entity.Property(e => e.RedFlags)
                .HasDefaultValueSql("''::text")
                .HasColumnName("red_flags");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Applied'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.Strengths)
                .HasDefaultValueSql("''::text")
                .HasColumnName("strengths");
            entity.Property(e => e.SuggestedQuestions)
                .HasDefaultValueSql("''::text")
                .HasColumnName("suggested_questions");
            entity.Property(e => e.Weaknesses)
                .HasDefaultValueSql("''::text")
                .HasColumnName("weaknesses");

            entity.HasOne(d => d.JobDescription).WithMany(p => p.Candidates)
                .HasForeignKey(d => d.JobDescriptionId)
                .HasConstraintName("fk_job_description");
        });

        modelBuilder.Entity<JobDescription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("job_descriptions_pkey");

            entity.ToTable("job_descriptions");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.RequiredSkills).HasColumnName("required_skills");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
            entity.Property(e => e.YearsOfExperience).HasColumnName("years_of_experience");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
