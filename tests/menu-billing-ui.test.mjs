import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement, cloneElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTranslator } from 'next-intl'
import { load } from './support/firestore-transactions.mjs'

const now = Date.parse('2027-01-10T00:00:00Z')
const model = load('functions/src/projects/menu/billing/model.ts', {})
test('balance inconsistency has a publication error message in every locale', () => {
  for (const locale of ['ru', 'en', 'kz']) {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}/editor/editor-menu.json`, import.meta.url), 'utf8'))
    const t = createTranslator({ locale: locale === 'kz' ? 'kk' : locale, messages, namespace: 'editor.menu.publish.errors', onError: (error) => { throw error } })
    assert.ok(t('BALANCE_INCONSISTENT').length > 0)
  }
})
function panels(locale = 'ru') {
  const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}/editor/editor-menu.json`, import.meta.url), 'utf8'))
  return load('src/editor/components/modals/menu-billing-panel.tsx', {
    'next-intl': {
      useLocale: () => locale,
      useNow: () => new Date(now),
      useTranslations: (namespace) => createTranslator({ locale: locale === 'kz' ? 'kk' : locale, messages, namespace, onError: (error) => { throw error } }),
    },
    '@/components/ui/button': { Button: ({ asChild, children, variant: _variant, size: _size, ...props }) => asChild
      ? cloneElement(children, props) : createElement('button', props, children) },
  })
}
function review(plan = 'menu-100', count = 51, previous = null) {
  const proposal = model.proposeMenuBilling(previous, plan, count, now)
  return { quoteId: 'quote', photoCount: count, planId: plan, amount: proposal.amount,
    availableCredits: 1000, current: previous, billing: proposal.billing, expiresAtMillis: now + 600_000 }
}
function renderReview(value, locale = 'ru') {
  return renderToStaticMarkup(createElement(panels(locale).MenuBillingReviewPanel, {
    review: value, busy: false, accepted: false, onAccept() {}, onPlan() {}, onRefresh() {},
  }))
}

test('payment review renders all prices and disables undersized packages in every locale', () => {
  for (const locale of ['ru', 'en', 'kz']) {
    const html = renderReview(review(), locale)
    assert.equal((html.match(/type="radio"/g) ?? []).length, 4)
    assert.match(html, /disabled=""[^>]*value="menu-50"/)
    assert.match(html, /checked=""[^>]*value="menu-100"/)
    for (const amount of [200, 350, 500, 650]) assert.ok(html.includes(String(amount)))
    assert.match(html, /type="checkbox"/)
  }
})

test('insufficient balance exposes topup and full upgrade difference without changing renewal', () => {
  const previous = { ...review('menu-50', 50).billing, lastTransactionId: 'paid' }
  const value = { ...review('menu-100', 51, previous), availableCredits: 100 }
  const html = renderReview(value)
  assert.equal(value.amount, 150)
  assert.equal(value.billing.periodEndMillis, previous.periodEndMillis)
  assert.match(html, /Не хватает 50 кредитов/)
  assert.match(html, /href="\/ru\/account\/billing"/)
  assert.match(html, /полная разница между пакетами/)
})

test('free update has no debit consent; paid cancellation preserves active access and resume control', () => {
  const previous = { ...review().billing, lastTransactionId: 'paid', autoRenew: false, nextAttemptAtMillis: null }
  assert.doesNotMatch(renderReview(review('menu-100', 51, previous)), /type="checkbox"/)
  for (const locale of ['ru', 'en', 'kz']) {
    const html = renderToStaticMarkup(createElement(panels(locale).MenuBillingStatusPanel, { billing: previous, busy: false, onAutoRenew() {} }))
    assert.match(html, /<button/)
    if (locale === 'ru') {
      assert.match(html, /Оплачено/)
      assert.match(html, /Включить автопродление/)
      assert.doesNotMatch(html, /Доступ приостановлен/)
    }
  }
})
