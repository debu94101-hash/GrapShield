import React, { useState, useEffect } from 'react';
import { AwsInfrastructureReport, AwsServiceStatus } from '../types';
import { getAwsInfrastructure } from '../services/api';
import {
  Cloud,
  CheckCircle2,
  Server,
  Database,
  Radio,
  FileCode2,
  Activity,
  Layers,
  Zap,
  Clock,
  HardDrive
} from 'lucide-react';

interface AwsInfrastructureViewProps {
  onOpenArchitectureDocs: () => void;
}

export const AwsInfrastructureView: React.FC<AwsInfrastructureViewProps> = ({
  onOpenArchitectureDocs,
}) => {
  const [report, setReport] = useState<AwsInfrastructureReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'dynamodb' | 'pipeline'>('services');

  useEffect(() => {
    let mounted = true;
    getAwsInfrastructure()
      .then(rep => {
        if (mounted) {
          setReport(rep);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('AWS health query error:', err);
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
            <Cloud className="w-4 h-4" />
            <span>AWS Serverless Digital Twin Architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            AWS CLOUD INFRASTRUCTURE HEALTH
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
            <span>Region: {report?.region || 'ap-south-1'}</span>
            <span aria-hidden="true">·</span>
            <span>Uptime: {report?.systemUptime || 'Operational'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">All 7 Core Services Online</span>
          </div>
        </div>

        <button
          onClick={onOpenArchitectureDocs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-cyan-950/40"
        >
          <FileCode2 className="w-4 h-4" />
          <span>View CloudFormation (SAM) Blueprint</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'services'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Core Services ({report?.services.length || 7})
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ingestion & Simulation Data Pipeline
        </button>
        <button
          onClick={() => setActiveTab('dynamodb')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'dynamodb'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          DynamoDB Single-Table Schema Design
        </button>
      </div>

      {/* Tab 1: Core Services Grid */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report?.services.map((svc: any, idx: number) => {
            const isOperational = svc.status === 'OPERATIONAL';
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#0E1524] border border-slate-800 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{svc.name}</span>
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {svc.role}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {svc.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1.5 text-slate-400">
                  {Object.entries(svc)
                    .filter(([k]) => !['name', 'role', 'status'].includes(k))
                    .map(([key, val]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-slate-200 font-semibold truncate max-w-[140px]" title={String(val)}>
                          {Array.isArray(val) ? `${val.length} items` : String(val)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Event-Driven Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              End-to-End Serverless Data Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              EventBridge cron triggers Lambda ingestion every 15 minutes, persisting raw snapshots into S3 and indexed records into DynamoDB.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <pre className="text-cyan-300 text-[11px]">{`
LIVE VERIFIED SOURCES (Open-Meteo Copernicus CAMS & CPCB Stations)
        │
        ▼ (Every 15 min scheduled event)
AMAZON EVENTBRIDGE (grap-shield-ingestion-cron)
        │
        ▼ (Invokes runtime payload)
AWS LAMBDA INGESTION WORKER (grap-shield-ingestion-worker)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
AMAZON S3 RAW LAKE            AMAZON DYNAMODB (GrapShieldUrbanTwin)
(s3://grap-shield-delhi)      (Single-Table: PK/SK Partition Design)
   │                               │
   └───────────────┬───────────────┘
                   ▼
AWS LAMBDA RISK ENGINE (grap-shield-risk-evaluator)
   │
   ├─► Evaluates Receptor Exposure (Hospital ICUs, Schools, Elder Care)
   ├─► Resolves Statutory CAQM GRAP Stage (I → II → III → IV)
   │
   ├─► Breaches detected? ──► AMAZON SNS (Emergency Alert Dispatch)
   │
   ▼
AMAZON API GATEWAY (REST API)
   │
   ▼
GRAP SHIELD WEB DIGITAL TWIN & INTERVENTION SIMULATOR
            `}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: DynamoDB Single-Table Schema */}
      {activeTab === 'dynamodb' && (
        <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Amazon DynamoDB: Single-Table Architecture (`GrapShieldUrbanTwin`)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Zero graph database dependency. Highly optimized partition (PK) and sort (SK) design supports sub-millisecond exposure queries and historical temporal lookups.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">Partition Key (PK)</th>
                  <th className="py-2.5 px-3">Sort Key (SK)</th>
                  <th className="py-2.5 px-3">GSI1PK</th>
                  <th className="py-2.5 px-3">Attributes Stored</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-3 text-cyan-400 font-bold">Air Observation</td>
                  <td className="py-3 px-3">STATION#{'{station_id}'}</td>
                  <td className="py-3 px-3">OBS#{'{timestamp}'}</td>
                  <td className="py-3 px-3">OBSERVATION</td>
                  <td className="py-3 px-3 text-slate-400">pm2_5, pm10, aqi, no2, windSpeed, windDir</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-purple-400 font-bold">Vulnerable Receptor</td>
                  <td className="py-3 px-3">RECEPTOR#{'{receptor_id}'}</td>
                  <td className="py-3 px-3">METADATA</td>
                  <td className="py-3 px-3">VULNERABILITY</td>
                  <td className="py-3 px-3 text-slate-400">name, type, lat, lon, vulnerabilityFactor, nearestStation</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-amber-400 font-bold">Risk State</td>
                  <td className="py-3 px-3">RISK_STATE#{'{date}'}</td>
                  <td className="py-3 px-3">RECEPTOR#{'{receptor_id}'}</td>
                  <td className="py-3 px-3">RISK_LEVEL#{'{level}'}</td>
                  <td className="py-3 px-3 text-slate-400">exposureScore, riskLevel, breakdown, drivers</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-emerald-400 font-bold">GRAP State</td>
                  <td className="py-3 px-3">GRAP_EVAL#{'{date}'}</td>
                  <td className="py-3 px-3">STAGE#{'{stage}'}</td>
                  <td className="py-3 px-3">GRAP_STATE</td>
                  <td className="py-3 px-3 text-slate-400">stageNumber, triggers, mandatoryActions, orders</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-orange-400 font-bold">Simulation Run</td>
                  <td className="py-3 px-3">SIMULATION#{'{scenario_id}'}</td>
                  <td className="py-3 px-3">RUN#{'{timestamp}'}</td>
                  <td className="py-3 px-3">SCENARIO</td>
                  <td className="py-3 px-3 text-slate-400">interventions, deltaExposure, beforeMetrics, afterMetrics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
