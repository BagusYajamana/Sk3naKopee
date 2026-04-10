import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CATEGORY_SWIPE_THRESHOLD = 44
const CATEGORY_TOGGLE_TRANSITION = {
  duration: 0.3,
  ease: [0.2, 0.82, 0.24, 1],
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function CategoryToggleRail({
  categories,
  activeIndex,
  onSelectCategory,
  onCycleCategory,
}) {
  const displayedCategories = useMemo(() => {
    if (categories.length <= 1) {
      return categories.map((category, actualIndex) => ({
        ...category,
        actualIndex,
        displayKey: `category-${category.id}`,
      }))
    }

    const firstCategory = categories[0]
    const lastCategory = categories[categories.length - 1]

    return [
      {
        ...lastCategory,
        actualIndex: categories.length - 1,
        displayKey: `ghost-start-${lastCategory.id}`,
      },
      ...categories.map((category, actualIndex) => ({
        ...category,
        actualIndex,
        displayKey: `category-${category.id}`,
      })),
      {
        ...firstCategory,
        actualIndex: 0,
        displayKey: `ghost-end-${firstCategory.id}`,
      },
    ]
  }, [categories])

  const viewportRef = useRef(null)
  const tabRefs = useRef([])
  const swipeStartRef = useRef({ x: 0, y: 0 })
  const [metrics, setMetrics] = useState(() => ({
    viewportWidth: 0,
    trackWidth: 0,
    tabs: [],
  }))

  const activeDisplayIndex = categories.length > 1 ? activeIndex + 1 : activeIndex
  const activeTabMetric = metrics.tabs[activeDisplayIndex] ?? null
  const offsetX = useMemo(() => {
    if (!activeTabMetric || metrics.viewportWidth === 0) {
      return 0
    }

    const desiredOffset =
      metrics.viewportWidth / 2 - (activeTabMetric.left + activeTabMetric.width / 2)
    const minimumOffset = Math.min(0, metrics.viewportWidth - metrics.trackWidth)

    return clamp(desiredOffset, minimumOffset, 0)
  }, [activeTabMetric, metrics])

  const setTabRef = useCallback((index, node) => {
    tabRefs.current[index] = node
  }, [])

  const handleSwipeStart = useCallback((event) => {
    const touch = event.touches?.[0]
    if (!touch) {
      return
    }

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }, [])

  const handleSwipeEnd = useCallback(
    (event) => {
      const touch = event.changedTouches?.[0]
      if (!touch) {
        return
      }

      const deltaX = touch.clientX - swipeStartRef.current.x
      const deltaY = touch.clientY - swipeStartRef.current.y
      if (
        Math.abs(deltaX) < CATEGORY_SWIPE_THRESHOLD ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      ) {
        return
      }

      onCycleCategory(deltaX > 0 ? 'left' : 'right')
    },
    [onCycleCategory],
  )

  useLayoutEffect(() => {
    const measure = () => {
      const viewportWidth = viewportRef.current?.clientWidth ?? 0
      const tabs = displayedCategories.map((_, index) => {
        const node = tabRefs.current[index]
        return node
          ? {
              left: node.offsetLeft,
              width: node.offsetWidth,
            }
          : null
      })
      const lastTab = tabs[tabs.length - 1]
      const trackWidth = lastTab ? lastTab.left + lastTab.width : 0

      setMetrics((current) => {
        const sameViewport = current.viewportWidth === viewportWidth
        const sameTrack = current.trackWidth === trackWidth
        const sameTabs =
          current.tabs.length === tabs.length &&
          current.tabs.every((tab, index) => {
            const nextTab = tabs[index]
            return tab?.left === nextTab?.left && tab?.width === nextTab?.width
          })

        return sameViewport && sameTrack && sameTabs
          ? current
          : { viewportWidth, trackWidth, tabs }
      })
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current)
    }

    tabRefs.current.forEach((node) => {
      if (node) {
        resizeObserver.observe(node)
      }
    })

    window.addEventListener('resize', measure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [displayedCategories])

  return (
    <div className="mx-auto mt-10 flex w-full justify-center md:mt-12">
      <div className="relative w-full max-w-[17rem] rounded-full border border-[color:color-mix(in_srgb,var(--primary)_12%,transparent)] bg-[color:color-mix(in_srgb,#fff7eb_80%,var(--surface)_20%)] p-1.5 shadow-[0_18px_32px_rgba(73,50,34,0.08)]">
        <div className="pointer-events-none absolute inset-y-1.5 left-1.5 z-20 w-12 rounded-l-full bg-gradient-to-r from-[color:color-mix(in_srgb,#fff7eb_92%,var(--surface)_8%)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-1.5 right-1.5 z-20 w-12 rounded-r-full bg-gradient-to-l from-[color:color-mix(in_srgb,#fff7eb_92%,var(--surface)_8%)] to-transparent" />
        <div
          ref={viewportRef}
          className="relative overflow-hidden rounded-full touch-pan-y"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          <motion.div
            className="absolute top-1/2 z-0 h-11 -translate-y-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_88%,#b96a42_12%)] shadow-[0_14px_24px_rgba(107,63,42,0.18)]"
            animate={{
              x: (activeTabMetric?.left ?? 0) + offsetX,
              width: activeTabMetric?.width ?? 0,
              opacity: activeTabMetric ? 1 : 0,
            }}
            transition={CATEGORY_TOGGLE_TRANSITION}
          />

          <motion.div
            className="relative z-10 flex w-max items-center gap-3 px-3 py-1.5"
            animate={{ x: offsetX }}
            transition={CATEGORY_TOGGLE_TRANSITION}
          >
            {displayedCategories.map((category, displayIndex) => {
              const isActive = displayIndex === activeDisplayIndex

              return (
                <button
                  key={category.displayKey}
                  ref={(node) => setTabRef(displayIndex, node)}
                  type="button"
                  aria-pressed={isActive}
                  className="relative flex h-11 shrink-0 items-center justify-center rounded-full px-5"
                  onClick={() => onSelectCategory(category.actualIndex)}
                >
                  <span
                    className={`font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-[0.1em] uppercase transition-opacity duration-200 ${
                      isActive
                        ? 'text-[#fdf8f0]'
                        : 'text-[color:color-mix(in_srgb,var(--on_surface)_74%,#4f453f_26%)] opacity-50 md:hover:opacity-80'
                    }`}
                  >
                    {category.label}
                  </span>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CategoryToggleRail
