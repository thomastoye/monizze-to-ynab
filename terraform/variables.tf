variable "project" {
  default = "monizze-to-ynab"
  type    = string
}

variable "region" {
  default = "europe-west3"
  type    = string
}

variable "prefix" {
  default = "monizze-to-ynab"
  type    = string
}

variable "function_name" {
  default = "monizze-to-ynab-function"
  type    = string
}

variable "function_entry_point" {
  default = "moduleEntryPoint"
  type    = string
}

variable "monizze_email" {
  sensitive = true
  type      = string
}

variable "monizze_password" {
  sensitive = true
  type      = string
}

variable "ynab_personal_access_token" {
  sensitive = true
  type      = string
}

variable "ynab_budget_id" {
  sensitive = true
  type      = string
}

variable "ynab_account_id" {
  sensitive = true
  type      = string
}

variable "issuing_company_name" {
  type = string
}
