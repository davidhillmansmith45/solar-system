import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SolarSystem } from './SolarSystem'
import { observatory } from '../../store/useObservatory'

function SimClock() {
  const last = useRef(performance.now())
  useFrame(() => {
    const now = performance.now()
    const dt = Math.min(now - last.current, 100)
    last.current = now
    observatory.advanceSim(dt)
  })
  return null
}

export function SceneCanvas() {
  return (
    <div className="absolute inset-0 touch-none">
      <Canvas
        camera={{ position: [28, 18, 42], fov: 42, near: 0.1, far: 2000 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <SimClock />
        <SolarSystem />
      </Canvas>
    </div>
  )
}
