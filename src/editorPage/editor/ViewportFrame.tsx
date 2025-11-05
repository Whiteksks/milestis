"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Device = "desktop" | "tablet" | "mobile"

const DEVICE_WIDTHS: Record<Device, number> = {
  mobile: 390, // iPhone 12/13/14 width
  tablet: 768, // iPad portrait
  desktop: 1280,
}

export function ViewportFrame({
  device = "desktop",
  className,
  children,
  heightOffset = 120, // pixels reserved for top bars, paddings, etc.
}: {
  device?: Device
  className?: string
  children: React.ReactNode
  heightOffset?: number
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  const heightStyle = useMemo(() => {
    return { height: `calc(100vh - ${heightOffset}px)` }
  }, [heightOffset])

  useLayoutEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // Basic document structure
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head><body><div id="root"></div></body></html>`)
    doc.close()

    // Copy theme classes and inline styles (dark mode, fonts, etc.)
    try {
      const parentHtml = document.documentElement
      const html = doc.documentElement
      html.setAttribute("class", parentHtml.getAttribute("class") || "")
      const styleAttr = parentHtml.getAttribute("style")
      if (styleAttr) html.setAttribute("style", styleAttr)
    } catch {}

    // Copy all style and stylesheet link tags so Tailwind + globals apply inside the iframe
    const head = doc.head
    const nodes = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
    nodes.forEach((node) => head.appendChild(node.cloneNode(true)))

    // Mount point
    const mount = doc.getElementById("root") || doc.body
    setMountNode(mount as HTMLElement)
  }, [])

  // Keep theme class in sync if it changes dynamically
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    const observer = new MutationObserver(() => {
      const parentHtml = document.documentElement
      const html = doc.documentElement
      html.setAttribute("class", parentHtml.getAttribute("class") || "")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`w-full flex justify-center ${className ?? ""}`}>
      <div
        style={{ width: DEVICE_WIDTHS[device], ...heightStyle, willChange: "width, height" }}
        className="transition-all mt-2 duration-300 ease-in-out overflow-hidden"
      >
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%" }}
          className="border mt-2 rounded-sm bg-background shadow-sm"
        />
      </div>
      {mountNode ? createPortal(children as any, mountNode) : null}
    </div>
  )
}
