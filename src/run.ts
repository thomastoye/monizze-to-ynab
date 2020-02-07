#!/usr/bin/env ts-node
import { config } from 'dotenv'
config()

import * as yargs from 'yargs'
import { createObjectCsvStringifier } from 'csv-writer'
import { parse } from '.'
import { getAllTransactions } from './get'
import { getToken } from './get-token';

interface Arguments {
    token?: string
}

const argv: Arguments = yargs.options({
    token: { type: 'string', description: 'Token from the Monizze API. Found in your Monizze.be cookies or X-Token when a request is made.' },
}).argv;

(async () => {
    let token: string

    if (argv.token != null) {
        console.error('Using provided token.')
        token = argv.token
    } else if (process.env.MONIZZE_EMAIL == null || process.env.MONIZZE_PASSWORD == null) {
        console.error('$MONIZZE_EMAIL or $MONIZZE_PASSWORD not set and no token provided')
        process.exit(1)
    } else {
        console.error('Getting token from Monizze by logging in...')
        const automaticToken = await getToken(process.env.MONIZZE_EMAIL, process.env.MONIZZE_PASSWORD)

        if (automaticToken == null) {
            console.error('Could not get token from Monizze automatically!')
            process.exit(1)
        }

        token = automaticToken
    }

    const input = await getAllTransactions(token)
    
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'date', title: 'Date' },
            { id: 'payee', title: 'Payee' },
            { id: 'memo', title: 'Memo' },
            { id: 'amount', title: 'Amount' },
        ]
    })
    
    const toLog = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([ ...parse(input) ])
    
    console.log(toLog)
})();
