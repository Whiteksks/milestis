"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import { sendSignInLinkToEmail } from "@/lib/auth";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    const { success, error } = await sendSignInLinkToEmail(email);

    if (success) {
      setSent(true);
    } else if (error) {
      setError(error);
    }

    setLoading(false);
  };

  const handleChangeEmail = () => {
    setSent(false);
    setError(null);
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <div className="flex h-full flex-col justify-center p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Create something amazing
              </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our platform to build, design, and share your creative
              projects with the world.
            </p>
            <ul className="mt-8 space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Intuitive design tools</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Seamless collaboration</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Global community</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-8">
        <Card className="w-full max-w-md rounded-2xl border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {!sent ? "Sign in or create an account" : "Check your email"}
            </CardTitle>
            <CardDescription>
              {!sent
                ? "Enter your email to receive a magic link."
                : `A sign-in link has been sent to ${email}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-lg"
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>

                <Button
                  onClick={handleSendMagicLink}
                  disabled={loading || !email}
                  className="h-12 w-full rounded-lg text-sm font-medium"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Continue with Email"}
                </Button>

                <div className="relative flex items-center py-2">
                  <Separator className="flex-1" />
                  <span className="px-4 text-xs text-muted-foreground">
                    OR
                  </span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-lg text-sm font-medium"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                 <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to sign in. You can close this tab.
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleSendMagicLink}
                      disabled={loading}
                      className="h-12 w-full rounded-lg"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Link
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleChangeEmail}
                      className="h-12 w-full rounded-lg"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Use a different email
                    </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
