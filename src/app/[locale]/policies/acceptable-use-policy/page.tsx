import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Acceptable Use Policy',
    ru: 'Политика допустимого использования',
  }
  const descriptions: Record<string, string> = {
    en: 'Read the Milestis Acceptable Use Policy — user content, prohibited content, intellectual property, and service rules.',
    ru: 'Ознакомьтесь с Политикой допустимого использования Milestis — правила загрузки, пользовательский контент и правила сервиса.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `${siteConfig.appUrl}/${locale}/policies/acceptable-use-policy`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.appUrl}/en/policies/acceptable-use-policy`,
        'ru': `${siteConfig.appUrl}/ru/policies/acceptable-use-policy`,
        'x-default': `${siteConfig.appUrl}/en/policies/acceptable-use-policy`,
      },
    },
    openGraph: { type: 'website', url, title, description, siteName: 'Milestis' },
  }
}

const content = {
  en: {
    title: 'Acceptable Use Policy',
    updated: 'Last updated: July 2026',
    intro: 'This Acceptable Use Policy sets out the rules for using the Milestis platform — an online SaaS editor for creating and publishing visual projects, digital photobooks, portfolios, and shareable mini-sites. By using the service you agree to these rules. This policy may be translated into other languages for user convenience. In the event of any conflict between versions, the English version shall prevail.',
    footerText: 'Questions? Contact us at ',
    sections: [
      {
        title: '1. Eligibility & Account',
        text: `You must be at least 16 years old to use Milestis. By creating an account, you confirm that you accept these Terms and that you are old enough to form a binding agreement under the laws of your jurisdiction.\nEach account is personal and non-transferable. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you believe your account has been compromised, contact us immediately at ${siteConfig.supportEmail}.`,
      },
      {
        title: '2. Acceptable Use',
        text: 'Milestis is an online SaaS editor that lets you design and publish visual projects — such as portfolios and photobooks — using pre-built templates. Published projects are delivered as pages on Milestis infrastructure.\nYou agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You must not:\n• Attempt to gain unauthorised access to the platform or other users\' accounts\n• Use automated tools, bots, or scripts to interact with the service without prior written consent\n• Resell, sublicense, or otherwise transfer platform access to third parties\n• Interfere with the security, performance, or integrity of the service\n• Use the platform in any way that violates applicable local, national, or international laws',
      },
      {
        title: '3. User-Generated Content',
        text: 'Photographs, texts, and other materials you upload remain your intellectual property. Milestis does not claim ownership of your content.\nBy uploading content you grant Milestis a limited, non-exclusive, royalty-free licence to store, process, resize, and display your content solely for the purpose of operating and delivering the service to you. This licence ends when you delete the content or your account. Residual copies may remain in automated backup systems for a maximum of 14 days, after which they are permanently purged. We do not use retained backup data to restore or access your content.\nYou are solely responsible for ensuring you hold the necessary rights, licences, or permissions for any content you upload.',
      },
      {
        title: '4. Prohibited Content',
        text: `The following types of content are strictly prohibited on Milestis:\n• Adult, sexually explicit, or pornographic content of any kind\n• Content involving sexual exploitation, minors in sexual contexts, human trafficking, terrorism, extremism, self-harm instructions, or instructions for evading the law\n• Content that is unlawful, threatening, defamatory, or promotes violence, hatred, harassment, or discrimination\n• Content that infringes any third-party copyright, trademark, privacy, publicity, or other legal rights\n• Personal data or private information of third parties shared without their explicit consent\n• Spam, phishing, malware, impersonation, scams, misleading claims, or any content designed to deceive, manipulate, or harm others\n• Content that violates sanctions, export-control rules, or other applicable legal restrictions\nMilestis reserves the right to remove content that violates these rules and to suspend or terminate the responsible account without prior notice. To report a violation or abusive content, contact ${siteConfig.supportEmail}.`,
      },
      {
        title: '5. Prohibited Commercial & Payment Activity',
        text: 'Milestis is not a marketplace, payment processor, fundraising platform, financial service, or general-purpose hosting provider. Published projects are intended for personal, creative, portfolio, event, memory-keeping, and digital photobook use. Users may not use Milestis pages to process payments, collect payment credentials, sell or broker regulated or illegal goods or services, run investment or financial schemes, solicit fraudulent donations, or conduct activity that would violate the rules of Milestis\' payment, billing, hosting, storage, or infrastructure providers.\nMilestis may use third-party billing providers to sell its own subscriptions or credits. Users must not use the platform in a way that creates legal, financial, payment, reputational, security, or operational risk for Milestis, its users, or its providers.',
      },
      {
        title: '6. Intellectual Property',
        text: 'Milestis and its licensors retain all intellectual property rights in the platform, including but not limited to: templates, layouts, design elements, visual effects, texture overlays, decorative components, colour palettes, and all associated software and code.\nBy using the platform you receive a limited, non-exclusive, non-transferable licence to access and use these elements solely within the Milestis editor to create your projects. You may not copy, extract, reproduce, distribute, reverse-engineer, or create derivative works based on Milestis design elements or templates outside of the platform.\nThe Milestis name, logo, and brand identity are trademarks owned by Milestis and may not be used without prior written permission.',
      },
      {
        title: '7. Service Rules & Modifications',
        text: `Milestis is an editor and project-delivery tool for creating digital legacy projects, visual portfolios, mini-sites, and digital photobooks. It is not a general-purpose hosting provider, marketplace, payment processor, or platform for user-run commercial transactions. We provide the infrastructure and tooling; users are solely responsible for the content they create, upload, and publish through the platform. Milestis expressly disclaims all liability for user-generated content.\nWe do not routinely monitor or scan user content. We may review published projects or uploaded content only in response to reported violations, verified complaints, legal requirements, or where we have reasonable grounds to believe such review is necessary to prevent serious harm or ensure compliance with this Policy or provider requirements. We may remove content, unpublish projects, restrict access, suspend accounts, or refuse service without prior notice if we determine that the content or activity violates this Policy or creates material risk for Milestis, users, or providers.\nWe reserve the right to modify, suspend, or discontinue any part of the service at any time. Where practicable, we will provide reasonable prior notice of material changes. We may also update these Terms; continued use of the service after changes are posted constitutes your acceptance of the updated Terms.\nTo report abusive, illegal, or infringing content published through the platform, contact ${siteConfig.supportEmail}.`,
      },
      {
        title: '8. Disclaimer of Warranties',
        text: 'The platform is provided \"as is\" and \"as available\" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or uninterrupted availability. Milestis does not warrant that the service will be error-free or that published projects will remain accessible at all times.\nTo the fullest extent permitted by applicable law, Milestis disclaims all liability for any loss of data, loss of revenue, loss of business opportunity, or any indirect, incidental, or consequential damages arising from your use of or inability to use the platform.',
      },
      {
        title: '9. Termination',
        text: 'We may suspend or terminate your account at our sole discretion if you breach these Terms, without prior notice or liability. Upon termination for a violation:\n• Your projects, published pages, and uploaded content may be deleted or made unavailable\n• Any unused credits in your account are forfeited and will not be refunded\nYou may close your account at any time through your account settings. Upon voluntary deletion, your content, projects, and published pages are removed immediately from the active service. Residual copies in automated backup systems are permanently purged within 14 days. We will not use retained data to restore or access your content following voluntary deletion.',
      },
      {
        title: '10. Applicable Law',
        text: 'These Terms are governed by applicable law in the jurisdiction in which Milestis operates. Nothing in these Terms limits any rights you may have under the mandatory laws of your country of residence. Milestis makes no representation that the service is appropriate or lawfully available in every jurisdiction. Users access the service at their own initiative and are responsible for compliance with their local laws.',
      },
    ],
  },
  ru: {
    title: 'Политика допустимого использования',
    updated: 'Последнее обновление: Июль 2026',
    intro: 'Настоящая Политика допустимого использования определяет правила использования платформы Milestis — онлайн-редактора для создания и публикации визуальных проектов, цифровых фотокниг, портфолио и мини-сайтов для шеринга. Используя сервис, вы принимаете эти правила. Политика может переводиться на другие языки для удобства пользователей. В случае расхождений между версиями приоритет имеет английская версия.',
    footerText: 'Есть вопросы? Свяжитесь с нами по адресу ',
    sections: [
      {
        title: '1. Допуск к сервису и аккаунт',
        text: `Для использования Milestis вам должно быть не менее 16 лет. Регистрируя аккаунт, вы подтверждаете принятие настоящих Условий и наличие достаточного возраста для заключения юридически обязывающего соглашения по законодательству вашей страны.\nКаждый аккаунт является личным и не может быть передан третьим лицам. Вы несёте ответственность за конфиденциальность данных для входа и за все действия, совершённые под вашим аккаунтом. При подозрении на несанкционированный доступ незамедлительно обратитесь к нам по адресу ${siteConfig.supportEmail}.`,
      },
      {
        title: '2. Допустимое использование',
        text: 'Milestis — это онлайн SaaS-редактор, позволяющий создавать и публиковать визуальные проекты (портфолио, фотокниги) на основе готовых шаблонов. Опубликованные проекты размещаются в виде страниц на инфраструктуре Milestis.\nВы соглашаетесь использовать платформу только в законных целях и без нарушения прав других лиц. Запрещается:\n• Предпринимать попытки несанкционированного доступа к платформе или аккаунтам других пользователей\n• Использовать автоматизированные инструменты, ботов или скрипты без предварительного письменного согласия\n• Перепродавать, сублицензировать или иным образом передавать доступ к платформе третьим лицам\n• Нарушать безопасность, работоспособность или целостность сервиса\n• Использовать платформу способом, нарушающим применимое законодательство',
      },
      {
        title: '3. Пользовательский контент',
        text: 'Фотографии, тексты и иные материалы, которые вы загружаете, остаются вашей интеллектуальной собственностью. Milestis не претендует на право собственности на ваш контент.\nЗагружая контент, вы предоставляете Milestis ограниченную, неисключительную, безвозмездную лицензию на хранение, обработку, изменение размера и отображение вашего контента исключительно в целях предоставления сервиса. Эта лицензия прекращается при удалении контента или аккаунта. Остаточные копии могут сохраняться в автоматических системах резервного копирования не более 14 дней, после чего безвозвратно удаляются. Мы не используем сохранённые резервные копии для восстановления или доступа к вашему контенту.\nВы несёте единоличную ответственность за наличие необходимых прав, лицензий или разрешений на весь загружаемый контент.',
      },
      {
        title: '4. Запрещённый контент',
        text: `На платформе Milestis строго запрещён следующий контент:\n• Материалы для взрослых, откровенного сексуального характера или порнографического содержания\n• Материалы, связанные с сексуальной эксплуатацией, несовершеннолетними в сексуальном контексте, торговлей людьми, терроризмом, экстремизмом, инструкциями по самоповреждению или обходу закона\n• Незаконный, угрожающий, клеветнический контент, а также пропаганда насилия, ненависти, преследования или дискриминации\n• Контент, нарушающий авторские права, товарные знаки, право на частную жизнь, право на изображение или иные законные права третьих лиц\n• Персональные данные или личная информация третьих лиц, опубликованные без их явного согласия\n• Спам, фишинг, вредоносное ПО, выдача себя за другое лицо, мошенничество, вводящие в заблуждение заявления или контент, направленный на обман, манипуляцию или причинение вреда\n• Контент, нарушающий санкционные, экспортные или иные применимые правовые ограничения\nMilestis вправе удалять контент, нарушающий настоящие правила, а также блокировать или удалять аккаунт нарушителя без предварительного уведомления. Для сообщения о нарушениях обратитесь по адресу ${siteConfig.supportEmail}.`,
      },
      {
        title: '5. Запрещённая коммерческая и платёжная деятельность',
        text: 'Milestis не является маркетплейсом, платёжным оператором, платформой для сбора пожертвований, финансовым сервисом или универсальным хостинг-провайдером. Опубликованные проекты предназначены для личного, творческого, портфолио, событийного, памятного использования и цифровых фотокниг. Пользователям запрещается использовать страницы Milestis для проведения платежей, сбора платёжных данных, продажи или посредничества в отношении регулируемых или незаконных товаров и услуг, инвестиционных или финансовых схем, мошеннического сбора пожертвований, а также любой деятельности, нарушающей правила платёжных, биллинговых, хостинговых, провайдеров хранения данных или инфраструктурных провайдеров Milestis.\nMilestis может использовать сторонних биллинговых провайдеров для продажи собственных подписок или кредитов. Пользователи не должны использовать платформу способом, который создаёт юридический, финансовый, платёжный, репутационный, риск безопасности или операционный риск для Milestis, пользователей или провайдеров.',
      },
      {
        title: '6. Интеллектуальная собственность',
        text: 'Milestis и её лицензиары сохраняют все права интеллектуальной собственности на платформу, включая, помимо прочего: шаблоны, макеты, дизайн-элементы, визуальные эффекты, текстурные наложения, декоративные компоненты, цветовые палитры, а также всё программное обеспечение и код.\nИспользуя платформу, вы получаете ограниченную, неисключительную, непередаваемую лицензию на доступ к этим элементам и их использование исключительно в рамках редактора Milestis для создания своих проектов. Запрещается копировать, извлекать, воспроизводить, распространять, осуществлять обратный инжиниринг или создавать производные работы на основе дизайн-элементов или шаблонов Milestis за пределами платформы.\nНаименование, логотип и фирменный стиль Milestis являются товарными знаками и не могут использоваться без предварительного письменного разрешения.',
      },
      {
        title: '7. Правила сервиса и изменения',
        text: `Milestis является редактором и инструментом публикации проектов для создания цифрового наследия, визуальных портфолио, мини-сайтов и цифровых фотокниг. Milestis не является универсальным хостинг-провайдером, маркетплейсом, платёжным оператором или платформой для коммерческих транзакций пользователей. Мы предоставляем инфраструктуру и инструменты; пользователи несут единоличную ответственность за контент, который они создают, загружают и публикуют через платформу. Milestis прямо отказывается от какой-либо ответственности за пользовательский контент.\nМы не осуществляем систематического мониторинга или сканирования пользовательского контента. Мы можем проверять опубликованные проекты или загруженный контент только в ответ на сообщения о нарушениях, подтверждённые жалобы, требования закона или при наличии достаточных оснований полагать, что такая проверка необходима для предотвращения серьёзного вреда или обеспечения соответствия настоящей Политике или требованиям провайдеров. Мы можем удалять контент, снимать проекты с публикации, ограничивать доступ, приостанавливать аккаунты или отказывать в обслуживании без предварительного уведомления, если мы установим, что контент или активность нарушают настоящую Политику либо создают существенный риск для Milestis, пользователей или провайдеров.\nМы оставляем за собой право изменять, приостанавливать или прекращать работу любой части сервиса в любое время. По возможности мы будем заблаговременно уведомлять о существенных изменениях. Мы можем обновлять настоящие Условия; продолжение использования сервиса после публикации изменений означает их принятие.\nДля сообщения о незаконном или нарушающем правила контенте обратитесь по адресу ${siteConfig.supportEmail}.`,
      },
      {
        title: '8. Отказ от гарантий',
        text: 'Платформа предоставляется «как есть» и «по мере доступности» без каких-либо явных или подразумеваемых гарантий, включая, помимо прочего, гарантии товарной пригодности, соответствия конкретному назначению или бесперебойной доступности. Milestis не гарантирует безошибочную работу сервиса или постоянную доступность опубликованных проектов.\nВ максимальной степени, допустимой применимым законодательством, Milestis снимает с себя ответственность за потерю данных, упущенную выгоду, утрату деловых возможностей, а также любые косвенные, случайные или последующие убытки, возникшие в результате использования или невозможности использовать платформу.',
      },
      {
        title: '9. Блокировка и прекращение доступа',
        text: 'Мы вправе заблокировать или удалить ваш аккаунт по нашему усмотрению в случае нарушения настоящих Условий без предварительного уведомления. При блокировке за нарушение:\n• Ваши проекты, опубликованные страницы и загруженный контент могут быть удалены или сделаны недоступными\n• Неиспользованные кредиты аннулируются и возврату не подлежат\nВы можете закрыть аккаунт в любой момент через настройки. При добровольном удалении ваш контент, проекты и опубликованные страницы немедленно удаляются из активного сервиса. Остаточные копии в системах резервного копирования безвозвратно удаляются в течение 14 дней. Мы не используем сохранённые данные для восстановления или доступа к вашему контенту после добровольного удаления.',
      },
      {
        title: '10. Применимое право',
        text: 'Настоящие Условия регулируются применимым законодательством в юрисдикции, в которой осуществляет деятельность Milestis. Ничто в настоящих Условиях не ограничивает права, которые вы можете иметь в соответствии с обязательными нормами законодательства вашей страны. Milestis не заявляет, что сервис является законным или доступным во всех юрисдикциях. Пользователи получают доступ к сервису по собственной инициативе и несут ответственность за соблюдение местного законодательства.',
      },
    ],
  },
}

export default async function TermsPage({ params }: PageProps) {
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
            href={`mailto:${siteConfig.supportEmail}`}
            className="font-medium text-neutral-900 dark:text-neutral-50 underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            {siteConfig.supportEmail}
          </a>
        </p>
      </div>
    </main>
  )
}
