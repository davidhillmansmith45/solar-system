import { useObservatory, observatory } from '../../store/useObservatory'

export function SettingsPanel() {
  const s = useObservatory()
  if (!s.settingsOpen) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 safe-top safe-x pt-[4.5rem]">
      <div className="pointer-events-auto ml-auto w-full max-w-[280px] animate-fade-in">
        <div className="glass rounded-2xl p-3 shadow-2xl">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Display
          </p>
          <Toggle
            label="Orbits"
            on={s.showOrbits}
            onToggle={() => observatory.toggleOrbits()}
          />
          <Toggle
            label="Labels"
            on={s.showLabels}
            onToggle={() => observatory.toggleLabels()}
          />
          <Toggle
            label="Moons"
            on={s.showMoons}
            onToggle={() => observatory.toggleMoons()}
          />
          <Toggle
            label="Theatre scale"
            on={!s.compact}
            onToggle={() => observatory.toggleCompact()}
            hint={s.compact ? 'Compact on' : 'Theatre on'}
          />

          <div className="my-2 border-t border-white/10" />

          <button
            type="button"
            onClick={() => observatory.startTour()}
            className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-[14px] font-medium text-white/90 active:bg-white/8"
          >
            Guided tour
          </button>
          <button
            type="button"
            onClick={() => observatory.resetToToday()}
            className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-[14px] font-medium text-white/90 active:bg-white/8"
          >
            <RefreshIcon />
            Reset to today
          </button>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  on,
  onToggle,
  hint,
}: {
  label: string
  on: boolean
  onToggle: () => void
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 active:bg-white/5"
    >
      <span className="text-[14px] font-medium text-white/90">
        {label}
        {hint ? <span className="ml-2 text-[11px] text-white/35">{hint}</span> : null}
      </span>
      <span
        className={`relative h-7 w-12 rounded-full transition ${on ? 'bg-white/90' : 'bg-white/15'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full shadow transition ${
            on ? 'left-5 bg-[#0a0a0e]' : 'left-0.5 bg-white/80'
          }`}
        />
      </span>
    </button>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 0 1 13.5-5.7M20 12a8 8 0 0 1-13.5 5.7" strokeLinecap="round" />
      <path d="M17 3v4h4M7 21v-4H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
