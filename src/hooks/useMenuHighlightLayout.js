import { useEffect, useMemo, useState } from 'react'
import { layoutPretext, preparePretext } from '../lib/pretext-helpers'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function findTightWidth(prepared, minWidth, maxWidth, lineHeight) {
  let best = {
    width: maxWidth,
    height: layoutPretext(prepared, maxWidth, lineHeight).height,
    area: Number.POSITIVE_INFINITY,
    lineCount: 1,
  }

  for (let width = minWidth; width <= maxWidth; width += 8) {
    const result = layoutPretext(prepared, width, lineHeight)
    const area = width * result.height
    if (area < best.area) {
      best = {
        width,
        height: result.height,
        area,
        lineCount: result.lineCount,
      }
    }
  }

  return best
}

export function useMenuHighlightLayout(items) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )
  const preparedItems = useMemo(
    () =>
      items.map((item) =>
        preparePretext(item.description, '500 18px "Plus Jakarta Sans"'),
      ),
    [items],
  )

  const textWidths = useMemo(() => {
    const maxWidth = clamp(Math.floor(viewportWidth * 0.46), 280, 520)
    const minWidth = clamp(Math.floor(maxWidth * 0.55), 220, 320)
    const lineHeight = 30

    return preparedItems.map((prepared) =>
      findTightWidth(prepared, minWidth, maxWidth, lineHeight),
    )
  }, [preparedItems, viewportWidth])

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return textWidths
}
