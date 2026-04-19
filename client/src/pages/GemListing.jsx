import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GEMSTONES, PLANETS } from '../data/gemstones';
import GemCard from '../components/gems/GemCard';
import Divider from '../components/ui/Divider';

// ── Filter configuration ─────────────────────────────────────────────────────
const PLANET_FILTERS = [
  'All', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
];

const TRANSPARENCY_FILTERS = ['All', 'transparent', 'translucent', 'opaque'];

function FilterPill({ label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.58rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        borderRadius: '2px',
        border: `1px solid ${active ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
        background: active ? '#C9A84C' : 'transparent',
        color: active ? '#2C1A0E' : '#8A7060',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </motion.button>
  );
}

export default function GemListing() {
  const [planet, setPlanet] = useState('All');
  const [transparency, setTransparency] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return GEMSTONES.filter((gem) => {
      const matchPlanet = planet === 'All' || gem.planet.includes(planet);
      const matchTransparency = transparency === 'All' || gem.transparency?.includes(transparency.toLowerCase());
      const matchSearch = !search ||
        gem.name.toLowerCase().includes(search.toLowerCase()) ||
        gem.nameHindi.includes(search) ||
        gem.planet.toLowerCase().includes(search.toLowerCase());
      return matchPlanet && matchTransparency && matchSearch;
    });
  }, [planet, transparency, search]);

  return (
    <div style={{ background: '#FDFAF5', minHeight: '100vh', paddingTop: '80px' }}>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div
        style={{
          background: '#F2EBE0',
          padding: '4rem 2rem 3rem',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8A7060',
              marginBottom: '1.5rem',
            }}
          >
            Home &rsaquo; Gemstones
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              color: '#2C1A0E',
              marginBottom: '0.5rem',
            }}
          >
            Our Gemstone Collection
          </motion.h1>
          <p
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '1.1rem',
              color: '#8A7060',
              marginBottom: '2rem',
            }}
          >
            36+ certified astrological and ornamental gemstones — sourced from world's finest mines
          </p>
          <Divider />
        </div>
      </div>

      {/* ── Sticky Filter Bar ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: '68px',
          zIndex: 50,
          background: 'rgba(250,246,240,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gemstones..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '2px',
                background: 'transparent',
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: '0.95rem',
                color: '#2C1A0E',
                outline: 'none',
              }}
            />
            <svg
              width="14" height="14"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7060' }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', background: 'rgba(201,168,76,0.3)' }} />

          {/* Planet filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PLANET_FILTERS.map((p) => (
              <FilterPill key={p} label={p} active={planet === p} onClick={() => setPlanet(p)} />
            ))}
          </div>

          {/* Count */}
          <div style={{ marginLeft: 'auto' }}>
            <span
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8A7060',
              }}
            >
              {filtered.length} Gemstone{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Gem Grid ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '6rem 0' }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#8A7060' }}>
                No gemstones match your filters.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {filtered.map((gem, i) => (
                <GemCard key={gem.id} gem={gem} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
