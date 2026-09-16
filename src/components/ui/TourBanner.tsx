import { TOUR_STOPS, BODY_BY_ID } from '../../data/bodies'
import { useObservatory, observatory } from '../../store/useObservatory'

export function TourBanner() {
  const { tourActive, tourIndex } = useObservatory()
  if (!tourActive) return null
  const id = TOUR_STOPS[tourIndex]
  const name = BODY_BY_ID[id]?.name ?? ''
  const isLast = tourIndex >= TOUR_STOPS.length - 1

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-35 safe-top safe-x pt-[4.6rem]">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-white/15 bg-black/60 px-3 py-2.5 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Guided tour · {tourIndex + 1}/{TOUR_STOPS.length}
          </p>
          <p className="truncate font-display text-lg text-white">{name}</p>
        </div>
        <button
          type="button"
          onClick={() => observatory.endTour()}
          className="flex h-10 items-center rounded-xl px-3 text-[12px] text-white/50 active:bg-white/10"
        >
          End
        </button>
        <button
          type="button"
          onClick={() => observatory.nextTourStop(TOUR_STOPS)}
          className="flex h-10 items-center rounded-xl bg-white px-3.5 text-[13px] font-medium text-[#0a0a0e] active:scale-95"
        >
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  )
}
