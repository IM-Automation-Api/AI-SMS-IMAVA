# Deploying to Google Cloud Run

This document provides instructions for deploying the AI-SMS-IMAVA application to Google Cloud Run.

## Prerequisites

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured
2. [Docker](https://docs.docker.com/get-docker/) installed
3. A Google Cloud project with billing enabled
4. Container Registry or Artifact Registry enabled in your Google Cloud project

## Configuration Files

The following files are used for deployment:

- `Dockerfile`: Defines how to build the container image
- `.dockerignore`: Specifies files to exclude from the container
- `nginx.conf`: Configures the Nginx server that serves the application
- `cloudbuild.yaml`: Defines the CI/CD pipeline for Google Cloud Build
- `.env.production`: Contains environment variables for the production build

## Manual Deployment

### 1. Update Environment Variables

Edit the `.env.production` file with your actual Supabase URL and anonymous key:

```
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 2. Build the Docker Image

```bash
docker build -t gcr.io/[YOUR_PROJECT_ID]/AI-SMS-IMAVA:latest .
```

Replace `[YOUR_PROJECT_ID]` with your Google Cloud project ID.

### 3. Push the Image to Google Container Registry

First, authenticate Docker with Google Cloud:

```bash
gcloud auth configure-docker
```

Then push the image:

```bash
docker push gcr.io/[YOUR_PROJECT_ID]/AI-SMS-IMAVA:latest
```

### 4. Deploy to Cloud Run

```bash
gcloud run deploy AI-SMS-IMAVA \
  --image gcr.io/[YOUR_PROJECT_ID]/AI-SMS-IMAVA:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

You can change the region as needed.

## Automated Deployment with Cloud Build

### 1. Set Up a Trigger in Google Cloud Build

1. Go to the [Cloud Build Triggers page](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Connect your repository
4. Configure the trigger to use the `cloudbuild.yaml` file
5. Set any environment variables needed

### 2. Push to Your Repository

When you push to your repository, Cloud Build will automatically:
1. Build the Docker image
2. Push it to Container Registry
3. Deploy it to Cloud Run

## Environment Variables

For environment variables, you have two options:

### 1. Build-time Variables

Include them in your `.env.production` file before building.

### 2. Runtime Variables

Pass them to the Cloud Run service:

```bash
gcloud run services update AI-SMS-IMAVA \
  --set-env-vars "KEY1=VALUE1,KEY2=VALUE2"
```

## Important Notes

1. Make sure your Supabase project allows requests from your Cloud Run domain
2. Update CORS settings in your Supabase project if needed
3. Consider setting up a custom domain for your Cloud Run service
4. For production, consider adding a CDN like Cloud CDN in front of your service

## Monitoring and Logging

After deployment, you can monitor your application using:
- Cloud Run dashboard
- Cloud Logging
- Cloud Monitoring

You can view logs with:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=AI-SMS-IMAVA"
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check your Dockerfile and make sure all dependencies are correctly specified
2. **Runtime Errors**: Check the logs in Cloud Run for any runtime errors
3. **API Connection Issues**: Ensure your Supabase URL and key are correct and that CORS is properly configured
4. **Performance Issues**: Consider adjusting the memory and CPU allocation for your Cloud Run service

### Getting Help

If you encounter issues, you can:
1. Check the [Cloud Run documentation](https://cloud.google.com/run/docs)
2. Search for similar issues on Stack Overflow
3. File a support ticket with Google Cloud Support
