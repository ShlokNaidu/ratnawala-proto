import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const STAT_ICONS = { total: '✉', new: '◈', contacted: '◻', won: '✦', orders: '◇' };

function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      style={{
        background: '#E8D9BC', border: '1px solid rgba(168,131,42,0.25)',
        borderRadius: '4px', padding: '1.5rem 1.75rem',
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 2px 12px rgba(56,32,14,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#1E0E06', lineHeight: 1 }}>{value ?? '—'}</p>
        </div>
        <span style={{ fontSize: '1.5rem', color, opacity: 0.7 }}>{icon}</span>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enqRes, ordRes] = await Promise.all([
          api.get('/enquiries?limit=5'),
          api.get('/orders?limit=5'),
        ]);

        const enquiries = enqRes.data.enquiries || [];
        setRecentEnquiries(enquiries.slice(0, 5));

        // Compute stats
        const byStatus = (status) => enquiries.filter(e => e.status === status).length;
        setStats({
          total: enqRes.data.total || 0,
          new: byStatus('new'),
          contacted: byStatus('contacted'),
          won: byStatus('closed_won'),
          orders: ordRes.data.total || 0,
        });
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STATUS_COLOR = {
    new: '#A8832A', contacted: '#4A82A8', negotiating: '#8A4AA8',
    closed_won: '#4AA862', closed_lost: '#A84A4A',
  };

  return (
    <div style={{ padding: '2.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '4px' }}>Overview</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2.4rem', color: '#1E0E06' }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard label="Total Enquiries"  value={stats?.total}     icon="✉" color="#A8832A" delay={0}    />
        <StatCard label="New"              value={stats?.new}       icon="◈" color="#4AA862" delay={0.07} />
        <StatCard label="Contacted"        value={stats?.contacted} icon="◻" color="#4A82A8" delay={0.14} />
        <StatCard label="Won"              value={stats?.won}       icon="✦" color="#8A4AA8" delay={0.21} />
        <StatCard label="Total Orders"     value={stats?.orders}    icon="◇" color="#A84A4A" delay={0.28} />
      </div>

      {/* Recent enquiries */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ background: '#E8D9BC', border: '1px solid rgba(168,131,42,0.2)', borderRadius: '4px', overflow: 'hidden' }}
      >
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(168,131,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#38200E' }}>Recent Enquiries</h2>
          <button onClick={() => navigate('/admin/enquiries')} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A8832A', background: 'none', border: 'none', cursor: 'pointer' }}>
            View All →
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif" }}>Loading…</div>
        ) : recentEnquiries.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif" }}>No enquiries yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168,131,42,0.15)' }}>
                {['Customer', 'Gemstone', 'Budget', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 1.75rem', textAlign: 'left', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B5548', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e, i) => (
                <tr key={e._id} style={{ borderBottom: i < recentEnquiries.length - 1 ? '1px solid rgba(168,131,42,0.1)' : 'none' }}
                  onClick={() => navigate('/admin/enquiries')}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(168,131,42,0.06)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <td style={td}>{e.name}</td>
                  <td style={td}>{e.gemName}</td>
                  <td style={td}>{e.budget ? `₹${e.budget.toLocaleString('en-IN')}` : '—'}</td>
                  <td style={{ ...td, cursor: 'pointer' }}>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.52rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '3px 10px', borderRadius: '2px',
                      background: `${STATUS_COLOR[e.status] || '#A8832A'}18`,
                      color: STATUS_COLOR[e.status] || '#A8832A',
                      border: `1px solid ${STATUS_COLOR[e.status] || '#A8832A'}44`,
                    }}>{e.status}</span>
                  </td>
                  <td style={{ ...td, color: '#6B5548' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

const td = { padding: '12px 1.75rem', fontFamily: "'EB Garamond', serif", fontSize: '0.97rem', color: '#38200E', cursor: 'pointer' };
