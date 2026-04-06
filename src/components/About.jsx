import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useAboutOrbLayout } from '../hooks/useAboutOrbLayout'
import coffeBeanImage from '../assets/images/coffe-bean.webp'

const ABOUT_PARAGRAPHS = [
  'At Skena, we believe coffee is more than a stimulant; it is a conversation between the soil and the soul. Our journey began in the misty highlands of West Java, where we found more than just beans, we found a community of artisans dedicated to preserving Indonesian coffee heritage.',
  "Every cup served in our sanctuary is a culmination of careful choices, from roast curves that respect origin character to the exact water profile in each manual brew. We choose the slower method because ritual is where clarity appears, and clarity is what makes each sip memorable.",
]

const ACTIVE_BEANS = [
  { x: 120, y: 90, mobileX: 155, mobileY: 293, vx: 16, vy: 13, size: 170, rotation: 4, interactive: true },
  { x: 430, y: 160, vx: -12, vy: 10, size: 148, rotation: 48, interactive: false },
  { x: 640, y: 60, vx: 11, vy: -12, size: 136, rotation: 92, interactive: false },
]

const DECORATIVE_BEANS = [
  { left: 24, bottom: 18, size: 40, rotation: 19, opacity: 0.3, driftX: 18, driftY: 14, duration: 22 },
  { left: 78, bottom: 46, size: 52, rotation: 34, opacity: 0.34, driftX: 14, driftY: 10, duration: 19 },
  { left: 146, bottom: 30, size: 60, rotation: 63, opacity: 0.33, driftX: 16, driftY: 12, duration: 24 },
  { left: 220, bottom: 64, size: 74, rotation: 77, opacity: 0.31, driftX: 20, driftY: 15, duration: 27 },
  { left: 302, bottom: 20, size: 88, rotation: 106, opacity: 0.28, driftX: 12, driftY: 9, duration: 30 },
  { left: 44, bottom: 102, size: 46, rotation: 121, opacity: 0.35, driftX: 15, driftY: 11, duration: 23 },
  { left: 172, bottom: 126, size: 66, rotation: 143, opacity: 0.29, driftX: 17, driftY: 13, duration: 26 },
  { left: 284, bottom: 112, size: 84, rotation: 159, opacity: 0.27, driftX: 13, driftY: 8, duration: 29 },
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function About() {
  const MotionDiv = motion.div
  const sectionRef = useRef(null)
  const textStageRef = useRef(null)
  const activeImageRefs = useRef([])
  const activeSizeRefs = useRef(
    ACTIVE_BEANS.map((bean) => ({ width: bean.size, height: bean.size })),
  )
  const dragRef = useRef(null)
  const activeBeansRef = useRef(null)
  if (activeBeansRef.current === null) {
    const initMobile = typeof window !== 'undefined' && window.innerWidth < 768
    activeBeansRef.current = ACTIVE_BEANS.map((bean, i) => ({
      x: i === 0 && initMobile ? bean.mobileX ?? bean.x : bean.x,
      y: i === 0 && initMobile ? bean.mobileY ?? bean.y : bean.y,
      vx: bean.vx,
      vy: bean.vy,
      paused: false,
    }))
  }

  const [activeRender, setActiveRender] = useState(() => {
    const initMobile = typeof window !== 'undefined' && window.innerWidth < 768
    return ACTIVE_BEANS.map((bean, i) => ({
      x: i === 0 && initMobile ? bean.mobileX ?? bean.x : bean.x,
      y: i === 0 && initMobile ? bean.mobileY ?? bean.y : bean.y,
      paused: false,
      dragging: false,
    }))
  })
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )
  const [columnWidth, setColumnWidth] = useState(0)
  const [orbRects, setOrbRects] = useState([])
  const activeCount = isMobile ? 1 : ACTIVE_BEANS.length

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
      const draggingIndex = dragRef.current?.index ?? -1

      for (let index = 0; index < activeCount; index += 1) {
        const bean = activeBeansRef.current[index]
        const size = activeSizeRefs.current[index] ?? {
          width: ACTIVE_BEANS[index].size,
          height: ACTIVE_BEANS[index].size,
        }
        const maxX = Math.max(sectionRect.width - size.width, 0)
        const maxY = Math.max(sectionRect.height - size.height, 0)
        const isDraggingThisBean = index === draggingIndex

        if (!bean.paused && !isDraggingThisBean && !(isMobile && index === 0)) {
          bean.x += bean.vx * dt
          bean.y += bean.vy * dt

          if (bean.x <= 0) {
            bean.x = 0
            bean.vx = Math.abs(bean.vx)
          } else if (bean.x >= maxX) {
            bean.x = maxX
            bean.vx = -Math.abs(bean.vx)
          }

          if (bean.y <= 0) {
            bean.y = 0
            bean.vy = Math.abs(bean.vy)
          } else if (bean.y >= maxY) {
            bean.y = maxY
            bean.vy = -Math.abs(bean.vy)
          }
        }
      }

      setActiveRender(
        activeBeansRef.current.map((bean, index) => ({
          x: bean.x,
          y: bean.y,
          paused: bean.paused,
          dragging: index === draggingIndex && index < activeCount,
        })),
      )

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [activeCount, isMobile])

  useEffect(() => {
    if (dragRef.current && dragRef.current.index >= activeCount) {
      dragRef.current = null
    }
  }, [activeCount])

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

      const nextRectangles = []
      for (let index = 0; index < activeCount; index += 1) {
        const imageRect = activeImageRefs.current[index]?.getBoundingClientRect()
        if (!imageRect) {
          continue
        }

        activeSizeRefs.current[index] = {
          width: imageRect.width,
          height: imageRect.height,
        }

        const beanBox = {
          left: imageRect.left - sectionRect.left,
          top: imageRect.top - sectionRect.top,
          right: imageRect.right - sectionRect.left,
          bottom: imageRect.bottom - sectionRect.top,
        }

        const overlapLeft = Math.max(textBox.left, beanBox.left)
        const overlapTop = Math.max(textBox.top, beanBox.top)
        const overlapRight = Math.min(textBox.right, beanBox.right)
        const overlapBottom = Math.min(textBox.bottom, beanBox.bottom)

        if (overlapRight <= overlapLeft || overlapBottom <= overlapTop) {
          continue
        }

        nextRectangles.push({
          x: overlapLeft - textBox.left,
          y: overlapTop - textBox.top,
          width: overlapRight - overlapLeft,
          height: overlapBottom - overlapTop,
        })
      }

      setOrbRects(nextRectangles)
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
  }, [activeCount, activeRender])

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragRef.current) {
        return
      }
      if (event.pointerType === 'touch' && event.cancelable) {
        event.preventDefault()
      }

      const sectionRect = sectionRef.current?.getBoundingClientRect()
      if (!sectionRect) {
        return
      }

      const deltaX = event.clientX - dragRef.current.startX
      const deltaY = event.clientY - dragRef.current.startY
      const targetIndex = dragRef.current.index
      if (targetIndex >= activeCount) {
        return
      }
      const size = activeSizeRefs.current[targetIndex] ?? {
        width: ACTIVE_BEANS[targetIndex]?.size ?? 120,
        height: ACTIVE_BEANS[targetIndex]?.size ?? 120,
      }
      const maxX = Math.max(sectionRect.width - size.width, 0)
      const maxY = Math.max(sectionRect.height - size.height, 0)
      const targetBean = activeBeansRef.current[targetIndex]

      targetBean.x = clamp(dragRef.current.beanStartX + deltaX, 0, maxX)
      targetBean.y = clamp(dragRef.current.beanStartY + deltaY, 0, maxY)
      dragRef.current.moved =
        dragRef.current.moved || Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4
    }

    const onPointerUp = () => {
      if (!dragRef.current) {
        return
      }

      const wasClick = !dragRef.current.moved
      const targetIndex = dragRef.current.index
      if (targetIndex >= activeCount) {
        dragRef.current = null
        return
      }
      const targetBean = activeBeansRef.current[targetIndex]
      if (wasClick) {
        targetBean.paused = !dragRef.current.wasPaused
      } else {
        targetBean.paused = true
      }

      dragRef.current = null
      setActiveRender((prev) =>
        prev.map((bean, index) =>
          index === targetIndex
            ? {
                ...bean,
                x: targetBean.x,
                y: targetBean.y,
                paused: targetBean.paused,
                dragging: false,
              }
            : bean,
        ),
      )
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [activeCount])

  const routedLayout = useAboutOrbLayout({
    paragraphs: ABOUT_PARAGRAPHS,
    columnWidth,
    orbRects,
    lineHeight: 34,
    paragraphGap: 30,
  })

  return (
    <section id="heritage" className="overflow-hidden bg-[var(--surface)] px-8 py-32">
      <div ref={sectionRef} className="relative mx-auto max-w-7xl">
        {activeRender.slice(0, activeCount).map((bean, index) => (
          <MotionDiv
            key={`active-bean-${index}`}
            className={`absolute top-0 left-0 z-20 ${
              bean.dragging ? 'cursor-grabbing' : bean.paused ? 'cursor-pointer' : 'cursor-grab'
            }`}
            style={{
              transform: `translate3d(${bean.x}px, ${bean.y}px, 0) rotate(${ACTIVE_BEANS[index].rotation}deg)`,
              opacity: 0.94,
              touchAction: 'none',
            }}
            onPointerDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (event.currentTarget.setPointerCapture) {
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              const targetBean = activeBeansRef.current[index]
              dragRef.current = {
                index,
                startX: event.clientX,
                startY: event.clientY,
                beanStartX: targetBean.x,
                beanStartY: targetBean.y,
                moved: false,
                wasPaused: targetBean.paused,
              }
              targetBean.paused = true
              setActiveRender((prev) =>
                prev.map((entry, innerIndex) =>
                  innerIndex === index
                    ? { ...entry, paused: true, dragging: true }
                    : entry,
                ),
              )
            }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)] blur-3xl" />
            <img
              ref={(element) => {
                activeImageRefs.current[index] = element
              }}
              src={coffeBeanImage}
              alt={index === 0 ? 'Coffee bean' : ''}
              className="block h-auto select-none"
              style={{ width: `${ACTIVE_BEANS[index].size}px` }}
              draggable={false}
            />
          </MotionDiv>
        ))}

        {DECORATIVE_BEANS.map((bean, index) => (
          <motion.img
            key={`decorative-bean-${index}`}
            src={coffeBeanImage}
            alt=""
            className="pointer-events-none absolute z-10 select-none"
            style={{
              left: `${bean.left}px`,
              bottom: `${bean.bottom}px`,
              width: `${bean.size}px`,
              opacity: bean.opacity,
              rotate: `${bean.rotation}deg`,
            }}
            animate={{
              x: [0, bean.driftX, -bean.driftX * 0.55, 0],
              y: [0, -bean.driftY, bean.driftY * 0.45, 0],
            }}
            transition={{
              duration: bean.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: index * 0.7,
            }}
            draggable={false}
          />
        ))}

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

        <div
          className="pointer-events-none absolute right-4 bottom-4 z-30 px-2 py-1 font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-[0.1em] uppercase"
          style={{ color: 'color-mix(in srgb, var(--on_surface) 40%, transparent)' }}
        >
          drag the beans  click to pause
        </div>
      </div>
    </section>
  )
}

export default About
