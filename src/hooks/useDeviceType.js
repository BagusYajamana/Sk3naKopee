import { useEffect, useState } from 'react'

function getIsTouchDevice() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(hover: none)').matches
}

export function useDeviceType() {
  const [isTouch, setIsTouch] = useState(getIsTouchDevice)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)')
    const onChange = (event) => {
      setIsTouch(event.matches)
    }

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return { isTouch }
}
