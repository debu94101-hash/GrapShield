import React from 'react';
import { ReceptorExposure } from '../types';
import {
  X,
  ShieldAlert,
  Wind,
  Truck,
  HardHat,
  Sparkles,
  GitBranch,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface LocationIntelligenceModalProps {
  receptor: ReceptorExposure | null;
  onClose: () => void;
  onViewExposureNetwork: (receptor: ReceptorExposure) => void;
  onSimulateIntervention: (receptor: ReceptorExposure) => void;
}

export const LocationIntelligenceModal: React.FC<LocationIntelligenceModalProps> = ({
  receptor,
  onClose,
  onViewExposureNetwork,
  onSimulateIntervention,
}) => {
  if (!receptor) return null;

  const riskBadgeColor =
    receptor.riskLevel === 'CRITICAL' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
    receptor.riskLevel === 'HIGH' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
    receptor.riskLevel === 'MODERATE' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0E1524] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Building2 className="w-4 h-4" />
              <span>URBAN DIGITAL TWIN · LOCATION INTELLIGENCE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {receptor.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{receptor.type}</span>
              <span aria-hidden="true">·</span>
              <span>{receptor.occupancyDescription}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Risk Severity</div>
              <div className={`mt-1 inline-flex px-2 py-0.5 rounded text-xs font-bold font-mono border ${riskBadgeColor}`}>
                {receptor.riskLevel}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Exposure Score</div>
              <div className="mt-1 text-2xl font-bold text-cyan-400 font-mono tabular-nums">
                {receptor.exposureScore}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Est. Local PM2.5</div>
              <div className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
                {receptor.localEstimatedPm25}
                <span className="text-xs text-slate-400 font-normal"> μg/m³</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Nearest Station</div>
              <div className="mt-1 text-sm font-semibold text-slate-200 truncate">
                {receptor.nearestStation.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {receptor.nearestStation.distanceKm} km away
              </div>
            </div>
          </div>

          {/* WHY IS THIS LOCATION AT RISK? */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>WHY IS THIS LOCATION AT RISK? (Transparent Deterministic Drivers)</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {receptor.whyAtRisk.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-mono">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exposure Component Breakdown Bar Charts */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold uppercase text-slate-400">
              Mathematical Exposure Breakdown (0 - 100 Max Model)
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Particulate Severity Load (max 45):</span>
                  <span className="font-bold text-cyan-400">{receptor.breakdown.particulateSeverity} pts</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${(receptor.breakdown.particulateSeverity / 45) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Receptor Vulnerability Weight (max 35):</span>
                  <span className="font-bold text-purple-400">{receptor.breakdown.vulnerabilityWeight} pts</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(receptor.breakdown.vulnerabilityWeight / 35) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Traffic Corridor Proximity (max 15):</span>
                  <span className="font-bold text-amber-400">{receptor.breakdown.trafficCorridorLoad} pts</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${(receptor.breakdown.trafficCorridorLoad / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Fugitive Construction Dust (max 15):</span>
                  <span className="font-bold text-orange-400">{receptor.breakdown.constructionDustLoad} pts</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(receptor.breakdown.constructionDustLoad / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Intervention Highlight */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-cyan-400">Targeted GRAP / Spatial Action</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {receptor.recommendedIntervention}
              </div>
            </div>
            <div className="text-xs font-mono text-cyan-300">
              Evaluated for this receptor
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            onClick={() => onViewExposureNetwork(receptor)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
          >
            <GitBranch className="w-4 h-4 text-purple-400" />
            View in Exposure Network
          </button>

          <button
            onClick={() => onSimulateIntervention(receptor)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-cyan-950/40"
          >
            <Sparkles className="w-4 h-4" />
            Simulate Intervention Impact
          </button>
        </div>
      </div>
    </div>
  );
};
