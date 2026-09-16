/** Approximate orbital position from period + eccentricity (Keplerian, mean anomaly). */

const MS_PER_DAY = 86_400_000
/** Reference epoch: 2000-01-01 noon UTC */
const EPOCH_MS = Date.UTC(2000, 0, 1, 12)

export function meanAnomaly(
  simTimeMs: number,
  periodDays: number,
  phase = 0,
): number {
  if (!periodDays) return phase
  const days = (simTimeMs - EPOCH_MS) / MS_PER_DAY
  const n = (Math.PI * 2) / Math.abs(periodDays)
  const sign = periodDays < 0 ? -1 : 1
  return phase + sign * n * days
}

/** Solve Kepler’s equation for eccentric anomaly (radians). */
export function eccentricAnomaly(M: number, e: number): number {
  let E = M
  for (let i = 0; i < 8; i++) {
    E = M + e * Math.sin(E)
  }
  return E
}

export function trueAnomaly(E: number, e: number): number {
  const cosE = Math.cos(E)
  const sinE = Math.sin(E)
  return Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e)
}

export function orbitalPosition(
  simTimeMs: number,
  semiMajor: number,
  periodDays: number,
  eccentricity: number,
  phase = 0,
  inclination = 0,
): [number, number, number] {
  if (!semiMajor || !periodDays) return [0, 0, 0]
  const M = meanAnomaly(simTimeMs, periodDays, phase)
  const e = Math.min(Math.max(eccentricity, 0), 0.99)
  const E = eccentricAnomaly(M, e)
  const nu = trueAnomaly(E, e)
  const r = semiMajor * (1 - e * Math.cos(E))
  const x = r * Math.cos(nu)
  const z = r * Math.sin(nu)
  const y = z * Math.sin(inclination)
  const zFlat = z * Math.cos(inclination)
  return [x, y, zFlat]
}

export function rotationAngle(simTimeMs: number, rotationHours: number): number {
  if (!rotationHours) return 0
  const hours = (simTimeMs - EPOCH_MS) / 3_600_000
  return (hours / rotationHours) * Math.PI * 2
}
