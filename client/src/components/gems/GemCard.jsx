import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getGemImage } from '../../data/getGemImage';

/**
 * GemCard — displays a gemstone with a static image on the listing page.
 * On click → navigates to /gems/:slug (detail page with 3D viewer).
 *
 * Features:
 * - Static image with warm gold overlay on hover
 * - Card lifts 8px on hover (Framer Motion)
 * - Border brightens to gold
 * - Gem name in Cinzel (English) + Hindi in EB Garamond
 * - Planet badge
 * - Subtle gem-color tint on hover
 */
export default function GemCard({ gem, index = 0 }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = getGemImage(gem.id);

  const handleClick = () => {
    navigate(`/gems/${gem.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.28, ease: 'easeOut' } }}
      onClick={handleClick}
      className="gem-card group relative cursor-pointer"
      style={{
        background: '#FDFAF5',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '4px',
        boxShadow: '0 4px 24px rgba(180,130,60,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/3', background: gem.accentColorLight || '#FAF6F0' }}
      >
        {/* Static image */}
        <img
          src={imgSrc}
          alt={gem.name}
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease, transform 0.5s ease' }}
          loading="lazy"
        />

        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ background: `linear-gradient(135deg, ${gem.accentColorLight || '#F2EBE0'}, #FAF6F0)` }}
          />
        )}

        {/* Hover overlay — warm gold + gem's accent color */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: `linear-gradient(to top, ${gem.accentColor || '#C9A84C'}22 0%, transparent 60%)`,
          }}
        />

        {/* Planet badge — top right */}
        <div className="absolute top-2 right-2">
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.52rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              border: '1px solid rgba(201,168,76,0.55)',
              borderRadius: '2px',
              color: '#8B6914',
              background: 'rgba(253,250,245,0.92)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {gem.planetSymbol} {gem.planet}
          </span>
        </div>

        {/* Hover glow border sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            border: `1.5px solid ${gem.accentColor || '#C9A84C'}`,
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 20px 16px', background: '#FDFAF5' }}>
        {/* English name */}
        <h3
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.78rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2C1A0E',
            marginBottom: '4px',
            lineHeight: 1.4,
          }}
        >
          {gem.name}
        </h3>

        {/* Hindi name */}
        <p
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: '1.1rem',
            color: '#8A7060',
            lineHeight: 1.2,
            marginBottom: '14px',
          }}
        >
          {gem.nameHindi}
        </p>

        {/* Bottom row — family + view link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <span
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.57rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8A7060',
            }}
          >
            {gem.family}
          </span>

          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.57rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            View Stone
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M0 4h10M7 1l3 3-3 3" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </motion.span>
        </div>
      </div>

      {/* Bottom gold accent line — animates on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px]"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ background: `linear-gradient(to right, ${gem.accentColor || '#C9A84C'}, #E0C97F)` }}
      />
    </motion.div>
  );
}
