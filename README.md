# Monizze to YNAB

Import Monizze transactions to YNAB.

## How to use

```
# Clone the repo
$ git clone https://github.com/thomastoye/monizze-to-ynab.git

# Install dependencies
$ yarn

# Option 1: Get a token yourself 
$ yarn --silent start --token=eyJpd... > output.csv

# Option 2: Automatically get a token
#           You can use a .env file
$ MONIZZE_EMAIL=me@example.org MONIZZE_PASSWORD=very-secure yarn --silent start > output.csv

```

Now you can import `output.csv` in YNAB.

## Getting a token yourself

If you don't want to provide your username and password to an untrusted script, you can provide an existing token. You can do this by [logging in on Monizze](https://my.monizze.be/nl/login/) and inspecting the network panel. The token is sent with the `X-Token` header to the API.
