import { observatory } from '../../store/useObservatory'

export function IntroSplash() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] px-6 safe-top safe-bottom">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 7 === 0 ? 2 : 1,
              height: i % 7 === 0 ? 2 : 1,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              opacity: 0.15 + ((i * 13) % 40) / 100,
            }}
          />
        ))}
      </div>

      <div className="animate-fade-in relative z-10 flex max-w-sm flex-col items-center text-center">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
          Observatory model
        </p>
        <h1 className="font-display text-[3.25rem] font-medium leading-none tracking-tight text-white sm:text-6xl">
          Solar System
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-white/55">
          Eight planets, a comet, and the moons that keep them company — turning in time.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => observatory.enter(false)}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-6 text-[15px] font-medium text-[#0a0a0e] transition active:scale-[0.98]"
          >
            Enter the system
          </button>
          <button
            type="button"
            onClick={() => observatory.enter(true)}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 text-[15px] font-medium text-white/90 transition active:scale-[0.98]"
          >
            Guided tour
          </button>
        </div>
      </div>
    </div>
  )
}
