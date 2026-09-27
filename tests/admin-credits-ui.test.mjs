import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTranslator } from 'next-intl'
import { load } from './support/firestore-transactions.mjs'

function page(locale, allowed) {
  const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}/dashboard-account/admin-credits.json`, import.meta.url), 'utf8'))
  return load('src/app/[locale]/account/admin-credits/page.tsx', {
    'next-intl': { useTranslations: (namespace) => createTranslator({ locale: locale === 'kz' ? 'kk' : locale, messages, namespace, onError: (error) => { throw error } }) },
    '@tanstack/react-query': { useQueryClient: () => ({}) },
    '@/hooks/useCreditsAdmin': { useCreditsAdmin: () => ({ data: allowed, isFetching: false }) },
    '@/hooks/useUserStore': { useUserStore: (selector) => selector({ profile: { uid: 'admin' } }) },
    '@/components/ui/button': { Button: ({ children, variant: _variant, ...props }) => createElement('button', props, children) },
    '@/components/ui/input': { Input: (props) => createElement('input', props) },
    '@/lib/billing/admin-credits-api': {},
  }).default
}

test('admin page denies access and renders a search form for authorized users in every locale', () => {
  for (const locale of ['ru', 'en', 'kz']) {
    assert.doesNotMatch(renderToStaticMarkup(createElement(page(locale, false))), /<input/)
    const html = renderToStaticMarkup(createElement(page(locale, true)))
    assert.match(html, /id="credit-account"/)
    assert.doesNotMatch(html, /id="credit-amount"/)
  }
})

test('reload restores the original pending recipient and amount without creating a new grant', (t) => {
  const calls = []
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    getItem(key) {
      calls.push(key)
      return JSON.stringify({ input: { targetUid: 'customer', amount: 777, reason: 'Service compensation', requestId: 'original-request' },
        account: { uid: 'customer', email: 'customer@example.com', displayName: 'Customer' } })
    },
  } })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'sessionStorage', previous)
    else delete globalThis.sessionStorage
  })
  const html = renderToStaticMarkup(createElement(page('ru', true)))
  assert.match(html, /customer@example.com/)
  assert.match(html, /777/)
  assert.match(html, /Проверить и завершить/)
  assert.doesNotMatch(html, /<input/)
  assert.deepEqual(calls, ['credits-compensation:admin'])
})
