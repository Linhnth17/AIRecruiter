namespace AIRecruiter.Core.DTOs;

public record BulkUploadResponseDto(
    int Total,
    int Processed,
    int Failed,
    string Message
);