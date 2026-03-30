import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MenuHighlights from './components/MenuHighlights'
import About from './components/About'
import BrewGuide from './components/BrewGuide'
import PullQuote from './components/PullQuote'

function App() {
  return (
    <main id="top" className="min-h-screen bg-[var(--surface)]">
      <Navbar />
      <Hero />
      <MenuHighlights />
      <About />
      <BrewGuide />
      <PullQuote />
      <div
        className="pointer-events-none fixed right-4 bottom-4 z-50 px-2 py-1 font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-[0.1em] uppercase"
        style={{ color: 'color-mix(in srgb, var(--on_surface) 40%, transparent)' }}
      >
        drag the beans  click to pause
      </div>
    </main>
  )
}

export default App
