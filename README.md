# Monizze to YNAB

Import Monizze transactions to YNAB.

## How to use

1. Clone this repo
1. Run `yarn`
1. Get your recent transaction history from YNAB. This is manual for now. Go to [this page](https://my.monizze.be/en/history) with your network panel open. Get the response from the request to https://happy.monizze.be/api/services/my-monizze/voucher/history and save this to `something.json`
1. Run `src/run.ts --file=./something.json > output.json`
1. Import `output.json` in YNAB
