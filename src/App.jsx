import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MenuHighlights from './components/MenuHighlights'
import About from './components/About'
import BrewGuide from './components/BrewGuide'
import PullQuote from './components/PullQuote'
import LocationHours from './components/LocationHours'
import Footer from './components/Footer'

function App() {
  return (
    <main id="top" className="min-h-screen bg-[var(--surface)]">
      <Navbar />
      <Hero />
      <MenuHighlights />
      <About />
      <BrewGuide />
      <PullQuote />
      <LocationHours />
      <Footer />
    </main>
  )
}

export default App
