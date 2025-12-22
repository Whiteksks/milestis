"use client"

import { useState } from "react"
import { Check, Mail, Key, Chrome, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    id: "password",
    name: "Password",
    description: "Add a password to sign in without email links",
    icon: Key,
    isPrimary: false,
    isConnected: false,
    canDisconnect: true,
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
    <div className="space-y-6">
      {/* Sign-in Methods */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <CardTitle>Sign-in Methods</CardTitle>
          </div>
          <CardDescription>Manage how you access your Milestis account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {methods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-md ${
                    method.isConnected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Icon + Info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          method.isConnected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{method.name}</h3>
                          {method.isPrimary && (
                            <Badge variant="secondary" className="rounded-full bg-primary/15 text-primary text-xs">
                              Primary
                            </Badge>
                          )}
                          {method.isConnected && (
                            <Badge
                              variant="outline"
                              className="rounded-full border-green-500/30 bg-green-500/10 text-green-600 text-xs"
                            >
                              <Check className="mr-1 size-3" />
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        {method.isConnected && method.userEmail && (
                          <p className="text-sm font-medium text-foreground/80">{method.userEmail}</p>
                        )}
                        {method.id === "password" && !method.isConnected && (
                          <p className="text-xs text-muted-foreground/70">Optional — for convenience</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    <div className="sm:shrink-0">
                      {method.id === "email" ? (
                        <Button variant="outline" className="rounded-full bg-transparent" disabled>
                          Always enabled
                        </Button>
                      ) : method.id === "password" ? (
                        <Button
                          variant={method.isConnected ? "outline" : "default"}
                          className="rounded-full"
                          onClick={() => toggleConnection(method.id)}
                        >
                          {method.isConnected ? "Change password" : "Add password"}
                        </Button>
                      ) : (
                        <Button
                          variant={method.isConnected ? "outline" : "default"}
                          className="rounded-full"
                          onClick={() => toggleConnection(method.id)}
                        >
                          {method.isConnected ? "Disconnect" : "Connect Google"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Helpful Info Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-muted/30 p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Shield className="size-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Multiple sign-in methods</p>
          <p className="text-sm text-muted-foreground">
            You can connect multiple methods for convenience. Your Magic Link email will always remain your primary way
            to recover your account.
          </p>
        </div>
      </div>
    </div>
  )
}
