'use client';

import { usePathname } from 'next/navigation'; // Импортируем хук для отслеживания пути

// Iubenda temporarily disabled — hook is now a no-op
export function useIubenda() {
  const pathname = usePathname(); // Получаем текущий URL-путь
  void pathname;

  /*
  useEffect(() => {
    // 1. Сначала удаляем старый скрипт, если он уже был добавлен, 
    // чтобы принудительно перезапустить инициализацию виджетов
    const existingScript = document.querySelector('script[src*="iubenda.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Уничтожаем глобальный объект iubenda, если он остался от прошлых страниц
    if (typeof window !== 'undefined' && (window as Window & { Iubenda?: unknown }).Iubenda) {
      delete (window as Window & { Iubenda?: unknown }).Iubenda;
    }

    // 2. Создаем и вставляем скрипт заново для новой страницы
    const loader = () => {
      const s = document.createElement("script");
      s.src = "https://cdn.iubenda.com/iubenda.js";
      s.async = true;
      
      const tag = document.getElementsByTagName("script")[0];
      if (tag && tag.parentNode) {
        tag.parentNode.insertBefore(s, tag);
      } else {
        document.head.appendChild(s);
      }
    };

    // Так как страница уже загружена в SPA-режиме, запускаем лоадер сразу
    loader();

  }, [pathname]); // <-- Магия здесь: useEffect сработает заново КАЖДЫЙ РАЗ, когда меняется страница!
  */
}