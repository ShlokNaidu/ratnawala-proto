import React from 'react';
import { motion } from 'framer-motion';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';

const TIMELINE = [
  { year: '2019', event: 'Founded in Indore', desc: 'Ratnawala was established to bring certified astrological gemstones to families across India.' },
  { year: '2020', event: 'Government Certification', desc: 'Received affiliation with India\'s premier gem grading laboratories for official stone appraisal.' },
  { year: '2021', event: 'Expanded to 36 Varieties', desc: 'Expanded our collection to include all planetary gemstones — from the rarest Alexandrite to Nav Ratna collections.' },
  { year: '2022', event: 'Online Presence', desc: 'Launched our digital storefront to serve customers across Maharashtra, Gujarat, and Delhi NCR.' },
  { year: '2024', event: '5000+ Happy Customers', desc: 'Crossed the milestone of 5,000 certified stones delivered across India with verified astrological guidance.' },
  { year: '2026', event: 'Premium Digital Experience', desc: 'Launched the world-class digital platform for seamless gem discovery and purchase.' },
];

export default function AboutUs() {
  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', background: '#F2EBE0', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}
          >
            Est. 2019 · Indore, India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#2C1A0E', marginBottom: '1.5rem' }}
          >
            Our Story
          </motion.h1>
          <Divider />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.15rem', color: '#4A2F1A', lineHeight: 1.85, marginTop: '2rem', maxWidth: '680px', margin: '2rem auto 0' }}
          >
            Ratnawala was born from a simple belief — that every person deserves access to genuinely certified,
            astrologically meaningful gemstones, guided by expertise rather than commerce.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '3rem', textAlign: 'center' }}>
          Our Journey
        </h2>
        <div style={{ position: 'relative' }}>
          {/* Vertical gold line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)', transform: 'translateX(-50%)' }} />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex',
                justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                paddingRight: i % 2 === 0 ? 'calc(50% + 2rem)' : '0',
                paddingLeft: i % 2 === 0 ? '0' : 'calc(50% + 2rem)',
                marginBottom: '3rem',
                position: 'relative',
              }}
            >
              {/* Dot on center line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '8px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#C9A84C',
                transform: 'translateX(-50%)',
              }} />
              <div style={{ maxWidth: '280px' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', color: '#C9A84C', marginBottom: '4px' }}>{item.year}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, color: '#2C1A0E', marginBottom: '6px' }}>{item.event}</h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.98rem', color: '#8A7060', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: '5rem 2rem', background: '#F2EBE0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#2C1A0E', marginBottom: '1.5rem' }}>
            Our Philosophy
          </h2>
          <Divider className="mb-6" />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', color: '#4A2F1A', lineHeight: 1.9 }}>
            In Vedic astrology, every planet has a corresponding gemstone that channels its energy.
            Wearing the right stone — properly activated and certified — can harmonize planetary influences
            and align the wearer with cosmic abundance. We believe gemstones are not mere ornaments but
            living tools of consciousness, as ancient as the stars themselves.
          </p>
        </div>
      </section>
    </div>
  );
}
