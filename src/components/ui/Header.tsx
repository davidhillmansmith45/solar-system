import { useObservatory, observatory, formatSimDate } from '../../store/useObservatory'

export function Header() {
  const { simTimeMs, settingsOpen } = useObservatory()

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 safe-top safe-x">
      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-auto glass rounded-2xl px-3.5 py-2.5">
          <h1 className="font-display text-[1.35rem] font-medium leading-none tracking-tight text-white">
            Solar System
          </h1>
          <p className="mt-1 text-[11px] font-medium tracking-wide text-white/50">
            {formatSimDate(simTimeMs)}
          </p>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            aria-label="Guided tour"
            onClick={() => observatory.startTour()}
            className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-white/85 active:scale-95"
          >
            <TelescopeIcon />
          </button>
          <button
            type="button"
            aria-label="Settings"
            aria-pressed={settingsOpen}
            onClick={() => observatory.setSettingsOpen(!settingsOpen)}
            className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-white/85 active:scale-95"
          >
            <GearIcon />
          </button>
        </div>
      </div>
    </header>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}

function TelescopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 19 9.5 9.5M14.5 4.5l5 2.5-6 11.5-5-2.5 6-11.5Z" strokeLinejoin="round" />
      <path d="M8 21h4M10 19v2" strokeLinecap="round" />
      <circle cx="6" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
