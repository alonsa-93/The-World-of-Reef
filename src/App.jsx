import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AudioProvider } from './contexts/AudioContext'
import { motion } from 'framer-motion'
import ErrorBoundary from './components/ui/ErrorBoundary'

const HomePage = lazy(() => import('./pages/HomePage'))
const WorldPage = lazy(() => import('./pages/WorldPage'))
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'))

// Process games
const VolcanoGamePage = lazy(() => import('./pages/VolcanoGamePage'))
const SeedFlowerGamePage = lazy(() => import('./pages/games/SeedFlowerGamePage'))
const WaterCycleGamePage = lazy(() => import('./pages/games/WaterCycleGamePage'))
const ButterflyGamePage = lazy(() => import('./pages/games/ButterflyGamePage'))
const DayNightGamePage = lazy(() => import('./pages/games/DayNightGamePage'))
const MeltIceGamePage = lazy(() => import('./pages/games/MeltIceGamePage'))

// Literacy games
const FindLetterGamePage = lazy(() => import('./pages/games/FindLetterGamePage'))
const SightWordsGamePage = lazy(() => import('./pages/games/SightWordsGamePage'))
const StartingSoundsGamePage = lazy(() => import('./pages/games/StartingSoundsGamePage'))
const RhymingGamePage = lazy(() => import('./pages/games/RhymingGamePage'))
const SyllableGamePage = lazy(() => import('./pages/games/SyllableGamePage'))

// Logic games
const PatternGamePage = lazy(() => import('./pages/games/PatternGamePage'))
const SortingGamePage = lazy(() => import('./pages/games/SortingGamePage'))

// Emotion games
const EmotionMirrorGamePage = lazy(() => import('./pages/games/EmotionMirrorGamePage'))

// Travel games
const PackingGamePage = lazy(() => import('./pages/games/PackingGamePage'))
const BeachGamePage = lazy(() => import('./pages/games/BeachGamePage'))

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full bg-reef-bg">
      <motion.div
        className="text-7xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        🌊
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="h-full w-full overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/world/:worldId" element={<WorldPage />} />

                {/* Process games */}
                <Route path="/game/volcano" element={<VolcanoGamePage />} />
                <Route path="/game/seedflower" element={<SeedFlowerGamePage />} />
                <Route path="/game/watercycle" element={<WaterCycleGamePage />} />
                <Route path="/game/butterfly" element={<ButterflyGamePage />} />
                <Route path="/game/daynight" element={<DayNightGamePage />} />
                <Route path="/game/meltice" element={<MeltIceGamePage />} />

                {/* Literacy games */}
                <Route path="/game/findletter" element={<FindLetterGamePage />} />
                <Route path="/game/sightwords" element={<SightWordsGamePage />} />
                <Route path="/game/startingsounds" element={<StartingSoundsGamePage />} />
                <Route path="/game/rhyming" element={<RhymingGamePage />} />
                <Route path="/game/syllables" element={<SyllableGamePage />} />

                {/* Logic games */}
                <Route path="/game/patterns" element={<PatternGamePage />} />
                <Route path="/game/sorting" element={<SortingGamePage />} />

                {/* Emotion games */}
                <Route path="/game/emotionmirror" element={<EmotionMirrorGamePage />} />

                {/* Travel games */}
                <Route path="/game/packing" element={<PackingGamePage />} />
                <Route path="/game/beach" element={<BeachGamePage />} />

                {/* Coming soon for all other games */}
                <Route path="/game/*" element={<ComingSoonPage />} />
              </Routes>
            </Suspense>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </AudioProvider>
  )
}
