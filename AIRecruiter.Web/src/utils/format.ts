export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + '...';
}

export function parseList(str: string): string[] {
  return str.split('|').map(s => s.trim()).filter(Boolean);
}

export function parseSkills(str: string): string[] {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}