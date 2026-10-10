import React from 'react';
import { NavigationTab } from '../types';
import { RefreshCw, Bell, Shield, FlaskConical, Radio, MapPin, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  selectedCity: string;
  onSelectCity: (cityId: string) => void;
  citiesList: { id: string; name: string; state: string; zone: string }[];
  isSimulationMode: boolean;
  onToggleSimulationMode: (enabled: boolean) => void;
  lastUpdated?: string;
  isStale?: boolean;
  alertCount: number;
  onOpenAlerts: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  cityName?: string;
  stateName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  selectedCity,
  onSelectCity,
  citiesList,
  isSimulationMode,
  onToggleSimulationMode,
  lastUpdated,
  alertCount,
  onOpenAlerts,
  onRefresh,
  isRefreshing,
  cityName,
  stateName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070B12]/95 backdrop-blur-md px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
      {/* Zone 1: Brand title wordmark and State/City Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2 text-left text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <span>GRAP SHIELD</span>
        </button>

        {/* State & City Selector Dropdown */}
        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="pl-7 pr-8 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-white font-mono font-medium focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
              title="Select State & City Urban Twin"
            >
              {citiesList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          <div className="hidden 2xl:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>LIVE ONLY</span>
            <span aria-hidden="true">·</span>
            <span>Open-Meteo & CAAQMS Verified</span>
            {lastUpdated && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{lastUpdated}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Text with active underlines / clean highlights) */}
      <nav className="hidden lg:flex items-center gap-1">
        <button
          onClick={() => onSelectTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'overview'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'map'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Digital Twin Map
        </button>
        <button
          onClick={() => onSelectTab('exposure-network')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'exposure-network'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Exposure Network
        </button>
        <button
          onClick={() => onSelectTab('grap')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'grap'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          GRAP Status
        </button>
        <button
          onClick={() => onSelectTab('simulator')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'simulator'
              ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Intervention Simulator
        </button>
        <button
          onClick={() => onSelectTab('aws')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            currentTab === 'aws'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          AWS Infrastructure
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Live/Simulation Switcher, Notifications, Refresh) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mode Toggle Control */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => onToggleSimulationMode(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              !isSimulationMode
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">LIVE</span> VERIFIED
          </button>
          <button
            onClick={() => onToggleSimulationMode(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              isSimulationMode
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FlaskConical className="w-3 h-3 text-amber-400" />
            SIMULATION
          </button>
        </div>

        {/* Alerts Center Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Open Alert Center"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* Live Refresh Trigger */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Live Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    </header>
  );
};
