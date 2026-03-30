import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MenuHighlights from './components/MenuHighlights'

function App() {
  return (
    <main id="top" className="min-h-screen bg-[var(--surface)]">
      <Navbar />
      <Hero />
      <MenuHighlights />
    </main>
  )
}

export default App
