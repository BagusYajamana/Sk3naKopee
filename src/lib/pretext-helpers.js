import { layout, prepare } from '@chenglou/pretext'

export function preparePretext(text, font, options) {
  return prepare(text, font, options)
}

export function layoutPretext(prepared, maxWidth, lineHeight) {
  return layout(prepared, maxWidth, lineHeight)
}
