import React, { useRef, useCallback, useEffect } from 'react'

const useResizable = (initialWidth = 240, min = 160, max = 500) => {
  const [leftWidth, setLeftWidth] = React.useState(initialWidth)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const onResizeMove = useCallback((e) => {
    if (!dragging.current) return
    const delta = e.clientX - startX.current
    setLeftWidth(Math.min(Math.max(startWidth.current + delta, min), max))
  }, [min, max])

  const onResizeEnd = useCallback(() => {
    dragging.current = false
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
  }, [onResizeMove])

  const onResizeStart = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    startX.current = e.clientX
    startWidth.current = leftWidth
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
  }, [leftWidth, onResizeMove, onResizeEnd])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
    }
  }, [onResizeMove, onResizeEnd])

  return [leftWidth, onResizeStart]
}

export default useResizable
