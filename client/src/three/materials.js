import * as THREE from 'three';

/**
 * Creates a caustic texture — soft radial gradient in gem's color.
 * Used as an additive blending plane beneath each gem.
 */
export function createCausticTexture(hexColor, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, hexColor + 'CC');
  gradient.addColorStop(0.35, hexColor + '66');
  gradient.addColorStop(1, hexColor + '00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Master gem material factory.
 * Takes gem.three config object and returns a MeshPhysicalMaterial.
 */
export function buildGemMaterial(threeConfig) {
  const cfg = threeConfig || {};

  // For transparent/transmission gems, ensure a minimum visible emissive
  // so they're never completely invisible without a loaded HDRI
  const isTransmissive = (cfg.transmission ?? 0.9) > 0.3;
  const baseEmissive = cfg.emissive || (isTransmissive ? cfg.color : '#000000');
  const baseEmissiveIntensity = cfg.emissiveIntensity ??
    (isTransmissive ? 0.08 : 0);

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.color || '#AAAAAA'),
    emissive: new THREE.Color(baseEmissive || '#000000'),
    emissiveIntensity: baseEmissiveIntensity,
    transmission: cfg.transmission ?? 0.9,
    transparent: true,
    roughness: cfg.roughness ?? 0.05,
    metalness: cfg.metalness ?? 0,
    ior: cfg.ior ?? 1.5,
    thickness: cfg.thickness ?? 1.5,
    attenuationColor: new THREE.Color(cfg.attenuationColor || cfg.color || '#AAAAAA'),
    attenuationDistance: cfg.attenuationDistance ?? 1.5,
    clearcoat: cfg.clearcoat ?? 1.0,
    clearcoatRoughness: cfg.clearcoatRoughness ?? 0.05,
    envMapIntensity: cfg.envMapIntensity ?? 2.5,   // bumped default for reflections
    reflectivity: cfg.reflectivity ?? 0.5,
    sheen: cfg.sheen ?? 0,
    sheenColor: new THREE.Color(cfg.sheenColor || '#FFFFFF'),
    sheenRoughness: cfg.sheenRoughness ?? 0.5,
    side: THREE.DoubleSide,
  });
}

/**
 * Per-gem material overrides that can't be expressed in the data file alone.
 * Keyed by gem slug. These override or supplement the generic buildGemMaterial output.
 */
export const GEM_MATERIAL_OVERRIDES = {
  'ruby': (mat) => {
    // Ruby: chromium fluorescence — higher emissive
    mat.emissive = new THREE.Color('#8B0000');
    mat.emissiveIntensity = 0.18;
    return mat;
  },
  'pearl': (mat) => {
    // Pearl: nacre iridescence via sheen
    mat.sheen = 1.0;
    mat.sheenColor = new THREE.Color('#FFB6C1');
    mat.sheenRoughness = 0.15;
    mat.transmission = 0;
    mat.roughness = 0.03;
    mat.metalness = 0.08;
    return mat;
  },
  'coral': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.35;
    mat.sheen = 0.3;
    mat.sheenColor = new THREE.Color('#FF6B8A');
    mat.sheenRoughness = 0.5;
    return mat;
  },
  'triangular-coral': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.35;
    mat.sheen = 0.3;
    mat.sheenColor = new THREE.Color('#FF6B8A');
    mat.sheenRoughness = 0.5;
    return mat;
  },
  'turquoise': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.45;
    mat.clearcoat = 0.35;
    mat.clearcoatRoughness = 0.4;
    mat.sheen = 0.2;
    mat.sheenColor = new THREE.Color('#48BFAD');
    mat.sheenRoughness = 0.6;
    return mat;
  },
  'onyx': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.05;
    mat.metalness = 0.08;
    mat.clearcoat = 1.0;
    mat.clearcoatRoughness = 0.02;
    return mat;
  },
  'moon-stone': (mat) => {
    mat.sheen = 1.0;
    mat.sheenColor = new THREE.Color('#6EB5FF');
    mat.sheenRoughness = 0.3;
    mat.transmission = 0.4;
    return mat;
  },
  'opal': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.08;
    mat.clearcoat = 0.95;
    mat.clearcoatRoughness = 0.03;
    return mat;
  },
  'lapis-lazuli': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.4;
    mat.clearcoat = 0.3;
    mat.clearcoatRoughness = 0.35;
    return mat;
  },
  'malachite': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.3;
    mat.clearcoat = 0.5;
    mat.clearcoatRoughness = 0.2;
    return mat;
  },
  'mariyam': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.55;
    mat.clearcoat = 0.15;
    mat.clearcoatRoughness = 0.5;
    return mat;
  },
  'aventurine': (mat) => {
    mat.transmission = 0.25;
    mat.roughness = 0.2;
    mat.clearcoat = 0.5;
    mat.clearcoatRoughness = 0.15;
    return mat;
  },
  'agate': (mat) => {
    mat.transmission = 0.15;
    mat.roughness = 0.25;
    mat.clearcoat = 0.5;
    mat.clearcoatRoughness = 0.2;
    return mat;
  },
  'sun-stone': (mat) => {
    mat.transmission = 0.3;
    mat.roughness = 0.15;
    mat.clearcoat = 0.6;
    mat.clearcoatRoughness = 0.1;
    return mat;
  },
  'tiger-eye': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.18;
    mat.clearcoat = 0.7;
    mat.clearcoatRoughness = 0.08;
    return mat;
  },
  'cats-eye': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.08;
    mat.clearcoat = 0.95;
    mat.clearcoatRoughness = 0.02;
    return mat;
  },
  'labradorite': (mat) => {
    mat.transmission = 0;
    mat.roughness = 0.2;
    mat.metalness = 0.05;
    mat.clearcoat = 0.7;
    mat.clearcoatRoughness = 0.1;
    return mat;
  },
};

/**
 * Get the fully configured material for a gem.
 * @param {Object} gem - the gem data object (from gemstones.js)
 * @returns {THREE.MeshPhysicalMaterial}
 */
export function getGemMaterial(gem) {
  const mat = buildGemMaterial(gem.three);
  const override = GEM_MATERIAL_OVERRIDES[gem.slug];
  if (override) override(mat);
  return mat;
}
