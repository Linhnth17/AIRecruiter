import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, shadow } from '../../styles/tokens';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Upload, LayoutDashboard, Briefcase, Users } from 'lucide-react';

interface NavItem {
  path:   string;
  label:  string;
  icon:   React.ReactNode;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/',          label: 'Jobs',      icon: <Briefcase size={15} /> },
  { path: '/candidates', label: 'Candidates', icon: <Users size={15} /> },
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { path: '/upload',    label: 'Upload CVs', icon: <Upload size={15} />, roles: ['Admin', 'Recruiter'] },
  { path: '/create',    label: '+ New JD',  icon: null, roles: ['Admin', 'Recruiter'] },
];

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.roles || (user && item.roles.includes(user.role))
  );

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
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 32, textDecoration: 'none' }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>AI Recruiter</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {visibleItems.map(({ path, label, icon }) => {
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
              display:        'flex',
              alignItems:     'center',
              gap:            6,
            }}>
              {icon}
              {label}
            </Link>
          );
        })}
      </div>

      {/* User info + Logout */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && (
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            {user.fullName} · <span style={{ opacity: 0.7 }}>{user.role}</span>
          </span>
        )}
        <button onClick={handleLogout} style={{
          background:   'rgba(255,255,255,0.15)',
          border:       'none',
          color:        '#fff',
          padding:      '6px 14px',
          borderRadius: 6,
          cursor:       'pointer',
          fontSize:     13,
          display:      'flex',
          alignItems:   'center',
          gap:          6,
        }}>
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </nav>
  );
}