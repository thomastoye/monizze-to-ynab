# Monizze to YNAB

Import Monizze transactions to YNAB.

## How to use

1. Clone this repo
1. Run `yarn`
1. Get a token from Monizze. You can do this by logging in and inspecting the network panel. The token is sent with the `X-Token` header to the API. Alternatively, get it from the cookies.
1. Run `src/run.ts --token=eyJpd... > output.csv`
1. Import `output.csv` in YNAB
