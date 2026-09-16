import { useSyncExternalStore, useCallback } from 'react'

export type TimeScaleId = '1day' | '1week' | '1month' | '1year' | '10year' | '100year'

export const TIME_SCALES: { id: TimeScaleId; label: string; daysPerSec: number }[] = [
  { id: '1day', label: '1 day', daysPerSec: 1 },
  { id: '1week', label: '1 week', daysPerSec: 7 },
  { id: '1month', label: '1 month', daysPerSec: 30 },
  { id: '1year', label: '1 year', daysPerSec: 365.25 },
  { id: '10year', label: '10 yr', daysPerSec: 3652.5 },
  { id: '100year', label: '100 yr', daysPerSec: 36525 },
]

const PREFS_KEY = 'solar-observatory-prefs'
const TIP_KEY = 'solar-observatory-tip-seen'

interface Prefs {
  showOrbits: boolean
  showLabels: boolean
  showMoons: boolean
  compact: boolean
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<Prefs>
      return {
        showOrbits: p.showOrbits ?? true,
        showLabels: p.showLabels ?? true,
        showMoons: p.showMoons ?? true,
        compact: p.compact ?? true,
      }
    }
  } catch {
    /* ignore */
  }
  return { showOrbits: true, showLabels: true, showMoons: true, compact: true }
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export function tipSeen(): boolean {
  try {
    return localStorage.getItem(TIP_KEY) === '1'
  } catch {
    return false
  }
}

export function markTipSeen() {
  try {
    localStorage.setItem(TIP_KEY, '1')
  } catch {
    /* ignore */
  }
}

/** Always real today at midnight local — never far-future. */
export function todayDate(): Date {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  return d
}

interface State {
  entered: boolean
  selectedId: string | null
  sheetExpanded: boolean
  paused: boolean
  timeScale: TimeScaleId
  /** Simulation Julian-ish date (ms since epoch) — always starts at today */
  simTimeMs: number
  showOrbits: boolean
  showLabels: boolean
  showMoons: boolean
  /** Theatre/compact: compact DEFAULT on (true = compact) */
  compact: boolean
  settingsOpen: boolean
  tourActive: boolean
  tourIndex: number
  showTip: boolean
  focusRequest: { id: string; token: number } | null
}

const prefs = loadPrefs()

let state: State = {
  entered: false,
  selectedId: null,
  sheetExpanded: false,
  paused: false,
  timeScale: '1month',
  simTimeMs: todayDate().getTime(),
  showOrbits: prefs.showOrbits,
  showLabels: prefs.showLabels,
  showMoons: prefs.showMoons,
  compact: prefs.compact,
  settingsOpen: false,
  tourActive: false,
  tourIndex: 0,
  showTip: false,
  focusRequest: null,
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function set(partial: Partial<State>) {
  state = { ...state, ...partial }
  emit()
}

function persistVisualPrefs() {
  savePrefs({
    showOrbits: state.showOrbits,
    showLabels: state.showLabels,
    showMoons: state.showMoons,
    compact: state.compact,
  })
}

export const observatory = {
  get: () => state,
  subscribe(cb: () => void) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
  enter(startTour = false) {
    set({
      entered: true,
      showTip: !tipSeen(),
      ...(startTour
        ? { tourActive: true, tourIndex: 0 }
        : {}),
    })
    if (startTour) {
      observatory.focusBody('sun')
      set({ selectedId: 'sun', sheetExpanded: true })
    }
  },
  select(id: string | null) {
    set({
      selectedId: id,
      sheetExpanded: id !== null,
      settingsOpen: false,
    })
    if (id) observatory.focusBody(id)
  },
  setSheetExpanded(v: boolean) {
    set({ sheetExpanded: v })
  },
  togglePaused() {
    set({ paused: !state.paused })
  },
  setPaused(v: boolean) {
    set({ paused: v })
  },
  setTimeScale(id: TimeScaleId) {
    set({ timeScale: id })
  },
  advanceSim(deltaMs: number) {
    if (state.paused || deltaMs === 0) return
    const scale = TIME_SCALES.find((t) => t.id === state.timeScale)!
    const days = (deltaMs / 1000) * scale.daysPerSec
    set({ simTimeMs: state.simTimeMs + days * 86_400_000 })
  },
  resetToToday() {
    set({ simTimeMs: todayDate().getTime(), settingsOpen: false })
  },
  toggleOrbits() {
    set({ showOrbits: !state.showOrbits })
    persistVisualPrefs()
  },
  toggleLabels() {
    set({ showLabels: !state.showLabels })
    persistVisualPrefs()
  },
  toggleMoons() {
    set({ showMoons: !state.showMoons })
    persistVisualPrefs()
  },
  toggleCompact() {
    set({ compact: !state.compact })
    persistVisualPrefs()
  },
  setSettingsOpen(v: boolean) {
    set({ settingsOpen: v })
  },
  startTour() {
    set({
      tourActive: true,
      tourIndex: 0,
      settingsOpen: false,
      entered: true,
      selectedId: 'sun',
      sheetExpanded: true,
    })
    observatory.focusBody('sun')
  },
  nextTourStop(stops: readonly string[]) {
    const next = state.tourIndex + 1
    if (next >= stops.length) {
      set({ tourActive: false, tourIndex: 0 })
      return
    }
    const id = stops[next]
    set({ tourIndex: next, selectedId: id, sheetExpanded: true })
    observatory.focusBody(id)
  },
  endTour() {
    set({ tourActive: false })
  },
  dismissTip() {
    markTipSeen()
    set({ showTip: false })
  },
  focusBody(id: string) {
    set({
      focusRequest: { id, token: (state.focusRequest?.token ?? 0) + 1 },
    })
  },
}

export function useObservatory() {
  return useSyncExternalStore(observatory.subscribe, observatory.get, observatory.get)
}

export function useObservatoryActions() {
  return observatory
}

export function formatSimDate(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function useAction<T extends (...args: never[]) => void>(fn: T): T {
  return useCallback(fn, [fn]) as T
}
