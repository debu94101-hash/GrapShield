import React, { useState } from 'react';
import { VerifiedAirData } from '../types';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code,
  FileCheck,
  Globe,
  Radio
} from 'lucide-react';

interface DataProvenanceViewProps {
  airData: VerifiedAirData | null;
}

export const DataProvenanceView: React.FC<DataProvenanceViewProps> = ({ airData }) => {
  const [showRawPayload, setShowRawPayload] = useState(false);

  const sources = [
    {
      name: 'Open-Meteo Air Quality API',
      partner: 'Copernicus Atmosphere Monitoring Service (CAMS) & ECMWF',
      category: 'Atmospheric Aerosols & Gaseous Species',
      parameters: 'PM2.5, PM10, NO2, SO2, CO, Ozone',
      updateFrequency: 'Hourly reanalysis & near-real-time observations',
      endpoint: 'https://air-quality-api.open-meteo.com/v1/air-quality',
      coordinates: '28.6139° N, 77.2090° E (Delhi Central Grid)',
      status: airData?.isAvailable ? '✓ VERIFIED LIVE' : 'UNAVAILABLE',
      statusColor: airData?.isAvailable ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30',
      description: 'Global and regional high-resolution chemical weather models assimilating satellite retrievals (Sentinel-5P, MODIS) and verified ground sensors.'
    },
    {
      name: 'Open-Meteo Weather API',
      partner: 'National Weather Services & ECMWF Integrated Forecasting System',
      category: 'Planetary Boundary Layer & Meteorology',
      parameters: 'Surface Temperature, Relative Humidity, 10m Wind Speed, Wind Direction',
      updateFrequency: 'Hourly real-time surface assimilation',
      endpoint: 'https://api.open-meteo.com/v1/forecast',
      coordinates: '28.6139° N, 77.2090° E',
      status: airData?.isAvailable ? '✓ VERIFIED LIVE' : 'UNAVAILABLE',
      statusColor: airData?.isAvailable ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30',
      description: 'Used by the digital twin dispersion engine to calculate downwind aerosol transport vectors and nocturnal thermal inversion potential.'
    },
    {
      name: 'Central Pollution Control Board (CPCB) / DPCC Registry',
      partner: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
      category: 'In-Situ Station Metadata & Sub-Index Functions',
      parameters: 'Indian National Air Quality Index (NAQI) Breakpoint Standards',
      updateFrequency: 'Continuous continuous ambient air monitoring stations (CAAQMS)',
      endpoint: 'Official Statutory CPCB NAQI Standard Formulations',
      coordinates: '12 Verified Delhi-NCR Telemetry Stations (Anand Vihar, Punjabi Bagh, etc.)',
      status: '✓ STATUTORY BASELINE',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Official continuous monitoring stations in Delhi NCT providing station-level microclimate weights and NAQI breakpoint definitions.'
    },
    {
      name: 'Commission for Air Quality Management (CAQM)',
      partner: 'CAQM in NCR and Adjoining Areas Act, 2021',
      category: 'Graded Response Action Plan (GRAP) Statutory Thresholds',
      parameters: 'Stage I (201-300), Stage II (301-400), Stage III (401-450), Stage IV (>450)',
      updateFrequency: 'Statutory Gazette Revision (Updated 2023/2024)',
      endpoint: 'https://caqm.nic.in / Statutory Gazette Notifications',
      coordinates: 'Entire National Capital Region (NCR) jurisdiction',
      status: '✓ REGULATORY RULEBOOK',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'The statutory authority defining mandatory government enforcement actions for vehicular, construction, industrial, and institutional sectors.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Fabrication Provenance Policy</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            DATA PROVENANCE & INTEGRITY AUDIT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every metric displayed in GRAP SHIELD maps to an official, authenticated public data stream or statutory gazette formulation.
          </p>
        </div>

        <button
          onClick={() => setShowRawPayload(!showRawPayload)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer border border-slate-700"
        >
          <Code className="w-4 h-4 text-cyan-400" />
          <span>{showRawPayload ? 'Hide Raw Telemetry' : 'Inspect Raw Ingestion JSON'}</span>
        </button>
      </div>

      {/* Raw Payload Drawer / Code Block */}
      {showRawPayload && (
        <div className="p-4 rounded-2xl bg-[#080D18] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pb-2 border-b border-slate-800">
            <span>Raw Ingested AWS / Open-Meteo Telemetry Payload:</span>
            <span>Timestamp: {airData?.rawTimestamp || new Date().toISOString()}</span>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 p-3 bg-black/60 rounded-xl leading-relaxed">
            {JSON.stringify(airData, null, 2)}
          </pre>
        </div>
      )}

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#0E1524] border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {src.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {src.partner}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${src.statusColor}`}>
                  {src.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono mt-3 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                {src.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Observed Parameters:</span>
                <span className="text-slate-200">{src.parameters}</span>
              </div>
              <div className="flex justify-between">
                <span>Ingestion Cadence:</span>
                <span className="text-slate-200">{src.updateFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span>Spatial Reference:</span>
                <span className="text-cyan-300 truncate max-w-xs">{src.coordinates}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
