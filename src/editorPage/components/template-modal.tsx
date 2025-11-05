"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  image: string
}

const templates: Template[] = [
  {
    id: "1",
    name: "Next.js Boilerplate",
    description: "Get started with Next.js and React in seconds.",
    category: "Framework",
    image: "/nextjs-template.jpg",
  },
  {
    id: "2",
    name: "Image Gallery",
    description: "An image gallery built on Next.js and Cloudinary.",
    category: "Gallery",
    image: "/gallery-preview.png",
  },
  {
    id: "3",
    name: "AI Chatbot",
    description: "A full-featured, hackable Next.js AI chatbot built by Vercel.",
    category: "AI",
    image: "/chatbot-interface.png",
  },
  {
    id: "4",
    name: "Admin Dashboard",
    description: "Tailwind CSS, Postgres, and Auth set up.",
    category: "Dashboard",
    image: "/modern-admin-dashboard.png",
  },
]

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onApply?: (template: Template) => void
}

export function TemplateModal({ isOpen, onClose, onApply }: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0])

  if (!isOpen) return null

  const handleApply = () => {
    if (selectedTemplate && onApply) {
      onApply(selectedTemplate)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Select Template</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Template Gallery */}
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <div className="p-4 space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                      <p className="text-xs opacity-75 line-clamp-1">{template.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Template Details */}
          <div className="w-2/3 flex flex-col p-8">
            {selectedTemplate && (
              <>
                <div className="flex-1">
                  {/* Preview Image */}
                  <div className="mb-8">
                    <img
                      src={selectedTemplate.image || "/placeholder.svg"}
                      alt={selectedTemplate.name}
                      className="w-full h-48 rounded-lg object-cover bg-muted mb-4"
                    />
                  </div>

                  {/* Template Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground mb-2 text-balance">{selectedTemplate.name}</h3>
                      <p className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full">
                        {selectedTemplate.category}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Description
                      </h4>
                      <p className="text-foreground leading-relaxed text-pretty">{selectedTemplate.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        Features
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          Pre-configured setup and best practices
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          Ready for production use
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          Fully customizable components
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer - Action Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Apply Template
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
