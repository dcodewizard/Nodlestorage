resource "google_cloud_run_v2_service" "noddleservice_v3" {
  name     = "noddleservice-v3"
  location = var.region

  timeouts {
    create = "10m"
  }

  template {
    containers {
      image = var.docker_url

      env {
        name  = "FIREBASE_API_KEY"
        value = var.firebase_api_key
      }
      env {
        name  = "FIREBASE_AUTH_DOMAIN"
        value = var.firebase_domain
      }
      env {
        name  = "FIREBASE_PROJECT_ID"
        value = var.firebase_project_id
      }
      env {
        name  = "CLOUD_RUN_SERVICE_ACCOUNT"
        value = var.service_account
      }
      env {
        name  = "SECRET_MANAGER_PROJECT_ID"
        value = var.secret_manager_project_id
      }
    }
    service_account = var.service_account
  }
}

output "service_name" {
  value = google_cloud_run_v2_service.noddleservice_v3.name
}