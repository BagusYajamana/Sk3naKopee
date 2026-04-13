import RecommendedBadge from './RecommendedBadge'

function MenuCardFace({
  item,
  textWidth,
  measuredHeight,
  showRecommendedBadge,
}) {
  return (
    <div className="relative">
      <RecommendedBadge show={showRecommendedBadge} />

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
}

export default MenuCardFace
