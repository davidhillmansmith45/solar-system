import type { ReactNode } from 'react'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BodyDef } from '../../data/bodies'
import { orbitRadius } from '../../data/bodies'
import { orbitalPosition, rotationAngle } from '../../lib/orbit'
import { OrbitRing } from './OrbitRing'

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

  const material = useMemo(() => {
    if (body.kind === 'star') {
      return new THREE.MeshStandardMaterial({
        color: body.swatch,
        emissive: body.swatch,
        emissiveIntensity: 1.6,
        roughness: 0.4,
        metalness: 0.1,
      })
    }
    return new THREE.MeshStandardMaterial({
      color: body.swatch,
      roughness: 0.72,
      metalness: 0.15,
      emissive: body.swatch,
      emissiveIntensity: body.kind === 'comet' ? 0.25 : 0.05,
    })
  }, [body])

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

      <mesh
        ref={mesh}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(body.id)
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <sphereGeometry args={[1, body.kind === 'star' ? 48 : 32, body.kind === 'star' ? 48 : 32]} />
        <primitive object={material} attach="material" />
      </mesh>

      {body.kind === 'star' && (
        <mesh scale={scale * 1.35}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={body.swatch} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}

      {body.id === 'saturn' && (
        <mesh rotation={[Math.PI / 2.6, 0, 0.2]} scale={scale}>
          <ringGeometry args={[1.5, 2.35, 64]} />
          <meshBasicMaterial
            color="#d4c4a0"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
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
