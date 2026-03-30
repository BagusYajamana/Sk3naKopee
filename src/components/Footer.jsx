function Footer() {
  return (
    <footer className="relative overflow-hidden px-8 py-20" style={{ backgroundColor: '#ece5d9' }}>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-[0.06em] text-[var(--primary)] uppercase">
              SKENA COFFEE
            </h3>
            <p className="max-w-xs font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--on_surface)_66%,#4f453f_34%)]">
              An honest tribute to Indonesian coffee heritage. Crafted with modern
              precision and artisanal curiosity since 2017.
            </p>
          </div>

          <div>
            <span className="mb-4 block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_50%,#4f453f_50%)] uppercase">
              DISCOVERY
            </span>
            <nav className="space-y-3">
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Our Journal
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Roast Profiles
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Wholesale
              </a>
            </nav>
          </div>

          <div>
            <span className="mb-4 block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_50%,#4f453f_50%)] uppercase">
              SANCTUARY
            </span>
            <nav className="space-y-3">
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Bandung
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Jakarta
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] no-underline hover:underline">
                Bali
              </a>
            </nav>
          </div>

          <div>
            <span className="mb-4 block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_50%,#4f453f_50%)] uppercase">
              JOIN THE RITUAL
            </span>
            <form className="flex items-center gap-2" action="#">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent px-0 py-2 font-['Plus_Jakarta_Sans'] text-sm text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] placeholder:text-[color:color-mix(in_srgb,var(--on_surface)_42%,#4f453f_58%)] focus:outline-none"
                style={{ borderBottom: '2px rgba(210, 196, 188, 0.75) solid' }}
              />
              <button
                type="submit"
                className="h-9 w-9 bg-transparent font-['Plus_Jakarta_Sans'] text-lg font-semibold leading-none text-[var(--primary)]"
                aria-label="Submit email"
              >
                &rarr;
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_50%,#4f453f_50%)] uppercase">
            (c) 2026 SKENA COFFEE  ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] uppercase no-underline hover:underline">
              PRIVACY
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] uppercase no-underline hover:underline">
              TERMS
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.1em] text-[color:color-mix(in_srgb,var(--on_surface)_82%,#4f453f_18%)] uppercase no-underline hover:underline">
              ACCESSIBILITY
            </a>
          </div>
        </div>

        <div className="pointer-events-none mt-14">
          <span className="block text-center font-['Newsreader'] text-[20vw] leading-none font-bold italic tracking-[-0.03em] text-[color:color-mix(in_srgb,var(--primary)_13%,transparent)]">
            SKENA COFFEE
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
