import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GEMSTONES } from '../data/gemstones';
import { getGemImage } from '../data/getGemImage';
import Divider from '../components/ui/Divider';

// ── Works data — curated from existing gem images ──────────────────────────
// Each "work" showcases a gemstone photo with a descriptive project title
const WORKS = [
  { slug: 'yellow-sapphire',    title: "Jupiter's Blessing",       cat: 'Certified Stone',    desc: 'Natural Ceylon Yellow Sapphire, 5.2 cts · Gold setting recommendation' },
  { slug: 'ruby',               title: 'Pigeon Blood Manik',       cat: 'Custom Order',       desc: 'Unheated Burmese Ruby, 3.8 cts · Delivered with GRS certificate' },
  { slug: 'emerald',            title: 'Colombian Panna',          cat: 'Certified Stone',    desc: 'F2 clarity Colombian Emerald, 4.5 cts · Certified by IGI' },
  { slug: 'blue-sapphire',      title: 'Neelam of Saturn',         cat: 'Astrological',       desc: 'Unheated Ceylon Blue Sapphire, 3.0 cts · Panch Dhatu setting' },
  { slug: 'diamond',            title: 'Diamond — Heera',          cat: 'Certified Stone',    desc: 'VS1 clarity, D colour, 1.2 cts · GIA certified' },
  { slug: 'coral',              title: 'Italian Coral Moonga',     cat: 'Custom Order',       desc: 'Mediterranean Ox-Blood Coral, 8 cts · Gold ring setting' },
  { slug: 'cats-eye',           title: "Cat's Eye Chrysoberyl",    cat: 'Astrological',       desc: 'Strong chatoyancy, 6.5 cts · Silver mounting for Ketu remedy' },
  { slug: 'hessonite',          title: 'Gomed for Rahu Dasha',     cat: 'Astrological',       desc: 'Ceylon Hessonite, 7 cts · Panchdhatu mounting, Rahu dasha remedy' },
  { slug: 'pearl',              title: 'South Sea Pearl Moti',     cat: 'Custom Order',       desc: 'Natural Basra Pearl, 7 cts · Certified by GGL, silver pendant' },
  { slug: 'moon-stone',         title: 'Rainbow Moonstone',        cat: 'Collection',         desc: 'Adularescence grade AAA, 12 cts · Statement piece' },
  { slug: 'amethyst',           title: 'Deep Purple Amethyst',     cat: 'Collection',         desc: 'Uruguay Amethyst, 18 cts · Crystal clear, collector grade' },
  { slug: 'tourmaline',         title: 'Paraiba Tourmaline',       cat: 'Certified Stone',    desc: 'Neon blue-green Paraiba, 2.1 cts · AGL certified Brazilian origin' },
  { slug: 'opal',               title: 'Ethiopian Fire Opal',      cat: 'Collection',         desc: 'Full play-of-color, 4 cts · Ethiopian origin, display piece' },
  { slug: 'turquoise',          title: 'Persian Turquoise',        cat: 'Custom Order',       desc: 'Natural Persian variety, no treatment, 15 cts · Silver bezel set' },
  { slug: 'citrine',            title: 'Golden Citrine',           cat: 'Collection',         desc: 'Brazilian citrine, 22 cts · Eye clean, sun-yellow tone' },
  { slug: 'triangular-coral',   title: 'Triangular Moonga',        cat: 'Astrological',       desc: 'Triangular shaped coral for Mangal dosh relief, 6 cts' },
];

const CATEGORIES = ['All', 'Certified Stone', 'Custom Order', 'Astrological', 'Collection'];

// ── Grid column spans — alternating rhythm ───────────────────────────────
const COL_SPANS = [
  'span 1', 'span 2', 'span 1',
  'span 1', 'span 1', 'span 2',
  'span 2', 'span 1', 'span 1',
  'span 1', 'span 2', 'span 1',
  'span 2', 'span 1', 'span 1',
  'span 1',
];

// Card height — wide cards are shorter (landscape), narrow cards taller
const CARD_HEIGHT = (colSpan) => colSpan === 'span 2' ? '280px' : '360px';

// ── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({ work, gem, onClose }) {
  if (!work || !gem) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(20,12,4,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FAF6F0',
          borderRadius: '4px',
          overflow: 'hidden',
          maxWidth: '760px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxHeight: '90vh',
        }}
      >
        {/* Image panel */}
        <div style={{
          background: gem.accentColorLight || '#F2EBE0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2.5rem',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 70% 60% at center, ${gem.accentColor}33 0%, transparent 70%)`,
          }} />
          <img
            src={getGemImage(gem.id)}
            alt={gem.name}
            style={{
              width: '100%', height: '260px', objectFit: 'contain',
              filter: `drop-shadow(0 12px 28px ${gem.accentColor}55)`,
              position: 'relative', zIndex: 1,
            }}
          />
        </div>

        {/* Info panel */}
        <div style={{ padding: '2.5rem', overflowY: 'auto' }}>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#C9A84C', display: 'block', marginBottom: '0.75rem',
          }}>{work.cat}</span>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.8rem', color: '#2C1A0E', marginBottom: '0.25rem', lineHeight: 1.2 }}>
            {work.title}
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: '#C9A84C', marginBottom: '1.25rem' }}>
            {gem.nameHindi}
          </p>

          <div style={{ width: '48px', height: '1px', background: '#C9A84C', marginBottom: '1.25rem' }} />

          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#4A2F1A', lineHeight: 1.7, marginBottom: '1rem' }}>
            {work.desc}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'Planet', value: `${gem.planetSymbol} ${gem.planet}` },
              { label: 'Family', value: gem.family },
              { label: 'Hardness', value: gem.hardness ? `${gem.hardness} Mohs` : '—' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A7060' }}>{s.label}</span>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#2C1A0E' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <a
            href={`/gems/${gem.slug}`}
            style={{
              display: 'inline-block',
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#2C1A0E', padding: '8px 20px',
              border: '1px solid #C9A84C',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Enquire About This Stone →
          </a>
        </div>
      </motion.div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem',
          background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.5)',
          borderRadius: '50%', width: '40px', height: '40px',
          color: '#C9A84C', fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}

// ── Work Card ─────────────────────────────────────────────────────────────
function WorkCard({ work, gem, index, colSpan, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      onClick={() => onClick(work, gem)}
      whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(180,130,60,0.18)' }}
      style={{
        gridColumn: colSpan,
        height: CARD_HEIGHT(colSpan),
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        background: gem.accentColorLight || '#F2EBE0',
        border: '1px solid rgba(201,168,76,0.2)',
        boxShadow: '0 4px 24px rgba(180,130,60,0.08)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Radial glow bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 60% at center, ${gem.accentColor}22 0%, transparent 70%)`,
      }} />

      {/* Gem image */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4%' }}>
        <img
          src={getGemImage(gem.id)}
          alt={gem.name}
          style={{
            width: '100%', height: '100%', objectFit: 'contain',
            filter: `drop-shadow(0 8px 20px ${gem.accentColor}55)`,
          }}
        />
      </div>

      {/* Overlay on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(44,26,14,0.85) 0%, rgba(44,26,14,0.2) 50%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.5rem',
        }}
      >
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.56rem',
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C',
          marginBottom: '4px',
        }}>{work.cat}</span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.2rem', color: '#FAF6F0', marginBottom: '4px' }}>
          {work.title}
        </h3>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.88rem', color: 'rgba(250,246,240,0.75)', lineHeight: 1.5 }}>
          {work.desc.split('·')[0]}
        </p>
      </motion.div>

      {/* Category badge */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px',
        background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(4px)',
        padding: '3px 10px', borderRadius: '2px',
        border: '1px solid rgba(201,168,76,0.4)',
      }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A7060' }}>
          {work.cat}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main OurWorks page ────────────────────────────────────────────────────
export default function OurWorks() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // { work, gem }

  const filtered = WORKS.filter(w =>
    activeCategory === 'All' || w.cat === activeCategory
  );

  const gemFor = (slug) => GEMSTONES.find(g => g.slug === slug);

  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '80px' }}>

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 2rem 3rem', background: '#F2EBE0', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A7060', marginBottom: '1.5rem' }}>
            Home › Our Works
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: '#2C1A0E', marginBottom: '0.5rem' }}
          >
            Our Works
          </motion.h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.08rem', color: '#8A7060', marginBottom: '2rem' }}>
            Certified stones delivered, custom settings created, and astrological remedies fulfilled.
          </p>
          <Divider />
        </div>
      </section>

      {/* ── Filter strip ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: '68px', zIndex: 50,
        background: 'rgba(250,246,240,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '1rem 2rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '6px 14px', borderRadius: '2px',
                border: `1px solid ${activeCategory === cat ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
                background: activeCategory === cat ? '#C9A84C' : 'transparent',
                color: activeCategory === cat ? '#2C1A0E' : '#8A7060',
                cursor: 'pointer',
              }}
            >{cat}</motion.button>
          ))}
          <span style={{ marginLeft: 'auto', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A7060' }}>
            {filtered.length} Works
          </span>
        </div>
      </div>

      {/* ── Masonry grid ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              // No gridAutoRows — each card controls its own height explicitly
            }}
          >
            {filtered.map((work, i) => {
              const gem = gemFor(work.slug);
              if (!gem) return null;
              return (
                <WorkCard
                  key={work.slug}
                  work={work}
                  gem={gem}
                  index={i}
                  colSpan={COL_SPANS[i % COL_SPANS.length]}
                  onClick={(w, g) => setLightbox({ work: w, gem: g })}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA strip ─────────────────────────────────────────────────── */}
      <section style={{
        padding: '4rem 2rem',
        background: '#2C1A0E',
        textAlign: 'center',
        borderTop: '1px solid rgba(201,168,76,0.3)',
      }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
          Your Stone, Next
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#FAF6F0', marginBottom: '1rem' }}>
          Commission a Custom Piece
        </h2>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.08rem', color: '#8A7060', marginBottom: '2rem' }}>
          We source, certify, and deliver verified gemstones across India with complete documentation.
        </p>
        <a
          href="/enquiry"
          style={{
            display: 'inline-block',
            fontFamily: "'Cinzel', serif", fontSize: '0.65rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#2C1A0E', padding: '12px 32px',
            background: '#C9A84C', border: 'none',
            textDecoration: 'none',
          }}
        >
          Start an Enquiry
        </a>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            work={lightbox.work}
            gem={lightbox.gem}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
