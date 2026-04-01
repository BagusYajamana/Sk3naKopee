import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import cofeeRoastImg from '../assets/images/cofee-roast.png'

const SECTIONS = [
  {
    image: '/assets/images/cofee-farm.png',
    headline: 'The Soul of Slow-Poured Indonesian Beans',
    subtext:
      'From volcanic highlands where time moves differently — each cherry picked by hand at peak ripeness.',
  },
  {
    image: cofeeRoastImg,
    headline: 'Roasted to Respect the Origin',
    subtext:
      'Light enough to carry the terroir. Dark enough to tell its story. Every batch a deliberate choice.',
  },
  {
    image: '/assets/images/cofee-grind.png',
    headline: 'Ground at the Moment of Order',
    subtext:
      'Oxidation is the enemy of flavor. We grind fresh for every cup, every time.',
  },
  {
    image: '/assets/images/cofee-grinded.png',
    headline: 'Every Gram, Intentional',
    subtext:
      'Precision is not obsession. It is a quiet form of respect for the farmer who grew it.',
  },
]

function ZoomSection({ image, headline, subtext, index }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Image pulls back from deep inside to natural scale
  const scale = useTransform(scrollYProgress, [0, 1], [1.85, 1.0])

  // Overlay lifts as the scene settles and becomes legible
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.88], [0.84, 0.28])

  // Headline sharpens into focus as zoom settles
  const headlineOpacity = useTransform(scrollYProgress, [0.28, 0.58], [0, 1])
  const headlineBlurRaw = useTransform(scrollYProgress, [0.28, 0.58], [14, 0])
  const headlineFilter = useTransform(headlineBlurRaw, (v) => `blur(${v}px)`)

  // Subtext arrives after the headline lands
  const subtextOpacity = useTransform(scrollYProgress, [0.48, 0.74], [0, 1])
  const subtextY = useTransform(scrollYProgress, [0.48, 0.74], [20, 0])

  // Section counter fades with the headline
  const counterOpacity = useTransform(scrollYProgress, [0.22, 0.52], [0, 0.55])

  return (
    <div ref={containerRef} style={{ height: '300vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#0d0a07',
        }}
      >
        {/* ── Background image, held in the zoom ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            scale,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <img
            src={image}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              userSelect: 'none',
            }}
          />
        </motion.div>

        {/* ── Cinematic gradient overlay ── */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(160deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.48) 42%, rgba(0,0,0,0.92) 100%)',
            opacity: overlayOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* ── Text block, anchored bottom-left ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(28px, 5.5vw, 88px)',
            paddingBottom: 'clamp(60px, 10vh, 108px)',
            pointerEvents: 'none',
          }}
        >
          <motion.h2
            style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 'clamp(2.25rem, 5.5vw, 5.25rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: 0,
              marginBottom: '0.8em',
              maxWidth: '17ch',
              opacity: headlineOpacity,
              filter: headlineFilter,
              willChange: 'opacity, filter',
            }}
          >
            {headline}
          </motion.h2>

          <motion.p
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)',
              fontWeight: 400,
              lineHeight: 1.72,
              color: 'rgba(255, 255, 255, 0.70)',
              margin: 0,
              maxWidth: '46ch',
              opacity: subtextOpacity,
              y: subtextY,
              willChange: 'opacity, transform',
            }}
          >
            {subtext}
          </motion.p>
        </div>

        {/* ── Section counter, top-right ── */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'clamp(24px, 3.5vh, 44px)',
            right: 'clamp(28px, 4vw, 64px)',
            opacity: counterOpacity,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'uppercase',
            }}
          >
            {String(index + 1).padStart(2, '0')} — 04
          </span>
        </motion.div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div style={{ background: '#0d0a07' }}>
      {SECTIONS.map((section, i) => (
        <ZoomSection key={section.headline} {...section} index={i} />
      ))}
    </div>
  )
}

export default Hero
