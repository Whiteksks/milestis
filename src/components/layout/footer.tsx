// components/layout/footer.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground font-sans shadow-sm mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-foreground text-sm mb-4 md:mb-0">
          &copy; {currentYear} Ваша компания. Все права защищены.
        </div>
        <div className="flex space-x-6">
          <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">
            Политика конфиденциальности
          </a>
          <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
            Условия использования
          </a>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollToTop}
          className="mt-4 md:mt-0 text-muted-foreground hover:text-foreground"
        >
          Наверх
        </Button>
      </div>
    </footer>
  );
}
