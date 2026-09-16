import { useEffect, useRef } from 'react'
import { PRIMARY_IDS, BODY_BY_ID, KIND_LABEL } from '../../data/bodies'
import { useObservatory, observatory } from '../../store/useObservatory'

export function WorldChips() {
  const { selectedId } = useObservatory()
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedId || !scroller.current) return
    const el = scroller.current.querySelector(`[data-id="${selectedId}"]`) as HTMLElement | null
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedId])

  return (
    <div className="safe-x">
      <div ref={scroller} className="chip-scroll no-scrollbar -mx-1 px-1 py-1">
        {PRIMARY_IDS.map((id) => {
          const body = BODY_BY_ID[id]
          const active = selectedId === id
          return (
            <button
              key={id}
              type="button"
              data-id={id}
              onClick={() => observatory.select(active ? null : id)}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition active:scale-[0.97] ${
                active
                  ? 'border-white/30 bg-white/15 text-white'
                  : 'border-white/10 bg-black/40 text-white/75 backdrop-blur-md'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: body.swatch, boxShadow: `0 0 8px ${body.swatch}88` }}
              />
              <span>{body.name}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                {KIND_LABEL[body.kind]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
