locals {
  app_labels = {
    project = "portfolio"
  }

  mongo_uri = "mongodb://${var.mongo_root_user}:${var.mongo_root_password}@mongodb:27017/${var.mongo_database}?authSource=admin"
}

resource "kubernetes_namespace_v1" "portfolio" {
  metadata {
    name = var.namespace

    labels = local.app_labels
  }
}

resource "kubernetes_secret_v1" "mongo" {
  metadata {
    name      = "mongo-secret"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  type = "Opaque"

  data = {
    MONGO_ROOT_USER     = var.mongo_root_user
    MONGO_ROOT_PASSWORD = var.mongo_root_password
    MONGO_DB            = var.mongo_database
    MONGO_URI           = local.mongo_uri
  }
}

resource "kubernetes_service_v1" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    cluster_ip = "None"

    selector = {
      app = "mongodb"
    }

    port {
      port        = 27017
      target_port = 27017
    }
  }
}

resource "kubernetes_stateful_set_v1" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    service_name = kubernetes_service_v1.mongodb.metadata[0].name
    replicas     = 1

    selector {
      match_labels = {
        app = "mongodb"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongodb"
        }
      }

      spec {
        container {
          name  = "mongodb"
          image = var.mongodb_image

          port {
            container_port = 27017
          }

          env {
            name = "MONGO_INITDB_ROOT_USERNAME"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_ROOT_USER"
              }
            }
          }

          env {
            name = "MONGO_INITDB_ROOT_PASSWORD"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_ROOT_PASSWORD"
              }
            }
          }

          env {
            name = "MONGO_INITDB_DATABASE"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_DB"
              }
            }
          }

          volume_mount {
            name       = "mongo-data"
            mount_path = "/data/db"
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = "mongo-data"
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests = {
            storage = var.mongo_storage_size
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    replicas = var.backend_replicas

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = var.backend_image

          port {
            container_port = 3001
          }

          env {
            name  = "PORT"
            value = "3001"
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name = "MONGO_ROOT_USER"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_ROOT_USER"
              }
            }
          }

          env {
            name = "MONGO_ROOT_PASSWORD"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_ROOT_PASSWORD"
              }
            }
          }

          env {
            name = "MONGO_DB"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_DB"
              }
            }
          }

          env {
            name = "MONGO_URI"

            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "MONGO_URI"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 3001
      target_port = 3001
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_deployment_v1" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    replicas = var.frontend_replicas

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = var.frontend_image

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      port        = 80
      target_port = 80
      node_port   = var.frontend_node_port
    }

    type = "NodePort"
  }
}

resource "kubernetes_ingress_v1" "portfolio" {
  metadata {
    name      = "portfolio-ingress"
    namespace = kubernetes_namespace_v1.portfolio.metadata[0].name

    annotations = {
      "nginx.ingress.kubernetes.io/use-regex" = "true"
    }
  }

  spec {
    ingress_class_name = var.ingress_class_name

    rule {
      host = var.ingress_host

      http {
        path {
          path      = "/api"
          path_type = "Prefix"

          backend {
            service {
              name = kubernetes_service_v1.backend.metadata[0].name

              port {
                number = 3001
              }
            }
          }
        }

        path {
          path      = "/"
          path_type = "Prefix"

          backend {
            service {
              name = kubernetes_service_v1.frontend.metadata[0].name

              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}
