import { useEffect, useRef, useCallback } from "react"
import createGlobe from "../../lib/cobe-patched"

interface GlobeMarker {
  location: [number, number]
  size: number
}

interface CobeGlobeProps {
  markers?: GlobeMarker[]
  size?: number
  speed?: number
}

export function CobeGlobe({
  markers = [],
  size = 500,
  speed = 0.004,
}: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const pointerDown = useRef<{ x: number; y: number } | null>(null)
  const dragDelta = useRef({ phi: 0, theta: 0 })
  const baseOffset = useRef({ phi: 0, theta: 0 })
  const pausedRef = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY }
    pausedRef.current = true
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!pointerDown.current) return
      dragDelta.current = {
        phi: (e.clientX - pointerDown.current.x) / 200,
        theta: (e.clientY - pointerDown.current.y) / 400,
      }
    }
    const onUp = () => {
      if (pointerDown.current) {
        baseOffset.current.phi += dragDelta.current.phi
        baseOffset.current.theta += dragDelta.current.theta
        dragDelta.current = { phi: 0, theta: 0 }
      }
      pointerDown.current = null
      pausedRef.current = false
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 0,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 10,
      mapBaseBrightness: 0,
      baseColor: [0.95, 0.95, 0.95],
      markerColor: [0.31, 0.27, 0.9],
      glowColor: [0.94, 0.93, 0.91],
      opacity: 0.7,
      markers,
      onRender: (state) => {
        if (!pausedRef.current) {
          phiRef.current += speed
        }
        state.phi = phiRef.current + baseOffset.current.phi + dragDelta.current.phi
        state.theta = 0.2 + baseOffset.current.theta + dragDelta.current.theta
      },
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: "1",
        cursor: "grab",
        touchAction: "none",
      }}
    />
  )
}
