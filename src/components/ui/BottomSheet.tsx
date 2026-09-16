import { BODY_BY_ID, KIND_LABEL, getMoonsOf } from '../../data/bodies'
import { useObservatory, observatory } from '../../store/useObservatory'

export function BottomSheet() {
  const { selectedId, sheetExpanded } = useObservatory()
  if (!selectedId) return null
  const body = BODY_BY_ID[selectedId]
  if (!body) return null

  const moons = getMoonsOf(body.id)
  const peek = !sheetExpanded

  return (
    <div
      className={`glass safe-x overflow-hidden rounded-t-3xl border-b-0 transition-[max-height] duration-300 ease-out ${
        peek ? 'max-h-[7.5rem]' : 'max-h-[52vh]'
      }`}
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        aria-label={peek ? 'Expand details' : 'Collapse details'}
        onClick={() => observatory.setSheetExpanded(!sheetExpanded)}
        className="flex w-full flex-col items-center pt-2"
      >
        <span className="mb-2 h-1 w-10 rounded-full bg-white/25" />
      </button>

      <div className="relative px-4 pb-3">
        <button
          type="button"
          aria-label="Close"
          onClick={() => observatory.select(null)}
          className="absolute right-3 top-0 flex h-10 w-10 items-center justify-center rounded-full text-white/50 active:bg-white/10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
          {KIND_LABEL[body.kind]}
        </p>
        <h2 className="font-display pr-10 text-[1.85rem] font-medium leading-tight text-white">
          {body.name}
        </h2>
        <p className="mt-0.5 text-[12px] text-white/45">
          {body.stats[0]?.value}
          {body.stats[1] ? ` · ${body.stats[1].value}` : ''}
        </p>

        {!peek && (
          <div className="mt-3 max-h-[36vh] overflow-y-auto overscroll-contain pb-2">
            <p className="text-[14px] leading-relaxed text-white/70">{body.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {body.stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium text-white/90">{stat.value}</p>
                </div>
              ))}
            </div>

            {moons.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Moons
                </p>
                <div className="flex flex-wrap gap-2">
                  {moons.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => observatory.select(m.id)}
                      className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[13px] text-white/80 active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: m.swatch }} />
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {body.kind === 'moon' && body.parent && (
              <button
                type="button"
                onClick={() => observatory.select(body.parent!)}
                className="mt-4 text-[13px] font-medium text-white/55 underline-offset-2 active:text-white"
              >
                Back to {BODY_BY_ID[body.parent]?.name}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
