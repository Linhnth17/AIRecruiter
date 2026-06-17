import { useState } from 'react';
import { candidateApi } from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors, spacing, radius } from '../styles/tokens';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

interface UploadResult {
  total:     number;
  processed: number;
  failed:    number;
  message:   string;
}

export default function BulkUpload() {
  const [files, setFiles]       = useState<File[]>([]);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<UploadResult | null>(null);
  const [error, setError]       = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setResult(null);
    setError('');
  };

  const handleUpload = async () => {
    if (files.length === 0) return setError('Please select at least one CV file.');
    setLoading(true);
    setError('');

    const formData = new FormData();
    files.forEach(file => formData.append('cvFiles', file));

    try {
      const res = await candidateApi.bulkUpload(formData);
      setResult(res.data);
      setFiles([]);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) =>
    setFiles(prev => prev.filter((_, i) => i !== index));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
          Bulk Upload CVs
        </h1>
        <p style={{ color: colors.text.muted, fontSize: 14 }}>
          Upload multiple CVs — AI will automatically extract candidate info and match to the best job description
        </p>
      </div>

      <Card padding={spacing.xl}>
        {/* Upload Zone */}
        <div style={{ marginBottom: spacing.lg }}>
          <label htmlFor="cv-files" style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{
              border:       `2px dashed ${files.length > 0 ? colors.primary : colors.border}`,
              borderRadius: radius.lg,
              padding:      40,
              textAlign:    'center',
              background:   files.length > 0 ? '#f0f0ff' : colors.bg.muted,
              transition:   'all 0.2s',
            }}>
              <Upload size={40} color={files.length > 0 ? colors.primary : colors.text.muted} style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 600, color: colors.text.secondary, marginBottom: 4 }}>
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload CVs'}
              </p>
              <p style={{ color: colors.text.muted, fontSize: 13 }}>
                PDF, DOCX, TXT supported • Multiple files allowed
              </p>
            </div>
          </label>
          <input
            type="file"
            id="cv-files"
            accept=".pdf,.docx,.txt"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: colors.text.secondary, marginBottom: 10 }}>
              Selected Files ({files.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {files.map((file, i) => (
                <div key={i} style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  background:     colors.bg.muted,
                  borderRadius:   radius.md,
                  padding:        '10px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={16} color={colors.primary} />
                    <span style={{ fontSize: 14, color: colors.text.secondary }}>{file.name}</span>
                    <span style={{ fontSize: 12, color: colors.text.muted }}>
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button onClick={() => removeFile(i)} style={{
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: colors.danger, padding: 4
                  }}>
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2', color: colors.danger,
            padding: '10px 14px', borderRadius: radius.md,
            fontSize: 14, marginBottom: spacing.md
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: '#f0fdf4', borderRadius: radius.md,
            padding: spacing.md, marginBottom: spacing.md,
            border: `1px solid #a7f3d0`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle size={20} color={colors.success} />
              <span style={{ fontWeight: 600, color: colors.success }}>Upload Successful</span>
            </div>
            <p style={{ fontSize: 14, color: colors.text.secondary }}>{result.message}</p>
            <div style={{ display: 'flex', gap: spacing.lg, marginTop: 10 }}>
              <span style={{ fontSize: 13, color: colors.text.muted }}>Total: <strong>{result.total}</strong></span>
              <span style={{ fontSize: 13, color: colors.success }}>Processed: <strong>{result.processed}</strong></span>
              {result.failed > 0 && (
                <span style={{ fontSize: 13, color: colors.danger }}>Failed: <strong>{result.failed}</strong></span>
              )}
            </div>
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          disabled={loading || files.length === 0}
          onClick={handleUpload}
        >
          {loading
            ? '⏳ Uploading & AI Processing...'
            : <><Upload size={16} /> Upload {files.length > 0 ? `${files.length} CV(s)` : 'CVs'}</>
          }
        </Button>
      </Card>
    </div>
  );
}