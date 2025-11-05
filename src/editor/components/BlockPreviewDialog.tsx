"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBlockElement, type BlockLibraryItem } from "@/editor/blocks/block-library";
import { Plus, RefreshCw, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BlockPreviewDialogProps {
  block: BlockLibraryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (action: "replace" | "add") => void;
}

export function BlockPreviewDialog({
  block,
  open,
  onOpenChange,
  onApply,
}: BlockPreviewDialogProps) {
  const handleActionSelect = (action: "replace" | "add") => {
    onOpenChange(false);
    onApply(action);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!block) return null;

  const preview = createBlockElement(block.componentName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-5xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">{block.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {block.description}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Side - Preview */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Предпросмотр</h3>
              <Card className="border-2 overflow-hidden bg-background/50">
                <div className="aspect-video w-full bg-background/50 border-b border-border/30 overflow-hidden relative">
                  <div className="w-full h-full scale-50 origin-top-left">
                    <div className="w-[200%] h-[200%]">
                      {preview || (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                          Предпросмотр недоступен
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Side - Info and Actions */}
          <div className="space-y-6 flex flex-col">
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Информация</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Название:</span>{" "}
                    {block.title}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Описание:</span>{" "}
                    {block.description}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Тип:</span>{" "}
                    {block.componentName}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Выберите действие
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4 hover:border-primary hover:bg-primary/5"
                    onClick={() => handleActionSelect("add")}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">Добавить как новый блок</div>
                      <div className="text-xs text-muted-foreground">
                        Добавить шаблон в конец существующих блоков
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4 hover:border-destructive hover:bg-destructive/5"
                    onClick={() => handleActionSelect("replace")}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
                      <RefreshCw className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">Заменить все</div>
                      <div className="text-xs text-muted-foreground">
                        Удалить все блоки и добавить только этот шаблон
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
