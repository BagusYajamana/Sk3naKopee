import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMenuHighlightLayout } from '../hooks/useMenuHighlightLayout'

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

  const floatProfiles = useMemo(
    () =>
      menuItems.map((item, index) => {
        const seed = item.name
          .split('')
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const distance = 8 + (seed % 11)
        const duration = 12 + ((seed + index) % 8)
        const delay = (seed % 5) * 0.8
        return { distance, duration, delay }
      }),
    [menuItems],
  )

  const layouts = useMenuHighlightLayout(menuItems)
  const MotionArticle = motion.article
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const [travelDistances, setTravelDistances] = useState(() =>
    menuItems.map(() => 0),
  )

  useLayoutEffect(() => {
    const measure = () => {
      const trackWidth = trackRef.current?.clientWidth ?? 0
      const nextDistances = menuItems.map((_, index) => {
        const cardWidth = cardRefs.current[index]?.offsetWidth ?? 0
        return Math.max(trackWidth - cardWidth, 0)
      })

      setTravelDistances((current) => {
        const isSame =
          current.length === nextDistances.length &&
          current.every((value, index) => value === nextDistances[index])
        return isSame ? current : nextDistances
      })
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current)
    }
    cardRefs.current.forEach((element) => {
      if (element) {
        resizeObserver.observe(element)
      }
    })
    window.addEventListener('resize', measure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [menuItems])

  return (
    <section
      id="the-roast"
      className="px-8 py-24"
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

        <div ref={trackRef} className="space-y-6">
          {menuItems.map((item, index) => {
            const layout = layouts[index]
            const textWidth = layout?.width ?? 360
            const measuredHeight = layout?.height ?? 120
            const travel = travelDistances[index] ?? 0

            return (
              <MotionArticle
                key={item.name}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className="w-fit max-w-full rounded-xl px-8 py-9 md:px-10 md:py-10"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)',
                  width: `min(100%, ${textWidth + 260}px)`,
                }}
                animate={{
                  x: travel > 0 ? [0, travel, 0] : 0,
                }}
                transition={{
                  duration: (floatProfiles[index]?.duration ?? 14) + travel / 90,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: floatProfiles[index]?.delay ?? 0,
                }}
              >
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
              </MotionArticle>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MenuHighlights
