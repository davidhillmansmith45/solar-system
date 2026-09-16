import { TIME_SCALES, useObservatory, observatory, formatSimDate } from '../../store/useObservatory'

export function TimeBar() {
  const { paused, timeScale, simTimeMs } = useObservatory()
  const scaleLabel = TIME_SCALES.find((t) => t.id === timeScale)?.label ?? ''

  return (
    <div className="glass safe-x rounded-2xl px-2.5 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={paused ? 'Play' : 'Pause'}
          onClick={() => observatory.togglePaused()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white active:scale-95"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2 px-0.5">
            <span className="truncate text-[12px] font-medium text-white/80">
              {formatSimDate(simTimeMs)}
            </span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {paused ? 'Paused' : `${scaleLabel} / sec`}
            </span>
          </div>
          <div className="chip-scroll no-scrollbar mt-1.5 gap-1.5">
            {TIME_SCALES.map((t) => {
              const active = timeScale === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => observatory.setTimeScale(t.id)}
                  className={`min-h-9 rounded-full px-2.5 text-[11px] font-medium whitespace-nowrap transition active:scale-95 ${
                    active
                      ? 'bg-white text-[#0a0a0e]'
                      : 'bg-white/8 text-white/65'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}
