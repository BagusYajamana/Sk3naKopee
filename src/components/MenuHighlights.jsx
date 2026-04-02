import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMenuHighlightLayout } from '../hooks/useMenuHighlightLayout'
import espressoImage from '../assets/images/espresso.png'
import pourOverImage from '../assets/images/pour-over.png'
import kopiSusuGulaArenImage from '../assets/images/kopi-susu-gula-aren.png'
import skenaNightBloomImage from '../assets/images/skena-night-bloom.png'

const DECK_VISIBLE_DEPTH = 3
const SWIPE_DISTANCE_THRESHOLD = 70
const SWIPE_VELOCITY_THRESHOLD = 520
const menuImageByName = {
  Espresso: espressoImage,
  'Pour Over': pourOverImage,
  'Kopi Susu Aren': kopiSusuGulaArenImage,
  'Kopi Susu Gula Aren': kopiSusuGulaArenImage,
  'Skena Night Bloom': skenaNightBloomImage,
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getSwipeDirection(offset, velocity) {
  const absX = Math.abs(offset.x)
  const absY = Math.abs(offset.y)
  const strongX =
    absX > SWIPE_DISTANCE_THRESHOLD ||
    Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD
  const strongY =
    absY > SWIPE_DISTANCE_THRESHOLD ||
    Math.abs(velocity.y) > SWIPE_VELOCITY_THRESHOLD

  if (strongY && absY > absX && (offset.y < 0 || velocity.y < 0)) {
    return 'up'
  }

  if (strongX && absX >= absY) {
    return offset.x >= 0 ? 'right' : 'left'
  }

  return null
}

function MenuHighlights() {
  const menuItems = useMemo(
    () => [
      {
        name: 'Espresso',
        price: '30k',
        profile: 'Bold / Dark Chocolate / Citrus',
        description:
          'Pulled short and intentional with a dense crema. The cup opens with dark cocoa and finishes with a clean citrus lift.',
        label: 'House Classic',
      },
      {
        name: 'Pour Over',
        price: '42k',
        profile: 'Floral / Tea-like / Bright',
        description:
          'Single-origin selection brewed by hand using a controlled spiral pour, revealing delicate aromatics and a crisp finish.',
        label: 'Manual Brew',
      },
      {
        name: 'Kopi Susu Aren',
        price: '38k',
        profile: 'Palm Sugar / Creamy / Roasted',
        description:
          'Skena signature blend with West Javanese aren sugar and fresh milk, balancing sweetness and deep roasted character.',
        label: 'Bandung Favorite',
      },
      {
        name: 'Skena Night Bloom',
        price: '45k',
        profile: 'Berry / Spice / Velvet',
        description:
          'A rotating seasonal creation built from anaerobic micro-lots, steamed milk, and a subtle clove-orange finish.',
        label: 'Signature Series',
      },
    ],
    [],
  )

  const layouts = useMenuHighlightLayout(menuItems)
  const MotionArticle = motion.article
  const deckRef = useRef(null)
  const wheelDeltaRef = useRef(0)
  const isPointerOverTopCardRef = useRef(false)
  const cycleLockRef = useRef(false)
  const [deckOrder, setDeckOrder] = useState(() =>
    menuItems.map((_, index) => index),
  )
  const [activeThrow, setActiveThrow] = useState(null)
  const [deckBounds, setDeckBounds] = useState(() => ({
    width: 0,
    height: 0,
  }))

  useLayoutEffect(() => {
    setDeckOrder(menuItems.map((_, index) => index))
    setActiveThrow(null)
    cycleLockRef.current = false
  }, [menuItems])

  useLayoutEffect(() => {
    const measure = () => {
      const width = deckRef.current?.clientWidth ?? 0
      const height = deckRef.current?.clientHeight ?? 0

      setDeckBounds((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      )
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    if (deckRef.current) {
      resizeObserver.observe(deckRef.current)
    }
    window.addEventListener('resize', measure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const renderCardBody = useCallback((item, textWidth, measuredHeight) => {
    return (
      <>
        <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.2em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
          {item.label}
        </span>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
          <div className="md:pt-1">
            <p className="font-['Newsreader'] text-5xl italic text-[var(--primary)]">
              {item.price}
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-['Newsreader'] text-4xl italic text-[var(--primary)] md:text-5xl">
              {item.name}
            </h3>
            <p className="mb-4 font-['Plus_Jakarta_Sans'] text-xs font-bold tracking-[0.14em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
              {item.profile}
            </p>
            <p
              className="font-['Plus_Jakarta_Sans'] text-base leading-[1.65] text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)]"
              style={{
                width: `min(100%, ${textWidth}px)`,
                minHeight: `${measuredHeight}px`,
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      </>
    )
  }, [])

  const startDeckCycle = useCallback(
    (direction, seed = { x: 0, y: 0 }) => {
      if (cycleLockRef.current || menuItems.length < 2) {
        return
      }

      cycleLockRef.current = true
      setActiveThrow({
        direction,
        startX: seed.x ?? 0,
        startY: seed.y ?? 0,
        startRotate: clamp((seed.x ?? 0) / 18, -14, 14),
      })
    },
    [menuItems.length],
  )

  const completeDeckCycle = useCallback(() => {
    setDeckOrder((current) =>
      current.length > 1 ? [...current.slice(1), current[0]] : current,
    )
    setActiveThrow(null)
    cycleLockRef.current = false
  }, [])

  const handleDeckWheel = useCallback(
    (event) => {
      event.preventDefault()

      if (cycleLockRef.current) {
        return
      }

      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const dominantDelta = isHorizontal ? event.deltaX : event.deltaY
      wheelDeltaRef.current += dominantDelta

      if (Math.abs(wheelDeltaRef.current) < 34) {
        return
      }

      const direction = isHorizontal
        ? wheelDeltaRef.current > 0
          ? 'right'
          : 'left'
        : wheelDeltaRef.current < 0
          ? 'up'
          : 'down'

      wheelDeltaRef.current = 0
      startDeckCycle(direction)
    },
    [startDeckCycle],
  )

  useLayoutEffect(() => {
    const onWindowWheel = (event) => {
      if (!isPointerOverTopCardRef.current) {
        return
      }

      handleDeckWheel(event)
    }

    window.addEventListener('wheel', onWindowWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWindowWheel)
    }
  }, [handleDeckWheel])

  const handleDeckDragEnd = useCallback(
    (_, info) => {
      const direction = getSwipeDirection(info.offset, info.velocity)
      if (!direction) {
        return
      }

      startDeckCycle(direction, { x: info.offset.x, y: info.offset.y })
    },
    [startDeckCycle],
  )

  const topIndex = deckOrder[0] ?? 0
  const topLayout = layouts[topIndex]
  const deckHeight = Math.max((topLayout?.height ?? 120) + 265, 380)
  const topItem = menuItems[topIndex]
  const topMenuImage = menuImageByName[topItem?.name] ?? espressoImage

  return (
    <section
      id="the-roast"
      className="px-8 py-28"
      style={{ backgroundColor: '#f9f3e8' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-['Newsreader'] text-4xl italic text-[var(--primary)] md:text-5xl">
            Today&apos;s Selection
          </h2>
          <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.18em] text-[color:color-mix(in_srgb,var(--on_surface)_58%,#4f453f_42%)] uppercase">
            Volume 04
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center xl:grid-cols-[minmax(0,1fr)_500px]">
          <div className="lg:flex lg:h-[min(72vh,620px)] lg:items-center">
            <div
              ref={deckRef}
              className="relative mx-auto w-full overflow-hidden touch-none pb-4"
              style={{ minHeight: `${deckHeight}px` }}
            >
              {deckOrder.map((itemIndex, depth) => {
              const item = menuItems[itemIndex]
              const layout = layouts[itemIndex]
              const textWidth = layout?.width ?? 360
              const measuredHeight = layout?.height ?? 120
              const isTopCard = depth === 0
              const hiddenDepth = depth >= DECK_VISIBLE_DEPTH
              const depthOffsetY = depth * 12
              const depthScale = 1 - depth * 0.035
              const depthOpacity =
                depth === 0 ? 1 : depth === 1 ? 0.84 : depth === 2 ? 0.68 : 0
              const throwWidth = deckBounds.width || 480
              const throwHeight = deckBounds.height || 420

              let animateConfig = {
                x: 0,
                y: depthOffsetY,
                scale: depthScale,
                rotate: 0,
                opacity: hiddenDepth ? 0 : depthOpacity,
              }
              let transitionConfig = { duration: 0 }

              if (isTopCard && activeThrow) {
                const isLeft = activeThrow.direction === 'left'
                const isRight = activeThrow.direction === 'right'
                const isUp = activeThrow.direction === 'up'
                const isDown = activeThrow.direction === 'down'
                const midX = isLeft ? -52 : isRight ? 52 : activeThrow.startX * 0.28
                const midY = isUp
                  ? activeThrow.startY - 60
                  : isDown
                    ? activeThrow.startY + 42
                    : activeThrow.startY - 26
                const exitX = isLeft ? -throwWidth - 160 : isRight ? throwWidth + 160 : 0
                const exitY = isUp
                  ? -throwHeight - 180
                  : isDown
                    ? throwHeight + 180
                    : throwHeight * 0.24
                const midRotate = isLeft
                  ? -8
                  : isRight
                    ? 8
                    : activeThrow.startRotate * 0.35
                const exitRotate = isLeft ? -16 : isRight ? 16 : isDown ? 6 : -6

                animateConfig = {
                  x: [activeThrow.startX, midX, exitX],
                  y: [activeThrow.startY, midY, exitY],
                  scale: 1,
                  rotate: [activeThrow.startRotate, midRotate, exitRotate],
                  opacity: 1,
                }
                transitionConfig = {
                  duration: 0.28,
                  ease: [0.2, 0.9, 0.25, 1],
                  times: [0, 0.36, 1],
                }
              } else if (isTopCard) {
                animateConfig = {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                }
              }

                return (
                  <MotionArticle
                    key={`deck-${item.name}`}
                  className="absolute left-0 top-0 mt-[54px] max-w-full rounded-xl px-8 py-9 md:px-10 md:py-10"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)',
                      width: `min(100%, ${textWidth + 260}px)`,
                      zIndex: menuItems.length - depth,
                      pointerEvents: isTopCard ? 'auto' : 'none',
                    }}
                    drag={isTopCard && !activeThrow}
                    dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    dragElastic={0.22}
                    dragMomentum={false}
                    onDragEnd={isTopCard ? handleDeckDragEnd : undefined}
                    onPointerEnter={
                      isTopCard
                        ? () => {
                            isPointerOverTopCardRef.current = true
                          }
                        : undefined
                    }
                    onPointerLeave={
                      isTopCard
                        ? () => {
                            isPointerOverTopCardRef.current = false
                            wheelDeltaRef.current = 0
                          }
                        : undefined
                    }
                    animate={animateConfig}
                    transition={transitionConfig}
                    onAnimationComplete={
                      isTopCard && activeThrow ? completeDeckCycle : undefined
                    }
                  >
                    {renderCardBody(item, textWidth, measuredHeight)}
                  </MotionArticle>
                )
              })}
            </div>
          </div>

          <div className="relative hidden h-[min(72vh,620px)] lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[min(88%,560px)] w-[min(88%,560px)] min-h-[min(82%,500px)] min-w-[min(82%,500px)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 h-[132%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,220,182,0.4)_0%,rgba(247,220,182,0.14)_36%,rgba(247,220,182,0)_74%)] blur-2xl" />
                  <div className="absolute left-[56%] top-[40%] h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,230,0.68)_0%,rgba(255,246,230,0.22)_40%,rgba(255,246,230,0)_78%)] blur-xl" />
                </div>
                <motion.img
                  key={topItem?.name}
                  src={topMenuImage}
                  alt={topItem ? `${topItem.name} menu item` : 'Menu item'}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_30px_34px_rgba(43,29,16,0.2)]"
                  initial={{ opacity: 0, scale: 0.9, rotate: -1.7, x: 0, y: 6 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1],
                    scale: [0.9, 1.06, 0.99, 1.015, 1],
                    rotate: [-1.7, 1.1, -0.85, 0.45, 0],
                    x: [0, -4, 4, -1, 0],
                    y: [6, -2, 1, 0, 0],
                  }}
                  transition={{
                    duration: 0.36,
                    ease: 'easeOut',
                    times: [0, 0.22, 0.5, 0.76, 1],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MenuHighlights
