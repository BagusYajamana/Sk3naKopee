import { useMemo } from 'react'
import {
  layoutPretextNextLine,
  preparePretextWithSegments,
} from '../lib/pretext-helpers'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getBlockedIntervalForBand(obstacle, bandTop, bandBottom) {
  if (!obstacle) {
    return null
  }

  const obstacleTop = obstacle.y
  const obstacleBottom = obstacle.y + obstacle.height
  if (bandBottom <= obstacleTop || bandTop >= obstacleBottom) {
    return null
  }

  return {
    left: obstacle.x,
    right: obstacle.x + obstacle.width,
  }
}

function carveSlots(base, blocked) {
  let slots = [base]
  for (let i = 0; i < blocked.length; i += 1) {
    const block = blocked[i]
    const next = []
    for (let j = 0; j < slots.length; j += 1) {
      const slot = slots[j]
      if (block.right <= slot.left || block.left >= slot.right) {
        next.push(slot)
        continue
      }
      if (block.left > slot.left) {
        next.push({ left: slot.left, right: block.left })
      }
      if (block.right < slot.right) {
        next.push({ left: block.right, right: slot.right })
      }
    }
    slots = next
  }

  return slots
    .map((slot) => ({
      left: clamp(slot.left, base.left, base.right),
      right: clamp(slot.right, base.left, base.right),
    }))
    .filter((slot) => slot.right - slot.left >= 48)
    .sort((a, b) => a.left - b.left)
}

function layoutParagraphAroundObstacle(
  prepared,
  paragraphIndex,
  lineHeight,
  columnWidth,
  startY,
  obstacle,
) {
  const lines = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = startY

  while (true) {
    const bandTop = y
    const bandBottom = y + lineHeight
    const interval = getBlockedIntervalForBand(obstacle, bandTop, bandBottom)
    const slots = carveSlots(
      { left: 0, right: columnWidth },
      interval ? [interval] : [],
    )

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
        key: `${paragraphIndex}-${y}-${i}-${line.start.segmentIndex}-${line.start.graphemeIndex}`,
        paragraphIndex,
        x: Math.round(slot.left),
        y: Math.round(y),
        width: line.width,
        text: line.text,
      })
      cursor = line.end
    }

    if (exhausted) {
      break
    }
    y += lineHeight
  }

  return { lines, endY: y }
}

export function useAboutOrbLayout({
  paragraphs,
  columnWidth,
  orbRect,
  lineHeight = 34,
  paragraphGap = 30,
}) {
  const preparedParagraphs = useMemo(
    () =>
      paragraphs.map((paragraph) =>
        preparePretextWithSegments(paragraph, '500 19px "Plus Jakarta Sans"'),
      ),
    [paragraphs],
  )

  return useMemo(() => {
    if (!columnWidth || columnWidth <= 0) {
      return { lines: [], height: 0 }
    }

    const hasOverlap =
      orbRect &&
      orbRect.width > 0 &&
      orbRect.height > 0 &&
      orbRect.x < columnWidth &&
      orbRect.x + orbRect.width > 0

    const constrainedOrbRect = hasOverlap
      ? {
          x: clamp(orbRect.x, 0, columnWidth),
          y: Math.max(orbRect.y, 0),
          width: clamp(orbRect.width, 0, columnWidth),
          height: Math.max(orbRect.height, 0),
        }
      : null

    const outputLines = []
    let y = 0

    for (let i = 0; i < preparedParagraphs.length; i += 1) {
      const paragraphLayout = layoutParagraphAroundObstacle(
        preparedParagraphs[i],
        i,
        lineHeight,
        columnWidth,
        y,
        constrainedOrbRect,
      )
      outputLines.push(...paragraphLayout.lines)
      y = paragraphLayout.endY + paragraphGap
    }

    return {
      lines: outputLines,
      height: Math.max(y - paragraphGap, lineHeight),
    }
  }, [
    columnWidth,
    lineHeight,
    orbRect,
    paragraphGap,
    preparedParagraphs,
  ])
}
