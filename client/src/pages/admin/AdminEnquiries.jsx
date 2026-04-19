import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnquiries, updateEnquiry } from '../../api/enquiries';
import { convertEnquiryToOrder } from '../../api/orders';

const STATUSES = ['new', 'contacted', 'negotiating', 'closed_won', 'closed_lost'];
const PAYMENT_METHODS = ['cash', 'upi', 'bank_transfer', 'razorpay'];

const STATUS_COLOR = {
  new: '#A8832A', contacted: '#4A82A8', negotiating: '#8A4AA8',
  closed_won: '#4AA862', closed_lost: '#A84A4A',
};

// ── Detail + Convert modal ────────────────────────────────────────────────────
function EnquiryModal({ enquiry, onClose, onUpdate }) {
  const [status, setStatus]       = useState(enquiry.status);
  const [notes, setNotes]         = useState(enquiry.adminNotes || '');
  const [saving, setSaving]       = useState(false);

  // Convert-to-order state
  const [showConvert, setShowConvert]   = useState(false);
  const [agreedAmount, setAgreedAmount] = useState(enquiry.budget || '');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [converting, setConverting]     = useState(false);
  const [converted, setConverted]       = useState(false);
  const [convertError, setConvertError] = useState('');

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateEnquiry(enquiry._id, { status, adminNotes: notes });
      onUpdate(res.data.enquiry);
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConvert = async () => {
    if (!agreedAmount || Number(agreedAmount) <= 0) {
      setConvertError('Enter a valid agreed amount to continue.');
      return;
    }
    setConverting(true);
    setConvertError('');
    try {
      await convertEnquiryToOrder(enquiry._id, {
        agreedAmount: Number(agreedAmount),
        paymentMethod,
        notes,
      });
      // Mark enquiry as won in local state too
      onUpdate({ ...enquiry, status: 'closed_won' });
      setConverted(true);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      setConvertError(msg);
    } finally {
      setConverting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(30,14,6,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#EFE5CC', borderRadius: '4px', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(30,14,6,0.35)', my: '2rem' }}
      >
        {/* ── Header ── */}
        <div style={{ padding: '1.25rem 1.75rem', background: '#1E0E06', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A8832A' }}>Enquiry Detail</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '1.5rem', color: '#EFE5CC' }}>{enquiry.gemName}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B5548', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* ── Details grid ── */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid rgba(168,131,42,0.2)' }}>
          {[
            ['Customer', enquiry.name],
            ['Phone', enquiry.phone],
            ['Email', enquiry.email || '—'],
            ['Mine / Origin', enquiry.mine || '—'],
            ['Quality', enquiry.quality || '—'],
            ['Weight', enquiry.weight ? `${enquiry.weight} cts` : '—'],
            ['Budget (asked)', enquiry.budget ? `₹${enquiry.budget.toLocaleString('en-IN')}` : '—'],
            ['Submitted', new Date(enquiry.createdAt).toLocaleString('en-IN')],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.54rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '2px' }}>{k}</p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#1E0E06' }}>{v}</p>
            </div>
          ))}
        </div>

        {/* ── Status + Notes ── */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid rgba(168,131,42,0.2)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={inp}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={lbl}>Admin Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes…"
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px 0', background: '#A8832A', border: 'none', borderRadius: '2px', color: '#1E0E06', fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={onClose} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(168,131,42,0.4)', borderRadius: '2px', color: '#6B5548', fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>

        {/* ── Convert to Order ── */}
        <div style={{ padding: '1.25rem 1.75rem', background: 'rgba(74,168,98,0.05)', borderTop: '2px solid rgba(74,168,98,0.25)' }}>
          {converted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(74,168,98,0.12)', border: '1px solid rgba(74,168,98,0.35)', borderRadius: '3px' }}
            >
              <span style={{ fontSize: '1.3rem' }}>✦</span>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2A6B3A', marginBottom: '2px' }}>
                  Order Created Successfully
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.92rem', color: '#3A7A4A' }}>
                  Enquiry marked as <strong>Closed Won</strong>. View it in the Orders section.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <button
                onClick={() => setShowConvert(v => !v)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '0', marginBottom: showConvert ? '1rem' : '0' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', color: '#4AA862' }}>◈</span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A6B3A' }}>
                    Convert to Order
                  </span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.88rem', color: '#6B5548' }}>
                    — Deal closed? Create an order record
                  </span>
                </div>
                <motion.span animate={{ rotate: showConvert ? 180 : 0 }} style={{ color: '#4AA862', fontSize: '0.9rem' }}>▾</motion.span>
              </button>

              <AnimatePresence>
                {showConvert && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={lbl}>Agreed Amount (₹) *</label>
                        <input
                          type="number"
                          value={agreedAmount}
                          onChange={e => setAgreedAmount(e.target.value)}
                          placeholder="e.g. 85000"
                          style={inp}
                        />
                      </div>
                      <div>
                        <label style={lbl}>Payment Method</label>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={inp}>
                          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                    </div>

                    {convertError && (
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: '#8B2020', marginBottom: '0.75rem', padding: '8px 10px', background: 'rgba(180,60,60,0.07)', border: '1px solid rgba(180,60,60,0.2)', borderRadius: '3px' }}>
                        {convertError}
                      </p>
                    )}

                    <button
                      onClick={handleConvert}
                      disabled={converting}
                      style={{
                        width: '100%', padding: '11px 0',
                        background: converting ? 'rgba(74,168,98,0.5)' : '#4AA862',
                        border: 'none', borderRadius: '2px',
                        color: '#fff', fontFamily: "'Cinzel', serif",
                        fontSize: '0.65rem', letterSpacing: '0.14em',
                        textTransform: 'uppercase', cursor: converting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {converting ? 'Creating Order…' : '✦  Confirm & Create Order'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminEnquiries() {
  const [enquiries, setEnquiries]       = useState([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected]         = useState(null);
  const [loading, setLoading]           = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      const res = await getEnquiries(params);
      setEnquiries(res.data.enquiries || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filterStatus]); // eslint-disable-line

  const handleUpdate = (updated) => {
    setEnquiries(prev => prev.map(e => e._id === updated._id ? updated : e));
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div style={{ padding: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '4px' }}>CRM Pipeline</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2.4rem', color: '#1E0E06' }}>
            Enquiries <span style={{ fontSize: '1.2rem', color: '#6B5548' }}>({total})</span>
          </h1>
        </div>
        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {['', ...STATUSES].map(s => (
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
      <div style={{ background: '#E8D9BC', border: '1px solid rgba(168,131,42,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif", fontSize: '1.1rem' }}>Loading…</div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B5548', fontFamily: "'EB Garamond', serif", fontSize: '1.1rem' }}>No enquiries found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168,131,42,0.2)', background: 'rgba(168,131,42,0.06)' }}>
                {['Customer', 'Phone', 'Gemstone', 'Weight', 'Budget', 'Status', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '12px 1.5rem', textAlign: 'left', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B5548', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e, i) => (
                <tr key={e._id} style={{ borderBottom: i < enquiries.length - 1 ? '1px solid rgba(168,131,42,0.1)' : 'none', cursor: 'pointer' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(168,131,42,0.06)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <td style={td}>{e.name}</td>
                  <td style={td}>{e.phone}</td>
                  <td style={{ ...td, color: '#A8832A', fontWeight: 500 }}>{e.gemName}</td>
                  <td style={td}>{e.weight ? `${e.weight} ct` : '—'}</td>
                  <td style={td}>{e.budget ? `₹${e.budget.toLocaleString('en-IN')}` : '—'}</td>
                  <td style={td}>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.5rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '3px 9px', borderRadius: '2px',
                      background: `${STATUS_COLOR[e.status] || '#A8832A'}18`,
                      color: STATUS_COLOR[e.status] || '#A8832A',
                      border: `1px solid ${STATUS_COLOR[e.status] || '#A8832A'}40`,
                    }}>{e.status?.replace('_', ' ')}</span>
                  </td>
                  <td style={{ ...td, color: '#6B5548', whiteSpace: 'nowrap' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={td}>
                    <button onClick={() => setSelected(e)} style={{
                      fontFamily: "'Cinzel', serif", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#A8832A', background: 'none', border: '1px solid rgba(168,131,42,0.4)',
                      padding: '4px 10px', borderRadius: '2px', cursor: 'pointer',
                    }}>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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

      {/* Enquiry detail modal */}
      <AnimatePresence>
        {selected && (
          <EnquiryModal
            enquiry={selected}
            onClose={() => setSelected(null)}
            onUpdate={handleUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const lbl = { display: 'block', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '6px' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid rgba(168,131,42,0.35)', borderRadius: '2px', background: 'rgba(239,229,204,0.8)', fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#1E0E06', outline: 'none' };
const td  = { padding: '11px 1.5rem', fontFamily: "'EB Garamond', serif", fontSize: '0.97rem', color: '#38200E' };
