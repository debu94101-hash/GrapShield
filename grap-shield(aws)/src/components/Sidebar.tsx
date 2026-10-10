import React from 'react';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  MapPin,
  GitBranch,
  ShieldAlert,
  SlidersHorizontal,
  Bell,
  Database,
  Cloud,
  FileCode2,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  grapStage: number;
  alertCount: number;
  onOpenArchitectureDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  grapStage,
  alertCount,
  onOpenArchitectureDocs,
}) => {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-[#0A0F1D]/80 flex flex-col justify-between p-4 hidden lg:flex select-none">
      <div className="space-y-6">
        {/* COMMAND Group */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Command
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Urban Command Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'map'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Live Digital Twin Map</span>
            </button>
          </div>
        </div>

        {/* INTELLIGENCE Group */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Intelligence
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('exposure-network')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'exposure-network'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <GitBranch className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Exposure Network</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300">DAG</span>
            </button>
          </div>
        </div>

        {/* RESPONSE Group */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Response
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('grap')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'grap'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                <span>GRAP Decision Engine</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                ST {grapStage}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('simulator')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'simulator'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Intervention Simulator</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">BEFORE/AFTER</span>
            </button>

            <button
              onClick={() => onSelectTab('alerts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'alerts'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 shrink-0 text-red-400" />
                <span>Alert Center (SNS)</span>
              </div>
              {alertCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                  {alertCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SYSTEM Group */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            System & Cloud
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('provenance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'provenance'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Database className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Data Provenance</span>
            </button>

            <button
              onClick={() => onSelectTab('aws')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'aws'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Cloud className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>AWS Infrastructure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info Box & SAM Template Docs link */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <button
          onClick={onOpenArchitectureDocs}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px]">
              <div className="text-slate-200 font-medium">System Architecture</div>
              <div className="text-slate-400 font-mono text-[10px]">SAM & DynamoDB Specs</div>
            </div>
          </div>
          <Activity className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="px-1 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>AWS Region</span>
          <span className="text-slate-300">ap-south-1</span>
        </div>
      </div>
    </aside>
  );
};
