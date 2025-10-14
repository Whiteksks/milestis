import { ReactNode } from "react"

interface FloatingContainerProps {
  children: ReactNode
}

const FloatingContainer = ({ children }: FloatingContainerProps) => {
  return (
    <main className="flex-grow p-4 md:p-6 ml-0 md:ml-[calc(80px+24px)]">
      <div
        className="
          rounded-2xl md:rounded-3xl 
          shadow-2xl border border-border 
          p-4 md:p-6 
          min-h-[calc(100vh-64px)]
          md:min-h-0
          md:h-[calc(100vh-48px)]
          overflow-visible md:overflow-y-auto
        "
        style={{
          background: `linear-gradient(
            135deg,
            var(--background) 0%,
            var(--card) 50%,
            var(--secondary) 100%
          )`,
          boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.01)",
        }}
      >
        {children}
      </div>
    </main>
  )
}

export default FloatingContainer
