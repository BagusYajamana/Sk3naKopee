import locationImage from '../assets/images/location-image.png'

function LocationHours() {
  const hours = [
    { day: 'Monday - Friday', time: '08:00 - 22:00' },
    { day: 'Saturday', time: '07:00 - 23:00' },
    { day: 'Sunday', time: '07:00 - 22:00' },
  ]

  return (
    <section id="locations" className="bg-[#ede8dd] px-8 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <span className="mb-6 block font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.18em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
            Our Flagship Sanctuary
          </span>
          <h2 className="mb-8 font-['Newsreader'] text-4xl italic text-[var(--primary)] md:text-5xl">
            Bandung, West Java
          </h2>
          <p className="mb-10 font-['Plus_Jakarta_Sans'] text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--on_surface)_74%,#4f453f_26%)]">
            Jl. Gatot Subroto No. 289
            <br />
            Batununggal, Bandung
            <br />
            Jawa Barat 40274
          </p>

          <div className="mb-12 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex px-8 py-4 font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 72%, #2b1a0e 28%))',
                color: 'var(--surface)',
              }}
            >
              Get Directions
            </a>
            <a
              href="#"
              className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-[0.14em] text-[var(--primary)] uppercase"
            >
              @skenacoffee
            </a>
          </div>

          <div className="organic-mask-1 h-[280px] overflow-hidden bg-[#d8d1c6]">
            <img
              src={locationImage}
              alt="Map lokasi Skena Coffee, Bandung"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div
          className="h-fit rounded-xl bg-[#fffdf8] px-8 py-10 md:px-10"
          style={{ boxShadow: '0 40px 40px -15px rgba(29, 28, 21, 0.06)' }}
        >
          <h3 className="mb-8 font-['Newsreader'] text-3xl italic text-[var(--primary)] md:text-4xl">
            Service Hours
          </h3>
          <div className="space-y-4">
            {hours.map((item) => (
              <div
                key={item.day}
                className="grid grid-cols-[1fr_auto] items-center gap-4 py-3"
                style={{ borderBottom: '2px rgba(210, 196, 188, 0.25) solid' }}
              >
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-[0.14em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
                  {item.day}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[color:color-mix(in_srgb,var(--on_surface)_76%,#4f453f_24%)]">
                  {item.time}
                </span>
              </div>
            ))}
            <div className="pt-4 font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-[0.2em] text-[color:color-mix(in_srgb,var(--on_surface)_52%,#4f453f_48%)] uppercase">
              Brewing Now
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationHours
