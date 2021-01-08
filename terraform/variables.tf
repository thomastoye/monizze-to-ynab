variable "project" {
  default = "monizze-to-ynab"
}

variable "region" {
  default = "europe-west1"
}

variable "prefix" {
  default = "monizze-to-ynab"
}

variable "function_name" {
  default = "monizze-to-ynab-function"
}

variable "function_entry_point" {
  default = "moduleEntryPoint"
}

variable "monizze_email" {
  sensitive = true
}

variable "monizze_password" {
  sensitive = true
}

variable "ynab_personal_access_token" {
  sensitive = true
}

variable "ynab_budget_id" {
  sensitive = true
}

variable "ynab_account_id" {
  sensitive = true
}
