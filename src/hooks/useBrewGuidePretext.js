import { useMemo } from 'react'
import { layoutPretext, preparePretext } from '../lib/pretext-helpers'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function useBrewGuidePretext(items, viewportWidth) {
  const preparedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        preparedBody: preparePretext(item.body, '500 17px "Plus Jakarta Sans"'),
      })),
    [items],
  )

  return useMemo(() => {
    const panelWidth = clamp(Math.floor(viewportWidth * 0.44), 280, 620)
    const textWidth = Math.max(panelWidth - 24, 220)
    const lineHeight = 30
    const bodyPadding = 32

    return preparedItems.map((item) => {
      const metrics = layoutPretext(item.preparedBody, textWidth, lineHeight)
      return {
        id: item.id,
        textWidth,
        expandedHeight: metrics.height + bodyPadding,
      }
    })
  }, [preparedItems, viewportWidth])
}
