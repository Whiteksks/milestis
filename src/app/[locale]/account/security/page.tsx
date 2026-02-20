"use client"

import { useState } from "react"
import { Check, Mail, Chrome, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const authMethods = [
  {
    id: "email",
    name: "Email (Magic Link)",
    description: "Sign in securely using a magic link sent to your email",
    icon: Mail,
    isPrimary: true,
    isConnected: true,
    userEmail: "alex@example.com",
    canDisconnect: false,
  },
  {
    id: "google",
    name: "Google",
    description: "Sign in with your Google account",
    icon: Chrome,
    isPrimary: false,
    isConnected: false,
    canDisconnect: true,
  },
]

export default function SecuritySettings() {
  const [methods, setMethods] = useState(authMethods)

  const toggleConnection = (id: string) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.id === id && method.canDisconnect ? { ...method, isConnected: !method.isConnected } : method,
      ),
    )
  }

  return (
    <div className="space-y-12">

      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Sign-in Methods</h2>
          <p className="mt-1 text-muted-foreground">Manage how you access your Milestis account</p>
        </div>

        <div className="rounded-2xl bg-card shadow-sm">
          <div className="divide-y divide-border/40">
            {methods.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{method.name}</span>
                        {method.isPrimary && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Primary</span>
                        )}
                        {method.isConnected && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                            <Check className="size-3" /> Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      {method.isConnected && method.userEmail && (
                        <p className="text-sm font-medium">{method.userEmail}</p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {method.id === "email" ? (
                      <Button variant="ghost" size="sm" className="rounded-full" disabled>
                        Always enabled
                      </Button>
                    ) : (
                      <Button
                        variant={method.isConnected ? "outline" : "default"}
                        size="sm"
                        className="rounded-full px-5"
                        onClick={() => toggleConnection(method.id)}
                      >
                        {method.isConnected ? "Disconnect" : "Connect Google"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-sm text-muted-foreground px-1">
          Your Magic Link email will always remain the primary way to recover your account.
        </p>
      </section>

    </div>
  )
}
