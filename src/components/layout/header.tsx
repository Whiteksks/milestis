import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '../theme/change-theme';

export function Header() {
  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar text-sidebar-foreground font-sans shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold tracking-tight">Memento Book</h1>

          <nav className="hidden md:flex space-x-4">
            <Button asChild variant="ghost" className="hover:bg-muted/20">
              <Link href="/">Главная</Link>
            </Button>
            <Button asChild variant="ghost" className="hover:bg-muted/20">
              <Link href="/products">Продукты</Link>
            </Button>
            <Button asChild variant="ghost" className="hover:bg-muted/20">
              <Link href="/about">О нас</Link>
            </Button>
            <Button asChild variant="ghost" className="hover:bg-muted/20">
              <Link href="/contacts">Контакты</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>

        <div className="hidden md:flex space-x-2">
          <Button asChild variant="ghost" className="hover:bg-muted/20">
            <Link href="/login">Войти</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Зарегистрироваться</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-border text-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[60%] max-w-sm bg-background text-foreground"
            aria-describedby={undefined}
          >
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <SheetDescription className="sr-only">description goes here</SheetDescription>
            <nav className="flex flex-col space-y-4 pt-4 px-4">
              <Button asChild variant="ghost">
                <Link href="/">Главная</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/products">Продукты</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/about">О нас</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/contacts">Контакты</Link>
              </Button>
              <div className="border-t pt-4 mt-4 flex flex-col space-y-2 border-border">
                <Button asChild variant="ghost">
                  <Link href="/login">Войти</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">Зарегистрироваться</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
