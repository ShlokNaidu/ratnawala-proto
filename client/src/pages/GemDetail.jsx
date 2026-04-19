import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Divider from '../components/ui/Divider';
import { GEMSTONES } from '../data/gemstones';
import { getGemImage } from '../data/getGemImage';
import { submitEnquiry } from '../api/enquiries';

function getGemBySlug(slug) {
  return GEMSTONES.find(g => g.slug === slug);
}

// ── Order Form ────────────────────────────────────────────────────────────────
function OrderForm({ gem }) {
  const { register, handleSubmit, watch } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [tcOpen, setTcOpen] = useState(false);
  const weight  = watch('weight', Math.round((gem.weightRange.min + gem.weightRange.max) / 2));
  const quality = watch('quality', '');

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      await submitEnquiry({
        name: data.name,
        phone: data.phone,
        gemSlug: gem.slug,
        gemName: gem.name,
        mine: data.mine,
        quality: data.quality,
        weight: parseFloat(data.weight),
        budget: parseFloat(data.budget),
        purpose: 'astrological',
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center', padding: '3rem 2rem',
          border: '1px solid rgba(201,168,76,0.4)', borderRadius: '4px',
          background: 'rgba(201,168,76,0.05)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(201,168,76,0.15)', border: '2px solid #C9A84C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#2C1A0E', marginBottom: '0.5rem' }}>
          Enquiry Submitted
        </h3>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#8A7060' }}>
          Our team will contact you within 24 hours to discuss your {gem.name} enquiry.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>Select Mine / Origin</label>
        <select {...register('mine', { required: true })} style={inp}>
          <option value="">Choose mine...</option>
          {gem.mines.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>Quality Grade</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {gem.qualities.map(q => {
            const isSelected = quality === q;
            return (
              <label key={q} style={{ cursor: 'pointer' }}>
                <input
                  {...register('quality', { required: true })}
                  type="radio" value={q}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                />
                <span style={{
                  display: 'block',
                  fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em',
                  padding: '8px 16px', borderRadius: '2px', cursor: 'pointer',
                  userSelect: 'none',
                  border: isSelected ? '1px solid #A8832A' : '1px solid rgba(201,168,76,0.4)',
                  background: isSelected ? '#A8832A' : 'transparent',
                  color: isSelected ? '#1E0E06' : '#6B5548',
                  transition: 'all 0.18s ease',
                }}>
                  {q}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>Weight — <span style={{ color: '#C9A84C' }}>{weight} carats</span></label>
        <input type="range" min={gem.weightRange.min} max={gem.weightRange.max} step={0.5}
          {...register('weight')} style={{ width: '100%', accentColor: '#C9A84C', marginTop: '8px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={sm}>{gem.weightRange.min} ct</span>
          <span style={sm}>{gem.weightRange.max} ct</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>Budget (₹)</label>
        <input type="number" placeholder="Enter your budget..." {...register('budget', { required: true })} style={inp} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={lbl}>Your Name</label>
          <input type="text" placeholder="Full name" {...register('name', { required: true })} style={inp} />
        </div>
        <div>
          <label style={lbl}>Contact Number</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX" {...register('phone', { required: true })} style={inp} />
        </div>
      </div>

      {/* T&C Accordion */}
      <div style={{ border: '1px solid rgba(201,168,76,0.3)', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <button type="button" onClick={() => setTcOpen(!tcOpen)} style={{
          width: '100%', padding: '12px 16px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.14em', color: '#4A2F1A', textTransform: 'uppercase' }}>
            Terms &amp; Conditions
          </span>
          <motion.span animate={{ rotate: tcOpen ? 180 : 0 }} style={{ color: '#C9A84C' }}>▾</motion.span>
        </button>
        <AnimatePresence>
          {tcOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.93rem', color: '#4A2F1A', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Treatment Disclosure</strong><br />
                  Continuous new experiments are done on precious, semi-precious gemstones and diamonds to enhance them, which is sometimes not possible to detect by experience or gem testing laboratories using current available facilities. Even though we always try to provide only natural gemstones, in future if lab technology improves, any gemstone or diamond can be found "treated". This possibility cannot be denied.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Return Policy — 80% Value Within 15 Days</strong><br />
                  If you are not satisfied with any gemstone sold by us, do not attempt to mount the gemstone in any metal. You can return it for 80% of the remaining value (after deducting GST) within <strong>15 days</strong> from the date of purchase, provided the gemstone remains intact along with packing material and sales documents, and these are presented in person at our office. The decision to accept the return rests entirely at the seller's discretion.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Refund Timeline — 20 Days</strong><br />
                  If a gemstone is returned under the above conditions, the buyer will allow a minimum of <strong>20 days</strong> for the refund of the applicable value from the date the gemstone is deposited with us.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Laboratory Certificates</strong><br />
                  Various institutes in India and abroad operate gem laboratories for verifying gems and detecting treatments. We select only the best laboratory available, but due to differences in capability, working efficiency, and technology, the opinion of another laboratory may differ for the same gemstone. Lab certificates are issued with the instruction <em>"not valid for legal purpose"</em> — a certificate can potentially be misused with a similar gemstone of the same weight.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Government Appraisal &amp; Fair Market Value</strong><br />
                  Each gemstone is examined by a government-recognised gemstone &amp; jewellery appraiser to determine its prevailing fair market value, ensuring the right gemstone is available to the customer at a reasonable price.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Effect of Chemicals &amp; Daily Use</strong><br />
                  Various chemical toiletries — oils, creams, powders, medicines, lotions, soaps, hair colours, etc. — used consistently in daily life can have an adverse effect on gems, causing colour and weight changes over time. Care should be taken accordingly.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Astrological Disclaimer</strong><br />
                  Since ancient times mankind has benefited from para-scientific disciplines such as astrology, palmistry, and vastu. The seller holds belief in these traditions, but does not in any way promote superstition. The seller holds no responsibility whatsoever for any profit or loss of any kind arising from wearing a gemstone.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Payment &amp; Delivery</strong><br />
                  Payment can be made via cash, debit/credit card, or e-payment. If payment is made by bank transfer or cheque, goods will be handed over to the buyer only after the payment amount is credited to the seller's account.</p>

                  <p><strong style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B6914' }}>Metal Setting &amp; Making Charges</strong><br />
                  If the buyer wishes to have the gemstone set in metal, the cost of the metal and making charges will be charged separately, based on the prevailing market price of the metal at that time. The price quoted for the gemstone does not include any type of jewellery, metal, or making costs.</p>

                  <p style={{ borderTop: '1px solid rgba(201,168,76,0.25)', paddingTop: '10px', fontStyle: 'italic', color: '#8A7060' }}>
                  I have read and understood all the above mentioned terms and conditions in full consciousness and completely agree with all the above statements.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.5rem', cursor: 'pointer' }}>
        <input type="checkbox" {...register('agreed', { required: true })} style={{ marginTop: '3px', accentColor: '#C9A84C' }} />
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.95rem', color: '#4A2F1A' }}>
          I have read and agree to the terms &amp; conditions
        </span>
      </label>

      {apiError && (
        <motion.p
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.92rem', color: '#8B2020', marginBottom: '1rem', padding: '8px 12px', background: 'rgba(180,60,60,0.06)', border: '1px solid rgba(180,60,60,0.2)', borderRadius: '3px' }}
        >{apiError}</motion.p>
      )}

      <Button variant="filled" size="lg" type="submit" disabled={loading} className="w-full justify-center">
        {loading ? 'Submitting…' : 'Request This Stone'}
      </Button>
    </form>
  );
}

const lbl = { display: 'block', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A7060', marginBottom: '8px' };
const inp = { width: '100%', padding: '10px 14px', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '2px', background: 'rgba(253,250,245,0.8)', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1rem', color: '#2C1A0E', outline: 'none' };
const sm = { fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.56rem', color: '#8A7060', letterSpacing: '0.1em' };

// ── Main GemDetail ────────────────────────────────────────────────────────────
export default function GemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const gem = getGemBySlug(slug);

  if (!gem) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#2C1A0E', marginBottom: '1rem' }}>
            Gemstone not found
          </h2>
          <Button variant="outline" onClick={() => navigate('/gems')}>Back to Collection</Button>
        </div>
      </div>
    );
  }

  const imgSrc = getGemImage(gem.id);

  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '68px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)' }}>

        {/* ── LEFT — Sticky gem image ───────────────────────────────────── */}
        <div style={{
          position: 'sticky',
          top: '68px',
          height: 'calc(100vh - 68px)',
          background: gem.accentColorLight || '#F2EBE0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          overflow: 'hidden',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 70% 60% at center, ${gem.accentColor}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Floating gem image */}
          <motion.img
            src={imgSrc}
            alt={gem.name}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '70%',
              maxWidth: '360px',
              height: 'auto',
              objectFit: 'contain',
              filter: `drop-shadow(0 24px 48px ${gem.accentColor}55)`,
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Color variety tags */}
          {gem.color && gem.color.length > 1 && (
            <div style={{ marginTop: '2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A7060', marginBottom: '10px' }}>
                Color Varieties
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {gem.color.map((c, i) => (
                  <span key={i} style={{
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.56rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '4px 10px',
                    border: '1px solid rgba(201,168,76,0.4)', borderRadius: '2px',
                    background: 'rgba(253,250,245,0.8)', color: '#4A2F1A',
                  }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT — Scrollable info + form ───────────────────────────── */}
        <div style={{ padding: '3rem 3rem 5rem', overflowY: 'auto' }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '2rem' }}>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A7060' }}>
              <Link to="/" style={{ color: '#8A7060', textDecoration: 'none' }}>Home</Link>
              &nbsp;›&nbsp;
              <Link to="/gems" style={{ color: '#8A7060', textDecoration: 'none' }}>Gemstones</Link>
              &nbsp;›&nbsp;
              <span style={{ color: '#4A2F1A' }}>{gem.name}</span>
            </span>
          </nav>

          <Badge planet={gem.planet} symbol={gem.planetSymbol} />

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.95rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginTop: '1.2rem', marginBottom: '0.4rem' }}>
            {gem.nameHindi}
          </p>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: '#2C1A0E', lineHeight: 1.08, marginBottom: '2rem' }}>
            {gem.name}
          </h1>

          <Divider className="mb-6" />

          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.08rem', color: '#4A2F1A', lineHeight: 1.85, marginBottom: '2rem' }}>
            {gem.description}
          </p>

          {/* Benefits */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B6914', marginBottom: '1rem' }}>
              Astrological Benefits
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {gem.astrologicalBenefits?.map((b, i) => (
                <span key={i} style={{
                  fontFamily: "'EB Garamond', serif", fontSize: '0.92rem', color: '#4A2F1A',
                  padding: '4px 12px', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '2px',
                  background: 'rgba(224,201,127,0.08)',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
            marginBottom: '2.5rem', padding: '1.5rem',
            background: '#F2EBE0', borderRadius: '4px',
          }}>
            {[
              { label: 'Hardness', value: gem.hardness ? `${gem.hardness} Mohs` : '—' },
              { label: 'Family', value: gem.family },
              { label: 'Metal', value: gem.bestMetal },
              { label: 'Finger', value: gem.wearingFinger },
              { label: 'Zodiac', value: gem.zodiac?.join(', ') },
              { label: 'Weight', value: `${gem.weightRange.min}–${gem.weightRange.max} cts` },
            ].map(spec => (
              <div key={spec.label}>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A7060', marginBottom: '4px' }}>
                  {spec.label}
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#2C1A0E' }}>
                  {spec.value || '—'}
                </p>
              </div>
            ))}
          </div>

          <Divider className="mb-6" />

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.8rem', color: '#2C1A0E', marginBottom: '0.5rem' }}>
            Request This Stone
          </h2>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.98rem', color: '#8A7060', marginBottom: '2rem' }}>
            Fill in your requirements. Our team will contact you with availability and pricing.
          </p>

          <OrderForm gem={gem} />

          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.88rem', color: '#8A7060', lineHeight: 1.75, marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
            ✦ 80% value refund within 15 days — gemstone must be unmounted &amp; in original packing. ✦ Refund processed within 20 days of deposit.
            ✦ All stones shipped with original lab certificate from a government-recognised laboratory. ✦ Metal setting &amp; making charges billed separately.
          </p>
        </div>
      </div>
    </div>
  );
}
