import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Home, HelpCircle } from "lucide-react"

export default function NotFound() {
  const t = useTranslations("error.404")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-8xl font-bold text-foreground">404</h1>
        
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          {t("title")}
        </h2>
        
        <p className="mt-4 text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <a href="https://milestis.com">
              <Home className="mr-2 h-4 w-4" />
              {t("goHome")}
            </a>
          </Button>
          
          <Button variant="outline" asChild className="bg-transparent">
            <a href="https://milestis.com/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              {t("getHelp")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}