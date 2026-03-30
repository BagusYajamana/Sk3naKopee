import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useAboutOrbLayout } from '../hooks/useAboutOrbLayout'

const ABOUT_PARAGRAPHS = [
  'At Skena, we believe coffee is more than a stimulant; it is a conversation between the soil and the soul. Our journey began in the misty highlands of West Java, where we found more than just beans, we found a community of artisans dedicated to preserving Indonesian coffee heritage.',
  "Every cup served in our sanctuary is a culmination of careful choices, from roast curves that respect origin character to the exact water profile in each manual brew. We choose the slower method because ritual is where clarity appears, and clarity is what makes each sip memorable.",
]

function About() {
  const MotionDiv = motion.div
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 })
  const motionX = useMotionValue(0)
  const motionY = useMotionValue(0)

  useAnimationFrame((time) => {
    const t = time / 1000
    const nextX = Math.sin(t * 0.28)
    const nextY = Math.cos(t * 0.22)
    motionX.set(nextX)
    motionY.set(nextY)
  })

  useMotionValueEvent(motionX, 'change', (value) => {
    setOrbPosition((prev) => ({ ...prev, x: value }))
  })

  useMotionValueEvent(motionY, 'change', (value) => {
    setOrbPosition((prev) => ({ ...prev, y: value }))
  })

  const paragraphLayouts = useAboutOrbLayout(ABOUT_PARAGRAPHS, orbPosition)

  const orbStyle = useMemo(
    () => ({
      x: motionX,
      y: motionY,
    }),
    [motionX, motionY],
  )

  return (
    <section id="heritage" className="overflow-hidden px-8 py-32 bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="relative min-h-[320px] lg:col-span-4">
          <MotionDiv
            className="absolute top-6 left-4 h-[280px] w-[280px] rounded-full"
            style={{
              ...orbStyle,
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(224,192,173,0.24) 60%, rgba(113,89,74,0.14) 100%)',
              filter: 'blur(8px)',
            }}
            transition={{ type: 'spring', damping: 42, stiffness: 60 }}
          />
          <div className="absolute inset-0 -z-10 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_6%,transparent)] blur-3xl" />
        </div>

        <div className="lg:col-span-8">
          <span className="mb-8 block font-['Plus_Jakarta_Sans'] text-xs font-bold tracking-[0.2em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
            Our Ethos
          </span>
          <h2 className="mb-12 font-['Newsreader'] text-5xl leading-tight italic tracking-[-0.02em] text-[var(--primary)] md:text-7xl">
            The beauty of <br /> deliberate pauses.
          </h2>
          <div className="space-y-8">
            {ABOUT_PARAGRAPHS.map((paragraph, index) => {
              const layout = paragraphLayouts[index]
              return (
                <p
                  key={paragraph}
                  className="font-['Plus_Jakarta_Sans'] text-lg leading-[1.75] text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)]"
                  style={{
                    maxWidth: `${layout?.width ?? 620}px`,
                    minHeight: `${layout?.height ?? 120}px`,
                    paddingInlineStart: `${layout?.indent ?? 0}px`,
                  }}
                >
                  {paragraph}
                </p>
              )
            })}
            <a
              href="#"
              className="editorial-underline inline-block font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-[0.06em] text-[var(--primary)] uppercase"
            >
              Discover Our Heritage
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
