import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor — gold dot + trailing ring.
 *
 * Fix: both elements use ONLY `transform: translate()` from
 * `left:0, top:0` — never mix left/top with translate on fixed elements.
 * Uses `e.clientX / e.clientY` (viewport-relative) so the position is
 * always correct regardless of scroll or fixed navbar overlaps.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Mobile / touch — don't bother
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Show elements once we know mouse is real
    dot.style.opacity  = '1';
    ring.style.opacity = '1';

    // Actual mouse position (updated immediately)
    let mx = -100, my = -100;
    // Ring lags behind (lerped in rAF)
    let rx = -100, ry = -100;
    let rafId;
    let isHovering = false;

    // Dot size / ring size constants
    const DOT_R  = 4;   // half of dot width
    const RING_R = 18;  // half of ring width

    const setDot  = (x, y) => {
      dot.style.transform  = `translate(${x - DOT_R}px, ${y - DOT_R}px)`;
    };
    const setRing = (x, y, scale = 1) => {
      ring.style.transform = `translate(${x - RING_R}px, ${y - RING_R}px) scale(${scale})`;
    };

    // --- mousemove: update dot instantly ---
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      setDot(mx, my);
    };

    // --- leave window: hide ---
    const onLeave = () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    };

    // --- interactive hover: expand ring ---
    const onHoverIn  = () => { isHovering = true; };
    const onHoverOut = () => { isHovering = false; };

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label')
        .forEach(el => {
          el.addEventListener('mouseenter', onHoverIn);
          el.addEventListener('mouseleave', onHoverOut);
        });
    };
    addHoverListeners();

    // --- rAF loop: lerp ring position ---
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      setRing(rx, ry, isHovering ? 1.85 : 1);

      // Tint on hover
      ring.style.borderColor = isHovering
        ? 'rgba(201,168,76,1)'
        : 'rgba(201,168,76,0.65)';

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Both elements: position:fixed, left:0, top:0, moved ONLY via transform
  const base = {
    position: 'fixed',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    zIndex: 99999,
    opacity: 0,           // hidden until first mousemove
    willChange: 'transform',
  };

  return (
    <>
      {/* Inner dot — snaps to cursor instantly */}
      <div
        ref={dotRef}
        style={{
          ...base,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#C9A84C',
          transform: 'translate(-100px, -100px)',
        }}
      />

      {/* Outer ring — lags slightly behind */}
      <div
        ref={ringRef}
        style={{
          ...base,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(201,168,76,0.65)',
          background: 'transparent',
          transform: 'translate(-100px, -100px)',
          transition: 'transform 0.08s linear, border-color 0.2s ease',
        }}
      />
    </>
  );
}
