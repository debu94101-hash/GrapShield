# GRAP Shield — Extended AWS Service Integration

The existing GRAP Shield stack is preserved. This optional layer documents and prepares integration points for the requested AWS services without pretending that resources are operational when they have not been provisioned.

## Existing operational services
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB
- Amazon EventBridge
- Amazon SNS
- Amazon CloudWatch

## Optional integration targets
- Amazon SageMaker AI
- Amazon EKS
- Amazon ECS
- AWS Fargate
- AWS Step Functions
- Amazon EC2
- Amazon Lightsail
- AWS App Runner
- AWS Amplify Hosting
- Amazon RDS
- Amazon Aurora
- Amazon Cognito
- Amazon CloudFront
- Amazon Route 53
- Amazon SQS

`extended-services.yaml` is intentionally disabled by default. Set `EnableExtendedServices=true` only after configuring the required networking, IAM, secrets, images/model artifacts, domains, and application endpoints. Several of these services can incur AWS charges.

The running application exposes `/api/aws/extended-services` so the architecture layer can distinguish existing operational services from optional integrations.
