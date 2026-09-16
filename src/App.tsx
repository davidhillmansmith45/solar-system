import { useObservatory } from './store/useObservatory'
import { SceneCanvas } from './components/scene/SceneCanvas'
import { IntroSplash } from './components/ui/IntroSplash'
import { Header } from './components/ui/Header'
import { WorldChips } from './components/ui/WorldChips'
import { BottomSheet } from './components/ui/BottomSheet'
import { TimeBar } from './components/ui/TimeBar'
import { SettingsPanel } from './components/ui/SettingsPanel'
import { FirstRunTip } from './components/ui/FirstRunTip'
import { TourBanner } from './components/ui/TourBanner'

export default function App() {
  const { entered } = useObservatory()

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050508]">
      <SceneCanvas />

      {!entered && <IntroSplash />}

      {entered && (
        <>
          <Header />
          <SettingsPanel />
          <TourBanner />
          <FirstRunTip />

          {/* Bottom chrome: chips → sheet → time bar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col gap-2 safe-bottom">
            <div className="pointer-events-auto">
              <WorldChips />
            </div>
            <div className="pointer-events-auto">
              <BottomSheet />
            </div>
            <div className="pointer-events-auto px-3 pb-1">
              <TimeBar />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
