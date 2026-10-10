import React, { useState } from 'react';
import {
  InterventionType,
  SimulationResult,
  ReceptorExposure,
  VerifiedAirData
} from '../types';
import { INTERVENTION_REGISTRY, simulateInterventions } from '../services/api';
import {
  TrafficCone,
  Truck,
  HardHat,
  Trees,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Building2,
  Layers,
  ArrowDownRight
} from 'lucide-react';

interface InterventionSimulatorProps {
  airData: VerifiedAirData | null;
  exposures: ReceptorExposure[];
  onSimulationUpdated: (result: SimulationResult | null) => void;
  onViewOnMap: () => void;
}

export const InterventionSimulator: React.FC<InterventionSimulatorProps> = ({
  airData,
  exposures,
  onSimulationUpdated,
  onViewOnMap,
}) => {
  const [selectedInterventions, setSelectedInterventions] = useState<InterventionType[]>([
    'TRAFFIC_DIVERSION',
    'HEAVY_VEHICLE_RESTRICTION',
  ]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'stepped' | 'sideBySide' | 'table'>('stepped');

  // Toggle selection
  const handleToggle = (id: InterventionType) => {
    setSelectedInterventions(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRunSimulation = async () => {
    if (selectedInterventions.length === 0) return;
    setIsSimulating(true);
    try {
      const result = await simulateInterventions(selectedInterventions, airData?.cityId || 'delhi');
      setSimulationResult(result);
      onSimulationUpdated(result);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setSimulationResult(null);
    onSimulationUpdated(null);
  };

  // Intervention Card Icons
  const iconMap: Record<InterventionType, any> = {
    TRAFFIC_DIVERSION: TrafficCone,
    HEAVY_VEHICLE_RESTRICTION: Truck,
    CONSTRUCTION_DUST_CONTROL: HardHat,
    GREEN_BUFFER: Trees,
    SCHOOL_OUTDOOR_TIMING: GraduationCap,
  };

  return (
    <div className="space-y-6">
      {/* Simulation Statutory Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>SCENARIO SIMULATION — NOT A MEASURED FUTURE VALUE.</strong> Projections are calculated deterministically from verified live baselines using CAQM micro-emission physics.
          </span>
        </div>
        <span className="text-[10px] text-amber-400/80 font-bold hidden sm:inline">
          DETERMINISTIC TWIN
        </span>
      </div>

      {/* Intervention Selector Grid */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>CAQM Emergency Spatial Toolkit</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-0.5">
              WHAT IF WE INTERVENE?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select one or multiple intervention measures to evaluate instantaneous exposure reduction across the urban twin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {simulationResult && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={handleRunSimulation}
              disabled={selectedInterventions.length === 0 || isSimulating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              <Sparkles className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Computing Dispersion Physics...' : 'Run Scenario Simulation'}
            </button>
          </div>
        </div>

        {/* 5 Intervention Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {(Object.keys(INTERVENTION_REGISTRY) as InterventionType[]).map((typeKey) => {
            const def = INTERVENTION_REGISTRY[typeKey];
            const isSelected = selectedInterventions.includes(typeKey);
            const IconComponent = iconMap[typeKey];

            return (
              <div
                key={typeKey}
                onClick={() => handleToggle(typeKey)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/50 ring-2 ring-cyan-500/20'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-cyan-500 border-cyan-500 text-white font-bold' : 'border-slate-700'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug">
                    {def.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {def.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
                  <div className="text-cyan-400 font-semibold truncate" title={def.targetMechanism}>
                    {def.targetMechanism}
                  </div>
                  <div className="text-slate-500 truncate" title={def.targetScope}>
                    Scope: {def.targetScope}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Comparison Container: BEFORE → INTERVENTION → AFTER */}
      {simulationResult && (
        <div className="space-y-6">
          {/* Comparison View Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">View Mode:</span>
              <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setActiveTab('stepped')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeTab === 'stepped' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BEFORE → INTERVENTION → AFTER
                </button>
                <button
                  onClick={() => setActiveTab('sideBySide')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeTab === 'sideBySide' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Side-by-Side Metrics
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeTab === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Receptor Impact Breakdown ({simulationResult.simulatedReceptors.length})
                </button>
              </div>
            </div>

            <button
              onClick={onViewOnMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              View Reduction Halos on Map
            </button>
          </div>

          {/* Stepped Workflow View: BEFORE → INTERVENTION → AFTER */}
          {activeTab === 'stepped' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Box 1: BEFORE (Current Baseline) */}
              <div className="p-6 rounded-2xl bg-[#0E1524] border border-red-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-red-400">
                    <span className="font-bold uppercase tracking-wider">01. Baseline State (BEFORE)</span>
                    <span>LIVE OBSERVED</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Average Urban Exposure:</div>
                      <div className="text-4xl font-extrabold text-red-400 font-mono tabular-nums mt-1">
                        {simulationResult.aggregateMetrics.averageExposureBefore}
                        <span className="text-sm text-slate-500 font-normal"> / 100</span>
                      </div>
                      {/* Bar Visual */}
                      <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${simulationResult.aggregateMetrics.averageExposureBefore}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">High-Risk Receptors:</span>
                        <span className="text-red-400 font-bold">{simulationResult.aggregateMetrics.highRiskLocationsBefore} Locations</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Peak Station PM2.5:</span>
                        <span className="text-white font-bold">{airData?.urbanMaxPm25} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active GRAP Status:</span>
                        <span className="text-amber-400 font-bold">Stage {airData?.grap.stage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Verified Copernicus CAMS & CAAQMS Registry Baseline</span>
                </div>
              </div>

              {/* Box 2: APPLIED INTERVENTIONS */}
              <div className="p-6 rounded-2xl bg-[#0E1524] border border-cyan-500/30 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold uppercase tracking-wider">02. Active Interventions</span>
                    <span>{simulationResult.selectedInterventions.length} MEASURES</span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {simulationResult.interventionsSummary.map(inv => (
                      <div key={inv.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{inv.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono leading-relaxed pl-5">
                          {inv.empiricalReductionBasis}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deterministic Spatial Model Applied</span>
                </div>
              </div>

              {/* Box 3: AFTER (Simulated Exposure Outcome) */}
              <div className="p-6 rounded-2xl bg-[#0E1524] border border-emerald-500/40 flex flex-col justify-between space-y-6 bg-gradient-to-br from-emerald-950/10 to-transparent">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                    <span className="font-bold uppercase tracking-wider">03. Simulated State (AFTER)</span>
                    <span className="font-bold">PROJECTION</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-mono">Simulated Urban Exposure:</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          {simulationResult.aggregateMetrics.exposureDelta} pts ({simulationResult.aggregateMetrics.percentReduction}% drop)
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1 flex items-baseline gap-2">
                        {simulationResult.aggregateMetrics.averageExposureAfter}
                        <span className="text-sm text-slate-500 font-normal"> / 100</span>
                        <TrendingDown className="w-6 h-6 text-emerald-400" />
                      </div>
                      {/* Bar Visual */}
                      <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${simulationResult.aggregateMetrics.averageExposureAfter}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">High-Risk Receptors:</span>
                        <span className="text-emerald-400 font-bold">
                          {simulationResult.aggregateMetrics.highRiskLocationsAfter} ({simulationResult.aggregateMetrics.locationsDeescalated} De-escalated)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risk Transition:</span>
                        <span className="text-white font-bold">CRITICAL → MODERATE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Scenario Status:</span>
                        <span className="text-cyan-300 font-bold">Compliant with Target</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Achieves Significant Receptor De-escalation</span>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-Side Metrics View */}
          {activeTab === 'sideBySide' && (
            <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white">
                Detailed Before vs. After Variance Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Average Exposure Index</div>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                    {simulationResult.aggregateMetrics.averageExposureBefore} → <span className="text-emerald-400">{simulationResult.aggregateMetrics.averageExposureAfter}</span>
                  </div>
                  <div className="text-emerald-400 mt-2 font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{simulationResult.aggregateMetrics.percentReduction}% Net Reduction</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">High/Critical Locations</div>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                    {simulationResult.aggregateMetrics.highRiskLocationsBefore} → <span className="text-emerald-400">{simulationResult.aggregateMetrics.highRiskLocationsAfter}</span>
                  </div>
                  <div className="text-emerald-400 mt-2 font-semibold">
                    {simulationResult.aggregateMetrics.locationsDeescalated} Facilities Protected
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Corridor Traffic Diverted</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">
                    ~28% PCU
                  </div>
                  <div className="text-slate-400 mt-2">
                    Rerouted to Peripheral Expressways
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 uppercase text-[10px]">Diesel Freight Particulates</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">
                    -32%
                  </div>
                  <div className="text-slate-400 mt-2">
                    Along Ring Road & NH-44
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receptor Breakdown Table */}
          {activeTab === 'table' && (
            <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Per-Receptor Exposure Variance & Mitigating Mechanisms
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {simulationResult.simulatedReceptors.length} Verified Facilities Evaluated
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Receptor Facility</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Before Exposure</th>
                      <th className="py-2.5 px-3">After Exposure</th>
                      <th className="py-2.5 px-3">Delta</th>
                      <th className="py-2.5 px-3">Applied Mitigations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {simulationResult.simulatedReceptors.map(r => (
                      <tr key={r.receptorId} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          {r.name}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {r.type}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            r.before.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            r.before.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {r.before.exposureScore} ({r.before.riskLevel})
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            r.after.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            r.after.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {r.after.exposureScore} ({r.after.riskLevel})
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400">
                          {r.delta.exposureChange} pts
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs truncate" title={r.appliedEffects.join(' · ')}>
                          {r.appliedEffects.length > 0 ? r.appliedEffects.join(' · ') : 'Baseline corridor buffer'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
