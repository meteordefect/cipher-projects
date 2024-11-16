# Cipher Projects Infrastructure

This repository contains the AWS infrastructure as code (IaC) for the Cipher Projects deployment, built using AWS CDK (Cloud Development Kit). It automates the setup of the necessary cloud infrastructure and deployment process for the `cipherprojects.com` application.

---

## Features

- **VPC Setup**: Configures a Virtual Private Cloud (VPC) with public subnets.
- **EC2 Deployment**: Deploys an Amazon EC2 instance to host the application.
- **CloudFront Distribution**: Configures AWS CloudFront for secure and performant content delivery.
- **S3 Deployment Bucket**: Sets up an S3 bucket to store deployment artifacts.
- **ACM SSL Certificates**: Ensures secure HTTPS connections using Amazon Certificate Manager (ACM).
- **User Data Script**: Configures the EC2 instance with Node.js, PM2, NGINX, and the application code.
- **Automated Deployment**: GitHub Actions for CI/CD pipeline, automating infrastructure deployment and application updates.

---

## Prerequisites

1. **AWS Account**: Ensure you have an AWS account with appropriate permissions.
2. **AWS CLI**: Install and configure the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
3. **Node.js**: Install [Node.js](https://nodejs.org/) version 18 or above.
4. **AWS CDK**: Install the AWS CDK globally:
   ```bash
   npm install -g aws-cdk
