import { useMemo } from 'react'
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

  const layouts = useMenuHighlightLayout(menuItems)

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

        <div className="space-y-6">
          {menuItems.map((item, index) => {
            const layout = layouts[index]
            const textWidth = layout?.width ?? 360
            const measuredHeight = layout?.height ?? 120

            return (
              <article
                key={item.name}
                className="w-fit max-w-full rounded-xl px-8 py-9 md:px-10 md:py-10"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)',
                  width: `min(100%, ${textWidth + 260}px)`,
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
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MenuHighlights
