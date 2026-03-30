import { useState } from 'react'

const navLinks = ['Heritage', 'The Roast', 'Brew Guide', 'Locations']

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-8">
      <nav
        className="mx-auto max-w-6xl rounded-xl px-4 py-3 md:px-6 md:py-4"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          backdropFilter: 'blur(12px)',
          color: 'var(--on_surface)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <a
            href="#top"
            className="text-base font-semibold tracking-[0.08em] uppercase"
            style={{ color: 'var(--primary)' }}
          >
            Skena Coffee
          </a>

          <button
            type="button"
            className="inline-flex h-10 items-center rounded px-3 text-sm font-medium md:hidden"
            style={{
              color: 'var(--on_surface)',
              backgroundColor:
                'color-mix(in srgb, var(--surface) 65%, var(--primary) 35%)',
            }}
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium tracking-[0.04em]"
                style={{ color: 'var(--on_surface)' }}
              >
                {link}
              </a>
            ))}
          </div>

          <a
            href="#order"
            className="hidden rounded px-4 py-2 text-sm font-semibold md:inline-flex"
            style={{
              color: 'var(--surface)',
              background:
                'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 72%, #2b1a0e 28%))',
            }}
          >
            Order Now
          </a>
        </div>

        {isOpen ? (
          <div id="mobile-nav" className="pt-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium tracking-[0.04em]"
                  style={{ color: 'var(--on_surface)' }}
                  onClick={() => setIsOpen(false)}
                >
                  {link}
                </a>
              ))}
              <a
                href="#order"
                className="mt-1 inline-flex w-fit rounded px-4 py-2 text-sm font-semibold"
                style={{
                  color: 'var(--surface)',
                  background:
                    'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 72%, #2b1a0e 28%))',
                }}
              >
                Order Now
              </a>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
