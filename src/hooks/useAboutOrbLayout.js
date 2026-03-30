import { useMemo } from 'react'
import { layoutPretext, preparePretext } from '../lib/pretext-helpers'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getLineBandCenter(index, total) {
  if (total <= 1) {
    return 0.5
  }
  return 0.25 + (index / (total - 1)) * 0.5
}

export function useAboutOrbLayout(paragraphs, orbPosition) {
  const preparedParagraphs = useMemo(
    () =>
      paragraphs.map((paragraph) =>
        preparePretext(paragraph, '500 19px "Plus Jakarta Sans"'),
      ),
    [paragraphs],
  )

  const xInfluence = 1 - Math.abs(orbPosition.x)
  const yNormalized = clamp((orbPosition.y + 1) / 2, 0, 1)

  return useMemo(() => {
    const maxWidth = 720
    const minWidth = 420
    const lineHeight = 34
    const maxIndent = 144

    return preparedParagraphs.map((prepared, index) => {
      const bandCenter = getLineBandCenter(index, preparedParagraphs.length)
      const yInfluence = clamp(1 - Math.abs(yNormalized - bandCenter) * 1.8, 0, 1)
      const exclusionStrength = clamp(xInfluence * yInfluence, 0, 1)
      const paragraphWidth = Math.round(
        maxWidth - (maxWidth - minWidth) * exclusionStrength,
      )
      const paragraphIndent = Math.round(maxIndent * exclusionStrength)
      const metrics = layoutPretext(prepared, paragraphWidth, lineHeight)

      return {
        width: paragraphWidth,
        indent: paragraphIndent,
        height: metrics.height,
      }
    })
  }, [preparedParagraphs, xInfluence, yNormalized])
}
