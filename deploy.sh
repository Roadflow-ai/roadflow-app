#!/bin/bash

set -e  # Exit on any error

# === Config ===
REGION="us-west1"
PROJECT_ID="manifest-grin-462423-m3"
REPO_NAME="hackaton"
SERVICE_NAME="flow-app"
LOCAL_IMAGE="bloodbloy/${SERVICE_NAME}"
REMOTE_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

# === Build ===
echo "🔨 Building project"
pnpm build

# === Deploy ===
gcloud run deploy $SERVICE_NAME  --source .   --allow-unauthenticated \
  --env-vars-file .env.yaml \
  --memory 2Gi \
  --cpu 2 --region $REGION \
  --project $PROJECT_ID


echo "✅ Deployment completed successfully."
