import { siteConfig } from '@/config/site'

export const dynamic = 'force-static'

export function GET() {
  return new Response(`# Milestis

> Milestis is a web app for creating interactive photo books ("Memory Books") and photography portfolios, and publishing them as shareable web pages. Free to start, no design skills required.

Milestis lets people turn their photos into an interactive, story-driven web page instead of a static PDF or print album. Two formats are supported: Memory Books (personal stories, events, travel) and Portfolios (for photographers to showcase and sell their work). Finished projects are published to a unique shareable link and can be unpublished, archived, or republished at any time.

## Key pages

- [Homepage](${siteConfig.appUrl}/en): product overview, what Milestis is and who it's for
- [What is Milestis](${siteConfig.appUrl}/en/help/articles/what-is-milestis): plain-language explainer of the product
- [Features](${siteConfig.appUrl}/en/features): design system and editing capabilities
- [Pricing](${siteConfig.appUrl}/en/pricing): plans and credit-based pricing
- [Story](${siteConfig.appUrl}/en/story): why Milestis exists
- [Help Center](${siteConfig.appUrl}/en/help): full documentation index
- [Getting started guide](${siteConfig.appUrl}/en/help/articles/getting-started): how to create and edit a project
- [Publishing & sharing guide](${siteConfig.appUrl}/en/help/articles/publish-share): how publishing, links, and credits work
- [Archive & republish guide](${siteConfig.appUrl}/en/help/articles/archive-republish): project lifecycle after publishing
- [How credits work](${siteConfig.appUrl}/en/help/articles/how-credits-work): credit system explained
- [FAQ](${siteConfig.appUrl}/en/help/faq): common questions

Content is also available in Russian (\`/ru/...\`) and Kazakh (\`/kz/...\`) locale prefixes.

## Notes for automated crawlers

- \`/dashboard\`, \`/account\`, \`/design\`, \`/auth\` are authenticated, per-user application areas — not representative content and should not be cited as public pages.
- Published user photo books live under a separate \`*.${siteConfig.publishedSiteHost}\` subdomain space and are user-generated content, not Milestis's own editorial content.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
