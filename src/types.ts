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
