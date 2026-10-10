import type { ReactNode } from 'react'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BodyDef } from '../../data/bodies'
import { orbitRadius } from '../../data/bodies'
import { orbitalPosition, rotationAngle } from '../../lib/orbit'
import { OrbitRing } from './OrbitRing'
import {
  VISUALS,
  loadTexture,
  makeAtmosphereMaterial,
  nightSideEmissive,
  getGlowTexture,
  makeRingGeometry,
} from './planetVisuals'

const noRaycast = () => null

interface Props {
  body: BodyDef
  simTimeMs: number
  compact: boolean
  showOrbit: boolean
  showLabel: boolean
  selected: boolean
  onSelect: (id: string) => void
  registerPos: (id: string, pos: THREE.Vector3) => void
  children?: ReactNode
}

function bodyScale(body: BodyDef, compact: boolean): number {
  const base = body.radius
  if (body.kind === 'star') return compact ? base * 0.85 : base * 0.7
  if (body.kind === 'moon') return Math.max(base * 0.9, 0.22)
  if (body.kind === 'comet') return Math.max(base, 0.35)
  return Math.max(base * (compact ? 0.55 : 0.45), body.kind === 'dwarf' ? 0.35 : 0.45)
}

export function CelestialBody({
  body,
  simTimeMs,
  compact,
  showOrbit,
  showLabel,
  selected,
  onSelect,
  registerPos,
  children,
}: Props) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const worldPos = useRef(new THREE.Vector3())

  const a = body.parent ? orbitRadius(body, compact) : 0
  const scale = bodyScale(body, compact)

  const visual = VISUALS[body.id]

  const material = useMemo(() => {
    if (body.kind === 'star') {
      // Placeholder until the photosphere texture arrives
      return new THREE.MeshBasicMaterial({ color: body.swatch })
    }
    return new THREE.MeshStandardMaterial({
      color: body.swatch,
      roughness: visual?.roughness ?? 0.9,
      metalness: 0,
      emissive: body.kind === 'comet' ? body.swatch : '#000000',
      emissiveIntensity: body.kind === 'comet' ? 0.25 : 0,
    })
  }, [body, visual])

  // Swap in real surface textures once loaded (keeps the flat swatch color until then)
  useEffect(() => {
    let cancelled = false
    if (body.kind === 'star') {
      loadTexture('2k_sun.jpg').then((t) => {
        if (cancelled) return
        const m = material as THREE.MeshBasicMaterial
        m.map = t
        m.color.setRGB(1.35, 1.2, 1.0)
        m.needsUpdate = true
      })
    } else if (visual?.map) {
      loadTexture(visual.map).then((t) => {
        if (cancelled) return
        const m = material as THREE.MeshStandardMaterial
        m.map = t
        if (visual.tintWithSwatch) {
          // Lift the swatch a little so the gray lunar detail doesn't darken it too much
          m.color.set(body.swatch).multiplyScalar(1.35)
        } else {
          m.color.set('#ffffff')
        }
        m.needsUpdate = true
      })
      if (body.id === 'earth') {
        loadTexture('1k_earth_nightmap.jpg').then((t) => {
          if (cancelled) return
          const m = material as THREE.MeshStandardMaterial
          nightSideEmissive(m)
          m.emissiveMap = t
          m.emissive.set('#ffd9a0')
          m.emissiveIntensity = 1.1
          m.needsUpdate = true
        })
      }
    }
    return () => {
      cancelled = true
    }
  }, [body, visual, material])

  const cloudMaterial = useMemo(() => {
    if (body.id !== 'earth') return null
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    })
  }, [body.id])

  useEffect(() => {
    if (!cloudMaterial) return
    let cancelled = false
    loadTexture('1k_earth_clouds.jpg', false).then((t) => {
      if (cancelled) return
      cloudMaterial.alphaMap = t
      cloudMaterial.opacity = 0.9
      cloudMaterial.needsUpdate = true
    })
    return () => {
      cancelled = true
    }
  }, [cloudMaterial])

  const atmosphereMaterial = useMemo(() => {
    const atm = visual?.atmosphere
    return atm ? makeAtmosphereMaterial(atm.color, atm.intensity, atm.power) : null
  }, [visual])

  const ringMaterial = useMemo(() => {
    if (body.id !== 'saturn') return null
    // Unlit so the rings stay visible when the Sun is near their plane
    return new THREE.MeshBasicMaterial({
      color: '#d4c4a0',
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [body.id])

  const ringGeometry = useMemo(
    () => (body.id === 'saturn' ? makeRingGeometry(1.5, 2.35, 128) : null),
    [body.id],
  )

  useEffect(() => {
    if (!ringMaterial) return
    let cancelled = false
    loadTexture('2k_saturn_ring_alpha.png').then((t) => {
      if (cancelled) return
      ringMaterial.map = t
      ringMaterial.color.set('#e6dccb')
      ringMaterial.opacity = 1
      ringMaterial.needsUpdate = true
    })
    return () => {
      cancelled = true
    }
  }, [ringMaterial])

  const tiltRotation: [number, number, number] = visual?.tiltX !== undefined
    ? [visual.tiltX, 0, 0]
    : [0, 0, THREE.MathUtils.degToRad(visual?.tiltDeg ?? 0)]

  const cloud = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!group.current) return
    if (body.parent && a > 0) {
      const [x, y, z] = orbitalPosition(
        simTimeMs,
        a,
        body.period,
        body.eccentricity,
        body.phase ?? 0,
        body.inclination ?? 0,
      )
      group.current.position.set(x, y, z)
    } else {
      group.current.position.set(0, 0, 0)
    }
    group.current.getWorldPosition(worldPos.current)
    registerPos(body.id, worldPos.current.clone())

    if (mesh.current && body.rotationHours) {
      mesh.current.rotation.y = rotationAngle(simTimeMs, body.rotationHours)
    }
    if (cloud.current && body.rotationHours) {
      // Clouds drift slowly relative to the surface
      cloud.current.rotation.y = rotationAngle(simTimeMs, body.rotationHours * 0.92)
    }
  })

  return (
    <group ref={group}>
      {showOrbit && body.parent && a > 0 && (
        // Ring is in parent space: render via negative — actually sibling in parent.
        // Parent SolarSystem draws rings; skip here for heliocentric bodies.
        // Moons: ring relative to this body's parent (planet), so draw at local -pos each frame is hard.
        // Drawn by parent wrapper instead.
        null
      )}

      <group rotation={tiltRotation}>
        <mesh
          ref={mesh}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(body.id)
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <sphereGeometry args={[1, body.kind === 'star' ? 64 : 48, body.kind === 'star' ? 64 : 48]} />
          <primitive object={material} attach="material" />
        </mesh>

        {cloudMaterial && (
          // Thin cloud layer hugging the surface (planet radius itself is unchanged)
          <mesh ref={cloud} scale={scale * 1.012} raycast={noRaycast}>
            <sphereGeometry args={[1, 48, 48]} />
            <primitive object={cloudMaterial} attach="material" />
          </mesh>
        )}
      </group>

      {atmosphereMaterial && (
        <mesh scale={scale * 1.04} raycast={noRaycast}>
          <sphereGeometry args={[1, 48, 48]} />
          <primitive object={atmosphereMaterial} attach="material" />
        </mesh>
      )}

      {body.kind === 'star' && (
        <sprite scale={scale * 3.6} raycast={noRaycast}>
          <spriteMaterial
            map={getGlowTexture()}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}

      {ringMaterial && ringGeometry && (
        <mesh rotation={[Math.PI / 2.6, 0, 0.2]} scale={scale} geometry={ringGeometry} raycast={noRaycast}>
          <primitive object={ringMaterial} attach="material" />
        </mesh>
      )}

      {body.kind === 'comet' && (
        <mesh position={[-scale * 2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[scale * 0.35, scale * 4, 8]} />
          <meshBasicMaterial color="#c9d4e6" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}

      {selected && (
        <mesh scale={scale * 1.55} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.18, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}

      {showLabel && (
        <Html
          center
          distanceFactor={52}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          position={[0, -scale * 1.4, 0]}
        >
          <div
            className="whitespace-nowrap text-[11px] font-medium tracking-wide text-white/80"
            style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          >
            {body.name}
          </div>
        </Html>
      )}

      {children}
    </group>
  )
}

export function BodyOrbitRing({
  body,
  compact,
  visible,
}: {
  body: BodyDef
  compact: boolean
  visible: boolean
}) {
  if (!visible || !body.parent) return null
  const a = orbitRadius(body, compact)
  if (a <= 0) return null
  return (
    <OrbitRing
      semiMajor={a}
      eccentricity={body.eccentricity}
      inclination={body.inclination ?? 0}
      opacity={body.kind === 'moon' ? 0.14 : 0.22}
    />
  )
}
