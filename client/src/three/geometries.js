import * as THREE from 'three';

/**
 * GEM CUT GEOMETRIES
 * Each function returns a THREE.BufferGeometry for the given cut type.
 * All geometries are centered at origin, normalized to roughly unit size.
 */

export function buildOvalCutGeometry() {
  const geo = new THREE.IcosahedronGeometry(1, 3);
  geo.scale(1.3, 0.5, 0.9);
  return geo;
}

export function buildRoundBrilliantGeometry() {
  return new THREE.IcosahedronGeometry(1, 4);
}

export function buildEmeraldCutGeometry() {
  const shape = new THREE.Shape();
  const w = 1.4, h = 1.0, c = 0.18;
  shape.moveTo(-w / 2 + c, -h / 2);
  shape.lineTo(w / 2 - c, -h / 2);
  shape.lineTo(w / 2, -h / 2 + c);
  shape.lineTo(w / 2, h / 2 - c);
  shape.lineTo(w / 2 - c, h / 2);
  shape.lineTo(-w / 2 + c, h / 2);
  shape.lineTo(-w / 2, h / 2 - c);
  shape.lineTo(-w / 2, -h / 2 + c);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.45,
    bevelEnabled: true,
    bevelSize: 0.07,
    bevelThickness: 0.07,
    bevelSegments: 4,
  });
  geo.center();
  return geo;
}

export function buildCushionCutGeometry() {
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    x = Math.sign(x) * Math.pow(Math.abs(x), 0.72);
    z = Math.sign(z) * Math.pow(Math.abs(z), 0.72);
    y *= 0.55;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildCabochonGeometry() {
  // Smooth domed hemisphere, flat base
  const geo = new THREE.SphereGeometry(1, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.scale(1.2, 0.65, 1.0);
  return geo;
}

export function buildOvalCabochonGeometry() {
  const geo = new THREE.SphereGeometry(1, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.scale(1.3, 0.6, 1.0);
  return geo;
}

export function buildSphereGeometry() {
  return new THREE.SphereGeometry(1, 64, 64);
}

export function buildCrystalGeometry() {
  // Hexagonal prism body + pyramid top
  const pyramidGeo = new THREE.CylinderGeometry(0, 0.58, 1.1, 6);
  const bodyGeo = new THREE.CylinderGeometry(0.58, 0.62, 1.6, 6);

  // Manually merge by translating positions
  const pyramidPos = pyramidGeo.attributes.position;
  const bodyPos = bodyGeo.attributes.position;

  const positions = [];
  const normals = [];
  const uvs = [];

  // Body (shifted down)
  for (let i = 0; i < bodyPos.count; i++) {
    positions.push(bodyPos.getX(i), bodyPos.getY(i) - 0.8, bodyPos.getZ(i));
  }
  // Pyramid on top
  for (let i = 0; i < pyramidPos.count; i++) {
    positions.push(pyramidPos.getX(i), pyramidPos.getY(i) + 0.8, pyramidPos.getZ(i));
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  merged.computeVertexNormals();
  return merged;
}

export function buildOctahedronGeometry() {
  const geo = new THREE.OctahedronGeometry(1, 0);
  geo.scale(1, 0.72, 1);
  return geo;
}

export function buildTriangularCabochonGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.0);
  shape.lineTo(0.866, -0.5);
  shape.lineTo(-0.866, -0.5);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSize: 0.14,
    bevelSegments: 10,
    bevelThickness: 0.28,
  });
  geo.center();
  return geo;
}

/**
 * Master geometry factory — maps geometry label to builder function
 */
export const GEM_GEOMETRIES = {
  OvalCut: buildOvalCutGeometry,
  RoundBrilliant: buildRoundBrilliantGeometry,
  EmeraldCut: buildEmeraldCutGeometry,
  CushionCut: buildCushionCutGeometry,
  Cabochon: buildCabochonGeometry,
  OvalCabochon: buildOvalCabochonGeometry,
  Sphere: buildSphereGeometry,
  Crystal: buildCrystalGeometry,
  Octahedron: buildOctahedronGeometry,
  TriangularCabochon: buildTriangularCabochonGeometry,
  NavRatanCluster: buildRoundBrilliantGeometry, // fallback for nav ratan
};

export function getGemGeometry(label) {
  const builder = GEM_GEOMETRIES[label] || buildOvalCutGeometry;
  return builder();
}
