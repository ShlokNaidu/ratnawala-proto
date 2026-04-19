import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GEMSTONES } from '../../data/gemstones';

const NAV_LINKS = [
  { label: 'Home',      path: '/' },
  { label: 'Gemstones', path: '/gems' },
  { label: 'Our Works', path: '/works' },
  { label: 'Enquiry',   path: '/enquiry' },
  { label: 'About',     path: '/about' },
  { label: 'Contact',   path: '/contact' },
];

// ── Search Overlay ────────────────────────────────────────────────────────────
function SearchOverlay({ onClose }) {
  const [query, setQuery]       = useState('');
  const [active, setActive]     = useState(0);
  const inputRef                = useRef(null);
  const navigate                = useNavigate();

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = query.length < 1 ? [] : GEMSTONES.filter(g => {
    const q = query.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.nameHindi.includes(q) ||
      g.planet?.toLowerCase().includes(q) ||
      g.family?.toLowerCase().includes(q) ||
      g.zodiac?.some(z => z.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const go = (slug) => {
    navigate(`/gems/${slug}`);
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActive(v => Math.min(v + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setActive(v => Math.max(v - 1, 0)); }
    if (e.key === 'Enter' && results[active]) go(results[active].slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(30,14,6,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '120px',
        padding: '120px 2rem 2rem',
      }}
    >
      <motion.div
        initial={{ y: -24, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '620px' }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          background: '#EFE5CC',
          border: '1px solid rgba(168,131,42,0.5)',
          borderRadius: '4px',
          padding: '12px 18px',
          boxShadow: '0 8px 40px rgba(30,14,6,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8832A" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKey}
            placeholder="Search gemstones, planets, zodiac…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: "'EB Garamond', serif",
              fontSize: '1.15rem',
              color: '#1E0E06',
              letterSpacing: '0.02em',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B5548', fontSize: '1rem', lineHeight: 1 }}
            >✕</button>
          )}
        </div>

        {/* Results dropdown */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: '6px',
                background: '#EFE5CC',
                border: '1px solid rgba(168,131,42,0.35)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(30,14,6,0.25)',
              }}
            >
              {results.map((gem, i) => (
                <motion.button
                  key={gem.slug}
                  onClick={() => go(gem.slug)}
                  onMouseEnter={() => setActive(i)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '11px 18px',
                    background: active === i ? 'rgba(168,131,42,0.12)' : 'transparent',
                    border: 'none',
                    borderBottom: i < results.length - 1 ? '1px solid rgba(168,131,42,0.12)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Accent dot in gem color */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: gem.accentColor || '#A8832A',
                    boxShadow: `0 0 6px ${gem.accentColor || '#A8832A'}88`,
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1E0E06', margin: 0 }}>
                      {gem.name}
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, textTransform: 'none', letterSpacing: 0, color: '#A8832A', marginLeft: '8px' }}>
                        {gem.nameHindi}
                      </span>
                    </p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.85rem', color: '#6B5548', margin: 0, marginTop: '1px' }}>
                      {gem.planet} · {gem.zodiac?.join(', ')} · {gem.family}
                    </p>
                  </div>

                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: active === i ? '#A8832A' : '#9A8070' }}>
                    View →
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* No results */}
          {query.length > 1 && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                marginTop: '6px', padding: '1.25rem 1.5rem',
                background: '#EFE5CC', border: '1px solid rgba(168,131,42,0.25)', borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#6B5548', margin: 0 }}>
                No gemstone found for "<em>{query}</em>"
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: '#9A8070', margin: '4px 0 0' }}>
                Try searching by planet, zodiac sign, or stone name
              </p>
            </motion.div>
          )}

          {/* Hint when empty */}
          {query.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: '6px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'rgba(239,229,204,0.5)', borderRadius: '4px' }}
            >
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B5548', whiteSpace: 'nowrap' }}>
                Try:
              </span>
              {['Ruby', 'Jupiter', 'Leo', 'Yellow Sapphire', 'Emerald'].map(hint => (
                <button key={hint} onClick={() => setQuery(hint)} style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.62rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '7px 14px', borderRadius: '2px',
                  background: '#2C1A0E', color: '#EFE5CC',
                  border: '1px solid rgba(168,131,42,0.6)', cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#A8832A'; e.currentTarget.style.color = '#1E0E06'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2C1A0E'; e.currentTarget.style.color = '#EFE5CC'; }}
                >{hint}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const location                      = useLocation();
  const navigate                      = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  // Prevent body scroll when search open
  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  const navBg     = scrolled ? 'rgba(250,246,240,0.97)' : 'transparent';
  const navBorder = scrolled ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent';
  const navShadow = scrolled ? '0 2px 24px rgba(180,130,60,0.10)' : 'none';

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg, borderBottom: navBorder, boxShadow: navShadow,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        <div style={{
          maxWidth: '1400px', margin: '0 auto', padding: '0 2rem',
          height: scrolled ? '68px' : '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'height 0.4s ease',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/logo.webp"
              alt="Ratnawala"
              style={{
                height: scrolled ? '44px' : '52px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.4s ease',
                filter: 'drop-shadow(0 1px 4px rgba(168,131,42,0.18))',
              }}
            />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: scrolled ? '1.15rem' : '1.3rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#38200E',
              transition: 'font-size 0.4s ease',
            }}>Ratnawala</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Cinzel', serif" }}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path ||
                (link.path === '/gems' && location.pathname.startsWith('/gems'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none', fontSize: '0.74rem', letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: isActive ? '#8F6C00' : '#38200E',
                    position: 'relative', paddingBottom: '2px',
                    transition: 'color 0.25s ease', fontFamily: "'Cinzel', serif",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="nav-underline" style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '1px', background: '#C9A84C',
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A2F1A', padding: '4px' }}
              aria-label="Search gemstones"
              title="Search gemstones"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </motion.button>



            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              aria-label="Toggle menu"
            >
              <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }} className="block w-6 h-px" style={{ background: '#4A2F1A' }} />
              <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-6 h-px" style={{ background: '#4A2F1A' }} />
              <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }} className="block w-6 h-px" style={{ background: '#4A2F1A' }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99, background: '#FAF6F0',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '2.5rem',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />

            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }} transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "'Cinzel', serif", fontSize: '1.1rem', letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: location.pathname === link.path ? '#B8960C' : '#2C1A0E',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}


          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
