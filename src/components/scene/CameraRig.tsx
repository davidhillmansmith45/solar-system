import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  selectedId: string | null
  focusRequest: { id: string; token: number } | null
  getPosition: (id: string) => THREE.Vector3 | undefined
  compact: boolean
}

type ControlsApi = {
  target: THREE.Vector3
  update: () => void
}

export function CameraRig({ selectedId, focusRequest, getPosition, compact }: Props) {
  const controls = useRef<ControlsApi | null>(null)
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))
  const lastToken = useRef(0)
  const animating = useRef(false)
  const animStart = useRef(0)
  const fromPos = useRef(new THREE.Vector3())
  const toPos = useRef(new THREE.Vector3())
  const fromTarget = useRef(new THREE.Vector3())
  const toTarget = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!focusRequest || focusRequest.token === lastToken.current) return
    lastToken.current = focusRequest.token
    const pos = getPosition(focusRequest.id)
    const aim = pos?.clone() ?? new THREE.Vector3(0, 0, 0)

    const dist = focusRequest.id === 'sun' ? (compact ? 55 : 70) : compact ? 14 : 18
    const offset = new THREE.Vector3(dist * 0.55, dist * 0.35, dist * 0.85)
    toTarget.current.copy(aim)
    toPos.current.copy(aim).add(offset)
    fromPos.current.copy(camera.position)
    fromTarget.current.copy(target.current)
    animStart.current = performance.now()
    animating.current = true
  }, [focusRequest, getPosition, camera, compact])

  useFrame(() => {
    if (selectedId) {
      const p = getPosition(selectedId)
      if (p) desiredTarget.current.lerp(p, 0.08)
    }

    if (animating.current) {
      const t = Math.min(1, (performance.now() - animStart.current) / 900)
      const e = 1 - Math.pow(1 - t, 3)
      camera.position.lerpVectors(fromPos.current, toPos.current, e)
      target.current.lerpVectors(fromTarget.current, toTarget.current, e)
      if (controls.current) {
        controls.current.target.copy(target.current)
        controls.current.update()
      }
      if (t >= 1) animating.current = false
      return
    }

    target.current.lerp(desiredTarget.current, 0.06)
    if (controls.current) {
      controls.current.target.lerp(target.current, 0.12)
      controls.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controls as never}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={compact ? 6 : 8}
      maxDistance={compact ? 220 : 320}
      maxPolarAngle={Math.PI * 0.92}
      makeDefault
    />
  )
}
