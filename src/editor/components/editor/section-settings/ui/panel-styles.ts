/**
 * Shared style tokens for editor section-settings panels.
 * Change values here to update all panels at once.
 */
export const ps = {
  /** Root wrapper vertical spacing */
  root: (dense: boolean) => (dense ? "space-y-2" : "space-y-2.5"),

  /** Two-column grid for paired inputs */
  grid2: (dense: boolean) => (dense ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2.5"),

  /** Standard single-line input */
  input: "h-9 text-xs rounded-xs",

  /** Single-line input that fills a flex row */
  inputFlex: "flex-1 h-9 text-xs rounded-xs",

  /**
   * Textarea with configurable min-height.
   * Pass Tailwind min-h-* classes for dense and normal modes.
   */
  textarea: (dense: boolean, denseH = "min-h-20", normalH = "min-h-24") =>
    `${dense ? denseH : normalH} text-xs resize-none rounded-xs`,

  /** "Add" ghost button used in section header rows */
  addBtn: "h-7 text-xs text-muted-foreground hover:text-foreground px-2",

  /** Delete icon button in list rows */
  deleteBtn: "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted shrink-0",

  /** Clickable empty-state zone */
  emptyZone:
    "group w-full rounded-lg border border-dashed border-border hover:border-primary/50 bg-transparent hover:bg-muted/40 transition-colors px-4 py-4 flex flex-col items-center gap-1.5 cursor-pointer",

  /** Icon inside empty-state zone */
  emptyIcon: "w-4 h-4 text-muted-foreground/50 group-hover:text-primary/60 transition-colors",

  /** Label text inside empty-state zone */
  emptyText: "text-[11px] text-muted-foreground group-hover:text-foreground transition-colors",

  // ─── Photobook panels (slightly larger than portfolio) ───────────────────────

  /** Root wrapper for photobook panels (no dense mode) */
  pbRoot: "space-y-3",

  /** Two-column grid for photobook panels */
  pbGrid2: "grid grid-cols-2 gap-3",

  /** Standard input for photobook panels */
  pbInput: "h-9 text-xs rounded-xs",

  /** Italic input (quotes, taglines, signatures) */
  pbInputItalic: "h-9 text-xs italic rounded-xs",

  /** Large title input (cover, story header) */
  pbInputTitle: "h-10 text-sm font-medium rounded-xs",

  /** Textarea for photobook panels */
  pbTextarea: "text-xs resize-none rounded-xs",
}
