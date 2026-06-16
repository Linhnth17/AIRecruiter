using AIRecruiter.Core.Interfaces;
using DocumentFormat.OpenXml.Packaging;
using UglyToad.PdfPig;

namespace AIRecruiter.Infrastructure.Services;

public class DocumentParserService : IDocumentParser
{
    public async Task<string> ParseAsync(Stream fileStream, string fileName)
    {
        string extension = Path.GetExtension(fileName).ToLower();

        return extension switch
        {
            ".pdf" => await ParsePdfAsync(fileStream),
            ".docx" => await ParseDocxAsync(fileStream),
            ".txt" => await ParseTxtAsync(fileStream),
            _ => throw new NotSupportedException($"Không hỗ trợ file {extension}.")
        };
    }

    private Task<string> ParsePdfAsync(Stream stream)
    {
        using PdfDocument pdf = PdfDocument.Open(stream);
        string text = string.Join("\n", pdf.GetPages().Select(p => p.Text));
        return Task.FromResult(text);
    }

    private Task<string> ParseDocxAsync(Stream stream)
    {
        using WordprocessingDocument doc = WordprocessingDocument.Open(stream, false);
        string text = doc.MainDocumentPart?.Document?.Body?.InnerText ?? string.Empty;
        return Task.FromResult(text);
    }

    private async Task<string> ParseTxtAsync(Stream stream)
    {
        using StreamReader reader = new(stream);
        return await reader.ReadToEndAsync();
    }
}