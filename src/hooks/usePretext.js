import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { layoutPretext, preparePretext } from '../lib/pretext-helpers'

export function usePretext({
  text,
  font,
  minWidth,
  maxWidth,
  lineHeight,
  whiteSpace = 'normal',
  initialProgress = 0.4,
}) {
  const preparedRef = useRef(null)
  const [metrics, setMetrics] = useState(() => ({
    width: minWidth,
    height: lineHeight,
    lineCount: 1,
  }))

  const clampedInitialProgress = useMemo(
    () => Math.max(0, Math.min(1, initialProgress)),
    [initialProgress],
  )

  const recalculate = useCallback(
    (progress = clampedInitialProgress) => {
      const prepared = preparedRef.current
      if (!prepared) {
        return
      }

      const clampedProgress = Math.max(0, Math.min(1, progress))
      const width = Math.round(minWidth + (maxWidth - minWidth) * clampedProgress)
      const result = layoutPretext(prepared, width, lineHeight)
      setMetrics({
        width,
        height: result.height,
        lineCount: result.lineCount,
      })
    },
    [clampedInitialProgress, lineHeight, maxWidth, minWidth],
  )

  useEffect(() => {
    preparedRef.current = preparePretext(text, font, { whiteSpace })
    recalculate(clampedInitialProgress)
  }, [clampedInitialProgress, font, recalculate, text, whiteSpace])

  return {
    metrics,
    recalculate,
  }
}
