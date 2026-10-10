import React from 'react';
import { VerifiedAirData, ReceptorExposure } from '../types';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Wind, Eye } from 'lucide-react';

interface HeroRiskCardProps {
  airData: VerifiedAirData | null;
  exposures: ReceptorExposure[];
  onOpenSimulator: () => void;
  onOpenMap: () => void;
}

export const HeroRiskCard: React.FC<HeroRiskCardProps> = ({
  airData,
  exposures,
  onOpenSimulator,
  onOpenMap,
}) => {
  if (!airData || !airData.isAvailable) {
    return (
      <div className="w-full rounded-2xl bg-[#0E1524] border border-slate-800 p-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase text-slate-400">Current Urban Risk</div>
          <div className="text-xl font-bold text-amber-400 mt-1">Source Temporarily Unavailable</div>
          <p className="text-xs text-slate-400 mt-1">
            Live atmospheric data stream from verified registry is loading or temporarily offline.
          </p>
        </div>
      </div>
    );
  }

  // Calculate urban-wide risk score deterministically from exposures
  const highRiskCount = exposures.filter(e => e.riskLevel === 'HIGH' || e.riskLevel === 'CRITICAL').length;
  const criticalCount = exposures.filter(e => e.riskLevel === 'CRITICAL').length;
  
  // Weighted urban risk index (0 - 100)
  const avgExposure = exposures.length > 0
    ? Math.round(exposures.reduce((acc, e) => acc + e.exposureScore, 0) / exposures.length)
    : Math.min(100, Math.round((airData.urbanAvgPm25 / 250) * 100));

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  let badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let gradientBorder = 'from-emerald-500/20 via-slate-800 to-slate-800';

  if (avgExposure >= 75 || airData.grap.stage >= 3 || criticalCount >= 2) {
    riskLevel = 'CRITICAL';
    badgeColor = 'text-red-400 border-red-500/30 bg-red-500/10';
    gradientBorder = 'from-red-500/30 via-slate-800 to-slate-800';
  } else if (avgExposure >= 55 || airData.grap.stage === 2 || highRiskCount >= 3) {
    riskLevel = 'HIGH';
    badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    gradientBorder = 'from-amber-500/30 via-slate-800 to-slate-800';
  } else if (avgExposure >= 35) {
    riskLevel = 'MODERATE';
    badgeColor = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    gradientBorder = 'from-yellow-500/30 via-slate-800 to-slate-800';
  }

  // Determine Primary Driver dynamically
  let primaryDriver = 'Baseline diurnal emissions with standard atmospheric boundary dispersion.';
  if (airData.urbanMaxPm25 > 250) {
    primaryDriver = `Severe particulate accumulation at peak transit nodes (Max PM2.5: ${airData.urbanMaxPm25} μg/m³) compounded by ground-level thermal inversion.`;
  } else if (airData.urbanMaxPm25 > 120) {
    primaryDriver = `High heavy freight diesel corridor exposure combined with low nocturnal surface wind velocity (${airData.weather?.windSpeedKmh} km/h).`;
  } else if (criticalCount > 0) {
    primaryDriver = `Critical vulnerability exposure threshold breached at ${criticalCount} priority hospital/school receptor zones.`;
  }

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-br ${gradientBorder} p-[1px] shadow-2xl`}>
      <div className="w-full rounded-2xl bg-[#0E1524]/95 backdrop-blur-xl p-6 lg:p-8 flex flex-col justify-between gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              <span>{airData.cityName || 'Urban'} · {airData.stateName || 'State'}</span>
              <span aria-hidden="true">·</span>
              <span>Digital Twin Engine</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400">{airData.regulatoryBody || 'Air Quality Authority'} Validated</span>
            </div>
            
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                CURRENT URBAN RISK
              </h2>
              <div className={`px-3 py-1 rounded-lg text-sm font-bold font-mono border ${badgeColor}`}>
                {riskLevel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[11px] font-mono uppercase text-slate-400">Urban Exposure Index</div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
                {avgExposure}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[11px] font-mono uppercase text-slate-400">Active GRAP</div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {airData.grap.stageName.split(' ')[0]} {airData.grap.stageName.split(' ')[1]}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Driver & Context Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="lg:col-span-2 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Primary Urban Air-Risk Driver:</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono">
              {primaryDriver}
            </p>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Receptors Monitored:</span>
              <span className="text-slate-200 font-bold">{exposures.length} Locations</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>High/Critical Receptors:</span>
              <span className="text-red-400 font-bold">{highRiskCount} Locations</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Wind Trajectory:</span>
              <span className="text-cyan-400 font-bold">{airData.weather?.windSpeedKmh} km/h @ {airData.weather?.windDirectionDeg}°</span>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Baseline: Verified Open-Meteo & CAAQMS Registry</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">✓ Real Telemetry</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Inspect Digital Twin
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              What If We Intervene?
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
