import React from 'react';

/**
 * Planet badge — displays planet symbol + name in Cinzel small caps
 * Usage: <Badge planet="Jupiter" symbol="♃" />
 */
export default function Badge({ planet, symbol, color }) {
  return (
    <span
      className="planet-badge inline-flex items-center gap-1.5"
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.6rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        border: '1px solid rgba(201,168,76,0.55)',
        borderRadius: '2px',
        color: '#8B6914',
        background: 'rgba(224,201,127,0.10)',
      }}
    >
      {symbol && <span style={{ fontSize: '0.8rem' }}>{symbol}</span>}
      {planet}
    </span>
  );
}
