import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const NAV = [
  { label: 'Dashboard',  path: '/admin',            icon: '◈' },
  { label: 'Enquiries',  path: '/admin/enquiries',   icon: '✉' },
  { label: 'Orders',     path: '/admin/orders',      icon: '◻' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'EB Garamond', serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        background: '#1E0E06',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 0',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        borderRight: '1px solid rgba(168,131,42,0.2)',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid rgba(168,131,42,0.15)' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '1.5rem', color: '#EFE5CC' }}>Ratnawala</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A8832A', marginTop: '2px' }}>
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '1.5rem 0', flex: 1 }}>
          {NAV.map(n => (
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === '/admin'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 1.5rem',
                textDecoration: 'none',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isActive ? '#A8832A' : '#9A8070',
                background: isActive ? 'rgba(168,131,42,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #A8832A' : '3px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <span style={{ fontSize: '1rem' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(168,131,42,0.15)' }}>
          <p style={{ color: '#9A8070', fontSize: '0.85rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</p>
          <p style={{ color: '#6B5548', fontSize: '0.78rem', marginBottom: '12px', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px', background: 'transparent',
              border: '1px solid rgba(168,131,42,0.3)', borderRadius: '2px',
              color: '#9A8070', cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '0.56rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main style={{ marginLeft: '240px', flex: 1, background: '#EFE5CC', minHeight: '100vh', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
