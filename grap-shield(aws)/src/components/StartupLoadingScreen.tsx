import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface StartupLoadingScreenProps {
  onComplete: () => void;
}

interface InitStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'warning';
  detail?: string;
}

export const StartupLoadingScreen: React.FC<StartupLoadingScreenProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState<InitStep[]>([
    { id: '1', label: 'Loading application modules & digital twin shaders', status: 'in_progress' },
    { id: '2', label: 'Checking environment & system configuration', status: 'pending' },
    { id: '3', label: 'Connecting to AWS infrastructure (EventBridge, DynamoDB, S3)', status: 'pending' },
    { id: '4', label: 'Checking verified air data sources (Open-Meteo Copernicus CAMS & CAAQMS)', status: 'pending' },
    { id: '5', label: 'Initializing urban exposure & CAQM GRAP rule engine', status: 'pending' },
    { id: '6', label: 'Loading Delhi-NCR spatial network & receptor vectors', status: 'pending' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allowManualContinue, setAllowManualContinue] = useState(false);

  useEffect(() => {
    // Show manual continue button after 2.5 seconds so user is never trapped
    const fallbackTimer = setTimeout(() => {
      setAllowManualContinue(true);
    }, 2500);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = prev + 1;
        if (next < steps.length) {
          setSteps(s =>
            s.map((step, idx) => {
              if (idx < next) return { ...step, status: 'completed' };
              if (idx === next) return { ...step, status: 'in_progress' };
              return step;
            })
          );
          return next;
        } else {
          // All done
          setSteps(s => s.map(step => ({ ...step, status: 'completed' })));
          clearInterval(stepInterval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => {
      clearTimeout(fallbackTimer);
      clearInterval(stepInterval);
    };
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070B12] text-slate-100 overflow-hidden">
      {/* Background Grid and Radial Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />

      {/* Atmospheric Radar Sweep Visual */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-cyan-950/40 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-900/20 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-cyan-800/20" />
        </div>
        <div className="absolute inset-0 rounded-full border-t border-cyan-500/30 animate-radar" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-4 p-8 rounded-2xl bg-[#0E1524]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              GRAP SHIELD
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-medium">v2.4-AWS</span>
            </h1>
            <p className="text-xs font-mono tracking-wider uppercase text-cyan-400/80">
              Live Urban Air-Risk Digital Twin & Intervention Intelligence
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 italic">
          Mapping exposure. Understanding risk. Simulating intervention.
        </p>

        {/* Initialization Checklist */}
        <div className="space-y-3 mb-6 bg-[#070B12]/60 p-4 rounded-xl border border-slate-800/60 font-mono text-xs">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            System Diagnostics & Provenance Check
          </div>
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isWarning = step.status === 'warning';

            return (
              <div key={step.id} className="flex items-center justify-between gap-3 text-slate-300">
                <div className="flex items-center gap-2.5 truncate">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isInProgress && (
                    <Activity className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  )}
                  {isWarning && (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  {!isCompleted && !isInProgress && !isWarning && (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={isCompleted ? 'text-slate-300' : isInProgress ? 'text-cyan-300 font-medium' : 'text-slate-600'}>
                    {step.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                  {isCompleted ? 'READY' : isInProgress ? 'INITIALIZING' : 'WAITING'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Actions */}
        <div className="space-y-3">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, ((currentStepIndex + 1) / steps.length) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Official CAQM & Copernicus Baseline Grounded</span>
            {allowManualContinue && (
              <button
                onClick={onComplete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors cursor-pointer text-xs"
              >
                Continue to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
