import got, { CancelableRequest } from 'got'
import { Transaction } from '.';
import pRetry from 'p-retry'

type ApiResponse = {
    data: {
        emv: readonly Transaction[]
    }
}

const getTransactionsForPage = async (page: number, token: string): Promise<readonly Transaction[]> => {
    const response: CancelableRequest<ApiResponse> = got(`https://happy.monizze.be/api/services/my-monizze/voucher/history/${page}/0/emv`, {
        headers: {
            'X-Token': token,
            Accept: 'application/json'
        }
    }).json()

    return (await response).data.emv
}

export const getAllTransactions = async (token: string): Promise<readonly Transaction[]> => {
    const buffer: Transaction[] = []
    let currentPage = 0

    while (true) {
        console.error(`Getting transactions for page ${currentPage}...`)
        const newTransactions = await pRetry(() => getTransactionsForPage(currentPage, token), { retries: 5 })
        buffer.push(...newTransactions)
        currentPage++

        if (newTransactions.length === 0) {
            break
        }
    }

    console.error(`Got ${buffer.length} transactions.`)

    return buffer
}
