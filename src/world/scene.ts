import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Euler,
  Fog,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  NearestFilter,
  Object3D,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from "three";
import {
  BRIDGE,
  LOMBARD,
  STREET,
  heightAt,
  lerp,
  lombardAt,
  streetAt,
} from "@/world/route";

/* ---------- geometry helpers ---------- */

function unit(geometry: BufferGeometry) {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  return flat.getAttribute("position").array as Float32Array;
}

// Unit shapes, all centred on the origin and one unit across.
const BOX = unit(new BoxGeometry(1, 1, 1));
const PYRAMID = unit(new ConeGeometry(Math.SQRT1_2, 1, 4, 1, false, Math.PI / 4));
const CONE = unit(new ConeGeometry(0.5, 1, 7));
const CYLINDER = unit(new CylinderGeometry(0.5, 0.5, 1, 8));
const BALL = unit(new IcosahedronGeometry(0.5, 0));
// A roof: triangular prism with its ridge running front to back.
const GABLE = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0, 0.5, 0.5,
  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0, 0.5, -0.5,
  0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0, 0.5, -0.5,
  0.5, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0, 0.5, 0.5,
  -0.5, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, -0.5,
]);

/**
 * Collects coloured shapes into one flat-shaded mesh, so the whole city costs
 * a handful of draw calls.
 */
class Builder {
  private positions: number[] = [];
  private colors: number[] = [];
  private matrix = new Matrix4();
  private quaternion = new Quaternion();
  private euler = new Euler();
  private position = new Vector3();
  private scale = new Vector3();
  private point = new Vector3();
  private color = new Color();

  add(
    shape: Float32Array,
    hex: number,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    ry = 0,
    rx = 0,
    rz = 0,
  ) {
    this.euler.set(rx, ry, rz, "YXZ");
    this.quaternion.setFromEuler(this.euler);
    this.matrix.compose(this.position.set(x, y, z), this.quaternion, this.scale.set(sx, sy, sz));
    this.color.setHex(hex);

    for (let index = 0; index < shape.length; index += 3) {
      this.point.set(shape[index], shape[index + 1], shape[index + 2]).applyMatrix4(this.matrix);
      this.positions.push(this.point.x, this.point.y, this.point.z);
      this.colors.push(this.color.r, this.color.g, this.color.b);
    }
  }

  box(hex: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0) {
    this.add(BOX, hex, x, y, z, sx, sy, sz, ry);
  }

  /** A quad from four corners given counter-clockwise when seen from above. */
  quad(hex: number, a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    this.color.setHex(hex);
    for (const corner of [a, b, c, a, c, d]) {
      this.positions.push(corner.x, corner.y, corner.z);
      this.colors.push(this.color.r, this.color.g, this.color.b);
    }
  }

  build() {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.positions), 3));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(this.colors), 3));
    geometry.computeVertexNormals();
    return geometry;
  }
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(list: readonly T[], random: () => number) =>
  list[Math.floor(random() * list.length)];

/* ---------- palette ---------- */

const ORANGE = 0xc8452b;
const ORANGE_SHADE = 0xa5361f;
const STONE = 0xd9d2c0;
const CONCRETE = 0x9aa3ad;
const ASPHALT = 0x4b5263;
const WOOD = 0xb08a5b;
const WOOD_DARK = 0x7a5a3a;
const TRUNK = 0x6a4a35;
const INK = 0x1b2638;
const WALLS = [0xf4a9a8, 0xf6d98b, 0xa8d5ba, 0xc9b6e4, 0xf1ede0, 0xeda576, 0x9cc4e4];
const ROOFS = [0x5d4a66, 0x6b5a52, 0x4f5d75, 0x7a4a45];
const BLOCKS = [0xf1ede0, 0xe6dfcf, 0xd9d2c0, 0xe9d8c8, 0xdfe6ea, 0xf3e3c3];
const GREENS = [0x4f8a5b, 0x5b9a63, 0x447a52, 0x6aa86a];
const FLOWERS = [0xf7a8c0, 0xffffff, 0xf7dc6f, 0xf58fa8];
const CAR_PAINT = [0xf4f6f8, 0x2a3142, 0xd9544a, 0xe9c04a, 0x4f7fb5, 0x6f8f7c];

/* ---------- world pieces ---------- */

function buildTerrain(solid: Builder) {
  const step = 6;
  const corner = (x: number, z: number) => new Vector3(x, heightAt(x, z), z);
  const random = mulberry32(3);

  for (let x = -486; x < 486; x += step) {
    for (let z = -300; z < 228; z += step) {
      const a = corner(x, z);
      const b = corner(x, z + step);
      const c = corner(x + step, z + step);
      const d = corner(x + step, z);
      const top = Math.max(a.y, b.y, c.y, d.y);
      if (top < -0.5) continue;

      const shade = random();
      let color: number;
      if (top < 1.6) color = 0xd8cfa6;
      else if (x < 60) color = shade > 0.5 ? 0x8fb26e : top > 38 ? 0xa9b97a : 0x83a865;
      else if (x < 196 && z < -40) color = shade > 0.5 ? 0x7fa86a : 0x8db573;
      else color = shade > 0.66 ? 0xb7c4a0 : shade > 0.33 ? 0xaebd99 : 0xc2c9a8;

      solid.quad(color, a, b, c, d);
    }
  }
}

function buildBridge(solid: Builder, lamps: Builder) {
  const { z, half, tower, deck, height } = BRIDGE;
  const top = deck + height;
  const cableZ = 4.6;

  solid.box(ORANGE, 0, deck, z, half * 2, 1.4, 8.4);
  solid.box(ORANGE_SHADE, 0, deck - 1.6, z, half * 2, 1.8, 6);
  solid.box(ASPHALT, 0, deck + 0.75, z, half * 2, 0.12, 6.6);
  solid.box(CONCRETE, half + 6, deck - 5, z, 14, 12, 12);
  solid.box(CONCRETE, -half - 6, deck - 5, z, 14, 12, 12);

  for (const x of [-tower, tower]) {
    for (const side of [-cableZ, cableZ]) {
      solid.box(ORANGE, x, (top - 4) / 2, z + side, 3.2, top + 4, 3.2);
      solid.box(ORANGE_SHADE, x, top + 1.2, z + side, 4, 1.4, 4);
    }
    for (const y of [deck - 8, deck + 16, deck + 30, deck + 42, top - 2]) {
      solid.box(ORANGE_SHADE, x, y, z, 2.2, 2.6, cableZ * 2);
    }
    solid.box(CONCRETE, x, 0.5, z, 10, 5, 18);
  }

  const cableAt = (x: number) => {
    const distance = Math.abs(x);
    if (distance <= tower) return top - (height - 7) * (1 - (distance / tower) ** 2);
    return deck + 1 + (top - deck - 1) * ((half - distance) / (half - tower)) ** 1.6;
  };

  const span = 4;
  for (let x = -half; x < half; x += span) {
    const from = cableAt(x);
    const to = cableAt(x + span);
    const middle = (from + to) / 2;
    const length = Math.hypot(span, to - from);
    const angle = Math.atan2(to - from, span);

    for (const side of [-cableZ, cableZ]) {
      solid.add(BOX, ORANGE, x + span / 2, middle, z + side, length + 0.2, 0.8, 0.8, 0, 0, angle);
      if (middle - deck > 2.2) {
        solid.box(ORANGE_SHADE, x + span / 2, (middle + deck) / 2, z + side, 0.32, middle - deck, 0.32);
      }
    }

    if ((x + half) % 12 === 0) {
      lamps.box(0xffd36a, x + span / 2, middle + 0.9, z - cableZ, 1.1, 1.1, 1.1);
      lamps.box(0xffd36a, x + span / 2, middle + 0.9, z + cableZ, 1.1, 1.1, 1.1);
      lamps.box(0xffe9a8, x + span / 2, deck + 1.6, z + 3.9, 0.7, 0.7, 0.7);
    }
  }
}

function tree(solid: Builder, x: number, z: number, size: number, random: () => number) {
  const ground = heightAt(x, z);
  if (ground < 1.5) return;

  const green = pick(GREENS, random);
  solid.box(TRUNK, x, ground + size * 0.6, z, size * 0.3, size * 1.4, size * 0.3);
  if (random() > 0.45) {
    solid.add(BALL, green, x, ground + size * 2, z, size * 2.1, size * 2, size * 2.1, random() * 3);
  } else {
    solid.add(CONE, green, x, ground + size * 2.3, z, size * 1.7, size * 3.4, size * 1.7);
  }
}

/** A Victorian rowhouse. `facing` turns its front (local +z) toward the street. */
function rowhouse(
  solid: Builder,
  glass: Builder,
  x: number,
  z: number,
  facing: number,
  width: number,
  height: number,
  depth: number,
  random: () => number,
) {
  const ground = heightAt(x, z);
  const cos = Math.cos(facing);
  const sin = Math.sin(facing);
  const wall = pick(WALLS, random);
  const roof = pick(ROOFS, random);
  const place = (
    builder: Builder,
    shape: Float32Array,
    hex: number,
    lx: number,
    y: number,
    lz: number,
    sx: number,
    sy: number,
    sz: number,
  ) => {
    builder.add(shape, hex, x + lx * cos + lz * sin, y, z - lx * sin + lz * cos, sx, sy, sz, facing);
  };
  const front = depth / 2;

  place(solid, BOX, wall, 0, ground + height / 2 - 2, 0, width, height + 4, depth);
  if (random() > 0.35) {
    place(solid, GABLE, roof, 0, ground + height + 1.6, 0, width + 0.5, 3.2, depth + 0.5);
  } else {
    place(solid, BOX, roof, 0, ground + height + 0.3, 0, width + 0.5, 0.6, depth + 0.5);
  }
  place(solid, BOX, 0xfffaf0, 0, ground + height - 0.2, front + 0.15, width + 0.4, 0.5, 0.5);
  place(solid, BOX, 0xfffaf0, -width * 0.22, ground + height * 0.38 + 0.6, front + 0.55, width * 0.46, height * 0.76, 1.3);
  place(solid, BOX, 0x4a3a3a, width * 0.26, ground + 1.5, front + 0.05, 1.5, 3, 0.3);
  place(solid, BOX, STONE, width * 0.26, ground + 0.3, front + 0.9, 2.3, 1, 1.7);

  for (let y = ground + 3.4; y < ground + height - 1.6; y += 3.5) {
    place(glass, BOX, 0xffffff, -width * 0.32, y, front + 1.24, width * 0.15, 1.9, 0.12);
    place(glass, BOX, 0xffffff, -width * 0.12, y, front + 1.24, width * 0.15, 1.9, 0.12);
    if (y > ground + 5) place(glass, BOX, 0xffffff, width * 0.26, y, front + 0.06, width * 0.2, 1.9, 0.12);
  }
}

function buildLombard(solid: Builder, glass: Builder, lamps: Builder) {
  const random = mulberry32(17);
  const samples = 220;
  const points = Array.from({ length: samples + 1 }, (_, index) => lombardAt(index / samples));
  const edge = (index: number, offset: number) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(samples, index + 1)];
    const dx = after.x - before.x;
    const dz = after.z - before.z;
    const length = Math.hypot(dx, dz) || 1;
    const x = points[index].x + (dz / length) * offset;
    const z = points[index].z - (dx / length) * offset;
    return new Vector3(x, heightAt(x, z) + 0.35, z);
  };

  for (let index = 0; index < samples; index += 1) {
    const brick = Math.floor(index / 3) % 2 === 0 ? 0xb5553f : 0xa94d39;
    solid.quad(brick, edge(index, 2.7), edge(index, -2.7), edge(index + 1, -2.7), edge(index + 1, 2.7));
    solid.quad(STONE, edge(index, 3.4), edge(index, 2.7), edge(index + 1, 2.7), edge(index + 1, 3.4));
    solid.quad(STONE, edge(index, -2.7), edge(index, -3.4), edge(index + 1, -3.4), edge(index + 1, -2.7));
  }

  // Hedges and hydrangeas fill everything between the switchbacks.
  for (let x = LOMBARD.x - 17; x <= LOMBARD.x + 17; x += 2.3) {
    for (let z = LOMBARD.top - 2; z <= LOMBARD.bottom + 2; z += 2.3) {
      let nearest = Infinity;
      for (let index = 0; index <= samples; index += 2) {
        nearest = Math.min(nearest, Math.hypot(points[index].x - x, points[index].z - z));
      }
      if (nearest < 4.3 || random() > 0.62) continue;

      const ground = heightAt(x, z);
      solid.box(pick(GREENS, random), x, ground + 0.7, z, 2.4, 1.5, 2.4);
      if (random() > 0.5) solid.box(pick(FLOWERS, random), x, ground + 1.6, z, 1.1, 0.5, 1.1);
    }
  }

  for (let z = LOMBARD.top - 4; z <= LOMBARD.bottom + 4; z += 10.6) {
    rowhouse(solid, glass, LOMBARD.x - 25, z, Math.PI / 2, 9.8, 9 + random() * 5, 11, random);
    rowhouse(solid, glass, LOMBARD.x + 25, z, -Math.PI / 2, 9.8, 9 + random() * 5, 11, random);
  }

  for (const z of [LOMBARD.top - 3, LOMBARD.bottom + 4]) {
    for (const side of [-19, 19]) {
      const ground = heightAt(LOMBARD.x + side, z);
      solid.box(INK, LOMBARD.x + side, ground + 3, z, 0.35, 6, 0.35);
      lamps.box(0xffd36a, LOMBARD.x + side, ground + 6.2, z, 0.9, 0.9, 0.9);
    }
  }
}

function buildStreet(solid: Builder, glass: Builder, lamps: Builder, stops: number) {
  const random = mulberry32(41);
  const { x } = STREET;
  const level = (z: number) => heightAt(x, z) + 0.35;
  const strip = (hex: number, from: number, to: number, z: number, length: number, lift: number) => {
    solid.quad(
      hex,
      new Vector3(from, level(z) + lift, z),
      new Vector3(from, level(z + length) + lift, z + length),
      new Vector3(to, level(z + length) + lift, z + length),
      new Vector3(to, level(z) + lift, z),
    );
  };

  for (let z = STREET.top - 22; z < STREET.bottom + 12; z += 2) {
    strip(ASPHALT, x - 5.6, x + 5.6, z, 2, 0);
    strip(STONE, x - 8.8, x - 5.6, z, 2, 0.35);
    strip(STONE, x + 5.6, x + 8.8, z, 2, 0.35);
    strip(0xb9c0cc, x - 1.45, x - 1.05, z, 2, 0.08);
    strip(0xb9c0cc, x + 1.05, x + 1.45, z, 2, 0.08);
    strip(0x2a2f3d, x - 0.14, x + 0.14, z, 2, 0.08);
    if (Math.floor(z / 2) % 3 !== 0) {
      strip(0xe2b84a, x - 3.6, x - 3.3, z, 2, 0.06);
      strip(0xe2b84a, x + 3.3, x + 3.6, z, 2, 0.06);
    }
  }

  for (let z = STREET.top - 20; z <= STREET.bottom + 4; z += 10.2) {
    rowhouse(solid, glass, x - 14.6, z, Math.PI / 2, 9.6, 10 + random() * 5, 11, random);
    rowhouse(solid, glass, x + 14.6, z, -Math.PI / 2, 9.6, 10 + random() * 5, 11, random);
    if (random() > 0.4) tree(solid, x - 7.4, z + 5, 1.5, random);
    if (random() > 0.4) tree(solid, x + 7.4, z + 5, 1.5, random);

    for (const side of [-4.6, 4.6]) {
      if (random() > 0.55) continue;
      const carZ = z + random() * 4;
      const ground = level(carZ);
      const pitch = -Math.atan((level(carZ + 1) - ground) / 1);
      solid.add(BOX, pick(CAR_PAINT, random), x + side, ground + 0.8, carZ, 1.9, 0.9, 4, 0, pitch);
      solid.add(BOX, 0x2a3142, x + side, ground + 1.5, carZ - 0.2, 1.7, 0.7, 2, 0, pitch);
    }
  }

  for (let stop = 0; stop < stops; stop += 1) {
    const z = lerp(STREET.top, STREET.bottom, stop / (stops - 1));
    for (let stripe = -4.4; stripe <= 4.4; stripe += 2.2) {
      strip(0xf4f6f8, x + stripe - 0.6, x + stripe + 0.6, z - 7.5, 2.4, 0.07);
    }
    for (const side of [-7.6, 7.6]) {
      const ground = level(z);
      solid.box(INK, x + side, ground + 3.6, z + 2, 0.35, 7, 0.35);
      lamps.box(0xffd36a, x + side * 0.92, ground + 7.2, z + 2, 1, 0.8, 1);
    }
  }
}

function buildCity(solid: Builder, glass: Builder) {
  const random = mulberry32(73);

  for (let x = 172; x <= 440; x += 15) {
    for (let z = -136; z <= 104; z += 15) {
      const ground = heightAt(x, z);
      if (ground < 3.2) continue;
      // Keep the two featured streets and the bridge landing clear.
      if (Math.abs(x - LOMBARD.x) < 34 && z > LOMBARD.top - 16 && z < LOMBARD.bottom + 16) continue;
      if (Math.abs(x - STREET.x) < 24 && z > STREET.top - 30) continue;
      if (x < 205 && z < -40) {
        if (random() > 0.45) tree(solid, x + random() * 8, z + random() * 8, 1.8 + random(), random);
        continue;
      }
      if (random() > 0.82) {
        tree(solid, x, z, 1.6 + random(), random);
        continue;
      }

      const downtown = Math.max(0, 1 - Math.hypot(x - 392, z + 30) / 70);
      const width = 9 + random() * 3;
      const depth = 9 + random() * 3;
      const height = 6 + random() * 7 + downtown * downtown * 46 * (0.5 + random());
      const wall = pick(BLOCKS, random);

      solid.box(wall, x, ground + height / 2 - 3, z, width, height + 6, depth);
      solid.box(0xc9c2b2, x, ground + height + 0.2, z, width - 1, 0.5, depth - 1);

      for (let y = ground + 3; y < ground + height - 1; y += 3.4) {
        for (let offset = -width / 2 + 1.8; offset < width / 2 - 1; offset += 2.6) {
          if (random() > 0.72) continue;
          glass.box(0xffffff, x + offset, y, z + depth / 2 + 0.05, 1.2, 1.6, 0.12);
        }
      }
    }
  }

  // The Transamerica Pyramid, so the skyline reads as San Francisco from anywhere.
  const pyramid = heightAt(392, -30);
  solid.add(PYRAMID, 0xf4f1e6, 392, pyramid + 30, -30, 13, 66, 13);
  solid.box(0xe6dfcf, 392, pyramid + 2, -30, 15, 8, 15);
}

function buildPier(solid: Builder, glass: Builder, lamps: Builder) {
  const random = mulberry32(97);
  const deck = 3.2;

  solid.box(WOOD, 346, deck - 0.3, 130, 78, 0.6, 34);
  solid.box(WOOD_DARK, 346, deck - 0.8, 130, 78, 0.5, 33);
  for (let x = 310; x <= 382; x += 9) {
    for (const z of [116, 130, 145]) solid.box(WOOD_DARK, x, deck / 2 - 1.5, z, 1, deck + 3, 1);
  }
  for (let x = 308; x <= 384; x += 4) solid.box(WOOD_DARK, x, deck + 0.8, 146.6, 0.35, 1.5, 0.35);
  solid.box(WOOD_DARK, 346, deck + 1.5, 146.6, 77, 0.3, 0.3);

  for (const [x, width, wall] of [
    [318, 12, 0x5f86b8],
    [333, 13, 0xf1ede0],
    [349, 11, 0xd9644a],
  ] as const) {
    solid.box(wall, x, deck + 3, 120, width, 6, 9);
    solid.add(GABLE, pick(ROOFS, random), x, deck + 7.4, 120, 10, 2.8, width + 1, Math.PI / 2);
    solid.box(0xf2c14e, x, deck + 3.6, 125, width - 2, 0.3, 2);
    glass.box(0xffffff, x - 2.4, deck + 3, 124.56, 2, 2.2, 0.12);
    glass.box(0xffffff, x + 2.4, deck + 3, 124.56, 2, 2.2, 0.12);
  }

  for (const x of [312, 340, 366]) {
    solid.box(INK, x, deck + 3, 144, 0.35, 6, 0.35);
    lamps.box(0xffd36a, x, deck + 6.2, 144, 0.9, 0.9, 0.9);
  }

  // Ferris wheel supports; the wheel itself turns and is built separately.
  for (const side of [-1, 1]) {
    solid.add(BOX, 0xf4f6f8, 372 + side * 5, deck + 8, 121, 0.7, 18, 0.7, 0, 0, side * 0.3);
  }

  // The sea lions' floating dock.
  solid.box(WOOD, 318, 0.5, 156, 20, 0.7, 8);
  for (let index = 0; index < 7; index += 1) {
    const x = 310 + index * 2.6 + random();
    const z = 154 + random() * 4;
    const brown = random() > 0.5 ? 0x6b4a36 : 0x7c5840;
    solid.add(BALL, brown, x, 1.5, z, 3.2, 1.5, 1.6, random() * 3);
    if (random() > 0.4) solid.add(BALL, brown, x + 0.9, 2.5, z, 1.1, 1.6, 1.1, 0, 0, -0.4);
  }

  // Alcatraz, out in the bay.
  solid.add(BALL, 0xa39a82, 250, 1, 300, 58, 14, 30);
  solid.box(0xe6dfcf, 252, 9, 300, 26, 5, 9);
  solid.add(CYLINDER, 0xf4f1e6, 236, 12, 298, 1.8, 12, 1.8);
  lamps.box(0xffe9a8, 236, 18.6, 298, 1.6, 1.4, 1.6);
}

function buildBackdrop(solid: Builder) {
  const random = mulberry32(131);
  for (let index = 0; index < 34; index += 1) {
    const angle = (index / 34) * Math.PI * 2 + random() * 0.1;
    const radius = 720 + random() * 120;
    const height = 60 + random() * 80;
    solid.add(
      CONE,
      random() > 0.5 ? 0x8ea3bd : 0x9bb0c6,
      60 + Math.cos(angle) * radius,
      height / 2 - 6,
      -40 + Math.sin(angle) * radius,
      200 + random() * 140,
      height,
      160 + random() * 120,
      random() * 3,
    );
  }
}

/* ---------- signs ---------- */

const GLYPHS: Record<string, readonly string[]> = {
  "0": ["xxx", "x.x", "x.x", "x.x", "xxx"],
  "1": [".x.", "xx.", ".x.", ".x.", "xxx"],
  "2": ["xxx", "..x", "xxx", "x..", "xxx"],
  "3": ["xxx", "..x", "xxx", "..x", "xxx"],
  "4": ["x.x", "x.x", "xxx", "..x", "..x"],
  "5": ["xxx", "x..", "xxx", "..x", "xxx"],
  "6": ["xxx", "x..", "xxx", "x.x", "xxx"],
  "7": ["xxx", "..x", "..x", "..x", "..x"],
  "8": ["xxx", "x.x", "xxx", "x.x", "xxx"],
  "9": ["xxx", "x.x", "xxx", "..x", "xxx"],
};

function crisp(texture: CanvasTexture) {
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * The plate that rides above the cable car showing the year of the current
 * stop. Drawn pixel by pixel so it needs no web font, and painted over the
 * scene so no house or lamp post can hide it.
 */
function yearPlate(length: number) {
  const canvas = document.createElement("canvas");
  canvas.width = length * 4 + 3;
  canvas.height = 9;
  const context = canvas.getContext("2d");
  const texture = crisp(new CanvasTexture(canvas));

  const paint = (label: string) => {
    if (!context) return;
    context.fillStyle = "#1b2638";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#c8452b";
    context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
    context.fillStyle = "#ffffff";
    Array.from(label).forEach((char, index) => {
      GLYPHS[char]?.forEach((row, y) => {
        for (let x = 0; x < row.length; x += 1) {
          if (row[x] === "x") context.fillRect(2 + index * 4 + x, 2 + y, 1, 1);
        }
      });
    });
    texture.needsUpdate = true;
  };

  const sprite = new Sprite(new SpriteMaterial({ map: texture, depthTest: false, fog: false }));
  sprite.scale.set(canvas.width * 0.3, canvas.height * 0.3, 1);
  sprite.renderOrder = 10;
  return { sprite, paint };
}

/** A product's logo on a signpost, resampled small so it matches the pixel world. */
function logoSign(source: string) {
  const size = 36;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const texture = crisp(new CanvasTexture(canvas));
  const image = new Image();
  let active = false;

  const paint = () => {
    if (!context) return;
    context.fillStyle = active ? "#c8452b" : "#1b2638";
    context.fillRect(0, 0, size, size);
    context.fillStyle = "#f7f9fb";
    context.fillRect(2, 2, size - 4, size - 4);
    if (image.complete && image.naturalWidth) {
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 5, 5, size - 10, size - 10);
    }
    texture.needsUpdate = true;
  };

  image.onload = paint;
  image.src = source;
  paint();

  const sprite = new Sprite(new SpriteMaterial({ map: texture }));
  sprite.scale.set(5.4, 5.4, 1);
  return {
    sprite,
    paint: (next: boolean) => {
      active = next;
      paint();
    },
  };
}

/* ---------- water ---------- */

function createWater() {
  const material = new ShaderMaterial({
    fog: true,
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      {
        uTime: { value: 0 },
        uDeep: { value: new Color() },
        uShallow: { value: new Color() },
        uGlint: { value: new Color() },
      },
    ]),
    vertexShader: /* glsl */ `
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vWorld;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorld = worldPosition.xyz;
        vec4 mvPosition = viewMatrix * worldPosition;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uGlint;
      varying vec3 vWorld;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        // Snapped to a coarse grid so the swell reads as pixel clusters, not gradients.
        vec2 cell = floor(vWorld.xz / vec2(3.0, 1.2));
        float swell = sin(cell.x * 0.31 + uTime * 0.8) + sin(cell.y * 0.47 - uTime * 0.6)
          + sin((cell.x + cell.y) * 0.17 + uTime * 0.4);
        vec3 color = mix(uDeep, uShallow, step(0.4, swell) * 0.5);
        color = mix(color, uGlint, step(2.15, swell));
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
  });

  const mesh = new Mesh(new PlaneGeometry(5000, 5000), material);
  mesh.rotation.x = -Math.PI / 2;
  return { mesh, material };
}

/* ---------- the world ---------- */

export interface WorldOptions {
  /** One logo per product stop, in order. */
  logos: readonly string[];
  /** One year per career stop, in order. */
  years: readonly string[];
}

export interface WorldFrame {
  /** Seconds; frozen when the visitor prefers reduced motion. */
  time: number;
  /** 0 = day, 1 = night. */
  night: number;
  /** How far the car is down Lombard, 0 to 1. */
  car: number;
  /** How far the cable car is down its street, 0 to 1. */
  tram: number;
  product: number;
  career: number;
}

const SKY_DAY = new Color(0xa9d8f5);
const SKY_NIGHT = new Color(0x141a33);
const GLASS_DAY = new Color(0x3b5576);
const GLASS_NIGHT = new Color(0xffd36a);
const CLOUD_DAY = new Color(0xffffff);
const CLOUD_NIGHT = new Color(0x2a3154);
const SUN = new Color(0xffe08a);
const MOON = new Color(0xf3efd8);

export function createWorld({ logos, years }: WorldOptions) {
  const scene = new Scene();
  const background = new Color().copy(SKY_DAY);
  const fog = new Fog(SKY_DAY.getHex(), 240, 980);
  scene.background = background;
  scene.fog = fog;

  const hemisphere = new HemisphereLight(0xdcefff, 0x8a9a78, 2.4);
  const sun = new DirectionalLight(0xfff1d6, 2.4);
  sun.position.set(-0.55, 1, 0.75);
  scene.add(hemisphere, sun);

  const solid = new Builder();
  const glass = new Builder();
  const lamps = new Builder();

  buildTerrain(solid);
  buildBridge(solid, lamps);
  buildCity(solid, glass);
  buildLombard(solid, glass, lamps);
  buildStreet(solid, glass, lamps, years.length);
  buildPier(solid, glass, lamps);
  buildBackdrop(solid);

  const random = mulberry32(211);
  for (let index = 0; index < 90; index += 1) {
    tree(solid, -420 + random() * 300, -260 + random() * 300, 2.4 + random() * 2.2, random);
  }

  const solidMaterial = new MeshLambertMaterial({ vertexColors: true });
  const glassMaterial = new MeshBasicMaterial({ color: GLASS_DAY.getHex() });
  const lampMaterial = new MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0 });
  const lampMesh = new Mesh(lamps.build(), lampMaterial);
  scene.add(new Mesh(solid.build(), solidMaterial), new Mesh(glass.build(), glassMaterial), lampMesh);

  const water = createWater();
  scene.add(water.mesh);

  // Sun and moon share one disc; night just changes what it is.
  const discMaterial = new MeshBasicMaterial({ color: SUN.getHex(), fog: false });
  const disc = new Mesh(new IcosahedronGeometry(1, 2), discMaterial);
  disc.scale.setScalar(46);
  disc.position.set(-560, 300, -900);
  scene.add(disc);

  const starPositions = new Float32Array(420 * 3);
  for (let index = 0; index < 420; index += 1) {
    const angle = random() * Math.PI * 2;
    const lift = 0.12 + random() * 0.88;
    const flat = Math.sqrt(1 - lift * lift);
    starPositions.set([Math.cos(angle) * flat * 1300, lift * 1300, Math.sin(angle) * flat * 1300], index * 3);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new BufferAttribute(starPositions, 3));
  const starMaterial = new PointsMaterial({
    color: 0xfff6d6,
    size: 1.6,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
    fog: false,
    depthWrite: false,
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);

  // Clouds sit in a wide ring, high up, so none ever hangs right over the camera.
  const cloudBuilder = new Builder();
  for (let index = 0; index < 18; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 420 + random() * 460;
    const x = 150 + Math.cos(angle) * radius;
    const y = 170 + random() * 90;
    const z = Math.sin(angle) * radius;
    const puffs = 3 + Math.floor(random() * 3);
    for (let puff = 0; puff < puffs; puff += 1) {
      cloudBuilder.box(0xffffff, x + puff * 24 - puffs * 10, y + (puff % 2) * 6, z, 44 + random() * 24, 9, 30);
    }
  }
  const cloudMaterial = new MeshBasicMaterial({ color: 0xffffff });
  const clouds = new Mesh(cloudBuilder.build(), cloudMaterial);
  scene.add(clouds);

  // Traffic on the bridge.
  const trafficCount = 12;
  const traffic = new InstancedMesh(
    new BoxGeometry(4, 1.3, 1.9),
    new MeshLambertMaterial(),
    trafficCount,
  );
  const trafficSeeds = Array.from({ length: trafficCount }, (_, index) => ({
    offset: random() * BRIDGE.half * 2,
    speed: 9 + random() * 7,
    lane: index % 2 === 0 ? 1 : -1,
  }));
  const paint = new Color();
  trafficSeeds.forEach((_, index) => {
    traffic.setColorAt(index, paint.setHex(pick(CAR_PAINT, random)));
  });
  scene.add(traffic);

  // Tower beacons blink red at night.
  const beaconBuilder = new Builder();
  for (const x of [-BRIDGE.tower, BRIDGE.tower]) {
    for (const side of [-4.6, 4.6]) {
      beaconBuilder.box(0xff4b3e, x, BRIDGE.deck + BRIDGE.height + 2.6, BRIDGE.z + side, 1.3, 1.3, 1.3);
    }
  }
  const beacons = new Mesh(beaconBuilder.build(), new MeshBasicMaterial({ color: 0xff4b3e }));
  beacons.visible = false;
  scene.add(beacons);

  // The car that drives Lombard. Its paint carries a little light of its own after
  // dark, and it runs with headlights, so it never sinks into the night street.
  const carBody = new Builder();
  carBody.box(0x6f8f7c, 0, 0.95, 0, 2.1, 0.9, 4.4);
  carBody.box(0x8fb09b, 0, 1.75, -0.2, 1.9, 0.8, 2.3);
  const carTrim = new Builder();
  carTrim.box(0x2a3142, 0, 1.75, 0.98, 1.7, 0.6, 0.1);
  for (const [wheelX, wheelZ] of [[-1, 1.4], [1, 1.4], [-1, -1.4], [1, -1.4]]) {
    carTrim.box(0x1b2638, wheelX, 0.45, wheelZ, 0.5, 0.9, 0.9);
  }
  const carLights = new Builder();
  carLights.box(0xfff1b8, -0.7, 1, 2.22, 0.5, 0.4, 0.12);
  carLights.box(0xfff1b8, 0.7, 1, 2.22, 0.5, 0.4, 0.12);
  carLights.box(0xff4b3e, -0.75, 1.05, -2.22, 0.45, 0.3, 0.12);
  carLights.box(0xff4b3e, 0.75, 1.05, -2.22, 0.45, 0.3, 0.12);
  const carPaint = new MeshLambertMaterial({ vertexColors: true });
  const beamMaterial = new MeshBasicMaterial({
    color: 0xffe9a8,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const beam = new Mesh(new BoxGeometry(2.6, 0.06, 6.4), beamMaterial);
  beam.position.set(0, 0.16, 5.6);
  const car = new Group();
  car.rotation.order = "YXZ";
  car.add(
    new Mesh(carBody.build(), carPaint),
    new Mesh(carTrim.build(), solidMaterial),
    new Mesh(carLights.build(), lampMaterial),
    beam,
  );
  scene.add(car);

  // The cable car.
  const tramBuilder = new Builder();
  tramBuilder.box(0x2a2f3d, 0, 0.6, 0, 3.4, 0.8, 9.6);
  tramBuilder.box(0x8f2a2a, 0, 1.75, 0, 3.8, 1.5, 9.8);
  tramBuilder.box(0xe0b65a, 0, 2.55, 0, 3.9, 0.22, 9.9);
  tramBuilder.box(0xead9a8, 0, 3.2, 0, 3.6, 1.2, 9.6);
  tramBuilder.box(0xf0e2b6, 0, 3.98, 0, 4.2, 0.4, 10.4);
  tramBuilder.box(0xd9c88f, 0, 4.4, 0, 2.6, 0.5, 8.4);
  const tram = new Group();
  tram.rotation.order = "YXZ";
  const tramGlass = new Builder();
  for (const windowZ of [-3.4, -1.15, 1.15, 3.4]) {
    tramGlass.box(0xffffff, -1.85, 3.2, windowZ, 0.14, 0.82, 1.7);
    tramGlass.box(0xffffff, 1.85, 3.2, windowZ, 0.14, 0.82, 1.7);
  }
  tramGlass.box(0xffffff, 0, 3.2, 4.85, 2.7, 0.82, 0.14);
  tramGlass.box(0xffffff, 0, 3.2, -4.85, 2.7, 0.82, 0.14);
  const tramLamp = new Builder();
  tramLamp.box(0xffe9a8, 0, 1.9, 5, 0.7, 0.7, 0.3);
  tram.add(
    new Mesh(tramBuilder.build(), solidMaterial),
    new Mesh(tramGlass.build(), glassMaterial),
    new Mesh(tramLamp.build(), lampMaterial),
  );
  scene.add(tram);

  // Ferris wheel.
  const wheel = new Group();
  wheel.position.set(372, 19, 121);
  const wheelBuilder = new Builder();
  for (let spoke = 0; spoke < 4; spoke += 1) {
    wheelBuilder.add(BOX, 0xf4f6f8, 0, 0, 0, 26, 0.4, 0.4, 0, 0, (spoke / 4) * Math.PI);
  }
  for (let cabin = 0; cabin < 12; cabin += 1) {
    const angle = (cabin / 12) * Math.PI * 2;
    wheelBuilder.box(pick(WALLS, random), Math.cos(angle) * 13, Math.sin(angle) * 13, 0, 2.2, 2.2, 1.6);
  }
  wheel.add(
    new Mesh(new TorusGeometry(13, 0.45, 5, 28), new MeshLambertMaterial({ color: 0xf4f6f8 })),
    new Mesh(wheelBuilder.build(), solidMaterial),
  );
  scene.add(wheel);

  // Sailboats.
  const boats = [
    [60, 30],
    [-40, -10],
    [270, 190],
    [400, 170],
    [170, 120],
  ].map(([x, z], index) => {
    const builder = new Builder();
    builder.box(0xf4f6f8, 0, 0.5, 0, 5, 1, 1.8);
    builder.box(0x2a3142, 0, 4, 0, 0.2, 7, 0.2);
    builder.add(PYRAMID, 0xf7f9fb, 1.3, 4.2, 0, 2.6, 6, 0.2);
    builder.add(PYRAMID, 0xf7f9fb, -0.9, 3.4, 0, 1.6, 4.2, 0.2);
    const boat = new Mesh(builder.build(), solidMaterial);
    boat.position.set(x, 0, z);
    boat.rotation.y = index * 1.3;
    scene.add(boat);
    return boat;
  });

  // Signposts: a logo at each bend of Lombard, a year at each cable-car stop.
  const productSigns = logos.map((logo, index) => {
    const at = lombardAt(index / Math.max(1, logos.length - 1));
    const side = index % 2 === 0 ? 1 : -1;
    const sign = logoSign(logo);
    sign.sprite.position.set(at.x + side * 0.5, at.y + 8.2, at.z - 1.5);
    const post = new Mesh(new BoxGeometry(0.3, 6, 0.3), new MeshLambertMaterial({ color: INK }));
    post.position.set(at.x + side * 0.5, at.y + 3, at.z - 1.5);
    scene.add(sign.sprite, post);
    return sign;
  });

  const plate = yearPlate(Math.max(...years.map((year) => year.length)));
  scene.add(plate.sprite);

  const helper = new Object3D();
  const sky = new Color();
  let lastProduct = -1;
  let lastCareer = -1;

  function update(frame: WorldFrame) {
    const { time, night } = frame;

    sky.lerpColors(SKY_DAY, SKY_NIGHT, night);
    background.copy(sky);
    fog.color.copy(sky);

    hemisphere.intensity = lerp(2.4, 0.95, night);
    hemisphere.color.setHex(0xdcefff).lerp(paint.setHex(0x4a5aa8), night);
    hemisphere.groundColor.setHex(0x8a9a78).lerp(paint.setHex(0x141a2e), night);
    sun.intensity = lerp(2.4, 0.7, night);
    sun.color.setHex(0xfff1d6).lerp(paint.setHex(0x9fb4ff), night);

    glassMaterial.color.lerpColors(GLASS_DAY, GLASS_NIGHT, night);
    lampMaterial.opacity = night;
    lampMesh.visible = night > 0.02;
    starMaterial.opacity = night;
    stars.visible = night > 0.02;
    cloudMaterial.color.lerpColors(CLOUD_DAY, CLOUD_NIGHT, night);
    discMaterial.color.lerpColors(SUN, MOON, night);
    beacons.visible = night > 0.4 && Math.floor(time * 1.4) % 2 === 0;
    carPaint.emissive.setHex(0x8fb09b).multiplyScalar(night * 0.5);
    beamMaterial.opacity = night * 0.34;
    beam.visible = night > 0.02;

    const uniforms = water.material.uniforms;
    uniforms.uTime.value = Math.floor(time * 8) / 8;
    (uniforms.uDeep.value as Color).setHex(0x3f8fcf).lerp(paint.setHex(0x161d3a), night);
    (uniforms.uShallow.value as Color).setHex(0x57a8e0).lerp(paint.setHex(0x1f2850), night);
    (uniforms.uGlint.value as Color).setHex(0xd6f0ff).lerp(paint.setHex(0x5a6aa8), night);

    clouds.rotation.y = time * 0.004;
    wheel.rotation.z = time * 0.12;

    trafficSeeds.forEach((seed, index) => {
      const travel = (seed.offset + time * seed.speed) % (BRIDGE.half * 2);
      const x = seed.lane > 0 ? -BRIDGE.half + travel : BRIDGE.half - travel;
      helper.position.set(x, BRIDGE.deck + 1.45, BRIDGE.z + seed.lane * 1.7);
      helper.rotation.set(0, 0, 0);
      helper.updateMatrix();
      traffic.setMatrixAt(index, helper.matrix);
    });
    traffic.instanceMatrix.needsUpdate = true;

    boats.forEach((boat, index) => {
      boat.position.y = Math.sin(time * 1.1 + index * 2) * 0.25;
      boat.rotation.z = Math.sin(time * 0.9 + index) * 0.04;
    });

    const here = lombardAt(frame.car);
    const ahead = lombardAt(Math.min(1, frame.car + 0.004));
    const behind = lombardAt(Math.max(0, frame.car - 0.004));
    const dx = ahead.x - behind.x;
    const dz = ahead.z - behind.z;
    car.position.set(here.x, here.y + 0.35, here.z);
    car.rotation.y = Math.atan2(dx, dz);
    car.rotation.x = -Math.atan2(ahead.y - behind.y, Math.hypot(dx, dz));

    const rail = streetAt(frame.tram);
    const railAhead = streetAt(Math.min(1, frame.tram + 0.01));
    const railBehind = streetAt(Math.max(0, frame.tram - 0.01));
    tram.position.set(rail.x, rail.y + 0.4, rail.z);
    tram.rotation.x = -Math.atan2(railAhead.y - railBehind.y, railAhead.z - railBehind.z);

    if (frame.product !== lastProduct) {
      productSigns.forEach((sign, index) => {
        sign.paint(index === frame.product);
        sign.sprite.scale.setScalar(index === frame.product ? 6.6 : 5.4);
      });
      lastProduct = frame.product;
    }

    plate.sprite.position.set(rail.x, rail.y + 8.6, rail.z);

    if (frame.career !== lastCareer) {
      plate.paint(years[frame.career] ?? "");
      lastCareer = frame.career;
    }
  }

  function dispose() {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        if (!material) continue;
        (material as SpriteMaterial).map?.dispose();
        material.dispose();
      }
    });
  }

  return { scene, update, dispose };
}

export type World = ReturnType<typeof createWorld>;
