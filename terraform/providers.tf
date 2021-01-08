provider "google" {
  #credentials = file("./monizze-to-ynab-terraform-key.json")
  project = var.project
  region  = var.region
}
