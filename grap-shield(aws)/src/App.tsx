import React, { useState, useEffect, useCallback } from 'react';
import {
  VerifiedAirData,
  ReceptorExposure,
  NavigationTab,
  SimulationResult,
  SnsNotification,
  MonitoringStation,
  VulnerableLocation,
  RoadCorridor,
  ConstructionZone,
  CityConfig
} from './types';
import {
  getVerifiedObservations,
  getUrbanExposure,
  getUrbanNetwork,
  getSnsNotifications,
  getSupportedCities
} from './services/api';
import { CITIES_LIST } from './data/cities';
import { StartupLoadingScreen } from './components/StartupLoadingScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroRiskCard } from './components/HeroRiskCard';
import { KpiCards } from './components/KpiCards';
import { UrbanDigitalTwinMap } from './components/UrbanDigitalTwinMap';
import { LocationIntelligenceModal } from './components/LocationIntelligenceModal';
import { ExposureNetworkView } from './components/ExposureNetworkView';
import { GrapStatusPanel } from './components/GrapStatusPanel';
import { InterventionSimulator } from './components/InterventionSimulator';
import { AlertCenter } from './components/AlertCenter';
import { DataProvenanceView } from './components/DataProvenanceView';
import { AwsInfrastructureView } from './components/AwsInfrastructureView';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import {
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  MapPin,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // App initialization state
  const [hasInitialized, setHasInitialized] = useState(false);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');

  // Multi-City / State Selection (Live data only)
  const [selectedCity, setSelectedCity] = useState<string>('delhi');
  const [citiesList, setCitiesList] = useState(CITIES_LIST);

  // Mode: Live Verified vs Simulation Mode
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // Core Data States
  const [airData, setAirData] = useState<VerifiedAirData | null>(null);
  const [exposures, setExposures] = useState<ReceptorExposure[]>([]);
  const [network, setNetwork] = useState<{
    config?: CityConfig;
    stations: MonitoringStation[];
    vulnerableLocations: VulnerableLocation[];
    roads: RoadCorridor[];
    constructionZones: ConstructionZone[];
  }>({
    stations: [],
    vulnerableLocations: [],
    roads: [],
    constructionZones: [],
  });
  const [alerts, setAlerts] = useState<SnsNotification[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // UI state
  const [selectedReceptor, setSelectedReceptor] = useState<ReceptorExposure | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showArchDocs, setShowArchDocs] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch verified live air quality for a chosen city
  const loadData = useCallback(async (cityToLoad?: string) => {
    const cityKey = cityToLoad || selectedCity;
    setIsRefreshing(true);
    setLoadError(null);
    try {
      const [obs, expRes, netRes, alertRes, cities] = await Promise.all([
        getVerifiedObservations(cityKey),
        getUrbanExposure(cityKey).catch(() => ({ baseline: null, exposures: [] })),
        getUrbanNetwork(cityKey).catch(() => ({ config: undefined, stations: [], vulnerableLocations: [], roads: [], constructionZones: [] })),
        getSnsNotifications(cityKey).catch(() => []),
        getSupportedCities().catch(() => CITIES_LIST),
      ]);

      if (cities && cities.length > 0) {
        setCitiesList(cities);
      }

      if (!obs.isAvailable) {
        setLoadError(obs.message || `Verified live source for ${cityKey} is temporarily unavailable`);
      } else {
        setAirData(obs);
      }

      if (expRes && expRes.exposures && expRes.exposures.length > 0) {
        setExposures(expRes.exposures);
      }
      if (netRes) {
        setNetwork(netRes);
      }
      if (alertRes) {
        setAlerts(alertRes);
      }
    } catch (err: any) {
      console.error('Data load exception:', err);
      setLoadError('Source temporarily unavailable. Please retry.');
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedCity]);

  // Initial load
  useEffect(() => {
    loadData(selectedCity);
    const interval = setInterval(() => {
      loadData(selectedCity);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData, selectedCity]);

  // Handle city selection
  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedReceptor(null);
    setSimulationResult(null);
    setIsSimulationMode(false);
    loadData(cityId);
  };

  // Handlers for modal interactions
  const handleOpenExposureNetwork = (receptor: ReceptorExposure) => {
    setSelectedReceptor(receptor);
    setCurrentTab('exposure-network');
  };

  const handleOpenSimulatorForReceptor = (_receptor: ReceptorExposure) => {
    setSelectedReceptor(null);
    setIsSimulationMode(true);
    setCurrentTab('simulator');
  };

  const handleSimulationUpdated = (result: SimulationResult | null) => {
    setSimulationResult(result);
    if (result) {
      setIsSimulationMode(true);
    }
  };

  // When startup loading screen is active
  if (!hasInitialized) {
    return (
      <StartupLoadingScreen
        onComplete={() => setHasInitialized(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col antialiased">
      {/* Top Bar Header with State & City Selector */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        citiesList={citiesList}
        isSimulationMode={isSimulationMode}
        onToggleSimulationMode={(enabled) => {
          setIsSimulationMode(enabled);
          if (enabled && !simulationResult) {
            setCurrentTab('simulator');
          }
        }}
        lastUpdated={airData?.lastUpdated}
        isStale={airData?.isStale}
        alertCount={alerts.length}
        onOpenAlerts={() => setCurrentTab('alerts')}
        onRefresh={() => loadData(selectedCity)}
        isRefreshing={isRefreshing}
        cityName={airData?.cityName}
        stateName={airData?.stateName}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          grapStage={airData?.grap?.stage ?? 2}
          alertCount={alerts.length}
          onOpenArchitectureDocs={() => setShowArchDocs(true)}
        />

        {/* Dynamic Viewport Canvas */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Error Banner if Upstream Data Unavailable */}
          {loadError && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>VERIFIED DATA UNAVAILABLE:</strong> {loadError}
                </span>
              </div>
              <button
                onClick={() => loadData(selectedCity)}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* National Urban Twin Switcher Bar */}
          <div className="p-3 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase">National Urban Twin Network</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                LIVE ONLY
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {citiesList.map(c => {
                const isSelected = c.id === selectedCity;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCity(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-500 ml-1 hidden sm:inline">({c.state.split(' ')[0]})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulation Mode Sticky Warning Ribbon */}
          {isSimulationMode && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs font-mono text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>SCENARIO MODE ACTIVE:</strong> Simulating intervention outcomes for <strong>{airData?.cityName || 'City'}</strong> from verified live baseline.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('simulator')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer font-mono"
                >
                  Configure Interventions
                </button>
                <button
                  onClick={() => setIsSimulationMode(false)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer font-mono"
                >
                  Exit to Live
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Risk Card */}
              <HeroRiskCard
                airData={airData}
                exposures={exposures}
                onOpenSimulator={() => {
                  setIsSimulationMode(true);
                  setCurrentTab('simulator');
                }}
                onOpenMap={() => setCurrentTab('map')}
              />

              {/* 7 KPI Metric Cards */}
              <KpiCards
                airData={airData}
                exposures={exposures}
                alerts={alerts}
                onSelectTab={setCurrentTab}
              />

              {/* Main Visual Center: Urban Digital Twin Map */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {airData?.cityName || 'Urban'} Digital Twin & Exposure Map
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      · {airData?.stateName || 'State'} Spatial Vectors
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentTab('map')}
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Map View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <UrbanDigitalTwinMap
                  airData={airData}
                  exposures={exposures}
                  network={network}
                  simulationResult={simulationResult}
                  isSimulationMode={isSimulationMode}
                  onSelectReceptor={(r) => setSelectedReceptor(r)}
                  onSelectStation={() => {}}
                />
              </div>

              {/* Quick Intelligence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* High Exposure Facilities List */}
                <div className="p-5 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200 uppercase">
                      Priority Monitored Facilities ({airData?.cityName})
                    </span>
                    <button
                      onClick={() => setCurrentTab('exposure-network')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      View Network DAG →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {exposures.slice(0, 4).map(rec => (
                      <div
                        key={rec.receptorId}
                        onClick={() => setSelectedReceptor(rec)}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-200 truncate">
                            {rec.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {rec.type} · Near {rec.nearestRoad.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rec.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            rec.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {rec.exposureScore}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GRAP / Clean Air Action Plan Snapshot */}
                <div className="p-5 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-200 uppercase">
                        {airData?.actionPlanName || 'Graded Action Plan'}
                      </span>
                      <button
                        onClick={() => setCurrentTab('grap')}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        Inspect Stages I-IV →
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {airData?.grap.mandatoryActions.slice(0, 3).map((act, i) => (
                        <div key={i} className="text-xs text-slate-300 font-mono p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Enforcement Authority:</span>
                    <span className="text-white font-semibold">{airData?.regulatoryBody || 'Pollution Control Board'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL TWIN MAP */}
          {currentTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {airData?.cityName || 'Urban'} Live Digital Twin Map
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Interactive spatial network showing real monitoring stations, arterial ring corridors, and vulnerable receptor exposure in {airData?.stateName || 'State'}.
                  </p>
                </div>
              </div>

              <UrbanDigitalTwinMap
                airData={airData}
                exposures={exposures}
                network={network}
                simulationResult={simulationResult}
                isSimulationMode={isSimulationMode}
                onSelectReceptor={(r) => setSelectedReceptor(r)}
                onSelectStation={() => {}}
              />
            </div>
          )}

          {/* TAB 3: EXPOSURE NETWORK */}
          {currentTab === 'exposure-network' && (
            <ExposureNetworkView
              airData={airData}
              exposures={exposures}
              selectedReceptor={selectedReceptor}
              onSelectReceptor={setSelectedReceptor}
              onSimulateIntervention={() => {
                setIsSimulationMode(true);
                setCurrentTab('simulator');
              }}
            />
          )}

          {/* TAB 4: GRAP ENGINE */}
          {currentTab === 'grap' && (
            <GrapStatusPanel
              airData={airData}
              onOpenSimulator={() => {
                setIsSimulationMode(true);
                setCurrentTab('simulator');
              }}
            />
          )}

          {/* TAB 5: INTERVENTION SIMULATOR */}
          {currentTab === 'simulator' && (
            <InterventionSimulator
              airData={airData}
              exposures={exposures}
              onSimulationUpdated={handleSimulationUpdated}
              onViewOnMap={() => setCurrentTab('map')}
            />
          )}

          {/* TAB 6: ALERT CENTER */}
          {currentTab === 'alerts' && (
            <AlertCenter
              alerts={alerts}
              onOpenGrap={() => setCurrentTab('grap')}
              onOpenSimulator={() => {
                setIsSimulationMode(true);
                setCurrentTab('simulator');
              }}
            />
          )}

          {/* TAB 7: DATA PROVENANCE */}
          {currentTab === 'provenance' && (
            <DataProvenanceView airData={airData} />
          )}

          {/* TAB 8: AWS INFRASTRUCTURE */}
          {currentTab === 'aws' && (
            <AwsInfrastructureView
              onOpenArchitectureDocs={() => setShowArchDocs(true)}
            />
          )}
        </main>
      </div>

      {/* Location Intelligence Modal */}
      {selectedReceptor && (
        <LocationIntelligenceModal
          receptor={selectedReceptor}
          onClose={() => setSelectedReceptor(null)}
          onViewExposureNetwork={handleOpenExposureNetwork}
          onSimulateIntervention={handleOpenSimulatorForReceptor}
        />
      )}

      {/* Architecture SAM Docs Modal */}
      {showArchDocs && (
        <ArchitectureDocsModal
          onClose={() => setShowArchDocs(false)}
        />
      )}
    </div>
  );
}
