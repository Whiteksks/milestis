import { headers } from 'next/headers'

export default async function PublishedPageUnavailable() {
  const language = (await headers()).get('accept-language')?.split(',')[0] ?? 'en'
  const text = language.startsWith('ru')
    ? { title: 'Страница временно недоступна', description: 'Попробуйте открыть её позже или обратитесь к владельцу ссылки.' }
    : language.startsWith('kk') || language.startsWith('kz')
      ? { title: 'Бет уақытша қолжетімсіз', description: 'Кейінірек ашып көріңіз немесе сілтеме иесіне хабарласыңыз.' }
      : { title: 'This page is currently unavailable', description: 'Please try again later or contact the owner of this link.' }
  return <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
    <div className="max-w-sm space-y-3 text-center"><h1 className="text-xl font-semibold">{text.title}</h1><p className="text-sm leading-relaxed text-muted-foreground">{text.description}</p></div>
  </main>
}
