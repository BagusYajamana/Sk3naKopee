import { useEffect } from 'react'
import { useDeviceType } from '../hooks/useDeviceType'
import { usePretext } from '../hooks/usePretext'

const HERO_COPY =
  'Crafted with intention, brewed with precision. Skena Coffee is a sanctuary for those who appreciate the ritual over the rush.'

function Hero() {
  const { isTouch } = useDeviceType()
  const { metrics, recalculate } = usePretext({
    text: HERO_COPY,
    font: '500 20px "Plus Jakarta Sans"',
    lineHeight: 36,
    minWidth: 260,
    maxWidth: 560,
    initialProgress: 0.5,
  })

  useEffect(() => {
    if (isTouch) {
      const onScroll = () => {
        const denom = Math.max(window.innerHeight * 0.9, 1)
        const progress = Math.min(Math.max(window.scrollY / denom, 0), 1)
        recalculate(progress)
      }

      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const onMouseMove = (event) => {
      const width = Math.max(window.innerWidth, 1)
      const progress = Math.min(Math.max(event.clientX / width, 0), 1)
      recalculate(progress)
    }

    onMouseMove({ clientX: window.innerWidth / 2 })
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [isTouch, recalculate])

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-8 pt-24 pb-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="z-10 lg:col-span-7">
          <span className="mb-6 block font-['Plus_Jakarta_Sans'] text-sm font-semibold tracking-[0.15em] text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)] uppercase">
            EST. 2017 - BANDUNG, ID
          </span>
          <h1
            className="mb-8 font-['Newsreader'] text-7xl leading-[0.95] tracking-[-0.02em] text-[var(--primary)] italic md:text-9xl"
            style={{ lineHeight: 0.95 }}
          >
            The Soul of <br />
            <span className="inline-block translate-x-12 md:translate-x-24">
              Slow-Poured
            </span>{' '}
            <br />
            Indonesian Beans.
          </h1>
          <p
            className="mb-10 font-['Plus_Jakarta_Sans'] text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)] md:text-xl"
            style={{ maxWidth: `${metrics.width}px`, minHeight: `${metrics.height}px` }}
            data-line-count={metrics.lineCount}
          >
            {HERO_COPY}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              className="px-10 py-5 font-['Plus_Jakarta_Sans'] font-bold tracking-tight transition-all active:scale-95"
              style={{
                backgroundColor: '#2b1a0e',
                color: 'var(--surface)',
              }}
              type="button"
            >
              Explore the Menu
            </button>
            <a
              className="editorial-underline font-['Plus_Jakarta_Sans'] font-semibold tracking-tight text-[var(--primary)] transition-opacity hover:opacity-70"
              href="#"
            >
              Read our Journal
            </a>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="organic-mask-1 relative aspect-[4/5] w-full overflow-hidden bg-[#ede8dd]">
            <img
              alt="Close up of a manual pour over coffee being made in a dark ceramic dripper"
              className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-700 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQYtcReBgEHpfH6vErlZUUnNrb9kFqJCRMaXIUp0o20n4S_uPVgoA1Uthpb11CsOl1hrH5kx3zeyUs4LHMWdhbABxmNudlGMCKz5BMw9iYTIRkdQ9WTH1XBhRwrKDukbzSY12-l6M1NErEBUQAILOnHB95O0XNPvhMxLLDmSBpPIXQk9v0J_NZWUaIkirlNXHvk80lSUn3OyhrZ96kLiDx3cnD6Y4wGGxvEimxlJIkDlFjZ2U_gk_41FKyJ6c4FRjKZ8d73qsMGtk"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 -z-10 h-32 w-32 rounded-full bg-[color:color-mix(in_srgb,#ffd8be_30%,transparent)] backdrop-blur-xl" />
        </div>
      </div>
      <div className="vertical-text absolute right-8 bottom-10 hidden lg:block">
        <span className="block origin-bottom-right -rotate-90 font-['Plus_Jakarta_Sans'] text-xs font-semibold tracking-widest text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)] uppercase">
          Follow the ritual - @skenacoffee
        </span>
      </div>
    </section>
  )
}

export default Hero
