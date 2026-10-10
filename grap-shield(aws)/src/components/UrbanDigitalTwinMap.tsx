import React, { useState, useMemo, useEffect } from 'react';
import {
  MonitoringStation,
  VulnerableLocation,
  RoadCorridor,
  ConstructionZone,
  ReceptorExposure,
  VerifiedAirData,
  SimulationResult,
  CityConfig
} from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Wind,
  Shield,
  Eye,
  AlertTriangle,
  Building2,
  HardHat,
  Compass,
  Navigation
} from 'lucide-react';

interface UrbanDigitalTwinMapProps {
  airData: VerifiedAirData | null;
  exposures: ReceptorExposure[];
  network: {
    config?: CityConfig;
    stations: MonitoringStation[];
    vulnerableLocations: VulnerableLocation[];
    roads: RoadCorridor[];
    constructionZones: ConstructionZone[];
  };
  simulationResult: SimulationResult | null;
  isSimulationMode: boolean;
  onSelectReceptor: (receptor: ReceptorExposure) => void;
  onSelectStation: (station: any) => void;
}

export const UrbanDigitalTwinMap: React.FC<UrbanDigitalTwinMapProps> = ({
  airData,
  exposures,
  network,
  simulationResult,
  isSimulationMode,
  onSelectReceptor,
  onSelectStation,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer Visibility Filters
  const [layers, setLayers] = useState({
    stations: true,
    vulnerable: true,
    roads: true,
    construction: true,
    plumes: true,
    waterways: true,
  });

  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

  // SVG dimensions
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 700;

  // Reset pan and zoom when city changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [network.config?.id]);

  // Compute dynamic bounding box for currently selected city
  const bounds = useMemo(() => {
    if (network.config?.bounds) {
      return network.config.bounds;
    }
    if (network.stations.length > 0) {
      const lats = network.stations.map(s => s.lat);
      const lons = network.stations.map(s => s.lon);
      return {
        minLat: Math.min(...lats) - 0.08,
        maxLat: Math.max(...lats) + 0.08,
        minLon: Math.min(...lons) - 0.08,
        maxLon: Math.max(...lons) + 0.08,
      };
    }
    return {
      minLat: 28.4800,
      maxLat: 28.8200,
      minLon: 77.0200,
      maxLon: 77.3800,
    };
  }, [network.config, network.stations]);

  // Convert GPS Coordinates to SVG X, Y
  const project = (lat: number, lon: number): [number, number] => {
    const latSpan = bounds.maxLat - bounds.minLat || 0.1;
    const lonSpan = bounds.maxLon - bounds.minLon || 0.1;
    const x = ((lon - bounds.minLon) / lonSpan) * MAP_WIDTH;
    const y = ((bounds.maxLat - lat) / latSpan) * MAP_HEIGHT;
    return [x, y];
  };

  // Waterway path calculation
  const waterwayPoints = network.config?.waterwayPathPoints || [];
  const waterwaySvgPath = useMemo(() => {
    if (!waterwayPoints.length) return '';
    const coords = waterwayPoints.map(([lat, lon]) => project(lat, lon));
    return coords.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [waterwayPoints, bounds]);

  // Map mouse controls for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Get simulation comparison for a receptor if available
  const getSimulationDelta = (receptorId: string) => {
    if (!simulationResult || !isSimulationMode) return null;
    return simulationResult.simulatedReceptors.find(r => r.receptorId === receptorId);
  };

  const windDir = airData?.weather?.windDirectionDeg ?? 45;
  const windSpeed = airData?.weather?.windSpeedKmh ?? 6;

  return (
    <div className="relative w-full h-[620px] rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden select-none flex flex-col">
      {/* Map Header / Layer Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0E1524]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">
              {network.config?.name || airData?.cityName || 'Urban'} Twin
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              {network.config?.state || airData?.stateName || 'India'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-300">
              {network.config?.centerLat ? `${network.config.centerLat.toFixed(2)}°N ${network.config.centerLon.toFixed(2)}°E` : '28.61°N 77.20°E'}
            </span>
          </div>

          {airData && (
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-[11px] font-mono text-cyan-300">
              <Wind className="w-3.5 h-3.5" />
              <span>{windSpeed} km/h @ {windDir}°</span>
            </div>
          )}
        </div>

        {/* Layer Filter Toggles */}
        <div className="flex items-center gap-1.5 bg-[#0E1524]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 pointer-events-auto">
          <button
            onClick={() => setLayers(l => ({ ...l, stations: !l.stations }))}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              layers.stations ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Stations ({network.stations.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, vulnerable: !l.vulnerable }))}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              layers.vulnerable ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Receptors ({network.vulnerableLocations.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, roads: !l.roads }))}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              layers.roads ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Roads ({network.roads.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, construction: !l.construction }))}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              layers.construction ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Dust Sites ({network.constructionZones.length})
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, plumes: !l.plumes }))}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              layers.plumes ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Plumes
          </button>
        </div>
      </div>

      {/* Floating Viewport Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-[#0E1524]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.75, z - 0.25))}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Simulation Mode Indicator Pill */}
      {isSimulationMode && (
        <div className="absolute bottom-4 left-4 z-20 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-mono flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>SCENARIO TWIN ACTIVE: Exposure reduction deltas mapped for {network.config?.name || 'City'}</span>
        </div>
      )}

      {/* SVG Canvas Map */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* Defs for gradients, filters and marker patterns */}
          <defs>
            <radialGradient id="plumeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Grid Lines */}
          <g opacity="0.15" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 6">
            {[0.2, 0.4, 0.6, 0.8].map(ratio => (
              <React.Fragment key={ratio}>
                <line x1={0} y1={MAP_HEIGHT * ratio} x2={MAP_WIDTH} y2={MAP_HEIGHT * ratio} />
                <line x1={MAP_WIDTH * ratio} y1={0} x2={MAP_WIDTH * ratio} y2={MAP_HEIGHT} />
              </React.Fragment>
            ))}
          </g>

          {/* Urban Basin Boundary Polygon */}
          <polygon
            points="
              120,80 340,60 520,70 650,110 780,180 840,320 860,480 810,600 680,640 480,630 310,590 190,520 140,410 110,260 120,80
            "
            fill="#0F172A"
            fillOpacity="0.45"
            stroke="#1E293B"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Layer: Waterway / River / Coastal Shoreline */}
          {layers.waterways && waterwaySvgPath && (
            <g>
              <path
                d={waterwaySvgPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeOpacity="0.35"
                strokeLinecap="round"
              />
              <path
                d={waterwaySvgPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              {waterwayPoints[Math.floor(waterwayPoints.length / 2)] && (
                <text
                  x={project(waterwayPoints[Math.floor(waterwayPoints.length / 2)][0], waterwayPoints[Math.floor(waterwayPoints.length / 2)][1])[0] + 10}
                  y={project(waterwayPoints[Math.floor(waterwayPoints.length / 2)][0], waterwayPoints[Math.floor(waterwayPoints.length / 2)][1])[1]}
                  fill="#38bdf8"
                  fontSize="9"
                  opacity="0.6"
                  fontFamily="monospace"
                >
                  {network.config?.waterwayName || 'Natural River Channel'}
                </text>
              )}
            </g>
          )}

          {/* Layer: Road Networks */}
          {layers.roads && (
            <g>
              {network.roads.map(road => {
                const pathString = road.coordinates.reduce((acc, [lat, lon], idx) => {
                  const [x, y] = project(lat, lon);
                  return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '');

                const isRing = road.type === 'Arterial Ring' || road.type === 'Expressway';
                const strokeColor = isRing ? '#f59e0b' : '#38bdf8';
                const strokeWidth = isRing ? 3 : 2;

                return (
                  <g key={road.id} className="cursor-pointer group">
                    <path
                      d={pathString}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity="0.45"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={1}
                      strokeOpacity="0.2"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Layer: Atmospheric Plumes from Monitoring Stations */}
          {layers.plumes && airData && (
            <g>
              {network.stations.map(st => {
                const [x, y] = project(st.lat, st.lon);
                const stationObs = airData.stations.find(s => s.stationId === st.id);
                const pm = stationObs?.pm2_5 ?? 100;
                const radius = Math.min(140, Math.max(50, pm * 0.7));

                const rad = ((windDir + 180) % 360) * (Math.PI / 180);
                const offsetX = Math.sin(rad) * (windSpeed * 3);
                const offsetY = -Math.cos(rad) * (windSpeed * 3);

                return (
                  <ellipse
                    key={`plume_${st.id}`}
                    cx={x + offsetX}
                    cy={y + offsetY}
                    rx={radius * 1.3}
                    ry={radius * 0.9}
                    fill="url(#plumeGradient)"
                    transform={`rotate(${windDir}, ${x + offsetX}, ${y + offsetY})`}
                    pointerEvents="none"
                  />
                );
              })}
            </g>
          )}

          {/* Layer: Construction Hotspots */}
          {layers.construction && (
            <g>
              {network.constructionZones.map(cz => {
                const [x, y] = project(cz.lat, cz.lon);
                return (
                  <g key={cz.id} transform={`translate(${x}, ${y})`}>
                    <circle r="22" fill="#ea580c" fillOpacity="0.12" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="7" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                    <text y="18" fill="#fdba74" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {cz.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Layer: Monitoring Stations */}
          {layers.stations && (
            <g>
              {network.stations.map(st => {
                const [x, y] = project(st.lat, st.lon);
                const stationObs = airData?.stations?.find(s => s.stationId === st.id);
                const pm = stationObs?.pm2_5 ?? 95;
                const aqi = stationObs?.cpcb_aqi ?? 250;

                const isCritical = pm > 200 || aqi > 400;
                const isHigh = pm > 120;
                const markerColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={st.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer group"
                    onClick={() => onSelectStation(stationObs || st)}
                    onMouseEnter={() => setHoveredEntity({ type: 'station', data: stationObs || st })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <circle
                      r="16"
                      fill={markerColor}
                      fillOpacity="0.18"
                      className="animate-beacon"
                    />
                    <circle
                      r="8"
                      fill="#0E1524"
                      stroke={markerColor}
                      strokeWidth="2.5"
                    />
                    <circle r="3" fill={markerColor} />

                    <rect
                      x="-38"
                      y="-26"
                      width="76"
                      height="15"
                      rx="3"
                      fill="#070B12"
                      fillOpacity="0.85"
                      stroke="#334155"
                      strokeWidth="0.5"
                    />
                    <text
                      y="-16"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {st.name.length > 12 ? st.name.slice(0, 10) + '..' : st.name}
                    </text>
                    <text
                      y="-5"
                      fill={markerColor}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pm} μg/m³
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Layer: Vulnerable Locations */}
          {layers.vulnerable && (
            <g>
              {network.vulnerableLocations.map(vl => {
                const [x, y] = project(vl.lat, vl.lon);
                const exposure = exposures.find(e => e.receptorId === vl.id);
                const simDelta = getSimulationDelta(vl.id);

                const risk = simDelta ? simDelta.after.riskLevel : exposure?.riskLevel ?? 'HIGH';
                const score = simDelta ? simDelta.after.exposureScore : exposure?.exposureScore ?? 75;

                const riskColor =
                  risk === 'CRITICAL' ? '#ef4444' :
                  risk === 'HIGH' ? '#f59e0b' :
                  risk === 'MODERATE' ? '#eab308' : '#10b981';

                return (
                  <g
                    key={vl.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      if (exposure) onSelectReceptor(exposure);
                    }}
                    onMouseEnter={() => setHoveredEntity({ type: 'receptor', data: exposure || vl })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {simDelta && simDelta.delta.exposureChange < 0 && (
                      <circle
                        r="24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ transformOrigin: 'center center' }}
                      />
                    )}

                    <polygon
                      points="0,-10 9,5 -9,5"
                      fill="#0E1524"
                      stroke={riskColor}
                      strokeWidth="2"
                    />

                    <text
                      y="1"
                      fill={riskColor}
                      fontSize="7"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {vl.type === 'Hospital' ? 'H' : vl.type === 'School' ? 'S' : 'E'}
                    </text>

                    <rect
                      x="10"
                      y="-12"
                      width="26"
                      height="13"
                      rx="3"
                      fill="#070B12"
                      fillOpacity="0.9"
                      stroke={riskColor}
                      strokeWidth="0.8"
                    />
                    <text
                      x="23"
                      y="-3"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {score}
                    </text>

                    {simDelta && (
                      <text
                        x="23"
                        y="12"
                        fill="#34d399"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {simDelta.delta.exposureChange}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Hover Info Tooltip Bar */}
      {hoveredEntity && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#0E1524]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3 text-xs font-mono pointer-events-none">
          {hoveredEntity.type === 'receptor' ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="font-bold text-white">{hoveredEntity.data.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-bold">Exposure: {hoveredEntity.data.exposureScore ?? 'Calculated'}/100</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Est. PM2.5: {hoveredEntity.data.localEstimatedPm25} μg/m³</span>
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-white">{hoveredEntity.data.stationName || hoveredEntity.data.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-300">PM2.5: {hoveredEntity.data.pm2_5} μg/m³</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">NAQI: {hoveredEntity.data.cpcb_aqi}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
