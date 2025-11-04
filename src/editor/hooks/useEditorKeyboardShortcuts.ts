"use client";

import { useEffect } from "react";
import { useEditorDnDStore } from "../state/useEditorDnDStore";

/**
 * Hook to handle editor keyboard shortcuts
 * - Ctrl+Z: Undo
 * - Ctrl+Shift+Z or Ctrl+Y: Redo
 * 
 * Shortcuts are ignored when user is typing in inputs, textareas, or contenteditable elements
 */
export const useEditorKeyboardShortcuts = () => {
  const undo = useEditorDnDStore((state) => state.undo);
  const redo = useEditorDnDStore((state) => state.redo);
  const canUndo = useEditorDnDStore((state) => state.canUndo);
  const canRedo = useEditorDnDStore((state) => state.canRedo);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      const isTyping = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Ignore shortcuts when typing
      if (isTyping) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      // Ctrl+Z or Cmd+Z: Undo
      if (ctrlKey && event.key === "z" && !event.shiftKey && canUndo()) {
        event.preventDefault();
        undo();
        return;
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z: Redo
      if (ctrlKey && event.key === "z" && event.shiftKey && canRedo()) {
        event.preventDefault();
        redo();
        return;
      }

      // Ctrl+Y or Cmd+Y: Redo (Windows/Linux alternative)
      if (ctrlKey && event.key === "y" && canRedo()) {
        event.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);
};
