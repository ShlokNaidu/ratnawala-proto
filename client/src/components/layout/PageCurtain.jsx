import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useAnimationControls } from 'framer-motion';

/**
 * PageCurtain — horizontal wipe transition between routes.
 * A deep espresso panel slides in from the left, covers the screen,
 * then reveals the new page by sweeping off to the right.
 */
export default function PageCurtain() {
  const location = useLocation();
  const controls = useAnimationControls();
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip animation on the very first page load
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const run = async () => {
      // Reset to left (off-screen)
      await controls.set({ x: '-100%', display: 'block' });
      // Slide in — cover screen
      await controls.start({
        x: '0%',
        transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] },
      });
      // Brief hold so the new page renders underneath
      await new Promise(r => setTimeout(r, 60));
      // Slide out to right — reveal new page
      await controls.start({
        x: '100%',
        transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1] },
      });
      await controls.set({ display: 'none' });
    };

    run();
  }, [location.key]); // triggers on every navigation

  return (
    <motion.div
      animate={controls}
      initial={{ x: '-100%', display: 'none' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#1A0F06',
        pointerEvents: 'none',
        willChange: 'transform',
        // Thin gold leading edge
        boxShadow: 'inset -4px 0 0 #C9A84C',
      }}
    />
  );
}
