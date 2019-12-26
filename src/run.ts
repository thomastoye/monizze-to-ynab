#!/usr/bin/env ts-node
import * as yargs from 'yargs'
import { createObjectCsvStringifier } from 'csv-writer'
import { parse } from '.'
import { getAllTransactions } from './get'

interface Arguments {
    token: string
}

const argv: Arguments = yargs.options({
    token: { type: 'string', demandOption: true, description: 'Token from the Monizze API. Found in your Monizze.be cookies or X-Token when a request is made.' },
}).argv;

(async () => {
    const input = await getAllTransactions(argv.token)
    
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
