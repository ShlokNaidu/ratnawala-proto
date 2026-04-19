import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ornamental gold divider with SVG flourish ends.
 * Usage: <Divider /> or <Divider className="my-12" />
 */
export default function Divider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      {/* Left flourish */}
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 7 C20 7 14 1 7 1 C3 1 0 4 0 7" stroke="#C9A84C" strokeWidth="0.8" fill="none" />
        <circle cx="1" cy="7" r="1.5" fill="#C9A84C" />
      </svg>

      {/* Line */}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />

      {/* Center diamond */}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="5" y="0.5" width="6.5" height="6.5" transform="rotate(45 5 5)" fill="#C9A84C" />
      </svg>

      {/* Right line */}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />

      {/* Right flourish */}
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
        <path d="M28 7 C20 7 14 1 7 1 C3 1 0 4 0 7" stroke="#C9A84C" strokeWidth="0.8" fill="none" />
        <circle cx="1" cy="7" r="1.5" fill="#C9A84C" />
      </svg>
    </div>
  );
}
