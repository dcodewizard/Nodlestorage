#  Secret Mangement application 

This repository contains the backend code and Terraform script to deploy and manage the Nodle Storage service on Google Cloud Run. 
The service utilizes Google Cloud Run V2 and integrates with various Google Cloud services such as Secret Manager and 
Firebase.

[Watch the video](https://www.loom.com/share/25a32d1a12e4449db06b7eec2fde96e8)

# Build With

- Node js
- Firebase
- Google Cloud Artifacts Registry
- Google Cloud Run Service

# Getting Started

## Clone the Repository:
   ```bash
   git clone git@github.com:dcodewizard/Nodle_Storage.git
   cd repo
   ```

## Prerequisties for server

- npm

  ```bash
  npm install npm@latest -g
  ```
## Installation

1. **Configuration**
   ```bash
   cd nodle-server
   configure your variables
   ```

2. **Deployment**
- Create a project on google cloud and note down the id.
- Replace projectId in index.js with your Google Cloud project ID.
- Replace the placeholder process.env.JWT_SECRET in index.js with your desired JWT secret.
- Configure Firebase
- Create your repository in artifacts registry.
- Build your docker image
   ```bash
   docker build - t name .
   ```
- Tag your image for pushing to artifacts argistry as per your configurations
   ```bash
   docker tag your-image yourlocation-docker.pkg.dev/your-project/your-repo/your-image
   ```
- Push your image
   ```bash
   docker push LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE:TAG
   ```
   
## Prerequisties for terraform

Before deploying the Nodle Storage service, make sure you have the following prerequisites in place:

- Have your docker image readyand deployed to artifacts registry.
- Google Cloud Platform account
- Google Cloud SDK installed and configured
- Terraform installed locally
- Service account JSON key file (authentication.json) for Google Cloud authentication

## Installation

1. **Configuration**
   ```bash
   cd nodle-terraform
   configure your variables
   ```

2. **Initialize the Terraform**

- Before starting the application for the first time, ensure that the authentication with gcloud is set up correctly.
   ```bash
   terraform init
   terraform plan
   ```
- Now apply the terraform plan with
   ```bash
   terraform apply
   ```

# API Documentation

Here is the API collection available on postman: 
https://elements.getpostman.com/redirect?entityId=31034066-a87abab3-d309-45d0-a828-45503f99dd7d&entityType=collection 

Bwlow is detailed information on each endpoints

1. **User Registration**:

- Endpoint: /register
- Method: POST
- Request Body
```bash
{
  "email": "usera@example.com",
  "password": "userpassword"
}
```
2. **Store Secret**:

- Endpoint: /storeSecret/:userId
- Method: POST
- Request Parameters:
  - userId: User ID obtained during registration/login
- Provide token generated during registration as an authorization header
- Request Body:
```bash
{
  "secret": "usersecret"
}
```
3. **Get Secret**:

- Endpoint: /getSecret/:userId
- Method: GET
- Request Parameters:
  - userId: User ID obtained during registration/login
- Provide token generated during registration as an authorization header
- Request Body:
```bash
{
  "secret": "usersecretvalue"
}
```
