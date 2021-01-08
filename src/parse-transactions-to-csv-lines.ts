import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { OutputLine, Transaction } from './types'

const TIMEZONE = 'Europe/Brussels'

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
