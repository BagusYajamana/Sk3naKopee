import { useEffect, useState } from 'react'
import { usePullQuoteLayout } from '../hooks/usePullQuoteLayout'

const QUOTE_TEXT =
  '"In Bandung, we found that the city breathes at its own pace. Skena was built to honor that rhythm, creating a space where the world slows down for exactly as long as it takes to brew a perfect V60."'

function PullQuote() {
  const [columnWidth, setColumnWidth] = useState(0)
  const [obstacleRect, setObstacleRect] = useState(null)

  useEffect(() => {
    const measure = () => {
      const stage = document.getElementById('pullquote-stage')
      const obstacle = document.getElementById('pullquote-obstacle')
      if (!stage || !obstacle) {
        return
      }

      const stageRect = stage.getBoundingClientRect()
      const obstacleRectRaw = obstacle.getBoundingClientRect()

      setColumnWidth(stageRect.width)
      setObstacleRect({
        x: obstacleRectRaw.left - stageRect.left,
        y: obstacleRectRaw.top - stageRect.top,
        width: obstacleRectRaw.width,
        height: obstacleRectRaw.height,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    const stage = document.getElementById('pullquote-stage')
    const obstacle = document.getElementById('pullquote-obstacle')
    if (stage) {
      observer.observe(stage)
    }
    if (obstacle) {
      observer.observe(obstacle)
    }
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const routed = usePullQuoteLayout({
    quote: QUOTE_TEXT,
    columnWidth,
    obstacleRect,
    lineHeight: 66,
  })

  return (
    <section className="bg-[var(--surface)] px-8 py-32">
      <div className="mx-auto max-w-7xl">
        <div id="pullquote-stage" className="relative">
          <div className="float-right ml-10 mb-8 hidden w-[30%] md:block">
            <div
              id="pullquote-obstacle"
              className="organic-mask-1 aspect-[3/4] overflow-hidden bg-[#ede8dd]"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWmLJ45kkz2PtEHTJc-23Yct_1Onp6beg6RB4dj-LEEe4QihzPafZf7XYhwh94hYP1U16yKQRzYTo2FNu43ZcwlJ10CrbfNNlReRQ4qpQWgWf6AIqHIW0rjlhmHfz0alNt-vdA44FiAWdtfxL9J-QmzvvHM0fN4KPi5WzuN_v_tu_2QxgI4y0SukluH44vbI1M8Y-fdYfiIzZHrfBozYIQPM6w5ox9SsjF6vhiIWubXjQ30GLeg3pZ4oqRuF8J-d7cXL6oGEhBP08"
                alt="Skena Coffee interior atmosphere"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div
            className="relative"
            style={{ minHeight: `${Math.max(routed.height, 280)}px` }}
          >
            {routed.lines.map((line) => (
              <div
                key={line.key}
                className="absolute font-['Newsreader'] text-4xl leading-[66px] italic text-[var(--primary)] md:text-6xl"
                style={{
                  left: `${line.x}px`,
                  top: `${line.y}px`,
                  width: `${line.width}px`,
                  whiteSpace: 'pre',
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-[var(--primary)]" />
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-[0.14em] text-[color:color-mix(in_srgb,var(--on_surface)_56%,#4f453f_44%)] uppercase">
              The Founder&apos;s Journal, 2021
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PullQuote
