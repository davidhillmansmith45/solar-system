import { useEffect } from 'react'
import { useObservatory, observatory } from '../../store/useObservatory'

export function FirstRunTip() {
  const { showTip, entered } = useObservatory()

  useEffect(() => {
    if (!showTip || !entered) return
    const t = window.setTimeout(() => observatory.dismissTip(), 4500)
    return () => window.clearTimeout(t)
  }, [showTip, entered])

  if (!showTip || !entered) return null

  return (
    <button
      type="button"
      onClick={() => observatory.dismissTip()}
      className="animate-tip absolute left-1/2 top-[28%] z-40 -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-5 py-3 text-[13px] font-medium tracking-wide text-white/90 shadow-lg backdrop-blur-md"
    >
      Drag to look · Pinch to zoom
    </button>
  )
}
