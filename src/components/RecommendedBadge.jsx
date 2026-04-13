import { AnimatePresence, motion } from 'framer-motion'

const RECOMMENDED_BADGE_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 0.8, 0.28, 1],
}

function RecommendedBadge({ show }) {
  return (
    <AnimatePresence>
      {show ? (
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
  )
}

export default RecommendedBadge
