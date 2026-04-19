import React, { Suspense } from 'react';
import GemScene from '../../three/GemScene';

/**
 * GemViewer3D — wraps GemScene with a loading state.
 * Used on the Gem Detail page (left panel).
 * Display-only: the gem auto-rotates, no mouse interaction.
 *
 * @param {Object} gem           - full gem data object
 * @param {string|null} colorOverride - hex color override for material
 */
export default function GemViewer3D({ gem, colorOverride = null }) {
  return (
    <div className="relative w-full h-full" style={{ minHeight: '420px' }}>
      <Suspense fallback={<GemLoadingState gem={gem} />}>
        <GemScene
          gem={gem}
          colorOverride={colorOverride}
          height="100%"
        />
      </Suspense>
    </div>
  );
}

/** Loading placeholder while Three.js initializes */
function GemLoadingState({ gem }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ minHeight: '420px', background: gem?.accentColorLight || '#F2EBE0' }}
    >
      <div
        className="w-16 h-16 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,168,76,0.2)', borderTopColor: '#C9A84C' }}
      />
      <p
        className="mt-4"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#8A7060',
        }}
      >
        Rendering {gem?.name || 'Gemstone'}...
      </p>
    </div>
  );
}
