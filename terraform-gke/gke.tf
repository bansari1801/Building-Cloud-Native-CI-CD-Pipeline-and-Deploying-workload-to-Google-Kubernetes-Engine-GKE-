variable "gke_num_nodes" {
  default     = 1
  description = "number of gke nodes"
}

# GKE cluster
resource "google_container_cluster" "primary" {
  project = "cloud-assignment-3-390018"
  name     = "cloud-assignment-3-390018-gke"
  location = "us-east1"
  remove_default_node_pool = true
  initial_node_count       = 1
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  project = "cloud-assignment-3-390018"
  name       = "${google_container_cluster.primary.name}-node-pool"
  location   = "us-east1"
  cluster    = google_container_cluster.primary.name
  node_count = var.gke_num_nodes

  node_config {
    machine_type    = "e2-micro"
    disk_type  = "pd-standard"
    disk_size_gb = 10
    image_type      = "COS_CONTAINERD"
    preemptible     = false
   

    labels = {
      env = "cloud-assignment-3-390018"
    }
  }
}