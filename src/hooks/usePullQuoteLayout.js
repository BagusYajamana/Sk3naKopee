import { useMemo } from 'react'
import {
  layoutPretextNextLine,
  preparePretextWithSegments,
} from '../lib/pretext-helpers'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function carveSlots(base, blocked) {
  let slots = [base]
  for (let i = 0; i < blocked.length; i += 1) {
    const obstacle = blocked[i]
    const next = []
    for (let j = 0; j < slots.length; j += 1) {
      const slot = slots[j]
      if (obstacle.right <= slot.left || obstacle.left >= slot.right) {
        next.push(slot)
        continue
      }
      if (obstacle.left > slot.left) {
        next.push({ left: slot.left, right: obstacle.left })
      }
      if (obstacle.right < slot.right) {
        next.push({ left: obstacle.right, right: slot.right })
      }
    }
    slots = next
  }

  return slots
    .map((slot) => ({
      left: clamp(slot.left, base.left, base.right),
      right: clamp(slot.right, base.left, base.right),
    }))
    .filter((slot) => slot.right - slot.left >= 56)
    .sort((a, b) => a.left - b.left)
}

export function usePullQuoteLayout({
  quote,
  columnWidth,
  obstacleRect,
  lineHeight = 66,
}) {
  const prepared = useMemo(
    () =>
      preparePretextWithSegments(
        quote,
        'italic 600 54px "Newsreader"',
      ),
    [quote],
  )

  return useMemo(() => {
    if (!columnWidth || columnWidth <= 0) {
      return { lines: [], height: 0 }
    }

    const constrainedObstacle = obstacleRect
      ? {
          x: clamp(obstacleRect.x, 0, columnWidth),
          y: Math.max(obstacleRect.y, 0),
          width: clamp(obstacleRect.width, 0, columnWidth),
          height: Math.max(obstacleRect.height, 0),
        }
      : null

    const lines = []
    let y = 0
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }

    while (true) {
      const bandTop = y
      const bandBottom = y + lineHeight
      const blocked = []

      if (
        constrainedObstacle &&
        bandBottom > constrainedObstacle.y &&
        bandTop < constrainedObstacle.y + constrainedObstacle.height
      ) {
        blocked.push({
          left: constrainedObstacle.x,
          right: constrainedObstacle.x + constrainedObstacle.width,
        })
      }

      const slots = carveSlots({ left: 0, right: columnWidth }, blocked)
      if (slots.length === 0) {
        y += lineHeight
        continue
      }

      let exhausted = false
      for (let i = 0; i < slots.length; i += 1) {
        const slot = slots[i]
        const line = layoutPretextNextLine(
          prepared,
          cursor,
          Math.max(slot.right - slot.left, 1),
        )
        if (!line) {
          exhausted = true
          break
        }

        lines.push({
          key: `${y}-${i}-${line.start.segmentIndex}-${line.start.graphemeIndex}`,
          text: line.text,
          x: Math.round(slot.left),
          y: Math.round(y),
          width: line.width,
        })
        cursor = line.end
      }

      if (exhausted) {
        break
      }
      y += lineHeight
    }

    return {
      lines,
      height: Math.max(y + lineHeight * 0.6, lineHeight),
    }
  }, [columnWidth, lineHeight, obstacleRect, prepared])
}
