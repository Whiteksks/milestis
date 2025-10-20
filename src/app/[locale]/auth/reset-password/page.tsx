// app/(group)/reset-password/page.tsx

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import InputPasswordStrength from "@/components/ui/custom/inputPassword";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const router = useRouter();

  const [done, setDone] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-center mb-6">
          {t("title")}
        </h1>

        {done ? (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-center text-primary">{t("success")}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer w-full"
            >
              {t("backToHome")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputPasswordStrength onValidChange={setIsValid} />

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer w-full"
              disabled={!isValid}
            >
              {t("button")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
