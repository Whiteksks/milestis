import { auth } from '../firebase/firebase'
import { PublishProjectError } from './publish-project-api'
import type { MenuBilling, MenuPlanId } from '../../../functions/src/projects/menu/billing/model'
import type { reviewMenuBilling } from '../../../functions/src/projects/menu/billing/service'

export type MenuBillingReview = Awaited<ReturnType<typeof reviewMenuBilling>>
export interface MenuBillingStatus { billing: MenuBilling | null }
async function request<T>(body: Record<string, unknown>): Promise<T> {
  const user = auth.currentUser
  if (!user) throw new PublishProjectError('UNAUTHORIZED', 'Not authenticated')
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const url = process.env.NEXT_PUBLIC_MENU_BILLING_URL || (project ? `https://europe-west4-${project}.cloudfunctions.net/menuBilling` : undefined)
  if (!url) throw new PublishProjectError('CONFIG_ERROR', 'Menu billing URL not configured')
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify(body) })
  const data = await response.json()
  if (!response.ok) throw new PublishProjectError(data.error ?? 'UNKNOWN', 'Menu billing failed')
  return data
}
export const getMenuBillingStatus = (projectId: string) => request<MenuBillingStatus>({ action: 'status', projectId })
export const reviewMenuPayment = (projectId: string, planId?: MenuPlanId) => request<MenuBillingReview>({ action: 'review', projectId, planId })
export const changeMenuAutoRenew = (projectId: string, autoRenew: boolean, revision: number) => request<{ billing: MenuBilling }>({ action: 'autoRenew', projectId, autoRenew, revision })
