import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, Terminal, BookOpen, Layers } from 'lucide-react';

interface ArchitectureDocsModalProps {
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'sam' | 'math' | 'setup'>('sam');
  const [copied, setCopied] = useState(false);

  const samYaml = `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: GRAP SHIELD - Live Urban Air-Risk Digital Twin & Intervention Intelligence

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x
    Tracing: Active
    Environment:
      Variables:
        TABLE_NAME: !Ref GrapShieldTable
        S3_BUCKET: !Ref TelemetryBucket
        SNS_ALERT_TOPIC: !Ref EmergencyAlertsTopic

Resources:
  # 1. DynamoDB Single-Table Storage (Zero Graph DB)
  GrapShieldTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: GrapShieldUrbanTwin
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true

  # 2. Amazon S3 Raw Telemetry Lake
  TelemetryBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: grap-shield-telemetry-delhi
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  # 3. Amazon EventBridge 15-Minute Ingestion Trigger
  IngestionScheduleRule:
    Type: AWS::Events::Rule
    Properties:
      Description: Dispatches scheduled air telemetry ingest every 15 minutes
      ScheduleExpression: rate(15 minutes)
      State: ENABLED
      Targets:
        - Arn: !GetAtt IngestionWorkerFunction.Arn
          Id: IngestionLambdaTarget

  # 4. AWS Lambda: Ingestion Worker
  IngestionWorkerFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: grap-shield-ingestion-worker
      Handler: index.handler
      CodeUri: ./backend/dist/ingestion
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref GrapShieldTable
        - S3CrudPolicy:
            BucketName: !Ref TelemetryBucket

  # 5. AWS Lambda: Risk & GRAP Evaluator
  RiskEvaluatorFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: grap-shield-risk-evaluator
      Handler: index.handler
      CodeUri: ./backend/dist/risk-engine
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref GrapShieldTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt EmergencyAlertsTopic.TopicName

  # 6. Amazon SNS Emergency Alerts Topic
  EmergencyAlertsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: grap-shield-emergency-alerts
      DisplayName: GRAP Shield Urban Exposure Emergency Dispatch

  # 7. Amazon API Gateway
  GrapShieldApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: v1
      Cors:
        AllowMethods: "'GET,POST,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
        AllowOrigin: "'*'"`;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0E1524] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                GRAP SHIELD Architecture & AWS CloudFormation Blueprint
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Production Serverless Deployment Specifications · Zero Graph Database Architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0B101D]">
          <button
            onClick={() => setActiveTab('sam')}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sam' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AWS SAM Template (YAML)
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'math' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Exposure Relationship Mathematics
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'setup' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Deployment & Setup Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          {activeTab === 'sam' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Production AWS CloudFormation / SAM Infrastructure as Code (template.yaml):</span>
                <button
                  onClick={() => copyCode(samYaml)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy SAM Spec'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
                {samYaml}
              </pre>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white uppercase text-cyan-400">
                  1. Spatial Proximity & Wind Decay Kernel
                </h3>
                <p>
                  Particulate concentration at receptor location <i>j</i> originating from station <i>i</i>:
                </p>
                <div className="p-2.5 bg-black/50 rounded-lg text-emerald-300">
                  w_spatial(i, j) = exp(-d_ij / 3.5 km) × [1 + 0.25 × cos(θ_wind - φ_ij)]
                </div>
                <p className="text-slate-400">
                  Where <i>d_ij</i> is Haversine distance, <i>θ_wind</i> is Open-Meteo wind azimuth, and <i>φ_ij</i> is bearing from station to receptor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white uppercase text-amber-400">
                  2. Traffic Corridor Emission Loading
                </h3>
                <div className="p-2.5 bg-black/50 rounded-lg text-amber-300">
                  E_traffic = (PCU_day / 150,000) × (DieselFreightShare / 0.35) × 10
                </div>
                <p className="text-slate-400">
                  Derived from CAQM arterial traffic counts on Mahatma Gandhi Ring Road and NH-44 GT Karnal Road.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white uppercase text-purple-400">
                  3. Multivariate Exposure Aggregation
                </h3>
                <div className="p-2.5 bg-black/50 rounded-lg text-purple-300">
                  ExposureIndex = min(100, PM_Score[max 45] + Vul_Score[max 35] + Traffic_Score[max 15] + Dust_Score[max 15])
                </div>
                <p className="text-slate-400">
                  Completely transparent, explainable, and deterministic. No black-box statistical hallucinations or arbitrary scores.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase text-cyan-400">
                  Deploying with AWS CLI & SAM
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Clone repository and install dependencies: <code className="text-cyan-300">npm install</code></li>
                  <li>Build serverless deployment package: <code className="text-cyan-300">sam build</code></li>
                  <li>Deploy to AWS Asia Pacific (Mumbai) region:
                    <div className="p-2 bg-black/60 rounded my-1 text-slate-200">
                      sam deploy --guided --region ap-south-1 --stack-name grap-shield-prod
                    </div>
                  </li>
                  <li>Run development server locally: <code className="text-cyan-300">npm run dev</code></li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
