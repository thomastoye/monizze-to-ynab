import { format } from 'date-fns'
import { API, TransactionDetail } from 'ynab'
import { Transaction } from './types'
import {
  capitalizeFirstLetterOfEachWord,
  removeMonizzePrefix,
  replaceIssuingCompanyName,
} from './clean-payee'

const IMPORT_ID_VERSION = 'v2' // Raise this when changing the format of e.g. the payee name

type YnabDetails = {
  accessToken: string
  budgetId: string
  accountId: string
  issuingCompanyName?: string
}

export const printAvailableBudgets = async (accessToken: string) => {
  const ynabAPI = new API(accessToken)
  const res = await ynabAPI.budgets.getBudgets()
  res.data.budgets.forEach((budget) =>
    console.error(`Budget: ${budget.id} ${budget.name}`)
  )
}

export const printAvailableAccounts = async (
  accessToken: string,
  budgetId: string
) => {
  const ynabAPI = new API(accessToken)
  const res = await ynabAPI.accounts.getAccounts(budgetId)
  res.data.accounts.forEach((accounts) =>
    console.error(`Account: ${accounts.id} ${accounts.name}`)
  )
}

export const getLastReconciliationDate = async (
  ynab: YnabDetails
): Promise<Date | null> => {
  const ynabAPI = new API(ynab.accessToken)

  const transactionsInYnab = (
    await ynabAPI.transactions.getTransactionsByAccount(
      ynab.budgetId,
      ynab.accountId
    )
  ).data.transactions

  const lastReconciliationDate = transactionsInYnab
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find(
      (transaction) =>
        transaction.cleared === TransactionDetail.ClearedEnum.Reconciled
    )?.date

  return lastReconciliationDate != null
    ? new Date(lastReconciliationDate)
    : null
}

export const importToYnab = async (
  transactions: readonly Transaction[],
  ynab: YnabDetails
) => {
  console.error(`Importing ${transactions.length} transactions into YNAB...`)
  const ynabAPI = new API(ynab.accessToken)

  try {
    await ynabAPI.transactions.createTransactions(ynab.budgetId, {
      transactions: transactions.map((transaction) => ({
        account_id: ynab.accountId,
        import_id: `monizze:${IMPORT_ID_VERSION}${transaction.date.getTime()}`,
        date: format(transaction.date, 'yyyy-MM-dd'),
        amount: Math.round(transaction.amount * 1000),
        payee_name: capitalizeFirstLetterOfEachWord(
          replaceIssuingCompanyName(
            removeMonizzePrefix(transaction.detail),
            ynab.issuingCompanyName
          )
        ),
        cleared: TransactionDetail.ClearedEnum.Cleared,
      })),
    })
  } catch (err) {
    console.error('Error while importing transactions to YNAB', err)
  }
}
