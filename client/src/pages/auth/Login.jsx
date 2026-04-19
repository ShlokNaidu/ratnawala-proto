import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GEMSTONES } from '../../data/gemstones';
import { getGemImage } from '../../data/getGemImage';
import { login } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import Divider from '../../components/ui/Divider';

const GEM_FOR_AUTH = GEMSTONES.find(g => g.slug === 'blue-sapphire');

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(data.email, data.password);
      setAuth(res.data.user, res.data.token);
      // Redirect admin to dashboard, customers to home
      if (['admin', 'sub_admin'].includes(res.data.user.role)) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left — decorative gem panel */}
      <div style={{
        background: GEM_FOR_AUTH?.accentColorLight || '#DBEAFE',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 70% 60% at center, ${GEM_FOR_AUTH?.accentColor}33 0%, transparent 70%)`,
        }} />
        <motion.img
          src={getGemImage(GEM_FOR_AUTH?.id)}
          alt={GEM_FOR_AUTH?.name}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '55%', height: 'auto', objectFit: 'contain',
            filter: `drop-shadow(0 24px 48px ${GEM_FOR_AUTH?.accentColor}55)`,
            position: 'relative', zIndex: 1,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2rem', color: '#1E0E06' }}>Ratnawala</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A8832A' }}>
            Certified Gemstones Since 2019
          </p>
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#EFE5CC' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '2.5rem', color: '#1E0E06', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#6B5548', marginBottom: '2rem' }}>Sign in to your Ratnawala account</p>
          <Divider className="mb-6" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '10px 14px', marginBottom: '1.5rem',
                background: 'rgba(180, 60, 60, 0.08)',
                border: '1px solid rgba(180, 60, 60, 0.3)',
                borderRadius: '3px',
                fontFamily: "'EB Garamond', serif", fontSize: '0.95rem', color: '#8B2020',
              }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lbl}>Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email" placeholder="your@email.com" style={inp}
              />
              {errors.email && <p style={err}>{errors.email.message}</p>}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={lbl}>Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password" placeholder="••••••••" style={inp}
              />
              {errors.password && <p style={err}>{errors.password.message}</p>}
            </div>
            <Button variant="filled" size="lg" type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.88rem', color: '#9A8070', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.7 }}>
            Admin access only · <a href="mailto:info@ratnawala.com" style={{ color: '#A8832A', textDecoration: 'none' }}>Contact us</a> for assistance
          </p>
        </div>
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5548', marginBottom: '8px' };
const inp = { width: '100%', padding: '11px 14px', border: '1px solid rgba(168,131,42,0.35)', borderRadius: '2px', background: 'rgba(239,229,204,0.6)', fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#1E0E06', outline: 'none' };
const err = { fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#8B2020', marginTop: '4px' };
