import { useMemo } from 'react'
import * as THREE from 'three'

interface Props {
  semiMajor: number
  eccentricity: number
  inclination?: number
  color?: string
  opacity?: number
}

export function OrbitRing({
  semiMajor,
  eccentricity,
  inclination = 0,
  color = '#ffffff',
  opacity = 0.22,
}: Props) {
  const line = useMemo(() => {
    const e = Math.min(Math.max(eccentricity, 0), 0.99)
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const nu = (i / segments) * Math.PI * 2
      const r = (semiMajor * (1 - e * e)) / (1 + e * Math.cos(nu))
      const x = r * Math.cos(nu)
      const z = r * Math.sin(nu)
      const y = z * Math.sin(inclination)
      const zFlat = z * Math.cos(inclination)
      pts.push(new THREE.Vector3(x, y, zFlat))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts)
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    })
    return new THREE.Line(geometry, material)
  }, [semiMajor, eccentricity, inclination, color, opacity])

  return <primitive object={line} />
}
