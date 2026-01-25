import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-8xl font-bold text-foreground">404</h1>
        
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Страница не найдена
        </h2>
        
        <p className="mt-4 text-muted-foreground">
          К сожалению, запрашиваемая страница не существует или была перемещена. 
          Проверьте правильность URL или воспользуйтесь ссылками ниже.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              Получить помощь
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Если вы считаете, что это ошибка, обратитесь в{" "}
          <Link href="/help" className="text-foreground underline underline-offset-4 hover:text-primary">
            службу поддержки
          </Link>
        </p>
      </div>
    </div>
  )
}
