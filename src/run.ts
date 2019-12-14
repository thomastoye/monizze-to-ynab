#!/usr/bin/env ts-node
import * as yargs from 'yargs'
import { createObjectCsvStringifier } from 'csv-writer'
import { load, parse } from '.'
import { readFileSync } from 'fs'

interface Arguments {
    file: string
}

const argv: Arguments = yargs.options({
    file: { type: 'string', demandOption: true, description: 'JSON file containing Monizze input. Get this from https://happy.monizze.be/api/services/my-monizze/voucher/history' },
}).argv

const input = readFileSync(argv.file).toString()

const csvStringifier = createObjectCsvStringifier({
    header: [
        { id: 'date', title: 'Date' },
        { id: 'payee', title: 'Payee' },
        { id: 'memo', title: 'Memo' },
        { id: 'amount', title: 'Amount' },
    ]
})

const toLog = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([ ...parse(load(input)) ])

console.log(toLog)
