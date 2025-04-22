# Product Catalog - Multi-tenant Application

A Kubernetes-based multi-tenant product catalog application with separate frontend and backend services, using AWS services for infrastructure.

## Architecture

### Components
- Frontend: Nginx serving static content
- Backend: Node.js Express API
- Image Storage: AWS CloudFront + S3
- Load Balancer: AWS ALB
- Container Registry: AWS ECR
- Kubernetes: AWS EKS

### Multi-tenancy
- Namespace-based isolation (cust1, cust2)
- Tenant-specific product catalogs
- Path-based routing (/cust1/*, /cust2/*)

## Prerequisites

- AWS CLI configured
- kubectl installed
- Docker installed
- Access to AWS ECR repository
- EKS cluster configured

## Infrastructure Setup

1. Create S3 bucket and CloudFront distribution:
```bash
# Create private S3 bucket
aws s3api create-bucket --bucket prod-catalog-images --region us-east-1

# Upload images
aws s3 cp images/ s3://prod-catalog-images/images/ --recursive
```

2. Configure ECR repositories:
```bash
# Create repositories
aws ecr create-repository --repository-name product-catalog-frontend
aws ecr create-repository --repository-name product-catalog-backend
```

## Deployment

1. Build and push Docker images:
```bash
# Frontend
docker build -t product-catalog-frontend -f frontend-Dockerfile .
docker tag product-catalog-frontend:latest 677276106411.dkr.ecr.us-east-1.amazonaws.com/product-catalog-frontend:latest
docker push 677276106411.dkr.ecr.us-east-1.amazonaws.com/product-catalog-frontend:latest

# Backend
docker build -t product-catalog-backend -f backend-Dockerfile .
docker tag product-catalog-backend:latest 677276106411.dkr.ecr.us-east-1.amazonaws.com/product-catalog-backend:latest
docker push 677276106411.dkr.ecr.us-east-1.amazonaws.com/product-catalog-backend:latest
```

2. Create namespaces:
```bash
kubectl create namespace cust1
kubectl create namespace cust2
```

3. Deploy application:
```bash
# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml -n cust1
kubectl apply -f k8s/backend-deployment.yaml -n cust2
kubectl apply -f k8s/backend-service.yaml -n cust1
kubectl apply -f k8s/backend-service.yaml -n cust2

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml -n cust1
kubectl apply -f k8s/frontend-deployment.yaml -n cust2
kubectl apply -f k8s/frontend-service.yaml -n cust1
kubectl apply -f k8s/frontend-service.yaml -n cust2

# Configure ingress
kubectl apply -f k8s/alb-ingress.yaml
```

## Project Structure

```
/proudct-catalog/
├── app.js                 # Backend application
├── index.html            # Frontend application
├── nginx.conf            # Nginx configuration
├── images/              # Product images
├── k8s/                 # Kubernetes manifests
│   ├── alb-ingress.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
├── frontend-Dockerfile   # Frontend container build
└── backend-Dockerfile    # Backend container build
```

## Access Application

After deployment, access the application at:
- Customer 1: http://[ALB-DNS]/cust1
- Customer 2: http://[ALB-DNS]/cust2

## Health Checks

- Frontend: `/healthz`
- Backend: `/health`

## Development

Local development setup:
```bash
# Run backend
npm install
node app.js

# Serve frontend
python -m http.server 8080
```

## Image Management

Images are served via CloudFront CDN:
- CloudFront URL: `http://[distribution-id].cloudfront.net`
- Image path format: `/images/[product-image].jpg`
