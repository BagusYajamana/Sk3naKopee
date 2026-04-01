import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import cofeeRoastImg from '../assets/images/cofee-roast.png'

// ── Shared scroll-driven zoom values ────────────────────────────────────────

function useZoomScroll(containerRef) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.85, 1.0])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.88], [0.84, 0.28])
  const counterOpacity = useTransform(scrollYProgress, [0.22, 0.52], [0, 0.55])
  return { scrollYProgress, scale, overlayOpacity, counterOpacity }
}

// ── Shared image + overlay ───────────────────────────────────────────────────

function ZoomBackground({ image, scale, overlayOpacity, gradientDir = '160deg' }) {
  return (
    <>
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

      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${gradientDir}, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.46) 42%, rgba(0,0,0,0.92) 100%)`,
          opacity: overlayOpacity,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ── Section counter ──────────────────────────────────────────────────────────

function SectionCounter({ index, opacity }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 'clamp(24px, 3.5vh, 44px)',
        right: 'clamp(28px, 4vw, 64px)',
        opacity,
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
  )
}

// ── Section 1: Farm — top-right text, mount-driven reveal ───────────────────
// Text is visible on load (no scroll gate) since this is the page entry point.
// The image zoom is still scroll-driven; only the text uses initial/animate.

function FarmSection() {
  const containerRef = useRef(null)
  const { scale, overlayOpacity, counterOpacity } = useZoomScroll(containerRef)

  const ease = [0.25, 0.1, 0.25, 1]

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
        <ZoomBackground
          image="/assets/images/cofee-farm.png"
          scale={scale}
          overlayOpacity={overlayOpacity}
          gradientDir="135deg"
        />

        {/* Text — top-left, fades in on mount */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 'clamp(28px, 5.5vw, 88px)',
            paddingTop: 'clamp(80px, 13vh, 128px)',
            textAlign: 'left',
            pointerEvents: 'none',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(14px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease }}
            style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 'clamp(2.25rem, 5.5vw, 5.25rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: 0,
              marginBottom: '0.75em',
              maxWidth: '14ch',
            }}
          >
            The Soul of Indonesian Bean
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)',
              fontWeight: 400,
              lineHeight: 1.72,
              color: 'rgba(255, 255, 255, 0.70)',
              margin: 0,
              maxWidth: '36ch',
            }}
          >
            Sourced from the volcanic highlands of Java and Sumatra,
            every bean carries the patience of the land it grew from —
            hand-harvested, slow-dried, and roasted to honour its origin.
          </motion.p>
        </div>

        <SectionCounter index={0} opacity={counterOpacity} />
      </div>
    </div>
  )
}

// ── Section 2: "Born" fade — centered ───────────────────────────────────────

function RoastSection() {
  const containerRef = useRef(null)
  const { scrollYProgress, scale, overlayOpacity, counterOpacity } = useZoomScroll(containerRef)

  const wordOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1])

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
        <ZoomBackground
          image={cofeeRoastImg}
          scale={scale}
          overlayOpacity={overlayOpacity}
          gradientDir="180deg"
        />

        {/* Word — centered */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.span
            style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 'clamp(5rem, 13vw, 12rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              opacity: wordOpacity,
            }}
          >
            Born
          </motion.span>
        </div>

        <SectionCounter index={1} opacity={counterOpacity} />
      </div>
    </div>
  )
}

// ── Sections 3 & 4: standard bottom-left layout ──────────────────────────────

function ZoomSection({ image, headline, subtext, index }) {
  const containerRef = useRef(null)
  const { scrollYProgress, scale, overlayOpacity, counterOpacity } = useZoomScroll(containerRef)

  const headlineOpacity = useTransform(scrollYProgress, [0.28, 0.58], [0, 1])
  const headlineBlurRaw = useTransform(scrollYProgress, [0.28, 0.58], [14, 0])
  const headlineFilter = useTransform(headlineBlurRaw, (v) => `blur(${v}px)`)
  const subtextOpacity = useTransform(scrollYProgress, [0.48, 0.74], [0, 1])
  const subtextY = useTransform(scrollYProgress, [0.48, 0.74], [20, 0])

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
        <ZoomBackground image={image} scale={scale} overlayOpacity={overlayOpacity} />

        {/* Text — bottom-left */}
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

        <SectionCounter index={index} opacity={counterOpacity} />
      </div>
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div style={{ background: '#0d0a07' }}>
      <FarmSection />
      <RoastSection />
      <ZoomSection
        image="/assets/images/cofee-grind.png"
        headline="Ground at the Moment of Order"
        subtext="Oxidation is the enemy of flavor. We grind fresh for every cup, every time."
        index={2}
      />
      <ZoomSection
        image="/assets/images/cofee-grinded.png"
        headline="Every Gram, Intentional"
        subtext="Precision is not obsession. It is a quiet form of respect for the farmer who grew it."
        index={3}
      />
    </div>
  )
}

export default Hero
