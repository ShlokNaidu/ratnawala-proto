import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { GEMSTONES } from '../data/gemstones';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';

function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '4rem 2rem' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        style={{
          width: '72px', height: '72px',
          margin: '0 auto 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 72 72" fill="none">
          <polygon points="36,4 68,20 68,52 36,68 4,52 4,20" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.12)" />
          <circle cx="36" cy="36" r="8" fill="#C9A84C" />
          <path d="M30 36l4 4 8-8" stroke="#FAF6F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#2C1A0E', marginBottom: '0.75rem' }}
      >
        Enquiry Received
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', color: '#8A7060' }}
      >
        Our expert team will reach out within 24 hours with personalized gemstone guidance.
      </motion.p>
    </motion.div>
  );
}

export default function Enquiry() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log('Enquiry:', data);
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '80px' }}>
      <section style={{ padding: '5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
            Personalised Guidance
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2C1A0E', marginBottom: '0.5rem' }}>
            Gem Enquiry
          </h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.05rem', color: '#8A7060' }}>
            Tell us about yourself and we'll recommend the perfect stone for your birth chart.
          </p>
          <Divider className="mt-4" />
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '4px',
                background: 'rgba(201,168,76,0.04)',
              }}
            >
              <SuccessAnimation />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '4px',
                padding: '3rem',
                background: '#FAF6F0',
                position: 'relative',
              }}
            >
              {/* Animated border on load */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: '-1px',
                  borderRadius: '4px',
                  border: '1px solid rgba(201,168,76,0.6)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={label}>Full Name</label>
                <input {...register('name', { required: true })} placeholder="Your full name" style={input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={label}>Contact Number</label>
                  <input {...register('phone', { required: true })} placeholder="+91 XXXXX XXXXX" style={input} />
                </div>
                <div>
                  <label style={label}>Email</label>
                  <input {...register('email')} type="email" placeholder="email@example.com" style={input} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={label}>Gemstone of Interest</label>
                <select {...register('gem', { required: true })} style={input}>
                  <option value="">Select a gemstone...</option>
                  {GEMSTONES.map(g => (
                    <option key={g.id} value={g.slug}>{g.name} — {g.nameHindi}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={label}>Budget (₹)</label>
                  <input {...register('budget')} type="number" placeholder="Your budget" style={input} />
                </div>
                <div>
                  <label style={label}>Purpose</label>
                  <select {...register('purpose')} style={input}>
                    <option value="">Select purpose...</option>
                    <option value="astrological">Astrological Remedy</option>
                    <option value="ornamental">Ornamental / Jewelry</option>
                    <option value="collection">Collection</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={label}>Message / Birth Details</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Share your birth date, time, and location for accurate astrological guidance..."
                  style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
              <Button variant="filled" size="lg" type="submit" className="w-full justify-center">
                Submit Enquiry
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

const label = {
  display: 'block',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.6rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#8A7060',
  marginBottom: '8px',
};

const input = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(201,168,76,0.3)',
  borderRadius: '2px',
  background: 'rgba(253,250,245,0.8)',
  fontFamily: "'EB Garamond', serif",
  fontSize: '1rem',
  color: '#2C1A0E',
  outline: 'none',
};
