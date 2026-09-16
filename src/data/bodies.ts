export type BodyKind = 'star' | 'planet' | 'moon' | 'dwarf' | 'comet'

export interface Stat {
  label: string
  value: string
}

export interface BodyDef {
  id: string
  name: string
  kind: BodyKind
  parent: string | null
  description: string
  stats: Stat[]
  /** Visual radius in scene units (Earth = 1 base, exaggerated) */
  radius: number
  /** Real AU from parent (for theatre scale) */
  au: number
  /** Compact orbit radius in scene units */
  orbitCompact: number
  /** Orbital period in Earth days (negative = retrograde) */
  period: number
  /** Sidereal rotation in hours (negative = retrograde) */
  rotationHours: number
  eccentricity: number
  swatch: string
  /** Mean anomaly offset at J2000-ish epoch (radians) for variety */
  phase?: number
  /** Inclination in radians for visual interest */
  inclination?: number
}

export const SUN: BodyDef = {
  id: 'sun',
  name: 'Sun',
  kind: 'star',
  parent: null,
  description:
    'A G2V yellow dwarf holding 99.8% of the solar system’s mass. Its core fuses hydrogen into helium at 15 million °C — the furnace that lights every world here.',
  stats: [
    { label: 'Type', value: 'G2V dwarf' },
    { label: 'Diameter', value: '1.39 million km' },
    { label: 'Mass', value: '333,000 Earths' },
    { label: 'Surface', value: '5,500 °C' },
    { label: 'Core', value: '15 million °C' },
    { label: 'Age', value: '4.6 billion yr' },
  ],
  radius: 4.2,
  au: 0,
  orbitCompact: 0,
  period: 0,
  rotationHours: 609.12,
  eccentricity: 0,
  swatch: '#f5c542',
}

/** Catalog cleaned from phone-first brief (first 6 stats each; Halley keeps all 6). */
export const BODIES: BodyDef[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    kind: 'planet',
    parent: 'sun',
    description:
      'The smallest planet, and the fastest. Days last longer than its year. With almost no air, the ground swings from furnace to frost in a single rotation.',
    stats: [
      { label: 'Distance', value: '0.39 AU' },
      { label: 'Diameter', value: '4,879 km' },
      { label: 'Day', value: '59 Earth days' },
      { label: 'Year', value: '88 Earth days' },
      { label: 'Moons', value: 'None' },
      { label: 'Tilt', value: '0.03°' },
    ],
    radius: 0.38,
    au: 0.387,
    orbitCompact: 12.2,
    period: 87.969,
    rotationHours: 1407.6,
    eccentricity: 0.2056,
    swatch: '#9a9590',
    phase: 0.4,
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: 'planet',
    parent: 'sun',
    description:
      'The hottest world in the system. A crushing CO₂ sky and clouds of sulfuric acid trap heat at 465 °C. It spins backwards, and slower than it orbits.',
    stats: [
      { label: 'Distance', value: '0.72 AU' },
      { label: 'Diameter', value: '12,104 km' },
      { label: 'Day', value: '243 Earth days' },
      { label: 'Year', value: '225 Earth days' },
      { label: 'Moons', value: 'None' },
      { label: 'Pressure', value: '92× Earth' },
    ],
    radius: 0.95,
    au: 0.723,
    orbitCompact: 16.8,
    period: 224.701,
    rotationHours: -5832.5,
    eccentricity: 0.0067,
    swatch: '#e6c99a',
    phase: 1.1,
  },
  {
    id: 'earth',
    name: 'Earth',
    kind: 'planet',
    parent: 'sun',
    description:
      'Liquid water, a magnetic shield, and a breathable sky. One large moon steadies the tilt that gives us seasons. Everything else in this model is, so far, silent.',
    stats: [
      { label: 'Distance', value: '1.00 AU' },
      { label: 'Diameter', value: '12,756 km' },
      { label: 'Day', value: '23 h 56 m' },
      { label: 'Year', value: '365.25 days' },
      { label: 'Moons', value: '1' },
      { label: 'Tilt', value: '23.4°' },
    ],
    radius: 1.0,
    au: 1.0,
    orbitCompact: 22.6,
    period: 365.256,
    rotationHours: 23.934,
    eccentricity: 0.0167,
    swatch: '#6ea4d4',
    phase: 2.0,
  },
  {
    id: 'moon',
    name: 'Moon',
    kind: 'moon',
    parent: 'earth',
    description:
      'Born from a collision early in Earth’s history. Tidally locked — the same face always looks home. Its pull raises the seas and has slowed our day.',
    stats: [
      { label: 'Distance', value: '384,400 km' },
      { label: 'Diameter', value: '3,475 km' },
      { label: 'Orbit', value: '27.3 days' },
      { label: 'Rotation', value: 'Tidally locked' },
      { label: 'Gravity', value: '0.17 g' },
      { label: 'Origin', value: 'Giant impact' },
    ],
    radius: 0.27,
    au: 0.00257,
    orbitCompact: 3.15,
    period: 27.322,
    rotationHours: 655.7,
    eccentricity: 0.0549,
    swatch: '#c5c1b8',
    phase: 0.8,
  },
  {
    id: 'mars',
    name: 'Mars',
    kind: 'planet',
    parent: 'sun',
    description:
      'Iron dust, polar ice, and the tallest volcano in the solar system. Riverbeds and minerals say water once pooled here. Its thin air is almost all carbon dioxide.',
    stats: [
      { label: 'Distance', value: '1.52 AU' },
      { label: 'Diameter', value: '6,792 km' },
      { label: 'Day', value: '24 h 37 m' },
      { label: 'Year', value: '687 Earth days' },
      { label: 'Moons', value: '2' },
      { label: 'Tilt', value: '25.2°' },
    ],
    radius: 0.53,
    au: 1.524,
    orbitCompact: 29.4,
    period: 686.98,
    rotationHours: 24.623,
    eccentricity: 0.0934,
    swatch: '#c07a52',
    phase: 3.2,
  },
  {
    id: 'ceres',
    name: 'Ceres',
    kind: 'dwarf',
    parent: 'sun',
    description:
      'A dwarf planet of rock and ice between Mars and Jupiter. Bright salt deposits hint at a buried ocean that once leaked to the surface.',
    stats: [
      { label: 'Distance', value: '2.77 AU' },
      { label: 'Diameter', value: '940 km' },
      { label: 'Day', value: '9.1 hours' },
      { label: 'Year', value: '4.6 Earth years' },
      { label: 'Class', value: 'Dwarf planet' },
      { label: 'Discovered', value: '1801' },
    ],
    radius: 0.16,
    au: 2.77,
    orbitCompact: 36.2,
    period: 1680.5,
    rotationHours: 9.07,
    eccentricity: 0.0785,
    swatch: '#8a847c',
    phase: 4.1,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: 'planet',
    parent: 'sun',
    description:
      'More mass than the rest of the planets combined. The Great Red Spot has raged for centuries. Its radiation belts would kill an unprotected visitor in hours.',
    stats: [
      { label: 'Distance', value: '5.20 AU' },
      { label: 'Diameter', value: '142,984 km' },
      { label: 'Day', value: '9 h 56 m' },
      { label: 'Year', value: '11.9 Earth years' },
      { label: 'Moons', value: '95+' },
      { label: 'Mass', value: '318 Earths' },
    ],
    radius: 3.55,
    au: 5.203,
    orbitCompact: 50.0,
    period: 4332.59,
    rotationHours: 9.925,
    eccentricity: 0.0489,
    swatch: '#d4b48a',
    phase: 5.0,
  },
  {
    id: 'io',
    name: 'Io',
    kind: 'moon',
    parent: 'jupiter',
    description:
      'Jupiter’s tides knead Io so violently that sulfur volcanoes never stop. Its surface is a fresh crust of yellow, orange, and black lava.',
    stats: [
      { label: 'Distance', value: '422,000 km' },
      { label: 'Diameter', value: '3,643 km' },
      { label: 'Orbit', value: '1.77 days' },
      { label: 'Volcanoes', value: '400+' },
      { label: 'Discovered', value: '1610 · Galileo' },
      { label: 'Class', value: 'Galilean moon' },
    ],
    radius: 0.29,
    au: 0.00282,
    orbitCompact: 5.35,
    period: 1.769,
    rotationHours: 42.46,
    eccentricity: 0.0041,
    swatch: '#e8d36a',
    phase: 0.2,
  },
  {
    id: 'europa',
    name: 'Europa',
    kind: 'moon',
    parent: 'jupiter',
    description:
      'A cracked white world. Under kilometers of ice sits a global ocean that may hold more water than Earth — one of the best chances for life beyond home.',
    stats: [
      { label: 'Distance', value: '671,000 km' },
      { label: 'Diameter', value: '3,122 km' },
      { label: 'Orbit', value: '3.55 days' },
      { label: 'Ocean', value: 'Likely, global' },
      { label: 'Discovered', value: '1610 · Galileo' },
      { label: 'Class', value: 'Galilean moon' },
    ],
    radius: 0.25,
    au: 0.00449,
    orbitCompact: 6.55,
    period: 3.551,
    rotationHours: 85.22,
    eccentricity: 0.009,
    swatch: '#d8d0c4',
    phase: 1.5,
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    kind: 'moon',
    parent: 'jupiter',
    description:
      'Bigger than Mercury. Ice and rock in layers, a faint aurora, and the only moon known to generate its own magnetosphere.',
    stats: [
      { label: 'Distance', value: '1.07 million km' },
      { label: 'Diameter', value: '5,268 km' },
      { label: 'Orbit', value: '7.15 days' },
      { label: 'Field', value: 'Intrinsic magnetic' },
      { label: 'Discovered', value: '1610 · Galileo' },
      { label: 'Class', value: 'Galilean moon' },
    ],
    radius: 0.41,
    au: 0.00716,
    orbitCompact: 8.05,
    period: 7.155,
    rotationHours: 171.7,
    eccentricity: 0.0013,
    swatch: '#b0a698',
    phase: 2.8,
  },
  {
    id: 'callisto',
    name: 'Callisto',
    kind: 'moon',
    parent: 'jupiter',
    description:
      'An ancient, pocked ice-rock world that never quite melted. It sits outside Jupiter’s worst radiation, a quiet archive of bombardment.',
    stats: [
      { label: 'Distance', value: '1.88 million km' },
      { label: 'Diameter', value: '4,821 km' },
      { label: 'Orbit', value: '16.7 days' },
      { label: 'Surface', value: 'Oldest, cratered' },
      { label: 'Discovered', value: '1610 · Galileo' },
      { label: 'Class', value: 'Galilean moon' },
    ],
    radius: 0.38,
    au: 0.0126,
    orbitCompact: 10.15,
    period: 16.689,
    rotationHours: 400.5,
    eccentricity: 0.0074,
    swatch: '#7a736c',
    phase: 4.0,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    kind: 'planet',
    parent: 'sun',
    description:
      'Light enough that it would float in a sea large enough to hold it. The rings are ice and dust, kept in fine lanes by shepherd moons. Titan, its largest, hides methane lakes.',
    stats: [
      { label: 'Distance', value: '9.54 AU' },
      { label: 'Diameter', value: '120,536 km' },
      { label: 'Day', value: '10 h 39 m' },
      { label: 'Year', value: '29.5 Earth years' },
      { label: 'Moons', value: '146+' },
      { label: 'Rings', value: 'Ice & dust' },
    ],
    radius: 3.15,
    au: 9.537,
    orbitCompact: 70.0,
    period: 10759.22,
    rotationHours: 10.656,
    eccentricity: 0.0565,
    swatch: '#e6d3a8',
    phase: 0.9,
  },
  {
    id: 'titan',
    name: 'Titan',
    kind: 'moon',
    parent: 'saturn',
    description:
      'The only moon with a dense atmosphere. Rivers of liquid methane cut through water-ice highlands. Under the crust, another ocean is likely.',
    stats: [
      { label: 'Distance', value: '1.22 million km' },
      { label: 'Diameter', value: '5,149 km' },
      { label: 'Orbit', value: '16 days' },
      { label: 'Air', value: 'Nitrogen, dense' },
      { label: 'Lakes', value: 'Liquid methane' },
      { label: 'Discovered', value: '1655 · Huygens' },
    ],
    radius: 0.4,
    au: 0.00817,
    orbitCompact: 8.35,
    period: 15.945,
    rotationHours: 382.7,
    eccentricity: 0.0288,
    swatch: '#d4a46a',
    phase: 1.2,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    kind: 'planet',
    parent: 'sun',
    description:
      'A collision long ago left Uranus spinning at 98° — its poles take turns facing the sun for decades. Methane in the haze makes it pale cyan. Thin dark rings circle the equator.',
    stats: [
      { label: 'Distance', value: '19.2 AU' },
      { label: 'Diameter', value: '51,118 km' },
      { label: 'Day', value: '17.2 hours' },
      { label: 'Year', value: '84 Earth years' },
      { label: 'Moons', value: '28' },
      { label: 'Tilt', value: '97.8°' },
    ],
    radius: 1.95,
    au: 19.19,
    orbitCompact: 90.0,
    period: 30688.5,
    rotationHours: -17.24,
    eccentricity: 0.0457,
    swatch: '#9fd4d8',
    phase: 2.4,
    inclination: 0.05,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    kind: 'planet',
    parent: 'sun',
    description:
      'Found on paper before it was seen — its pull on Uranus gave it away. Supersonic winds circle a deep blue methane atmosphere. Triton orbits backwards, a captured relic.',
    stats: [
      { label: 'Distance', value: '30.1 AU' },
      { label: 'Diameter', value: '49,528 km' },
      { label: 'Day', value: '16.1 hours' },
      { label: 'Year', value: '165 Earth years' },
      { label: 'Moons', value: '16' },
      { label: 'Winds', value: '2,000 km/h' },
    ],
    radius: 1.88,
    au: 30.07,
    orbitCompact: 108.0,
    period: 60195.0,
    rotationHours: 16.11,
    eccentricity: 0.0113,
    swatch: '#4a73c8',
    phase: 3.7,
  },
  {
    id: 'triton',
    name: 'Triton',
    kind: 'moon',
    parent: 'neptune',
    description:
      'Likely stolen from the Kuiper belt. Geysers of nitrogen rise from a pink-white crust. Its retrograde path is slowly decaying — one day Neptune will tear it apart.',
    stats: [
      { label: 'Distance', value: '355,000 km' },
      { label: 'Diameter', value: '2,707 km' },
      { label: 'Orbit', value: '5.9 days, retrograde' },
      { label: 'Surface', value: '−235 °C' },
      { label: 'Geysers', value: 'Nitrogen' },
      { label: 'Origin', value: 'Captured KBO' },
    ],
    radius: 0.22,
    au: 0.00237,
    orbitCompact: 4.85,
    period: -5.877,
    rotationHours: -141.0,
    eccentricity: 0.00002,
    swatch: '#d4c8c0',
    phase: 0.5,
  },
  {
    id: 'pluto',
    name: 'Pluto',
    kind: 'dwarf',
    parent: 'sun',
    description:
      'Reclassified as a dwarf planet in 2006, still every bit a world. Nitrogen glaciers flow across the bright heart of Tombaugh Regio. Charon is so large the two orbit a point in empty space.',
    stats: [
      { label: 'Distance', value: '39.5 AU' },
      { label: 'Diameter', value: '2,377 km' },
      { label: 'Day', value: '6.4 Earth days' },
      { label: 'Year', value: '248 Earth years' },
      { label: 'Moons', value: '5' },
      { label: 'Class', value: 'Dwarf planet' },
    ],
    radius: 0.19,
    au: 39.48,
    orbitCompact: 124.0,
    period: 90560.0,
    rotationHours: -153.3,
    eccentricity: 0.2488,
    swatch: '#d8b8a0',
    phase: 5.5,
    inclination: 0.3,
  },
  {
    id: 'charon',
    name: 'Charon',
    kind: 'moon',
    parent: 'pluto',
    description:
      'Half Pluto’s size. The pair are tidally locked — each keeps one face to the other. A reddish north polar cap is stained by gases that escaped Pluto.',
    stats: [
      { label: 'Distance', value: '19,640 km' },
      { label: 'Diameter', value: '1,212 km' },
      { label: 'Orbit', value: '6.4 days' },
      { label: 'Lock', value: 'Mutual' },
      { label: 'Discovered', value: '1978' },
      { label: 'Mass vs Pluto', value: '1/8' },
    ],
    radius: 0.1,
    au: 0.000131,
    orbitCompact: 1.35,
    period: 6.387,
    rotationHours: 153.3,
    eccentricity: 0.0002,
    swatch: '#9a9088',
    phase: 0.0,
  },
  {
    id: 'halley',
    name: 'Halley',
    kind: 'comet',
    parent: 'sun',
    description:
      'A dirty snowball on a 75-year loop. Perihelion skims inside Venus; aphelion fades past Neptune. The tail always points away from the sun — ice boiled into a wind of light.',
    stats: [
      { label: 'Period', value: '75.3 years' },
      { label: 'Perihelion', value: '0.59 AU' },
      { label: 'Aphelion', value: '35.1 AU' },
      { label: 'Inclination', value: '162° · retrograde' },
      { label: 'Next visit', value: '2061' },
      { label: 'Nucleus', value: '15 × 8 km' },
    ],
    radius: 0.28,
    au: 17.834,
    orbitCompact: 82.0,
    period: 27509.0,
    rotationHours: 52.8,
    eccentricity: 0.967,
    swatch: '#c9d4e6',
    phase: 1.8,
    inclination: 2.8,
  },
]

export const ALL_BODIES: BodyDef[] = [SUN, ...BODIES]

export const BODY_BY_ID: Record<string, BodyDef> = Object.fromEntries(
  ALL_BODIES.map((b) => [b.id, b]),
)

/** Primary chip / list order (Sun + planets/dwarfs/comet; moons via sheet). */
export const PRIMARY_IDS = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'ceres',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'halley',
] as const

export const TOUR_STOPS = [
  'sun',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'neptune',
  'pluto',
  'halley',
] as const

export const KIND_LABEL: Record<BodyKind, string> = {
  star: 'STAR',
  planet: 'PLANET',
  moon: 'MOON',
  dwarf: 'DWARF',
  comet: 'COMET',
}

export function getMoonsOf(parentId: string): BodyDef[] {
  return BODIES.filter((b) => b.kind === 'moon' && b.parent === parentId)
}

export function orbitRadius(body: BodyDef, compact: boolean): number {
  if (!body.parent) return 0
  if (body.kind === 'moon') {
    return compact ? body.orbitCompact : Math.max(body.au * 1800, body.orbitCompact * 0.85)
  }
  if (compact) return body.orbitCompact
  // Theatre: soft log-ish AU mapping so outer worlds stay reachable
  return 10 + Math.pow(body.au, 0.72) * 18
}
