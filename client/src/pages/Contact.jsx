import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';
import api from '../api/axios';

const inp = {
  width: '100%', padding: '11px 14px',
  border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px',
  background: 'transparent', fontFamily: "'EB Garamond', serif",
  fontSize: '1rem', color: '#2C1A0E', outline: 'none',
  boxSizing: 'border-box',
};
const lbl = {
  display: 'block', fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
  color: '#8A7060', marginBottom: '8px',
};

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError]  = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      // Store the message as a general enquiry (source: 'walk_in' re-used for website contact)
      await api.post('/enquiries', {
        name:    data.name,
        phone:   data.phone,
        email:   data.email || undefined,
        gemSlug: 'general-contact',
        gemName: 'General Enquiry',
        message: data.message,
        purpose: 'other',
        source:  'website',
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '80px' }}>
      <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
            Get in Touch
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#2C1A0E' }}>
            Contact Us
          </h1>
          <Divider className="mt-4" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* ── Left — store info ── */}
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#2C1A0E', marginBottom: '1.5rem' }}>
              Visit Our Store
            </h2>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.05rem', color: '#4A2F1A', lineHeight: 1.9 }}>
              Ratnawala Gems<br />
              Indore, Madhya Pradesh<br />
              India — 452001<br /><br />
              <a href="tel:+91-XXXXXXXXXX" style={{ color: '#C9A84C' }}>+91 XXXXX XXXXX</a><br />
              <a href="mailto:info@ratnawala.com" style={{ color: '#C9A84C' }}>info@ratnawala.com</a>
            </p>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A7060', marginBottom: '0.75rem' }}>
                Store Hours
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#4A2F1A' }}>
                Mon – Sat: 10:00 AM – 8:00 PM<br />Sunday: By Appointment Only
              </p>
            </div>
          </div>

          {/* ── Right — form ── */}
          <div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center', padding: '3rem 2rem',
                    border: '1px solid rgba(201,168,76,0.35)', borderRadius: '4px',
                    background: 'rgba(201,168,76,0.04)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                    style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'rgba(201,168,76,0.12)', border: '2px solid #C9A84C',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#2C1A0E', marginBottom: '0.5rem' }}>
                    Message Sent
                  </h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#8A7060', lineHeight: 1.7 }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{
                      marginTop: '1.5rem', background: 'none', border: 'none',
                      fontFamily: "'Cinzel', serif", fontSize: '0.6rem',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: '#A8832A', cursor: 'pointer', textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* Name */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={lbl}>Name *</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      {...register('name', { required: 'Name is required' })}
                      style={{ ...inp, borderColor: errors.name ? '#B44040' : 'rgba(201,168,76,0.3)' }}
                    />
                    {errors.name && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#B44040', marginTop: '4px' }}>{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={lbl}>Phone *</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: { value: /^[+\d\s\-()]{7,15}$/, message: 'Enter a valid phone number' },
                      })}
                      style={{ ...inp, borderColor: errors.phone ? '#B44040' : 'rgba(201,168,76,0.3)' }}
                    />
                    {errors.phone && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#B44040', marginTop: '4px' }}>{errors.phone.message}</p>}
                  </div>

                  {/* Email (optional) */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={lbl}>Email <span style={{ opacity: 0.6 }}>(optional)</span></label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...register('email', {
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                      })}
                      style={{ ...inp, borderColor: errors.email ? '#B44040' : 'rgba(201,168,76,0.3)' }}
                    />
                    {errors.email && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#B44040', marginTop: '4px' }}>{errors.email.message}</p>}
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={lbl}>Message *</label>
                    <textarea
                      rows={4}
                      placeholder="Your message…"
                      {...register('message', { required: 'Please write a message' })}
                      style={{ ...inp, resize: 'vertical', borderColor: errors.message ? '#B44040' : 'rgba(201,168,76,0.3)' }}
                    />
                    {errors.message && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#B44040', marginTop: '4px' }}>{errors.message.message}</p>}
                  </div>

                  {apiError && (
                    <p style={{
                      fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: '#B44040',
                      marginBottom: '1rem', padding: '9px 12px',
                      background: 'rgba(180,64,64,0.07)', border: '1px solid rgba(180,64,64,0.2)', borderRadius: '3px',
                    }}>{apiError}</p>
                  )}

                  <Button variant="filled" size="lg" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    {loading ? 'Sending…' : 'Send Message'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
