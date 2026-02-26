// Backward-compatible re-exports.
// New code should import directly from store-content-portfolio or store-content-photobook.
export {
  defaultPortfolioVisibility as defaultSectionVisibility,
  defaultPortfolioContent as defaultSectionContent,
} from './store-content-portfolio'

export {
  defaultPhotobookVisibility,
  defaultPhotobookContent,
} from './store-content-photobook'

// Kept as a named alias so old imports like `defaultSectionVisibility` keep working.
// TypeScript will alert if this file is imported in new code that should use slices directly.
