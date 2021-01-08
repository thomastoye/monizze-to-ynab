import got, { CancelableRequest } from 'got'
import { Transaction } from './types'
import pRetry from 'p-retry'
import { zonedTimeToUtc } from 'date-fns-tz'

type ApiResponse = {
  data: {
    emv: readonly {
      amount: number
      date: string // e.g. 2021-01-06 12:38:12
      detail: string
    }[]
  }
}

const getTransactionsForPage = async (
  page: number,
  token: string
): Promise<readonly Transaction[]> => {
  const response: CancelableRequest<ApiResponse> = got(
    `https://happy.monizze.be/api/services/my-monizze/voucher/history/${page}/0/emv`,
    {
      headers: {
        'X-Token': token,
        Accept: 'application/json',
      },
    }
  ).json()

  return (await response).data.emv.map((transaction) => ({
    amount: transaction.amount,
    date: zonedTimeToUtc(transaction.date, 'Europe/Brussels'),
    detail: transaction.detail,
  }))
}

export const getAllTransactions = async (
  token: string,
  day?: Date
): Promise<readonly Transaction[]> => {
  const buffer: Transaction[] = []
  let currentPage = 0

  while (true) {
    console.error(`Getting transactions for page ${currentPage}...`)
    const newTransactions = await pRetry(
      () => getTransactionsForPage(currentPage, token),
      { retries: 5 }
    )
    buffer.push(
      ...newTransactions.filter(
        (transaction) => day == null || transaction.date >= day
      )
    )
    currentPage++

    if (
      newTransactions.length === 0 ||
      (day != null &&
        newTransactions.filter((transaction) => transaction.date < day) != null)
    ) {
      break
    }
  }

  console.error(`Got ${buffer.length} transactions.`)

  return buffer
}
