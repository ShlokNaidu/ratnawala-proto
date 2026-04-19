import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import GemCard from '../components/gems/GemCard';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';
import { GEMSTONES } from '../data/gemstones';
import { getGemImage } from '../data/getGemImage';

// ── Marquee strip ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = GEMSTONES.map(g => ({ en: g.name, hi: g.nameHindi }));

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{
      overflow: 'hidden',
      background: '#2C1A0E',
      padding: '14px 0',
      borderTop: '1px solid rgba(201,168,76,0.3)',
      borderBottom: '1px solid rgba(201,168,76,0.3)',
    }}>
      <div className="marquee-track">
        {doubled.map((gem, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              whiteSpace: 'nowrap',
              padding: '0 1.5rem',
            }}>{gem.en}</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1rem',
              color: '#8A7060',
              whiteSpace: 'nowrap',
              padding: '0 0.5rem',
            }}>{gem.hi}</span>
            <span style={{ color: '#C9A84C', padding: '0 1rem' }}>◆</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Why Ratnawala ────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="#C9A84C" strokeWidth="1"/><path d="M9 14l3 3 7-7" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Certified Stones',
    desc: 'Every gemstone comes with laboratory certification from government-approved bodies.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="8" width="16" height="14" rx="1" stroke="#C9A84C" strokeWidth="1"/><path d="M10 8V6a4 4 0 018 0v2" stroke="#C9A84C" strokeWidth="1"/><circle cx="14" cy="15" r="2" fill="#C9A84C"/></svg>,
    title: 'Government Appraised',
    desc: "Verified and valued by India's certified gem appraisers and grading institutes.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><polygon points="14,3 17,10 24,10 18.5,14.5 20.5,21.5 14,17 7.5,21.5 9.5,14.5 4,10 11,10" stroke="#C9A84C" strokeWidth="1" fill="rgba(201,168,76,0.08)"/></svg>,
    title: '36+ Varieties',
    desc: 'From the rarest Alexandrite to the sacred Nav Ratna — all planetary gemstones available.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4v20M4 14h20" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/><circle cx="14" cy="14" r="10" stroke="#C9A84C" strokeWidth="1"/></svg>,
    title: 'Since 2019',
    desc: 'Trusted by thousands of families across India for astrological and ornamental gemstones.',
  },
];

// ── Nav Ratnas ────────────────────────────────────────────────────────────────
const NAV_RATNAS = GEMSTONES.filter(g => g.isNavRatan).slice(0, 9);

// ── Stone of month ────────────────────────────────────────────────────────────
const STONE_OF_MONTH = GEMSTONES.find(g => g.slug === 'yellow-sapphire');

// ── Floating gold particles ───────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 8 + 10,
    delay: Math.random() * 6,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div key={p.id}
          style={{
            position: 'absolute', bottom: '-10px', left: p.x,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', background: '#C9A84C', opacity: 0,
          }}
          animate={{ y: [0, -600], opacity: [0, 0.5, 0.3, 0], scale: [1, 0.5, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ── Hero gem image ────────────────────────────────────────────────────────────
function HeroGemImage({ gem }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '520px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: gem?.accentColorLight || '#FDF3C0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow behind gem */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 70% 60% at center, ${gem?.accentColor || '#C9A84C'}33 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Gem image */}
      <motion.img
        src={getGemImage(gem?.id)}
        alt={gem?.name}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '65%',
          height: '65%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 20px 40px rgba(180,130,60,0.35))',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Label */}
      <div style={{ position: 'absolute', bottom: '1.5rem', textAlign: 'center', zIndex: 1 }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C' }}>
          {gem?.planetSymbol} {gem?.name}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: gem?.accentColor || '#8A7060' }}>
          {gem?.nameHindi}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const featuredHero = GEMSTONES.find(g => g.slug === 'yellow-sapphire');

  return (
    <div style={{ background: '#FDFAF5' }}>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="noise-texture" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#FAF6F0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Particles />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full">
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            paddingTop: '80px',
          }}>
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.5rem' }}>
                Est. 2019 · Indore
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', lineHeight: 1.08, color: '#2C1A0E', marginBottom: '1.5rem' }}>
                Stones of<br />
                <em style={{ color: '#B8960C', fontStyle: 'italic' }}>Eternal Beauty</em>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.15rem', color: '#8A7060', lineHeight: 1.75, maxWidth: '420px', marginBottom: '2.5rem' }}>
                Certified astrological gemstones, appraised by government laboratories —
                crafted by the cosmos, curated for you.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="md" onClick={() => window.location.href = '/gems'}>
                  Explore Collection
                </Button>
                <Button variant="ghost" size="md" onClick={() => window.location.href = '/enquiry'}>
                  Free Consultation
                </Button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4rem' }}>
                <div style={{ width: '1px', height: '48px', background: 'rgba(201,168,76,0.4)', position: 'relative' }}>
                  <motion.div
                    animate={{ y: [0, 36, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: 0, left: '-2.5px', width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C' }}
                  />
                </div>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7060' }}>
                  Scroll to discover
                </span>
              </motion.div>
            </motion.div>

            {/* Right — Static gem image with float animation */}
            <HeroGemImage gem={featuredHero} />
          </div>
        </motion.div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── Nav Ratnas ──────────────────────────────────────────────────── */}
      <section style={{ padding: '7rem 2rem', background: '#FDFAF5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
              The Sacred Nine
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#2C1A0E', marginBottom: '1rem' }}>
              Nav Ratnas
            </motion.h2>
            <Divider className="mt-4" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {NAV_RATNAS.map((gem, i) => (
              <GemCard key={gem.id} gem={gem} index={i} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button variant="outline" onClick={() => window.location.href = '/gems'}>
              View All 36 Gemstones
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Ratnawala ───────────────────────────────────────────────── */}
      <section style={{
        padding: '5rem 2rem',
        background: '#F2EBE0',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
          {WHY_ITEMS.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2C1A0E', marginBottom: '0.6rem' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.98rem', color: '#8A7060', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stone of the Month ──────────────────────────────────────────── */}
      <section style={{ padding: '7rem 2rem', background: '#FAF6F0' }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
              Stone of the Month
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#2C1A0E', marginBottom: '0.5rem' }}>
              {STONE_OF_MONTH?.name}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.4rem', color: '#C9A84C', marginBottom: '1.5rem' }}>
              {STONE_OF_MONTH?.nameHindi}
            </p>
            <Divider className="mb-4" />
            <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.08rem', color: '#4A2F1A', lineHeight: 1.8, marginBottom: '2rem' }}>
              {STONE_OF_MONTH?.description}
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              {STONE_OF_MONTH?.astrologicalBenefits?.slice(0, 3).map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#C9A84C', fontSize: '0.7rem' }}>◆</span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#4A2F1A' }}>{b}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => window.location.href = `/gems/${STONE_OF_MONTH?.slug}`}>
              Enquire About This Stone
            </Button>
          </motion.div>

          {/* Right — static image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{
              height: '440px',
              background: STONE_OF_MONTH?.accentColorLight || '#FDF3C0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 70% 60% at center, ${STONE_OF_MONTH?.accentColor || '#C9A84C'}22 0%, transparent 70%)`,
            }} />
            <motion.img
              src={getGemImage(STONE_OF_MONTH?.id)}
              alt={STONE_OF_MONTH?.name}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '60%', height: '60%', objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(180,130,60,0.3))', position: 'relative', zIndex: 1 }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Enquiry CTA ─────────────────────────────────────────────────── */}
      <section style={{
        padding: '4.5rem 2rem',
        background: 'linear-gradient(135deg, #C9A84C 0%, #B8960C 50%, #8B6914 100%)',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(44,26,14,0.7)', marginBottom: '1rem' }}>
            Personalised Guidance
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#2C1A0E', marginBottom: '1rem' }}>
            Not sure which stone is right for you?
          </h2>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.1rem', color: 'rgba(44,26,14,0.8)', marginBottom: '2rem' }}>
            Our expert astrologers will guide you to the perfect gemstone for your birth chart.
          </p>
          <Button variant="white" onClick={() => window.location.href = '/enquiry'}>
            Get a Free Consultation
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
