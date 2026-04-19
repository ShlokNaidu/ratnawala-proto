import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getOrders, updateOrder } from '../../api/orders';

const ORDER_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'refunded', 'failed'];

const STATUS_COLOR = {
  placed: '#A8832A', confirmed: '#4A82A8', processing: '#8A4AA8',
  shipped: '#4AA8A8', delivered: '#4AA862', cancelled: '#A84A4A',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      const res = await getOrders(params);
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filterStatus]); // eslint-disable-line

  const handleStatusUpdate = async (id) => {
    setSaving(true);
    try {
      const res = await updateOrder(id, { orderStatus: editStatus });
      setOrders(prev => prev.map(o => o._id === id ? res.data.order : o));
      setEditId(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div style={{ padding: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '4px' }}>Fulfillment</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2.4rem', color: '#1E0E06' }}>Orders <span style={{ fontSize: '1.2rem', color: '#6B5548' }}>({total})</span></h1>
        </div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {['', ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} style={{
              fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.54rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 12px', borderRadius: '2px', cursor: 'pointer',
              background: filterStatus === s ? '#A8832A' : 'transparent',
              color: filterStatus === s ? '#1E0E06' : '#6B5548',
              border: `1px solid ${filterStatus === s ? '#A8832A' : 'rgba(168,131,42,0.3)'}`,
            }}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#E8D9BC', border: '1px solid rgba(168,131,42,0.2)', borderRadius: '4px', overflow: 'hidden' }}
      >
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif", fontSize: '1.1rem' }}>Loading…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif", fontSize: '1.1rem' }}>No orders yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168,131,42,0.2)', background: 'rgba(168,131,42,0.06)' }}>
                {['Customer', 'Phone', 'Gemstone', 'Amount', 'Payment', 'Order Status', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '12px 1.25rem', textAlign: 'left', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B5548', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o._id} style={{ borderBottom: i < orders.length - 1 ? '1px solid rgba(168,131,42,0.1)' : 'none' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(168,131,42,0.06)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <td style={td}>{o.customerName}</td>
                  <td style={td}>{o.customerPhone}</td>
                  <td style={{ ...td, color: '#A8832A' }}>{o.gemName}</td>
                  <td style={td}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td style={td}>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.5rem',
                      textTransform: 'uppercase', padding: '3px 9px', borderRadius: '2px',
                      background: o.paymentStatus === 'paid' ? 'rgba(74,168,98,0.15)' : 'rgba(168,131,42,0.12)',
                      color: o.paymentStatus === 'paid' ? '#4AA862' : '#A8832A',
                      border: `1px solid ${o.paymentStatus === 'paid' ? '#4AA86240' : '#A8832A40'}`,
                    }}>{o.paymentStatus}</span>
                  </td>
                  <td style={td}>
                    {editId === o._id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ padding: '4px 8px', background: '#EFE5CC', border: '1px solid rgba(168,131,42,0.4)', borderRadius: '2px', fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: '#1E0E06', outline: 'none' }}>
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => handleStatusUpdate(o._id)} disabled={saving} style={{ padding: '4px 10px', background: '#A8832A', border: 'none', borderRadius: '2px', color: '#1E0E06', cursor: 'pointer', fontSize: '0.8rem' }}>✓</button>
                        <button onClick={() => setEditId(null)} style={{ padding: '4px 8px', background: 'none', border: '1px solid rgba(168,131,42,0.3)', borderRadius: '2px', color: '#6B5548', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                      </div>
                    ) : (
                      <span style={{
                        fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.5rem',
                        textTransform: 'uppercase', padding: '3px 9px', borderRadius: '2px',
                        background: `${STATUS_COLOR[o.orderStatus] || '#A8832A'}18`,
                        color: STATUS_COLOR[o.orderStatus] || '#A8832A',
                        border: `1px solid ${STATUS_COLOR[o.orderStatus] || '#A8832A'}40`,
                      }}>{o.orderStatus}</span>
                    )}
                  </td>
                  <td style={{ ...td, color: '#6B5548', whiteSpace: 'nowrap' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={td}>
                    <button onClick={() => { setEditId(o._id); setEditStatus(o.orderStatus); }} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A8832A', background: 'none', border: '1px solid rgba(168,131,42,0.4)', padding: '4px 10px', borderRadius: '2px', cursor: 'pointer' }}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1.5rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: '36px', height: '36px', borderRadius: '2px',
              background: page === p ? '#A8832A' : 'transparent',
              color: page === p ? '#1E0E06' : '#6B5548',
              border: '1px solid rgba(168,131,42,0.4)',
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem', cursor: 'pointer',
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const td = { padding: '11px 1.25rem', fontFamily: "'EB Garamond', serif", fontSize: '0.97rem', color: '#38200E' };
