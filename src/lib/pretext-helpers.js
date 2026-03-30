import { layout, layoutNextLine, prepare, prepareWithSegments } from '@chenglou/pretext'

export function preparePretext(text, font, options) {
  return prepare(text, font, options)
}

export function layoutPretext(prepared, maxWidth, lineHeight) {
  return layout(prepared, maxWidth, lineHeight)
}

export function preparePretextWithSegments(text, font, options) {
  return prepareWithSegments(text, font, options)
}

export function layoutPretextNextLine(prepared, start, maxWidth) {
  return layoutNextLine(prepared, start, maxWidth)
}
