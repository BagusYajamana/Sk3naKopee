import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useBrewGuidePretext } from '../hooks/useBrewGuidePretext'

function BrewGuide() {
  const MotionSection = motion.section
  const [openId, setOpenId] = useState('01')
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const brewSteps = useMemo(
    () => [
      {
        id: '01',
        title: 'The Bloom',
        body: 'Start with 50 grams of water and let the grounds swell for thirty seconds. This releases trapped gases and opens up cleaner extraction for the next pours.',
      },
      {
        id: '02',
        title: 'The Spiral Pour',
        body: 'Pour in controlled concentric circles from center to edge, keeping flow steady. Target 180 grams total by minute one for balanced sweetness and clarity.',
      },
      {
        id: '03',
        title: 'The Pulse',
        body: 'Add water in two smaller pulses while keeping the bed level. This keeps turbulence intentional and avoids harsh channeling in the final cup.',
      },
      {
        id: '04',
        title: 'The Drawdown',
        body: 'Allow gravity to finish extraction without agitation. A consistent drawdown around two minutes forty seconds gives a clean body and bright finish.',
      },
      {
        id: '05',
        title: 'The Pause',
        body: 'Let the cup rest for one minute before tasting. As temperature drops, the aromatic layers separate and reveal notes that are hidden while too hot.',
      },
    ],
    [],
  )

  const measuredLayouts = useBrewGuidePretext(brewSteps, viewportWidth)

  return (
    <section id="brew-guide" className="bg-[#f3ede2] px-8 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:order-2">
          <span className="mb-8 block font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-[0.12em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
            Brew Guide
          </span>
          <h2 className="font-['Newsreader'] text-5xl leading-tight italic tracking-[-0.02em] text-[var(--primary)] md:text-7xl">
            The ritual of <br /> the pour.
          </h2>
        </div>

        <div className="space-y-4 lg:col-span-8 lg:order-1">
          {brewSteps.map((step) => {
            const measured = measuredLayouts.find((item) => item.id === step.id)
            const isOpen = openId === step.id

            return (
              <article
                key={step.id}
                className="rounded-xl bg-[#fffdf8] px-6 py-5 md:px-8"
                style={{ boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)' }}
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 text-left"
                  onClick={() => setOpenId((prev) => (prev === step.id ? '' : step.id))}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-5">
                    <span className="pt-1 font-['Newsreader'] text-3xl italic text-[color:color-mix(in_srgb,var(--on_surface)_46%,#4f453f_54%)]">
                      {step.id}
                    </span>
                    <h3 className="font-['Newsreader'] text-3xl italic text-[var(--primary)] md:text-4xl">
                      {step.title}
                    </h3>
                  </div>
                  <span
                    className="mt-1 font-['Plus_Jakarta_Sans'] text-sm font-semibold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_52%,#4f453f_48%)] uppercase"
                  >
                    {isOpen ? 'Close' : 'Open'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <MotionSection
                      key={step.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: measured?.expandedHeight ?? 'auto',
                        opacity: 1,
                      }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pt-6 font-['Plus_Jakarta_Sans'] text-[17px] leading-[30px] text-[color:color-mix(in_srgb,var(--on_surface)_72%,#4f453f_28%)]"
                        style={{ maxWidth: `${measured?.textWidth ?? 420}px` }}
                      >
                        {step.body}
                      </p>
                    </MotionSection>
                  ) : null}
                </AnimatePresence>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BrewGuide
