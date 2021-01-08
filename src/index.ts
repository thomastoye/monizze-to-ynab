import type { EventFunction } from '@google-cloud/functions-framework/build/src/functions'
import { getAllTransactions } from './get'
import { getToken } from './get-token'
import { getLastReconciliationDate, importToYnab } from './ynab'

const budgetId = process.env.YNAB_BUDGET_ID
const accountId = process.env.YNAB_ACCOUNT_ID
const accessToken = process.env.YNAB_PERSONAL_ACCESS_TOKEN
const monizzeEmail = process.env.MONIZZE_EMAIL
const monizzePassword = process.env.MONIZZE_PASSWORD

if (
  budgetId == null ||
  accountId == null ||
  accessToken == null ||
  monizzeEmail == null ||
  monizzePassword == null
) {
  throw new Error('Not all necessary env vars are set')
}

export const moduleEntryPoint: EventFunction = async () => {
  const lastReconciliationDate = await getLastReconciliationDate({
    accessToken,
    accountId,
    budgetId,
  })
  console.log(
    `Last reconciliation date: ${lastReconciliationDate}. Returning transactions on or after that date...`
  )

  const token = await getToken(monizzeEmail, monizzePassword)
  if (token == null) {
    throw new Error('Monizze token was empty!')
  }
  console.log('Got a Monizze token')

  const transactions = await getAllTransactions(
    token,
    lastReconciliationDate || undefined
  )

  await importToYnab(transactions, {
    accessToken,
    accountId,
    budgetId,
  })
}
