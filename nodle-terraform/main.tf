provider "google" {
  credentials = file("authentication.json")
  project     = var.project_name
  region      = var.region
}

resource "google_project_service" "run" {
  project = var.project_name
  service = "run.googleapis.com"
}

module "cloud_run_service" {
  source = "./modules/cloud_run_service"
}

resource "google_cloud_run_service_iam_member" "cloud_run_invoker" {
  service = module.cloud_run_service.service_name
  role    = "roles/run.invoker"
  member  = "allUsers"
}

resource "google_project_iam_member" "cloud_run_service_secret_accessor" {
  project = var.project_name
  role    = "roles/secretmanager.secretAccessor"
  member  =  var.service_member
}
