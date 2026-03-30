import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAboutOrbLayout } from '../hooks/useAboutOrbLayout'

const ABOUT_PARAGRAPHS = [
  'At Skena, we believe coffee is more than a stimulant; it is a conversation between the soil and the soul. Our journey began in the misty highlands of West Java, where we found more than just beans, we found a community of artisans dedicated to preserving Indonesian coffee heritage.',
  "Every cup served in our sanctuary is a culmination of careful choices, from roast curves that respect origin character to the exact water profile in each manual brew. We choose the slower method because ritual is where clarity appears, and clarity is what makes each sip memorable.",
]

const DEFAULT_BEAN_SIZE = 170

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function About() {
  const MotionDiv = motion.div
  const sectionRef = useRef(null)
  const textStageRef = useRef(null)
  const orbImageRef = useRef(null)
  const dragRef = useRef(null)
  const textBoxRef = useRef(null)
  const beanSizeRef = useRef({
    width: DEFAULT_BEAN_SIZE,
    height: DEFAULT_BEAN_SIZE,
  })
  const orbRef = useRef({
    x: 120,
    y: 90,
    vx: 46,
    vy: 38,
    paused: false,
  })

  const [orbRender, setOrbRender] = useState({
    x: 120,
    y: 90,
    paused: false,
    dragging: false,
  })
  const [columnWidth, setColumnWidth] = useState(0)
  const [orbRect, setOrbRect] = useState(null)

  useEffect(() => {
    let frameId = 0
    let lastTime = performance.now()

    const tick = (now) => {
      const sectionRect = sectionRef.current?.getBoundingClientRect()
      if (!sectionRect) {
        frameId = requestAnimationFrame(tick)
        return
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const beanWidth = beanSizeRef.current.width
      const beanHeight = beanSizeRef.current.height
      const maxX = Math.max(sectionRect.width - beanWidth, 0)
      const maxY = Math.max(sectionRect.height - beanHeight, 0)
      const orb = orbRef.current
      const isDragging = dragRef.current !== null

      if (!orb.paused && !isDragging) {
        orb.x += orb.vx * dt
        orb.y += orb.vy * dt

        if (orb.x <= 0) {
          orb.x = 0
          orb.vx = Math.abs(orb.vx)
        } else if (orb.x >= maxX) {
          orb.x = maxX
          orb.vx = -Math.abs(orb.vx)
        }

        if (orb.y <= 0) {
          orb.y = 0
          orb.vy = Math.abs(orb.vy)
        } else if (orb.y >= maxY) {
          orb.y = maxY
          orb.vy = -Math.abs(orb.vy)
        }
      }

      setOrbRender({
        x: orb.x,
        y: orb.y,
        paused: orb.paused,
        dragging: isDragging,
      })

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const measure = () => {
      const sectionRect = sectionRef.current?.getBoundingClientRect()
      const textRect = textStageRef.current?.getBoundingClientRect()
      if (!sectionRect || !textRect) {
        return
      }

      setColumnWidth(textRect.width)

      const textBox = {
        left: textRect.left - sectionRect.left,
        top: textRect.top - sectionRect.top,
        right: textRect.right - sectionRect.left,
        bottom: textRect.bottom - sectionRect.top,
      }
      textBoxRef.current = textBox

      const imageRect = orbImageRef.current?.getBoundingClientRect()
      if (!imageRect) {
        setOrbRect(null)
        return
      }
      beanSizeRef.current = {
        width: imageRect.width,
        height: imageRect.height,
      }

      const orbBox = {
        left: imageRect.left - sectionRect.left,
        top: imageRect.top - sectionRect.top,
        right: imageRect.right - sectionRect.left,
        bottom: imageRect.bottom - sectionRect.top,
      }

      const overlapLeft = Math.max(textBox.left, orbBox.left)
      const overlapTop = Math.max(textBox.top, orbBox.top)
      const overlapRight = Math.min(textBox.right, orbBox.right)
      const overlapBottom = Math.min(textBox.bottom, orbBox.bottom)

      if (overlapRight <= overlapLeft || overlapBottom <= overlapTop) {
        setOrbRect(null)
        return
      }

      setOrbRect({
        x: overlapLeft - textBox.left,
        y: overlapTop - textBox.top,
        width: overlapRight - overlapLeft,
        height: overlapBottom - overlapTop,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    if (textStageRef.current) {
      observer.observe(textStageRef.current)
    }
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [orbRender])

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragRef.current) {
        return
      }

      const sectionRect = sectionRef.current?.getBoundingClientRect()
      if (!sectionRect) {
        return
      }

      const deltaX = event.clientX - dragRef.current.startX
      const deltaY = event.clientY - dragRef.current.startY
      const maxX = Math.max(sectionRect.width - beanSizeRef.current.width, 0)
      const maxY = Math.max(sectionRect.height - beanSizeRef.current.height, 0)

      orbRef.current.x = clamp(dragRef.current.orbStartX + deltaX, 0, maxX)
      orbRef.current.y = clamp(dragRef.current.orbStartY + deltaY, 0, maxY)
      dragRef.current.moved =
        dragRef.current.moved ||
        Math.abs(deltaX) > 4 ||
        Math.abs(deltaY) > 4
    }

    const onPointerUp = () => {
      if (!dragRef.current) {
        return
      }

      const wasClick = !dragRef.current.moved
      const orb = orbRef.current
      if (wasClick) {
        orb.paused = !orb.paused
      } else {
        orb.paused = false
      }

      dragRef.current = null
      setOrbRender((prev) => ({
        ...prev,
        x: orb.x,
        y: orb.y,
        paused: orb.paused,
        dragging: false,
      }))
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  const routedLayout = useAboutOrbLayout({
    paragraphs: ABOUT_PARAGRAPHS,
    columnWidth,
    orbRect,
    lineHeight: 34,
    paragraphGap: 30,
  })

  const cursorClass = orbRender.dragging
    ? 'cursor-grabbing'
    : orbRender.paused
      ? 'cursor-pointer'
      : 'cursor-grab'

  const orbStyle = useMemo(
    () => ({
      transform: `translate3d(${orbRender.x}px, ${orbRender.y}px, 0)`,
    }),
    [orbRender.x, orbRender.y],
  )

  return (
    <section id="heritage" className="overflow-hidden bg-[var(--surface)] px-8 py-32">
      <div ref={sectionRef} className="relative mx-auto max-w-7xl">
        <MotionDiv
          className={`absolute top-0 left-0 z-20 ${cursorClass}`}
          style={orbStyle}
          onPointerDown={(event) => {
            event.preventDefault()
            const orb = orbRef.current
            dragRef.current = {
              startX: event.clientX,
              startY: event.clientY,
              orbStartX: orb.x,
              orbStartY: orb.y,
              moved: false,
            }
            orb.paused = true
            setOrbRender((prev) => ({ ...prev, paused: true, dragging: true }))
          }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)] blur-3xl" />
          <img
            ref={orbImageRef}
            src="/assets/images/coffee-bean.png"
            alt="Coffee bean"
            className="block w-[170px] h-auto select-none"
            draggable={false}
          />
        </MotionDiv>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="mb-8 block font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-[0.18em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
              Our Ethos
            </span>
            <h2 className="font-['Newsreader'] text-5xl leading-tight italic tracking-[-0.02em] text-[var(--primary)] md:text-7xl">
              The beauty of <br /> deliberate pauses.
            </h2>
          </div>

          <div className="relative lg:col-span-8">
            <div ref={textStageRef} className="relative min-h-[420px]">
              <div
                className="relative"
                style={{ height: `${Math.max(routedLayout.height, 360)}px` }}
              >
                {routedLayout.lines.map((line) => (
                  <div
                    key={line.key}
                    className="absolute font-['Plus_Jakarta_Sans'] text-lg leading-[34px] text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)]"
                    style={{
                      left: `${line.x}px`,
                      top: `${line.y}px`,
                      width: `${line.width}px`,
                      whiteSpace: 'pre',
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#"
              className="editorial-underline mt-8 inline-block font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-[0.06em] text-[var(--primary)] uppercase"
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
