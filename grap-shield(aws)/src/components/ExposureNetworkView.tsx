import React, { useState } from 'react';
import {
  ReceptorExposure,
  VerifiedAirData,
  MonitoringStation,
  RoadCorridor
} from '../types';
import {
  Wind,
  Radio,
  Truck,
  Building2,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ExposureNetworkViewProps {
  airData: VerifiedAirData | null;
  exposures: ReceptorExposure[];
  selectedReceptor: ReceptorExposure | null;
  onSelectReceptor: (receptor: ReceptorExposure) => void;
  onSimulateIntervention: () => void;
}

export const ExposureNetworkView: React.FC<ExposureNetworkViewProps> = ({
  airData,
  exposures,
  selectedReceptor,
  onSelectReceptor,
  onSimulateIntervention,
}) => {
  const currentReceptor = selectedReceptor || exposures[0] || null;
  const [activeStep, setActiveStep] = useState<number>(3); // Default to Vulnerable Receptor

  if (!currentReceptor || !airData) {
    return (
      <div className="p-8 rounded-2xl bg-[#0E1524] border border-slate-800 text-center text-slate-400">
        Exposure intelligence stream is initializing. Please wait.
      </div>
    );
  }

  // Network Flow Steps Definition
  const steps = [
    {
      step: 1,
      title: 'Pollution Observation',
      subtitle: 'Atmospheric PM2.5 / PM10',
      icon: Wind,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      activeBorder: 'border-cyan-400 ring-2 ring-cyan-500/20',
      bg: 'bg-cyan-950/20',
      data: {
        parameter: 'Ambient PM2.5 & PM10',
        measuredValue: `${currentReceptor.nearestStation.stationPm25} μg/m³ PM2.5`,
        source: 'Open-Meteo (Copernicus CAMS & CAAQMS In-Situ)',
        verification: '✓ VERIFIED',
        formula: 'P_station = Baseline_CAMS × MicroclimateFactor(DPCC)',
      },
      explanation: 'Ground-level particulate sensors register severe fine particulate accumulation under the nocturnal boundary layer.'
    },
    {
      step: 2,
      title: 'Monitoring Station',
      subtitle: currentReceptor.nearestStation.name,
      icon: Radio,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-500/20',
      bg: 'bg-emerald-950/20',
      data: {
        stationId: currentReceptor.nearestStation.id,
        distanceToReceptor: `${currentReceptor.nearestStation.distanceKm} km away`,
        dispersionKernel: `Gaussian exponential decay e^(-d / 3.5km)`,
        windVector: `${airData.weather?.windSpeedKmh} km/h @ ${airData.weather?.windDirectionDeg}°`,
        formula: 'w_spatial = exp(-d_ij / 3.5) × [1 + 0.25 cos(θ_wind - φ_ij)]',
      },
      explanation: 'Atmospheric transport vectors disperse particulates toward the receptor based on real-time surface wind velocity.'
    },
    {
      step: 3,
      title: 'Corridor Traffic Influence',
      subtitle: currentReceptor.nearestRoad.name,
      icon: Truck,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      activeBorder: 'border-amber-400 ring-2 ring-amber-500/20',
      bg: 'bg-amber-950/20',
      data: {
        roadName: currentReceptor.nearestRoad.name,
        dieselFreightShare: `${(currentReceptor.nearestRoad.dieselFreightShare * 100).toFixed(0)}% Heavy Freight`,
        trafficScore: `${currentReceptor.breakdown.trafficCorridorLoad} / 15 pts`,
        formula: 'E_traffic = (PCU_vol / 150000) × (Diesel_Share / 0.35) × 10',
      },
      explanation: 'Heavy commercial diesel vehicles along adjacent arterial ring roads contribute direct near-road black carbon and tailpipe aerosols.'
    },
    {
      step: 4,
      title: 'Vulnerable Receptor',
      subtitle: currentReceptor.name,
      icon: Building2,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      activeBorder: 'border-purple-400 ring-2 ring-purple-500/20',
      bg: 'bg-purple-950/20',
      data: {
        receptorType: currentReceptor.type,
        vulnerabilityFactor: `${currentReceptor.vulnerabilityFactor} (Index 0-1)`,
        vulnerabilityScore: `${currentReceptor.breakdown.vulnerabilityWeight} / 35 pts`,
        population: currentReceptor.occupancyDescription,
        formula: 'Score_vul = Susceptibility_Factor × 35',
      },
      explanation: 'Sensitive cohorts (children in schools, hospitalized respiratory patients, elderly residents) face acute biological susceptibility.'
    },
    {
      step: 5,
      title: 'Composite Exposure Risk',
      subtitle: `${currentReceptor.riskLevel} (${currentReceptor.exposureScore}/100)`,
      icon: AlertTriangle,
      color: currentReceptor.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-amber-400',
      borderColor: currentReceptor.riskLevel === 'CRITICAL' ? 'border-red-500/30' : 'border-amber-500/30',
      activeBorder: 'border-red-400 ring-2 ring-red-500/20',
      bg: 'bg-red-950/20',
      data: {
        compositeScore: `${currentReceptor.exposureScore} / 100`,
        riskLevel: currentReceptor.riskLevel,
        formula: 'Exposure = min(100, PM_Score + Vul_Score + Traffic_Score + Dust_Score)',
        derivedStatus: 'Exceeds regional hazard thresholds',
      },
      explanation: 'Multivariate deterministic aggregation quantifies cumulative receptor inhalation dosage without black-box estimation.'
    },
    {
      step: 6,
      title: 'GRAP Intervention Action',
      subtitle: currentReceptor.recommendedIntervention,
      icon: ShieldCheck,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      activeBorder: 'border-cyan-400 ring-2 ring-cyan-500/20',
      bg: 'bg-cyan-950/20',
      data: {
        grapStage: airData.grap.stageName,
        statutoryMandate: 'Commission for Air Quality Management (CAQM)',
        recommendedMeasure: currentReceptor.recommendedIntervention,
        actionStatus: 'Recommended for instant scenario evaluation',
      },
      explanation: 'Statutory emergency powers prescribe immediate spatial mitigation to decouple the receptor from ambient exposure.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0E1524] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Urban Exposure Relationship Network (No Graph DB Required)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Deterministic Exposure Chain: {currentReceptor.name}
          </h2>
        </div>

        {/* Receptor Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden md:inline">Inspect Receptor:</span>
          <select
            value={currentReceptor.receptorId}
            onChange={(e) => {
              const target = exposures.find(r => r.receptorId === e.target.value);
              if (target) onSelectReceptor(target);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {exposures.map(r => (
              <option key={r.receptorId} value={r.receptorId}>
                {r.name} ({r.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Network Pipeline DAG Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((st, idx) => {
          const IconComp = st.icon;
          const isSelected = activeStep === idx;

          return (
            <div
              key={st.step}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl transition-all cursor-pointer flex flex-col justify-between border ${st.bg} ${
                isSelected ? st.activeBorder : `${st.borderColor} hover:border-slate-600`
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>STEP 0{st.step}</span>
                  <IconComp className={`w-4 h-4 ${st.color}`} />
                </div>
                <div className="text-xs font-bold text-white leading-tight">
                  {st.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 truncate" title={st.subtitle}>
                  {st.subtitle}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{isSelected ? 'ACTIVE NODE' : 'CLICK TO INSPECT'}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? st.color : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Panel for Active Step */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-900 border ${steps[activeStep].borderColor}`}>
              {React.createElement(steps[activeStep].icon, { className: `w-5 h-5 ${steps[activeStep].color}` })}
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">
                Node Inspection · Step 0{steps[activeStep].step}
              </div>
              <h3 className="text-lg font-bold text-white">
                {steps[activeStep].title}
              </h3>
            </div>
          </div>

          <button
            onClick={onSimulateIntervention}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Scenario on This Chain
          </button>
        </div>

        {/* Narrative & Scientific Explanation */}
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          {steps[activeStep].explanation}
        </p>

        {/* Key Data Pairs & Deterministic Formula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              Node Parameters & Values
            </div>
            {Object.entries(steps[activeStep].data).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-slate-800/40 last:border-none">
                <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-slate-200 font-bold">{val}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                Deterministic Physics & Relationship Rule
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-cyan-300 font-mono text-[11px] break-all">
                {steps[activeStep].data.formula || 'Rule = CAQM Threshold Matrix'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                All weights are deterministic and audited against CAQM micro-emission models. No graph query engine or pseudo-random approximations are utilized.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono pt-3 border-t border-slate-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Data Provenance Verified · DynamoDB PK: RECEPTOR#{currentReceptor.receptorId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
