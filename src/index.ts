import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

const TIMEZONE = 'Europe/Brussels'

export type Transaction = {
  /** E.g. -7.73 */
  amount: number

  date: Date

  /** E.g. EXPRESS GENT ST LIEVENSPOGENT BE */
  detail: string
}

export type OutputLine = {
  /** Format? Not in YNAB's doc. Assumed to be mm/dd/yyyy */
  date: string
  payee: string
  memo: string
  amount: number
}

export const parse = (
  transactions: readonly Transaction[]
): readonly OutputLine[] => {
  return transactions.map((transaction) => {
    return {
      date: format(zonedTimeToUtc(transaction.date, TIMEZONE), 'yyyy-MM-dd'),
      payee: transaction.detail,
      memo: '',
      amount: transaction.amount,
    }
  })
}
