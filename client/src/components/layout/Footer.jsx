import React from 'react';
import { Link } from 'react-router-dom';
import Divider from '../ui/Divider';

function GemLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke="#C9A84C" strokeWidth="1.2" fill="rgba(201,168,76,0.08)" />
      <circle cx="12" cy="12" r="2" fill="#C9A84C" />
    </svg>
  );
}

const NAV_COL = [
  { label: 'Gemstones', path: '/gems' },
  { label: 'Our Works', path: '/works' },
  { label: 'Enquiry', path: '/enquiry' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#FAF6F0',
        borderTop: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gold divider */}
      <div style={{ padding: '0 2rem' }}>
        <Divider />
      </div>

      {/* Watermark gem silhouettes */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpolygon points='40,8 70,24 70,56 40,72 10,56 10,24' stroke='%23C9A84C' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Main content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '4rem 2rem 3rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr',
          gap: '4rem',
          position: 'relative',
        }}
        className="grid-cols-1 md:grid-cols-3"
      >
        {/* Column 1 — Logo & tagline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <GemLogo />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '1.6rem',
                color: '#2C1A0E',
                letterSpacing: '0.04em',
              }}
            >
              Ratnawala
            </span>
          </div>
          <p
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '1rem',
              color: '#8A7060',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              maxWidth: '280px',
            }}
          >
            Purveyors of certified, astrologically blessed gemstones since 2019.
            Sourced from the world's finest mines, authenticated by government-approved laboratories.
          </p>
          {/* Social links */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Instagram', 'WhatsApp', 'Facebook'].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#8A7060',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#8A7060'}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div>
          <h4
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
            }}
          >
            Navigate
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {NAV_COL.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: '1rem',
                  color: '#4A2F1A',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A2F1A'}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h4
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.5rem',
            }}
          >
            Contact Us
          </h4>
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '1rem',
              color: '#4A2F1A',
              lineHeight: 1.8,
            }}
          >
            <p>Ratnawala Gems</p>
            <p>Indore, Madhya Pradesh</p>
            <p style={{ color: '#8A7060' }}>India — 452001</p>
            <p style={{ marginTop: '1rem' }}>
              <a href="mailto:info@ratnawala.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                info@ratnawala.com
              </a>
            </p>
            <p>
              <a href="tel:+919999999999" style={{ color: '#4A2F1A', textDecoration: 'none' }}>
                +91 99999 99999
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          borderTop: '1px solid rgba(201,168,76,0.2)',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <span
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#8A7060',
          }}
        >
          Ratna Parikshan © 2019–2026
        </span>
        <span
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#8A7060',
          }}
        >
          Government Certified · 36+ Varieties · Since 2019
        </span>
      </div>
    </footer>
  );
}
