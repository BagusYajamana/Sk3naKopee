function Footer() {
  return (
    <footer className="px-8 py-20" style={{ backgroundColor: '#dfd9cf' }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 border-b border-[rgba(210,196,188,0.35)] pb-12 md:grid-cols-2">
          <div>
            <div className="mb-5 font-['Newsreader'] text-4xl italic tracking-[-0.02em] text-[var(--primary)]">
              Skena Coffee
            </div>
            <p className="max-w-md font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--on_surface)_70%,#4f453f_30%)]">
              An honest tribute to Indonesian coffee heritage, crafted with modern
              precision and artisanal curiosity since 2017.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.16em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
                Discovery
              </span>
              <nav className="space-y-2">
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Our Journal
                </a>
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Roast Profiles
                </a>
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Wholesale
                </a>
              </nav>
            </div>

            <div className="space-y-3">
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.16em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
                Sanctuary
              </span>
              <nav className="space-y-2">
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Bandung
                </a>
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Jakarta
                </a>
                <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                  Bali
                </a>
              </nav>
            </div>

            <div className="space-y-3">
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.16em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
                Join
              </span>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                Newsletter
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                Events
              </a>
              <a href="#" className="block font-['Plus_Jakarta_Sans'] text-sm text-[var(--on_surface)]">
                Careers
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.14em] text-[color:color-mix(in_srgb,var(--on_surface)_52%,#4f453f_48%)] uppercase">
            (c) 2026 Skena Coffee  All rights reserved
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.14em] text-[var(--on_surface)] uppercase">
              Privacy
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.14em] text-[var(--on_surface)] uppercase">
              Terms
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.14em] text-[var(--on_surface)] uppercase">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
