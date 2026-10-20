import { requestProjectFunction } from './request-project-function'
import { PublishProjectError } from './publish-project-api'
import type { MenuBilling, MenuPlanId } from '../../../functions/src/projects/menu/billing/model'
import type { reviewMenuBilling } from '../../../functions/src/projects/menu/billing/service'

export type MenuBillingReview = Awaited<ReturnType<typeof reviewMenuBilling>>
export interface MenuBillingStatus { billing: MenuBilling | null }
async function request<T>(body: Record<string, unknown>): Promise<T> {
  return requestProjectFunction<T>(
    'menuBilling', body,
    { errorClass: PublishProjectError, fallbackMessage: 'Menu billing failed', useServerMessage: false },
  )
}
export const getMenuBillingStatus = (projectId: string) => request<MenuBillingStatus>({ action: 'status', projectId })
export const reviewMenuPayment = (projectId: string, planId?: MenuPlanId) => request<MenuBillingReview>({ action: 'review', projectId, planId })
export const changeMenuAutoRenew = (projectId: string, autoRenew: boolean, revision: number) => request<{ billing: MenuBilling }>({ action: 'autoRenew', projectId, autoRenew, revision })
