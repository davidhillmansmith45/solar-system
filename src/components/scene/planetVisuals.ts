import * as THREE from 'three'

/**
 * Appearance-only data for each body: textures, axial tilt, surface response.
 * Nothing here affects size or orbit. Radii and distances live in data/bodies.ts.
 *
 * Planet textures: Solar System Scope (https://www.solarsystemscope.com/textures/),
 * CC BY 4.0, based on NASA imagery.
 */

const base = import.meta.env.BASE_URL
export const tex = (file: string) => `${base}textures/${file}`

export interface BodyVisual {
  /** Color map file under public/textures */
  map?: string
  /** Multiply the map by the body's swatch color (used for moons / dwarfs without their own map) */
  tintWithSwatch?: boolean
  roughness?: number
  /** Axial tilt in degrees (appearance only) */
  tiltDeg?: number
  /** Explicit tilt rotation around X in radians (overrides tiltDeg), used to line Saturn up with its rings */
  tiltX?: number
  /** Thin atmosphere rim glow */
  atmosphere?: { color: string; intensity: number; power: number }
}

export const VISUALS: Record<string, BodyVisual> = {
  mercury: { map: '1k_mercury.jpg', roughness: 1, tiltDeg: 0.03 },
  venus: {
    map: '1k_venus_atmosphere.jpg',
    roughness: 0.9,
    atmosphere: { color: '#f3d9a4', intensity: 0.55, power: 3.2 },
  },
  earth: {
    map: '2k_earth_daymap.jpg',
    roughness: 0.82,
    tiltDeg: 23.4,
    atmosphere: { color: '#5ea8ff', intensity: 0.9, power: 3.0 },
  },
  moon: { map: '1k_moon.jpg', roughness: 1 },
  mars: {
    map: '2k_mars.jpg',
    roughness: 0.95,
    tiltDeg: 25.2,
    atmosphere: { color: '#e8a27a', intensity: 0.25, power: 4.0 },
  },
  ceres: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1, tiltDeg: 4 },
  jupiter: { map: '2k_jupiter.jpg', roughness: 0.9, tiltDeg: 3.1 },
  io: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1 },
  europa: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 0.85 },
  ganymede: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1 },
  callisto: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1 },
  // Saturn's pole matches the existing ring orientation (rotation x = PI / 2.6)
  saturn: { map: '2k_saturn.jpg', roughness: 0.9, tiltX: Math.PI / 2.6 - Math.PI / 2 },
  titan: {
    map: '1k_moon.jpg',
    tintWithSwatch: true,
    roughness: 1,
    atmosphere: { color: '#e0a64e', intensity: 0.45, power: 2.6 },
  },
  uranus: {
    map: '1k_uranus.jpg',
    roughness: 0.9,
    tiltDeg: 97.8,
    atmosphere: { color: '#a8e6ef', intensity: 0.35, power: 3.0 },
  },
  neptune: {
    map: '1k_neptune.jpg',
    roughness: 0.9,
    tiltDeg: 28.3,
    atmosphere: { color: '#6f8cff', intensity: 0.4, power: 3.0 },
  },
  triton: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 0.9 },
  pluto: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1, tiltDeg: 57 },
  charon: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1 },
  halley: { map: '1k_moon.jpg', tintWithSwatch: true, roughness: 1 },
}

const loader = new THREE.TextureLoader()
const cache = new Map<string, Promise<THREE.Texture>>()

/** Load (once) and cache a texture from public/textures. */
export function loadTexture(file: string, srgb = true): Promise<THREE.Texture> {
  const key = `${file}|${srgb}`
  let p = cache.get(key)
  if (!p) {
    p = new Promise((resolve, reject) => {
      loader.load(
        tex(file),
        (t) => {
          if (srgb) t.colorSpace = THREE.SRGBColorSpace
          t.anisotropy = 4
          resolve(t)
        },
        undefined,
        reject,
      )
    })
    cache.set(key, p)
  }
  return p
}

/** Fresnel rim glow used for thin atmospheres. Rendered on a shell just outside the surface. */
export function makeAtmosphereMaterial(color: string, intensity: number, power: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalW;
      varying vec3 vPosW;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vPosW = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uPower;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      void main() {
        vec3 n = normalize(vNormalW);
        vec3 v = normalize(cameraPosition - vPosW);
        float rim = pow(1.0 - max(dot(n, v), 0.0), uPower);
        // Sun sits at the origin: only the lit side of the atmosphere glows
        vec3 l = normalize(-vPosW);
        float lit = smoothstep(-0.35, 0.4, dot(n, l));
        float a = rim * uIntensity * lit;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
}

/**
 * Patch a standard material so its emissive map (city lights) only shows on the night side.
 * The Sun is at the world origin.
 */
export function nightSideEmissive(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vNightPosW;\nvarying vec3 vNightNormalW;',
      )
      .replace(
        '#include <worldpos_vertex>',
        '#include <worldpos_vertex>\nvNightPosW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvNightNormalW = normalize(mat3(modelMatrix) * objectNormal);',
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vNightPosW;\nvarying vec3 vNightNormalW;',
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\nfloat nightSun = dot(normalize(vNightNormalW), normalize(-vNightPosW));\ntotalEmissiveRadiance *= smoothstep(0.12, -0.2, nightSun);',
      )
  }
  material.customProgramCacheKey = () => 'night-side-emissive'
}

/** Radial gradient sprite for the Sun's glow. */
let glowTexture: THREE.Texture | null = null
export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,240,200,1)')
  g.addColorStop(0.22, 'rgba(255,214,140,0.85)')
  g.addColorStop(0.4, 'rgba(255,170,70,0.35)')
  g.addColorStop(0.7, 'rgba(255,130,40,0.08)')
  g.addColorStop(1, 'rgba(255,120,30,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

/** RingGeometry's default UVs are planar; remap so U runs from inner to outer edge for a strip texture. */
export function makeRingGeometry(inner: number, outer: number, segments: number) {
  const geo = new THREE.RingGeometry(inner, outer, segments, 1)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const t = (v.length() - inner) / (outer - inner)
    uv.setXY(i, t, 0.5)
  }
  uv.needsUpdate = true
  return geo
}
