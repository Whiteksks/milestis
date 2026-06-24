'use client'

interface MilestisWhiteLabelProps {
  /** Управляет тем, будет ли плашка кликабельной ссылкой. По умолчанию true. */
  clickable?: boolean;
}

export function MilestisWhiteLabel({ clickable = true }: MilestisWhiteLabelProps) {
  // Базовые стили для контейнера (одинаковые как для ссылки, так и для div)
  const containerClasses = "group fixed bottom-4 left-4 z-[70] focus:outline-none"
  const ariaLabel = "Made in Milestis"

  // Внутреннее содержимое плашки (чтобы не дублировать код разметки)
  const renderContent = () => (
    <div
      className="relative h-7 overflow-hidden rounded-sm
        border border-neutral-200/60 bg-white/80 backdrop-blur-sm
        shadow-[0_1px_4px_rgba(0,0,0,0.06)]
        transition-shadow duration-300 group-hover:shadow-[0_1px_8px_rgba(0,0,0,0.1)]"
    >
      {/* Sliding fill — sweeps left to right on hover */}
      <div
        className="absolute inset-0 w-0 bg-neutral-900 transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
      />

      {/* Text layer — two states stacked vertically, slide up on hover */}
      <div
        className="relative flex items-center px-3
          h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:-translate-y-full"
        aria-hidden="false"
      >
        <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.12em] text-neutral-400 uppercase">
          Made in Milestis
        </span>
      </div>

      {/* Hover text — sits below, slides into view */}
      <div
        className="relative flex items-center px-3
          h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:-translate-y-full"
      >
        <span className="whitespace-nowrap text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
          Create your site →
        </span>
      </div>
    </div>
  );

  // Если clickable true — рендерим как полноценную ссылку
  if (clickable) {
    return (
      <a
        href="https://milestis.com"
        target="_blank"
        rel="noreferrer"
        className={containerClasses}
        aria-label={ariaLabel}
      >
        {renderContent()}
      </a>
    );
  }

  // Если clickable false — рендерим как обычный div (визуально и интерактивно идентичен, но не перенаправляет)
  return (
    <div className={`${containerClasses} cursor-default`} aria-label={ariaLabel}>
      {renderContent()}
    </div>
  );
}