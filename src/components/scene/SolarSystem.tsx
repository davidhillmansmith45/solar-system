import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Stars } from '@react-three/drei'
import { BODIES, SUN, getMoonsOf } from '../../data/bodies'
import { CelestialBody, BodyOrbitRing } from './CelestialBody'
import { useObservatory, observatory } from '../../store/useObservatory'
import { CameraRig } from './CameraRig'

export function SolarSystem() {
  const s = useObservatory()
  const positions = useRef<Map<string, THREE.Vector3>>(new Map())

  const registerPos = useCallback((id: string, pos: THREE.Vector3) => {
    positions.current.set(id, pos)
  }, [])

  const onSelect = useCallback((id: string) => {
    observatory.select(id)
  }, [])

  const getPosition = useCallback((id: string) => positions.current.get(id), [])

  const heliocentric = BODIES.filter((b) => b.parent === 'sun')

  return (
    <>
      <color attach="background" args={['#050508']} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 0, 0]} intensity={2.8} distance={0} decay={0.35} color="#fff2cc" />
      <Stars radius={400} depth={80} count={4500} factor={3.2} saturation={0} fade speed={0.4} />

      {heliocentric.map((b) => (
        <BodyOrbitRing key={`orb-${b.id}`} body={b} compact={s.compact} visible={s.showOrbits} />
      ))}

      <CelestialBody
        body={SUN}
        simTimeMs={s.simTimeMs}
        compact={s.compact}
        showOrbit={false}
        showLabel={s.showLabels}
        selected={s.selectedId === 'sun'}
        onSelect={onSelect}
        registerPos={registerPos}
      >
        {heliocentric.map((planet) => {
          const moons = getMoonsOf(planet.id)
          return (
            <CelestialBody
              key={planet.id}
              body={planet}
              simTimeMs={s.simTimeMs}
              compact={s.compact}
              showOrbit={false}
              showLabel={s.showLabels}
              selected={s.selectedId === planet.id}
              onSelect={onSelect}
              registerPos={registerPos}
            >
              {s.showMoons &&
                moons.map((moon) => (
                  <group key={`mog-${moon.id}`}>
                    <BodyOrbitRing body={moon} compact={s.compact} visible={s.showOrbits} />
                    <CelestialBody
                      body={moon}
                      simTimeMs={s.simTimeMs}
                      compact={s.compact}
                      showOrbit={false}
                      showLabel={s.showLabels}
                      selected={s.selectedId === moon.id}
                      onSelect={onSelect}
                      registerPos={registerPos}
                    />
                  </group>
                ))}
            </CelestialBody>
          )
        })}
      </CelestialBody>

      <CameraRig
        selectedId={s.selectedId}
        focusRequest={s.focusRequest}
        getPosition={getPosition}
        compact={s.compact}
      />
    </>
  )
}
