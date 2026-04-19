import React from 'react';
import { motion } from 'framer-motion';

/**
 * Gold button component.
 * Padding is applied via inline styles (not Tailwind) to guarantee
 * it always renders correctly regardless of purge/JIT behaviour.
 */
export default function Button({
  children,
  variant = 'outline',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style: styleProp = {},   // ← pull style out separately so ...rest doesn't overwrite baseStyle
  ...rest
}) {
  // ── Padding per size — inline so Tailwind purge never strips them ──
  const sizePad = {
    sm: { padding: '10px 24px', fontSize: '0.58rem' },
    md: { padding: '14px 36px', fontSize: '0.65rem' },
    lg: { padding: '16px 48px', fontSize: '0.68rem' },
  };

  // ── Colour tokens ─────────────────────────────────────────────────
  const variantStyle = {
    outline: {
      background: 'transparent',
      color: '#6B4D0E',
      border: '1px solid #A8832A',
    },
    filled: {
      background: '#A8832A',
      color: '#1E0E06',
      border: '1px solid #A8832A',
    },
    ghost: {
      background: 'transparent',
      color: '#6B4D0E',
      border: 'none',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    },
    white: {
      background: 'transparent',
      color: '#EFE5CC',
      border: '1px solid #EFE5CC',
    },
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...sizePad[size],
    ...variantStyle[variant],
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {
        scale: 1.02,
        boxShadow: variant === 'filled'
          ? '0 0 28px rgba(168,131,42,0.45)'
          : '0 0 20px rgba(168,131,42,0.28)',
        background: variant === 'filled' ? '#8F6C00'
          : variant === 'outline' ? '#A8832A'
          : undefined,
        color: variant === 'outline' ? '#1E0E06' : undefined,
      }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      style={{ ...baseStyle, ...styleProp }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
