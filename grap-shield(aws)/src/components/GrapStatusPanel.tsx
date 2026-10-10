import React, { useState } from 'react';
import { GrapStatus, VerifiedAirData } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';

interface GrapStatusPanelProps {
  airData: VerifiedAirData | null;
  onOpenSimulator: () => void;
}

interface StageDetail {
  stage: number;
  roman: string;
  name: string;
  aqiRange: string;
  pm25Threshold: string;
  description: string;
  triggers: string[];
  mandatoryActions: string[];
}

const ALL_STAGES: StageDetail[] = [
  {
    stage: 1,
    roman: 'I',
    name: 'Stage I (Poor)',
    aqiRange: 'AQI 201 – 300',
    pm25Threshold: 'PM2.5: 61 – 120 μg/m³',
    description: 'Activated when air quality deteriorates into the Poor category. Focuses on dust suppression, ban on open waste burning, and strict enforcement of vehicular emission norms.',
    triggers: [
      'Delhi Urban NAQI consistently falls in the 201 - 300 band',
      'Seasonal crop residue burning or dust storms elevated background PM10'
    ],
    mandatoryActions: [
      'Ensure strict mechanised road sweeping and water sprinkling along arterial roads',
      'Enforce anti-smog guns and dust screens on all construction plots > 5,000 sqm',
      'Zero tolerance for open municipal solid waste and agricultural biomass burning',
      'Strict vigilance on visibly polluting vehicles and overloaded heavy commercial vehicles',
      'Synchronize traffic lights at major intersections to prevent idling hotspots'
    ]
  },
  {
    stage: 2,
    roman: 'II',
    name: 'Stage II (Very Poor)',
    aqiRange: 'AQI 301 – 400',
    pm25Threshold: 'PM2.5: 121 – 250 μg/m³',
    description: 'Triggered when air quality drops into Very Poor. Focuses on diesel generator restrictions, public transit expansion, and discouraging private vehicular trips.',
    triggers: [
      'Delhi Urban NAQI enters the 301 - 400 band',
      'Atmospheric ventilation index falls below 6,000 m²/s with low surface wind speeds'
    ],
    mandatoryActions: [
      'Enhance municipal parking fees to discourage personal vehicle usage',
      'Augment CNG and electric bus fleets and increase Delhi Metro operational frequencies',
      'Strict ban on diesel generator sets (except critical healthcare, defense, and railways)',
      'DISCOMs must ensure 100% uninterrupted electricity supply to avoid generator switch-over',
      'Hotel and restaurant eateries prohibited from using coal or firewood in tandoors'
    ]
  },
  {
    stage: 3,
    roman: 'III',
    name: 'Stage III (Severe)',
    aqiRange: 'AQI 401 – 450',
    pm25Threshold: 'PM2.5: 251 – 300 μg/m³',
    description: 'Emergency tier activated when air quality enters the Severe bracket. Enforces bans on older non-compliant private vehicles and non-essential construction work.',
    triggers: [
      'Delhi Urban NAQI enters the 401 - 450 severe category',
      'Meteorological forecasts predict unfavourable dispersion conditions over subsequent 48 hours'
    ],
    mandatoryActions: [
      'Strict ban on plying of BS-III Petrol and BS-IV Diesel 4-wheeler LMVs in Delhi-NCR',
      'Complete cessation of all non-essential construction and demolition activities across NCR',
      'Stone crushers and brick kilns operating on non-clean fuels immediately shut down',
      'Discontinue physical classes for primary school children (up to Class V) and transition online',
      'Intensify mechanised sweeping and heavy water sprinkling with approved dust suppressants'
    ]
  },
  {
    stage: 4,
    roman: 'IV',
    name: 'Stage IV (Severe+)',
    aqiRange: 'AQI > 450',
    pm25Threshold: 'PM2.5 > 300 μg/m³',
    description: 'Catastrophic emergency level. Imposes severe border controls on heavy diesel freight vehicles, public sector work-from-home quotas, and school closures.',
    triggers: [
      'Delhi Urban NAQI exceeds 450 with peak station PM2.5 above 300 μg/m³',
      'Critical ground-level smog entrapment with near-zero planetary boundary layer height'
    ],
    mandatoryActions: [
      'Stop entry of non-electric, non-CNG, and non-BS-VI trucks into Delhi (except essential commodities)',
      'Ban plying of Delhi-registered diesel medium and heavy goods vehicles (MGVs & HGVs)',
      'Discontinue physical classes for school students up to Classes IX and XI',
      'Mandate 50% Work-From-Home for government and municipal corporations in Delhi-NCR',
      'State governments empowered to consider emergency staggered Odd-Even vehicle rationing'
    ]
  }
];

export const GrapStatusPanel: React.FC<GrapStatusPanelProps> = ({
  airData,
  onOpenSimulator,
}) => {
  const currentStageNum = airData?.grap?.stage ?? 2;
  const [inspectedStageNum, setInspectedStageNum] = useState<number>(currentStageNum);

  const inspectedStage = ALL_STAGES.find(s => s.stage === inspectedStageNum) || ALL_STAGES[0];
  const activeCurrentStage = ALL_STAGES.find(s => s.stage === currentStageNum) || ALL_STAGES[0];

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Statutory Air Quality Governance Engine (CAQM Act, 2021)</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              CURRENT GRAP STATUS: {activeCurrentStage.name.toUpperCase()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              Urban NAQI: {airData?.urbanAqi ?? '---'} · Verified
            </div>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Simulate GRAP Impact
            </button>
          </div>
        </div>

        {/* Visual Progression Bar: I → II → III → IV */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs font-mono uppercase text-slate-400 mb-3">
            CAQM Graded Response Escalation Hierarchy:
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ALL_STAGES.map((stage) => {
              const isCurrent = stage.stage === currentStageNum;
              const isInspected = stage.stage === inspectedStageNum;

              let stageColor = 'border-slate-800 text-slate-400 bg-slate-900/40';
              if (isCurrent) {
                stageColor = 'border-amber-500/60 bg-amber-500/10 text-amber-300 ring-2 ring-amber-500/20';
              } else if (isInspected) {
                stageColor = 'border-cyan-500/50 bg-cyan-950/20 text-cyan-200';
              }

              return (
                <div
                  key={stage.stage}
                  onClick={() => setInspectedStageNum(stage.stage)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${stageColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono tracking-tight">
                      Stage {stage.roman}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-semibold text-white">
                      {stage.name.split('(')[1]?.replace(')', '')}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {stage.aqiRange}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono flex items-center justify-between text-slate-400">
                    <span>{stage.pm25Threshold}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Inspection for Selected Stage */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">
              Stage Guidelines & Gazette Enforcement Mandates
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {inspectedStage.name} Details
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-400">
            {inspectedStage.stage === currentStageNum ? (
              <span className="text-amber-400 font-semibold">Active in Delhi-NCR Jurisdiction</span>
            ) : (
              <span>Inspection View Only</span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {inspectedStage.description}
        </p>

        {/* Triggers and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Triggering Conditions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>Statutory Triggering Conditions</span>
            </div>
            <div className="space-y-2">
              {inspectedStage.triggers.map((trig, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{trig}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mandatory Government Interventions</span>
            </div>
            <div className="space-y-2">
              {inspectedStage.mandatoryActions.map((act, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
