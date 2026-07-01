import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

// Убрали kz из метаданных, если язык пока не поддерживается
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Pricing & Refund Policy',
    ru: 'Правила оплаты и возврата',
  }
  const descriptions: Record<string, string> = {
    en: 'Learn about Milestis pricing, credit types, subscription rules, and refund policy.',
    ru: 'Узнайте о ценах Milestis, типах кредитов, правилах подписки и политике возврата.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `https://milestis.com/${locale}/policies/refund-policy`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': 'https://milestis.com/en/policies/refund-policy',
        'ru': 'https://milestis.com/ru/policies/refund-policy',
        'x-default': 'https://milestis.com/en/policies/refund-policy',
      },
    },
    openGraph: { type: 'website', url, title, description, siteName: 'Milestis' },
  }
}

const content = {
  en: {
    title: 'Pricing & Refund Policy',
    updated: 'Last updated: June 2026',
    intro: 'This policy explains how pricing, digital credits, subscriptions, and refunds work on the Milestis platform.',
    footerText: 'Have questions? Contact us at ',
    sections: [
      {
        title: '1. How Credits and Payments Work',
        text: 'Milestis uses internal credits to publish projects and access premium features. Credits have no cash value and cannot be redeemed for fiat currency.\n• Purchased credits: Bought as one-time packages, they never expire.\n• Subscription credits: Included in your recurring plan, they expire at the end of the billing cycle and do not roll over.\n• Bonus credits: Granted via promotions; expiration depends on the offer terms.\nThe required number of credits is always displayed before you confirm a publication. Credits are only deducted upon your confirmation.',
      },
      {
        title: '2. Subscriptions and Cancellation',
        text: 'Subscriptions provide regular credit allowances and premium features. You can cancel your subscription at any time in your account settings. If you cancel, you retain access to paid features until the end of the current billing cycle. We do not offer partial refunds for unused days or expired subscription credits.',
      },
      {
        title: '3. Refund Policy & Right of Withdrawal',
        text: 'By purchasing credits or a subscription, you gain immediate access to digital services and acknowledge that you waive your statutory right to cancel or withdraw. All purchases are final and non-refundable, even if you delete an already published project. Exceptions for refunds are made only in the following cases:\n• Technical errors: If a project fails to publish due to a bug on our end, we will refund the deducted credits to your balance.\n• Legal requirements: Where strictly required by applicable law.\nNote: Initiating an unjustified chargeback via your bank without contacting support first may result in account suspension.',
      },
      {
        title: '4. Payment Processing & Contact Us',
        text: 'Payments are handled by secure third-party providers. If you believe you were charged in error, contact us within 14 days at support@milestis.com with your account and transaction details. We will manually review your exceptional case.',
      },
    ],
  },
  ru: {
    title: 'Правила оплаты и возврата',
    updated: 'Последнее обновление: Июнь 2026',
    intro: 'Настоящая политика объясняет, как на платформе Milestis работают цены, цифровые кредиты, подписки и возвраты.',
    footerText: 'Есть вопросы? Свяжитесь с нами по адресу ',
    sections: [
      {
        title: '1. Как работают кредиты и оплата',
        text: 'Milestis использует внутренние кредиты для публикации проектов и доступа к платным функциям. Кредиты не имеют денежной стоимости и не могут быть выведены в реальную валюту.\n• Купленные кредиты: приобретаются разово и не имеют срока действия.\n• Кредиты подписки: начисляются регулярно, сгорают в конце расчетного периода и не переносятся.\n• Бонусные кредиты: выдаются по акциям, их срок зависит от условий предложения.\nСтоимость действия всегда отображается до подтверждения публикации. Кредиты списываются только после вашего явного согласия.',
      },
      {
        title: '2. Подписка и ее отмена',
        text: 'Подписка дает доступ к премиум-функциям и регулярным начислениям кредитов. Вы можете отменить подписку в любой момент в настройках аккаунта. При отмене вы сохраняете доступ к платным функциям до конца оплаченного периода. Частичный возврат средств за неиспользованные дни или сгоревшие кредиты не производится.',
      },
      {
        title: '3. Политика возврата и отказ от услуг',
        text: 'Приобретая кредиты или подписку, вы получаете немедленный доступ к цифровым услугам и теряете право на отмену покупки. Платежи являются окончательными и не подлежат возврату, даже если вы удалите опубликованный проект. Возврат возможен только в следующих случаях:\n• Технические сбои: Если проект не был опубликован из-за ошибки на нашей стороне, мы вернем потраченные кредиты на ваш баланс.\n• Требования закона: В случаях, прямо предусмотренных применимым законодательством.\nВнимание: Неправомерный отзыв платежа через банк (чарджбэк) без предварительного обращения в поддержку может привести к блокировке аккаунта.',
      },
      {
        title: '4. Обработка платежей и связь с нами',
        text: 'Все платежи обрабатываются безопасными сторонними провайдерами. Если вы считаете, что списание произошло по ошибке, свяжитесь с нами в течение 14 дней по адресу support@milestis.com, указав детали аккаунта и транзакции. Мы рассмотрим вашу ситуацию в индивидуальном порядке.',
      },
    ],
  },
}

export default async function RefundPolicyPage({ params }: PageProps) {
  const { locale } = await params
  const currentContent = content[locale as keyof typeof content] ?? content.en

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24 antialiased">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          {currentContent.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {currentContent.updated}
        </p>
        <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-300">
          {currentContent.intro}
        </p>
      </div>

      <div className="space-y-10">
        {currentContent.sections.map((section, index) => (
          <section key={index} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {section.title}
            </h2>
            {/* Добавлен класс whitespace-pre-line для корректных переносов строк */}
            <p className="text-lg leading-7 text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
              {section.text}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center sm:text-left">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {currentContent.footerText}
          <a 
            href="mailto:support@milestis.com" 
            className="font-medium text-neutral-900 dark:text-neutral-50 underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            support@milestis.com
          </a>
        </p>
      </div>
    </main>
  )
}