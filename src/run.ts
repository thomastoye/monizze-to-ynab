#!/usr/bin/env ts-node
import { config } from 'dotenv'
config()

import * as yargs from 'yargs'
import { createObjectCsvStringifier } from 'csv-writer'
import { getAllTransactions } from './get'
import { getToken } from './get-token'
import {
  getLastReconciliationDate,
  importToYnab,
  printAvailableAccounts,
  printAvailableBudgets,
} from './ynab'
import { parse } from './parse-transactions-to-csv-lines'

interface Arguments {
  token?: string
  csv: boolean
}

const argv: Arguments = yargs.options({
  token: {
    type: 'string',
    description:
      'Token from the Monizze API. Found in your Monizze.be cookies or X-Token when a request is made.',
  },
  csv: {
    type: 'boolean',
    description:
      'Print a CSV result file that can be imported into YNAB to standard output',
    default: true,
  },
}).argv

const getYnabDetails = async () => {
  const budgetId = process.env.YNAB_BUDGET_ID
  const accountId = process.env.YNAB_ACCOUNT_ID
  const accessToken = process.env.YNAB_PERSONAL_ACCESS_TOKEN

  if (budgetId != null && accountId != null && accessToken != null) {
    return {
      budgetId,
      accountId,
      accessToken,
      issuingCompanyName: process.env.ISSUING_COMPANY_NAME,
    }
  } else if (accessToken == null) {
    console.error(
      `$YNAB_PERSONAL_ACCESS_TOKEN not set, will not get last reconciliation date or import to YNAB`
    )
    console.error(
      `Get an access token here if you want: https://app.youneedabudget.com/settings/developer`
    )
    return null
  } else if (budgetId == null) {
    console.error(`$YNAB_BUDGET_ID not set`)
    await printAvailableBudgets(accessToken)
    process.exit(1)
  } else if (accountId == null) {
    console.error(`$YNAB_ACCOUNT_ID not set`)
    await printAvailableAccounts(accessToken, budgetId)
    process.exit(1)
  }

  return null
}

;(async () => {
  const ynabDetails = await getYnabDetails()

  let token: string

  if (argv.token != null) {
    console.error('Using provided token.')
    token = argv.token
  } else if (
    process.env.MONIZZE_EMAIL == null ||
    process.env.MONIZZE_PASSWORD == null
  ) {
    console.error(
      '$MONIZZE_EMAIL or $MONIZZE_PASSWORD not set and no token provided'
    )
    process.exit(1)
  } else {
    console.error('Getting token from Monizze by logging in...')
    const automaticToken = await getToken(
      process.env.MONIZZE_EMAIL,
      process.env.MONIZZE_PASSWORD
    )

    if (automaticToken == null) {
      console.error('Could not get token from Monizze automatically!')
      process.exit(1)
    }

    token = automaticToken
  }

  const lastReconciliationDate =
    ynabDetails == null ? null : await getLastReconciliationDate(ynabDetails)

  if (lastReconciliationDate != null) {
    console.error(
      `Last reconciliation date: ${lastReconciliationDate}. Returning transactions on or after that date...`
    )
  }

  const transactions = await getAllTransactions(
    token,
    lastReconciliationDate || undefined
  )

  if (argv.csv) {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'payee', title: 'Payee' },
        { id: 'memo', title: 'Memo' },
        { id: 'amount', title: 'Amount' },
      ],
    })

    const toLog =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords([...parse(transactions)])

    console.log(toLog)
  }

  if (ynabDetails != null) {
    await importToYnab(transactions, ynabDetails)
  }
})()
