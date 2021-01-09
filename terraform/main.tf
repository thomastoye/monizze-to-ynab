locals {
  timestamp = formatdate("YYMMDDhhmmss", timestamp())
  root_dir  = abspath("../")
}

data "archive_file" "source" {
  type       = "zip"
  source_dir = "${local.root_dir}/deploy"

  output_path = "/tmp/function-${local.timestamp}.zip"
}

resource "google_storage_bucket" "bucket" {
  project = var.project
  name    = "${var.project}-function"
}

resource "google_storage_bucket_object" "zip" {
  name   = "source-${data.archive_file.source.output_md5}.zip"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.source.output_path
}

resource "google_project_service" "cf" {
  project = var.project
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

resource "google_project_service" "cs" {
  project = var.project
  service = "cloudscheduler.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

resource "google_project_service" "cb" {
  project = var.project
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

resource "google_project_service" "ae" {
  project = var.project
  service = "appengine.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

resource "google_cloudfunctions_function" "function" {
  project = var.project
  name    = var.function_name
  runtime = "nodejs14"

  available_memory_mb   = 512
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.zip.name
  entry_point           = var.function_entry_point
  timeout               = 300

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.trigger_monizze_to_ynab_import.id
  }

  environment_variables = {
    "MONIZZE_EMAIL"              = var.monizze_email
    "MONIZZE_PASSWORD"           = var.monizze_password
    "YNAB_PERSONAL_ACCESS_TOKEN" = var.ynab_personal_access_token
    "YNAB_BUDGET_ID"             = var.ynab_budget_id
    "YNAB_ACCOUNT_ID"            = var.ynab_account_id
  }
}

resource "google_pubsub_topic" "trigger_monizze_to_ynab_import" {
  project = var.project
  name    = "trigger-monizze-to-ynab-import"
}

# Can't create a google_cloud_scheduler_job without a google_app_engine_application...
resource "google_app_engine_application" "empty_app" {
  project     = var.project
  location_id = var.region
}

resource "google_cloud_scheduler_job" "job" {
  project     = var.project
  region      = var.region
  depends_on  = [google_app_engine_application.empty_app]
  name        = "trigger_monizze_to_ynab_job"
  description = "Trigger Monizze to YNAB importer"
  schedule    = "0 12,13,19,21 * * *"

  pubsub_target {
    topic_name = google_pubsub_topic.trigger_monizze_to_ynab_import.id
    data       = base64encode("{}")
  }
}
