output "region" {
  value       = "us-east1"
  description = "GCloud Region"
}

output "project_id" {
  value       = "cloud-assignment-3-390018"
  description = "GCloud Project ID"
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "GKE Cluster Host"
}