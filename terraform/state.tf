terraform {
  backend "gcs" {
    bucket = "monizze-to-ynab-terraform"
    prefix = "terraform/state"
  }
}
