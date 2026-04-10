import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CategoryToggleRail from './CategoryToggleRail'
import { useMenuHighlightLayout } from '../hooks/useMenuHighlightLayout'
import menuCategories from '../data/menuItems'

const DECK_VISIBLE_DEPTH = 3
const SWIPE_DISTANCE_THRESHOLD = 70
const SWIPE_VELOCITY_THRESHOLD = 520
const DECK_CARD_TOP_OFFSET = 64
const HOLD_TO_FLIP_MS = 340
const HOLD_MOVE_THRESHOLD_PX = 4
const FLIP_RETURN_DELAY_MS = 500
const CATEGORY_DECK_ENTER_TRANSITION = {
  duration: 0.32,
  ease: [0.2, 0.82, 0.24, 1],
}
const CATEGORY_DECK_EXIT_TRANSITION = {
  duration: 0.24,
  ease: [0.3, 0.86, 0.36, 1],
}
const RECOMMENDED_BADGE_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 0.8, 0.28, 1],
}
const FAN_TRANSITION = {
  duration: 0.34,
  ease: [0.22, 0.68, 0.24, 1],
}
const CATEGORY_DECK_LAYER_VARIANTS = {
  enter: {},
  center: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
  exit: {
    transition: {
      when: 'afterChildren',
    },
  },
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

function getBehindCardFanPosition(depth, visibleBehindCount) {
  if (depth === 0 || visibleBehindCount <= 0) {
    return { x: 0, y: 0, rotate: 0 }
  }

  if (visibleBehindCount === 1) {
    return { x: 0, y: 22, rotate: 0 }
  }

  const behindIndex = depth - 1
  const slot = (behindIndex / (visibleBehindCount - 1)) * 2 - 1

  return {
    x: slot * 34,
    y: 22 + Math.abs(slot) * 10 + behindIndex * 5,
    rotate: slot * 6.5,
  }
}

function getCategoryCardExitTrajectory(depth, visibleCount, direction) {
  if (depth === 0) {
    return {
      x: direction === 'left' ? -38 : 38,
      y: -92,
      rotate: direction === 'left' ? -8 : 8,
    }
  }

  const visibleBehindCount = Math.max(visibleCount - 1, 1)
  const behindIndex = depth - 1
  const slot =
    visibleBehindCount === 1
      ? 0
      : (Math.min(behindIndex, visibleBehindCount - 1) / (visibleBehindCount - 1)) *
          2 -
        1

  return {
    x: slot * 220,
    y: -56 - depth * 26 + Math.abs(slot) * 18,
    rotate: slot * 18 + (slot === 0 ? 0 : Math.sign(slot) * 6),
  }
}

function getCategoryCardPresenceVariants() {
  return {
    enter: ({ direction }) => ({
      x: direction === 'left' ? 132 : -132,
      y: 0,
      rotate: direction === 'left' ? 3 : -3,
      opacity: 0,
    }),
    center: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: CATEGORY_DECK_ENTER_TRANSITION,
    },
    exit: ({ depth, direction, visibleCount }) => ({
      ...getCategoryCardExitTrajectory(depth, visibleCount, direction),
      opacity: 0,
      transition: CATEGORY_DECK_EXIT_TRANSITION,
    }),
  }
}

function getLocalDateKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDateSeed(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000)
}

function hashLabel(label) {
  let hash = 0
  for (let index = 0; index < label.length; index += 1) {
    hash = (hash * 31 + label.charCodeAt(index)) >>> 0
  }
  return hash
}

function MenuHighlights() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('right')
  const [categoryMotionKey, setCategoryMotionKey] = useState(0)
  const [todayKey, setTodayKey] = useState(() => getLocalDateKey(new Date()))
  const selectedCategory = menuCategories[categoryIndex] ?? menuCategories[0]
  const menuItems = selectedCategory?.items ?? []
  const categoryId = selectedCategory?.id ?? ''
  const layouts = useMenuHighlightLayout(menuItems)
  const MotionArticle = motion.article
  const categoryCardPresenceVariants = useMemo(
    () => getCategoryCardPresenceVariants(),
    [],
  )
  const deckRef = useRef(null)
  const wheelDeltaRef = useRef(0)
  const isPointerOverTopCardRef = useRef(false)
  const cycleLockRef = useRef(false)
  const holdFlipTimerRef = useRef(null)
  const flipReturnTimerRef = useRef(null)
  const holdPointerRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
  })
  const [deckOrder, setDeckOrder] = useState(() =>
    menuItems.map((_, index) => index),
  )
  const [activeThrow, setActiveThrow] = useState(null)
  const [isTopCardFlipped, setIsTopCardFlipped] = useState(false)
  const [isDeckFanned, setIsDeckFanned] = useState(false)
  const [deckBounds, setDeckBounds] = useState(() => ({
    width: 0,
    height: 0,
  }))
  const activeDeckOrder = useMemo(() => {
    if (
      deckOrder.length !== menuItems.length ||
      deckOrder.some((itemIndex) => itemIndex < 0 || itemIndex >= menuItems.length)
    ) {
      return menuItems.map((_, index) => index)
    }

    return deckOrder
  }, [deckOrder, menuItems])
  const cardLayoutMetrics = useMemo(() => {
    if (layouts.length === 0) {
      return {
        textWidth: 360,
        measuredHeight: 120,
      }
    }

    return layouts.reduce(
      (largest, layout) => ({
        textWidth: Math.max(largest.textWidth, layout?.width ?? 360),
        measuredHeight: Math.max(largest.measuredHeight, layout?.height ?? 120),
      }),
      {
        textWidth: 360,
        measuredHeight: 120,
      },
    )
  }, [layouts])
  const dateSeed = useMemo(() => getDateSeed(todayKey), [todayKey])
  const recommendedIndex = useMemo(() => {
    if (menuItems.length === 0) {
      return -1
    }

    return (dateSeed + hashLabel(categoryId)) % menuItems.length
  }, [categoryId, dateSeed, menuItems.length])

  const selectCategory = useCallback(
    (targetIndex) => {
      if (targetIndex === categoryIndex) {
        return
      }

      const forwardDistance =
        (targetIndex - categoryIndex + menuCategories.length) % menuCategories.length
      const backwardDistance =
        (categoryIndex - targetIndex + menuCategories.length) % menuCategories.length

      setCategoryDirection(forwardDistance <= backwardDistance ? 'right' : 'left')
      setCategoryMotionKey((current) => current + 1)
      setCategoryIndex(targetIndex)
    },
    [categoryIndex],
  )

  const cycleCategory = useCallback((direction) => {
    setCategoryDirection(direction)
    setCategoryMotionKey((current) => current + 1)
    setCategoryIndex((current) => {
      const step = direction === 'left' ? -1 : 1
      return (current + step + menuCategories.length) % menuCategories.length
    })
  }, [])

  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1,
    )

    const timer = window.setTimeout(() => {
      setTodayKey(getLocalDateKey(new Date()))
    }, nextMidnight.getTime() - now.getTime())

    return () => {
      window.clearTimeout(timer)
    }
  }, [todayKey])

  useLayoutEffect(() => {
    setDeckOrder(menuItems.map((_, index) => index))
    setActiveThrow(null)
    setIsTopCardFlipped(false)
    cycleLockRef.current = false
  }, [menuItems])

  const clearHoldFlipTimer = useCallback(() => {
    if (holdFlipTimerRef.current !== null) {
      window.clearTimeout(holdFlipTimerRef.current)
      holdFlipTimerRef.current = null
    }
  }, [])

  const clearFlipReturnTimer = useCallback(() => {
    if (flipReturnTimerRef.current !== null) {
      window.clearTimeout(flipReturnTimerRef.current)
      flipReturnTimerRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    return () => {
      clearHoldFlipTimer()
      clearFlipReturnTimer()
    }
  }, [clearFlipReturnTimer, clearHoldFlipTimer])

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

  const renderCardBody = useCallback((item, textWidth, measuredHeight, showRecommendedBadge) => {
    return (
      <div className="relative">
        <AnimatePresence>
          {showRecommendedBadge ? (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.92, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, y: -10, scale: 0.94, rotate: -6 }}
              transition={RECOMMENDED_BADGE_TRANSITION}
              className="pointer-events-none absolute right-0 top-0 z-10"
            >
              <span className="relative inline-flex min-w-[10.5rem] items-center justify-center px-5 py-4 font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-white uppercase drop-shadow-[0_8px_14px_rgba(111,60,32,0.22)]">
                <svg
                  viewBox="0 0 220 140"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M109 7c9 3 15 10 24 11 10 0 18-5 27-1 8 5 11 14 18 20 8 6 19 8 22 18 2 10-3 19-2 28 2 9 9 18 6 28-4 9-15 13-22 19-6 7-8 17-17 22-9 3-19-1-28 1-9 3-16 10-26 11-10-1-17-9-26-11-10-2-20 2-29-2-8-5-10-15-17-22-8-5-18-9-21-19-3-9 3-18 4-27 1-10-4-20-1-30 4-9 15-12 22-18 6-7 9-16 17-21 9-4 18 0 27 0 9-2 14-8 22-10Z"
                    fill="#bf6542"
                  />
                  <path
                    d="M108 18c7 3 12 9 19 10 8 1 15-4 22-1 6 4 8 11 14 15 6 4 15 6 18 14 2 8-3 15-2 22 1 8 7 15 5 23-3 7-11 10-16 15-5 5-7 14-14 17-7 3-15-1-22 1-7 2-13 9-22 9-8 0-14-7-21-9-8-2-16 2-23-1-7-4-9-12-14-17-6-5-14-7-17-15-2-7 2-15 3-22 1-8-4-16-2-24 3-7 11-10 17-14 5-5 7-12 14-16 7-3 15 1 22 0 7-1 12-7 19-9Z"
                    fill="#a94f46"
                    opacity="0.6"
                  />
                </svg>
                <span className="relative z-10 flex flex-col items-center justify-center font-['Newsreader'] italic leading-none text-white/90 [filter:blur(0.4px)]">
                  <span className="block rotate-[7deg] whitespace-nowrap tracking-[0.04em]">
                    Recommended
                  </span>
                  <span className="mt-1 block rotate-[4deg] whitespace-nowrap tracking-[0.04em]">
                    Today
                  </span>
                </span>
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

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
      </div>
    )
  }, [])

  const startDeckCycle = useCallback(
    (direction, seed = { x: 0, y: 0 }) => {
      if (cycleLockRef.current || menuItems.length < 2) {
        return
      }

      clearHoldFlipTimer()
      clearFlipReturnTimer()
      holdPointerRef.current.active = false
      holdPointerRef.current.pointerId = null
      holdPointerRef.current.moved = false
      setIsTopCardFlipped(false)
      cycleLockRef.current = true
      setActiveThrow({
        direction,
        startX: seed.x ?? 0,
        startY: seed.y ?? 0,
        startRotate: clamp((seed.x ?? 0) / 18, -14, 14),
      })
    },
    [clearFlipReturnTimer, clearHoldFlipTimer, menuItems.length],
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

  const handleTopCardPointerDown = useCallback(
    (event) => {
      const isMobileTouch =
        event.pointerType === 'touch' &&
        (typeof window === 'undefined' ? false : window.innerWidth < 1024)
      if (!isMobileTouch || activeThrow || isTopCardFlipped) {
        return
      }

      clearFlipReturnTimer()
      clearHoldFlipTimer()
      holdPointerRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      }

      holdFlipTimerRef.current = window.setTimeout(() => {
        const hold = holdPointerRef.current
        if (!hold.active || hold.moved) {
          return
        }
        setIsTopCardFlipped(true)
      }, HOLD_TO_FLIP_MS)
    },
    [activeThrow, clearFlipReturnTimer, clearHoldFlipTimer, isTopCardFlipped],
  )

  const handleTopCardPointerMove = useCallback(
    (event) => {
      const hold = holdPointerRef.current
      if (!hold.active || hold.pointerId !== event.pointerId) {
        return
      }

      const distance = Math.hypot(
        event.clientX - hold.startX,
        event.clientY - hold.startY,
      )
      if (distance <= HOLD_MOVE_THRESHOLD_PX) {
        return
      }

      hold.moved = true
      clearHoldFlipTimer()
    },
    [clearHoldFlipTimer],
  )

  const queueFlipBack = useCallback(() => {
    clearFlipReturnTimer()
    flipReturnTimerRef.current = window.setTimeout(() => {
      setIsTopCardFlipped(false)
    }, FLIP_RETURN_DELAY_MS)
  }, [clearFlipReturnTimer])

  const handleTopCardPointerRelease = useCallback(
    (event) => {
      const hold = holdPointerRef.current
      if (hold.pointerId !== null && hold.pointerId !== event.pointerId) {
        return
      }

      clearHoldFlipTimer()
      holdPointerRef.current.active = false
      holdPointerRef.current.pointerId = null
      if (isTopCardFlipped) {
        queueFlipBack()
      }
    },
    [clearHoldFlipTimer, isTopCardFlipped, queueFlipBack],
  )

  const topIndex = activeDeckOrder[0] ?? 0
  const deckHeight =
    Math.max(cardLayoutMetrics.measuredHeight + 265, 380) + DECK_CARD_TOP_OFFSET
  const topItem = menuItems[topIndex]
  const topMenuImage = topItem?.image

  return (
    <section
      id="the-roast"
      className="px-8 py-28"
      style={{ backgroundColor: '#f9f3e8' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="text-center font-['Newsreader'] text-4xl italic text-[var(--primary)] md:text-left md:text-5xl">
            Today&apos;s Selection
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center xl:grid-cols-[minmax(0,1fr)_500px]">
          <div className="lg:flex lg:h-[min(72vh,620px)] lg:items-center">
            <div
              ref={deckRef}
              className="relative mx-auto w-full touch-none pb-4"
              style={{ minHeight: `${deckHeight}px`, perspective: '1400px' }}
              onMouseEnter={() => setIsDeckFanned(true)}
              onMouseLeave={() => setIsDeckFanned(false)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`deck-layer-${categoryMotionKey}`}
                  className="relative h-full w-full"
                  variants={CATEGORY_DECK_LAYER_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {activeDeckOrder.map((itemIndex, depth) => {
                    const item = menuItems[itemIndex]
                    const backImage = item.image
                    const textWidth = cardLayoutMetrics.textWidth
                    const measuredHeight = cardLayoutMetrics.measuredHeight
                    const isTopCard = depth === 0
                    const hiddenDepth = depth >= DECK_VISIBLE_DEPTH
                    const depthOffsetY = depth * 12
                    const depthScale = 1 - depth * 0.035
                    const depthOpacity =
                      depth === 0 ? 1 : depth === 1 ? 0.84 : depth === 2 ? 0.68 : 0
                    const visibleBehindCount = Math.min(
                      Math.max(menuItems.length - 1, 0),
                      DECK_VISIBLE_DEPTH - 1,
                    )
                    const fanOffset = getBehindCardFanPosition(depth, visibleBehindCount)
                    const throwWidth = deckBounds.width || 480
                    const throwHeight = deckBounds.height || 420
                    const visibleCount = Math.min(menuItems.length, DECK_VISIBLE_DEPTH)
                    const showRecommendedBadge =
                      isTopCard && itemIndex === recommendedIndex

                    let animateConfig = {
                      x: isDeckFanned ? fanOffset.x : 0,
                      y: isDeckFanned ? fanOffset.y : depthOffsetY,
                      scale: depthScale,
                      rotate: isDeckFanned ? fanOffset.rotate : 0,
                      rotateY: 0,
                      opacity: hiddenDepth ? 0 : depthOpacity,
                    }
                    let transitionConfig = FAN_TRANSITION

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
                      const exitX =
                        isLeft ? -throwWidth - 160 : isRight ? throwWidth + 160 : 0
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
                        rotateY: 0,
                        opacity: 1,
                      }
                      transitionConfig = {
                        duration: 0.28,
                        ease: [0.2, 0.9, 0.25, 1],
                        times: [0, 0.36, 1],
                      }
                    } else if (isTopCard) {
                      animateConfig = {
                        x: isTopCardFlipped ? -8 : 0,
                        y: isTopCardFlipped ? -14 : 0,
                        scale: 1,
                        rotate: isTopCardFlipped ? -4 : 0,
                        rotateY: isTopCardFlipped ? 180 : 0,
                        opacity: 1,
                      }
                      transitionConfig = {
                        duration: 0.34,
                        ease: [0.22, 0.8, 0.32, 1],
                      }
                    }

                    return (
                      <motion.div
                        key={`deck-swap-${item.name}`}
                        className="absolute left-0 top-0 mt-[54px]"
                        style={{
                          zIndex: menuItems.length - depth,
                        }}
                        custom={{
                          depth,
                          direction: categoryDirection,
                          visibleCount,
                        }}
                        variants={categoryCardPresenceVariants}
                      >
                        <MotionArticle
                          className="relative max-w-full rounded-xl px-8 py-9 md:px-10 md:py-10"
                          style={{
                            backgroundColor: '#ffffff',
                            boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)',
                            border: '3px solid #6b3f2a',
                            width: `min(100%, ${textWidth + 260}px)`,
                            pointerEvents: isTopCard ? 'auto' : 'none',
                            transformStyle: 'preserve-3d',
                            willChange: 'transform',
                          }}
                          drag={isTopCard && !activeThrow && !isTopCardFlipped}
                          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          dragElastic={0.22}
                          dragMomentum={false}
                          onDragEnd={isTopCard ? handleDeckDragEnd : undefined}
                          onPointerDown={isTopCard ? handleTopCardPointerDown : undefined}
                          onPointerMove={isTopCard ? handleTopCardPointerMove : undefined}
                          onPointerUp={isTopCard ? handleTopCardPointerRelease : undefined}
                          onPointerCancel={
                            isTopCard ? handleTopCardPointerRelease : undefined
                          }
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
                          <div className="relative h-full w-full [transform-style:preserve-3d]">
                            <div className="[backface-visibility:hidden]">
                              {renderCardBody(
                                item,
                                textWidth,
                                measuredHeight,
                                showRecommendedBadge,
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-[#fffdf9] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                              <img
                                src={backImage}
                                alt={`${item.name} menu image`}
                                className="h-full w-full object-contain"
                                draggable={false}
                              />
                            </div>
                          </div>
                        </MotionArticle>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
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

        <CategoryToggleRail
          categories={menuCategories}
          activeIndex={categoryIndex}
          onSelectCategory={selectCategory}
          onCycleCategory={cycleCategory}
        />
      </div>
    </section>
  )
}

export default MenuHighlights
