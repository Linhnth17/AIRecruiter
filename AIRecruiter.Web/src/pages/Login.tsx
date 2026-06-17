import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { colors, radius, shadow, spacing } from '../styles/tokens';
import Button from '../components/ui/Button';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate        = useNavigate();
  const { login }       = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(email, password);
      login(res.data);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:        '100%',
    padding:      '11px 14px 11px 40px',
    borderRadius: radius.md,
    border:       `1.5px solid ${colors.border}`,
    fontSize:     15,
    outline:      'none',
    boxSizing:    'border-box' as const,
    fontFamily:   'Inter, sans-serif',
  };

  return (
    <div style={{
      minHeight:      '100vh',
      background:     `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        spacing.lg,
    }}>
      <div style={{
        background:   '#fff',
        borderRadius: radius.xl,
        padding:      spacing.xxl,
        width:        '100%',
        maxWidth:     420,
        boxShadow:    shadow.lg,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>
            AI Recruiter
          </h1>
          <p style={{ color: colors.text.muted, fontSize: 14 }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:   '#fee2e2',
            color:        colors.danger,
            padding:      '10px 14px',
            borderRadius: radius.md,
            fontSize:     14,
            marginBottom: spacing.md,
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: spacing.md, position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: colors.text.secondary }}>
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color={colors.text.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@airecruiter.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = colors.primary}
              onBlur={e  => e.target.style.borderColor = colors.border}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: spacing.xl, position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: colors.text.secondary }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color={colors.text.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = colors.primary}
              onBlur={e  => e.target.style.borderColor = colors.border}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <Button fullWidth size="lg" disabled={loading} onClick={handleLogin}>
          {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
        </Button>
      </div>
    </div>
  );
}