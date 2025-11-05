"use client";

import React from "react";
import { BlockThumbnail } from "@/editor/panels/thumbnails/block-thumbnail";
import { createBlockElement } from "@/editor/blocks/block-library";

interface ClickableBlockPreviewProps {
  id: string;
  componentName: string;
  title: string;
  description: string;
  onClick: () => void;
}

export default function ClickableBlockPreview({
  id,
  componentName,
  title,
  description,
  onClick,
}: ClickableBlockPreviewProps) {
  const preview = createBlockElement(componentName);

  return (
    <div className="cursor-pointer select-none" onClick={onClick}>
      <BlockThumbnail
        title={title}
        description={description}
        preview={
          preview ?? (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Preview
            </div>
          )
        }
      />
    </div>
  );
}
