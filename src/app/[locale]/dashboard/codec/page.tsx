"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, ImageIcon } from "lucide-react"

type Result = {
  filename: string
  originalSize: number
  // will hold encoded output once algorithm is implemented
  data: null
}

export default function CodecPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<{ url: string; name: string; size: number } | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [running, setRunning] = useState(false)

  function handleFile(file: File) {
    setResult(null)
    setImage({ url: URL.createObjectURL(file), name: file.name, size: file.size })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) handleFile(file)
  }

  async function handleEncode() {
    if (!image) return
    setRunning(true)
    // algorithm goes here
    await new Promise((r) => setTimeout(r, 600))
    setResult({ filename: image.name, originalSize: image.size, data: null })
    setRunning(false)
  }

  function handleDownload() {
    if (!result) return
    // will write actual encoded bytes once algorithm is ready
    const placeholder = JSON.stringify({ filename: result.filename, originalSize: result.originalSize, instructions: [] }, null, 2)
    const blob = new Blob([placeholder], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = result.filename.replace(/\.[^.]+$/, "") + ".codec.json"
    a.click()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Codec Lab</h1>
        <p className="mt-1 text-muted-foreground">Экспериментальный кодек — загрузи фото, получи инструкцию восстановления</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Исходное фото</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-muted/30"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.url} alt={image.name} className="max-h-64 rounded object-contain" />
              ) : (
                <>
                  <ImageIcon className="mb-3 size-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Перетащи или нажми чтобы выбрать</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            {image && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="truncate">{image.name}</span>
                <span className="shrink-0">{(image.size / 1024).toFixed(1)} КБ</span>
              </div>
            )}
            <Button onClick={handleEncode} disabled={!image || running} className="w-full">
              <Upload className="mr-2 size-4" />
              {running ? "Обработка..." : "Закодировать"}
            </Button>
          </CardContent>
        </Card>

        {/* Right — result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Результат</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
              {result ? (
                <div className="space-y-3 p-6 text-center">
                  <p className="text-sm font-medium">Инструкция готова</p>
                  <div className="rounded-md bg-muted p-3 text-left text-xs font-mono text-muted-foreground">
                    <div>Оригинал: {(result.originalSize / 1024).toFixed(1)} КБ</div>
                    <div className="mt-1 italic">алгоритм: не реализован</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Здесь появится результат</p>
              )}
            </div>
            <Button onClick={handleDownload} disabled={!result} variant="outline" className="w-full">
              <Download className="mr-2 size-4" />
              Скачать инструкцию (.codec.json)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

