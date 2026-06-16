namespace AIRecruiter.Core.Interfaces;

public interface IDocumentParser
{
    Task<string> ParseAsync(Stream fileStream, string fileName);
}