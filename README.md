# Monizze to YNAB

Import Monizze transactions to YNAB.

## How to use

```
# Clone the repo
$ git clone https://github.com/thomastoye/monizze-to-ynab.git

# Install dependencies
$ yarn

# Authentication with Monizze

# Option 1: Get a token yourself
$ yarn start --token=eyJpd...

# Option 2: Automatically get a token
#           You can use a .env file
$ MONIZZE_EMAIL=me@example.org MONIZZE_PASSWORD=very-secure yarn start

# Getting results

# Option 1: In a CSV file you can upload to YNAB manually
$ yarn --silent start --csv > output.csv

# Option 2: Auto-import to YNAB ✨
#           If you don't provide YNAB_BUDGET_ID/YNAB_ACCOUNT_ID, the script will provide a list of them
#           You can use a .env file to store these
$ YNAB_PERSONAL_ACCESS_TOKEN=... YNAB_BUDGET_ID=...YNAB_ACCOUNT_ID=... yarn start
```

## Getting a Monizze token yourself

If you don't want to provide your username and password to an untrusted script, you can provide an existing token. You can do this by [logging in on Monizze](https://my.monizze.be/nl/login/) and inspecting the network panel. The token is sent with the `X-Token` header to the API.

## Getting a YNAB access token

You can create a YNAB access token [here](https://app.youneedabudget.com/settings/developer).

## Deployment as a Google Cloud Function

This repo includes Terraform configuration to deploy as a Terraform function

Either run `gcloud auth application-default login` or set `GOOGLE_PROJECT` and `GOOGLE_APPLICATION_CREDENTIALS`.

Create `terraform/terraform.tfvars.json`.

Run `yarn deploy`.

Trigger the PubSub queue: `gcloud pubsub topics publish projects/.../topics/trigger-monizze-to-ynab-import --message='{}'`
