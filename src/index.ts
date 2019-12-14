import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

const TIMEZONE = 'Europe/Brussels'

export type Transaction = {
    /** -7.73 */
    amount: number

    /** E.g. 2019-12-01 18:29:11 */
    date: string

    /** E.g. EXPRESS GENT ST LIEVENSPOGENT BE */
    detail: string
}

export type ResponseStructure = {
    data: {
        emv: readonly Transaction[]
    }
}

export type OutputLine = {
    /** Format? Not in YNAB's doc. Assumed to be mm/dd/yyyy */
    date: string
    payee: string
    memo: string
    amount: number
}

export const load = (input: string): ResponseStructure => {
    // TODO should confirm structure with io-ts or similar
    return JSON.parse(input)
}

export const parse = (response: ResponseStructure): readonly OutputLine[] => {
    return response.data.emv.map(transaction => {
        return {
            date: format(zonedTimeToUtc(transaction.date, TIMEZONE), 'yyyy-MM-dd'),
            payee: transaction.detail,
            memo: '',
            amount: transaction.amount,
        }
    })
}
