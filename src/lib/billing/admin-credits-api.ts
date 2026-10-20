import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase/firebase'
import type { CreditAccount, CompensationInput, CompensationReceipt } from '../../../functions/src/transactions/admin/contracts'
export type { CreditAccount, CompensationInput, CompensationReceipt }

export async function findCreditAccount(identifier: string) {
  const result = await httpsCallable<{ action: string; identifier: string }, CreditAccount>(functions, 'adminCredits')({ action: 'lookup', identifier })
  return result.data
}
export async function grantCompensation(input: CompensationInput) {
  const result = await httpsCallable<CompensationInput & { action: string }, CompensationReceipt>(functions, 'adminCredits')({ ...input, action: 'grant' })
  return result.data
}
