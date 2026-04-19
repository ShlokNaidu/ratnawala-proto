import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { getGemGeometry } from './geometries';
import { getGemMaterial, createCausticTexture } from './materials';

/** Caustic shadow plane beneath the gem */
function CausticPlane({ causticColor }) {
  const texture = useMemo(() => {
    if (!causticColor) return null;
    return createCausticTexture(causticColor);
  }, [causticColor]);

  if (!causticColor || !texture) return null;

  return (
    <mesh position={[0, -1.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.5, 3.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Animated gem mesh — always auto-rotates, never interactive */
function GemMesh({ gem, colorOverride = null }) {
  const meshRef = useRef();

  const geometry = useMemo(() => getGemGeometry(gem.three?.geometry || 'OvalCut'), [gem]);

  const material = useMemo(() => {
    const mat = getGemMaterial(gem);
    if (colorOverride) {
      mat.color = new THREE.Color(colorOverride);
      mat.attenuationColor = new THREE.Color(colorOverride);
    }
    return mat;
  }, [gem, colorOverride]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.006;
    // Gentle bob
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[0.2, 0, 0.04]}
      castShadow
      receiveShadow
    />
  );
}

/** Ground plane that receives shadows */
function GroundPlane({ bgColor }) {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={bgColor || '#F2EBE0'} roughness={0.9} />
    </mesh>
  );
}

/**
 * GemScene — display-only Three.js canvas scene.
 * The gem auto-rotates. There are NO interactive controls.
 *
 * @param {Object}  gem           - full gem data object
 * @param {string}  colorOverride - hex color to override gem material color
 * @param {string}  height        - CSS height (default '100%')
 * @param {string}  bgColor       - background color for the canvas
 */
export default function GemScene({
  gem,
  colorOverride = null,
  height = '100%',
  bgColor = '#F0E8D8',
}) {
  if (!gem) return null;

  const gemColor = colorOverride || gem.three?.color || '#C9A84C';
  const causticColor = gem.three?.causticColor || null;

  // Derive a warm background from the gem's accent color for the canvas
  const sceneBg = gem.accentColorLight
    ? gem.accentColorLight
    : bgColor;

  return (
    // pointerEvents: 'none' — canvas never intercepts mouse events
    <div style={{ width: '100%', height, background: sceneBg, pointerEvents: 'none' }}>
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: false,                         // ← solid background, no transparency
        }}
        shadows
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        camera={{ position: [0, 0.5, 4.2], fov: 36 }}
      >
        {/* ── Scene Background Color ── */}
        <color attach="background" args={[sceneBg]} />

        {/* ── Lighting ── */}
        {/* Ambient — warm, low */}
        <ambientLight intensity={0.35} color="#FFF8F0" />

        {/* Key light — top-right, warm white */}
        <directionalLight
          position={[3, 8, 4]}
          intensity={2.2}
          color="#FFFAF0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Fill light — left, cooler */}
        <pointLight position={[-4, 3, -2]} intensity={0.8} color="#E8F0FF" />

        {/* Rim light — back, warm gold */}
        <pointLight position={[0, -1, -4]} intensity={0.6} color="#FFD580" />

        {/* Gem-colored underlight — makes transmission gems glow */}
        <pointLight position={[0, -2, 2]} intensity={1.2} color={gemColor} />

        {/* Caustic spotlight — colored, top-down */}
        <spotLight
          position={[0, 7, 1]}
          angle={0.4}
          penumbra={0.9}
          intensity={2.5}
          color={causticColor || gemColor}
          castShadow
          shadow-mapSize={[512, 512]}
        />

        {/* ── Environment for reflections ── */}
        {/* "sunset" or "warehouse" gives warm reflections without needing HDRI file */}
        <Environment
          preset="warehouse"
          background={false}
          environmentIntensity={1.6}
        />

        {/* ── Scene geometry ── */}
        <GroundPlane bgColor={sceneBg} />
        <CausticPlane causticColor={causticColor} />

        {/* ── The Gem (display only) ── */}
        <GemMesh
          gem={gem}
          colorOverride={colorOverride}
        />

        {/* ── Soft contact shadow ── */}
        <ContactShadows
          position={[0, -1.38, 0]}
          opacity={0.4}
          scale={8}
          blur={3}
          far={2.5}
          color={causticColor || '#8B6914'}
        />

        {/* ── Post-processing ── */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.78}
            luminanceSmoothing={0.85}
            intensity={0.5}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
