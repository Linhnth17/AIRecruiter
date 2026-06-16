export const colors = {
  primary:   '#667eea',
  secondary: '#764ba2',
  success:   '#059669',
  warning:   '#d97706',
  danger:    '#dc2626',
  info:      '#1d4ed8',

  bg: {
    page:  '#f0f2f5',
    card:  '#ffffff',
    muted: '#f8f9fa',
  },

  text: {
    primary:   '#1a1a2e',
    secondary: '#555555',
    muted:     '#888888',
    inverse:   '#ffffff',
  },

  border: '#e0e0e0',

  status: {
    Applied:   { bg: '#dbeafe', text: '#1d4ed8' },
    Screening: { bg: '#fef3c7', text: '#b45309' },
    Interview: { bg: '#ede9fe', text: '#7c3aed' },
    Offer:     { bg: '#d1fae5', text: '#065f46' },
    Hired:     { bg: '#a7f3d0', text: '#065f46' },
    Rejected:  { bg: '#fee2e2', text: '#b91c1c' },
  },

  score: {
    high:   { bg: '#d1fae5', text: '#059669' },
    medium: { bg: '#fef3c7', text: '#d97706' },
    low:    { bg: '#fee2e2', text: '#dc2626' },
  },
};

export type StatusKey = keyof typeof colors.status;

export const radius = {
  sm:  6,
  md:  10,
  lg:  14,
  xl:  20,
};

export const shadow = {
  sm:      '0 2px 8px rgba(0,0,0,0.06)',
  md:      '0 4px 16px rgba(0,0,0,0.08)',
  lg:      '0 8px 32px rgba(0,0,0,0.12)',
  primary: '0 4px 16px rgba(102,126,234,0.4)',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};