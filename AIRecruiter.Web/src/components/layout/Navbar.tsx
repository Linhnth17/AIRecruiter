import { Link, useLocation } from 'react-router-dom';
import { colors, shadow } from '../../styles/tokens';

interface NavItem {
  path:  string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/',          label: 'Jobs' },
  { path: '/create',    label: 'New JD' },
  { path: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const location = useLocation();
  const isApply  = location.pathname === '/apply';

  return (
    <nav style={{
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      padding:    '0 32px',
      display:    'flex',
      alignItems: 'center',
      height:     60,
      boxShadow:  shadow.primary,
      position:   'sticky',
      top:        0,
      zIndex:     100,
    }}>
      <Link to="/" style={{
        display:    'flex',
        alignItems: 'center',
        gap:        8,
        marginRight: 32,
        textDecoration: 'none',
      }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>AI Recruiter</span>
      </Link>

      {!isApply && (
        <div style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                color:          active ? '#fff' : 'rgba(255,255,255,0.65)',
                fontSize:       14,
                fontWeight:     active ? 600 : 400,
                padding:        '6px 12px',
                borderRadius:   6,
                background:     active ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                transition:     'all 0.2s',
              }}>
                {label}
              </Link>
            );
          })}
        </div>
      )}

      <div style={{ marginLeft: 'auto' }}>
        <Link to="/apply" style={{
          background:     '#fff',
          color:          colors.primary,
          padding:        '8px 20px',
          borderRadius:   20,
          fontWeight:     600,
          fontSize:       14,
          textDecoration: 'none',
          boxShadow:      '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          Apply Now →
        </Link>
      </div>
    </nav>
  );
}