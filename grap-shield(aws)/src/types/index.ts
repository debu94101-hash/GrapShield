export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface MonitoringStation {
  id: string;
  name: string;
  code: string;
  agency: string;
  lat: number;
  lon: number;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-West' | 'North-East' | 'South-West' | 'South-East';
  microClimateFactor: number;
  nearbyRoads: string[];
}

export interface StationObservation {
  stationId: string;
  stationName: string;
  stationCode: string;
  agency: string;
  lat: number;
  lon: number;
  zone: string;
  nearbyRoads: string[];
  pm2_5: number;
  pm10: number;
  nitrogen_dioxide: number;
  cpcb_aqi: number;
  source: string;
  verificationStatus: string;
  timestamp: string;
}

export interface VulnerableLocation {
  id: string;
  name: string;
  type: 'Hospital' | 'School' | 'ElderCare' | 'TransitShelter';
  lat: number;
  lon: number;
  vulnerabilityFactor: number;
  occupancyDescription: string;
  nearestStationId: string;
  nearestRoadId: string;
}

export interface RoadCorridor {
  id: string;
  name: string;
  type: 'Arterial Ring' | 'Interstate Highway' | 'Transit Choke' | 'Expressway';
  lengthKm: number;
  averagePcuDay: number;
  dieselFreightShare: number;
  coordinates: [number, number][];
}

export interface ConstructionZone {
  id: string;
  name: string;
  lat: number;
  lon: number;
  footprintSqm: number;
  dustGenerationIndex: number;
  antiSmogGunDeployed: boolean;
}

export interface WeatherObservation {
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  source: string;
}

export interface GrapStatus {
  stage: number;
  stageName: string;
  triggers: string[];
  mandatoryActions: string[];
}

export interface DataProvenance {
  airQualitySource: string;
  airQualityCitation: string;
  meteorologySource: string;
  regulatoryEngine: string;
  verificationStatus: string;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  zone: string;
  regulatoryBody: string;
  actionPlanName: string;
  centerLat: number;
  centerLon: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  waterwayName: string;
  waterwayPathPoints: [number, number][];
}

export interface VerifiedAirData {
  cityId: string;
  cityName: string;
  stateName: string;
  regulatoryBody: string;
  actionPlanName: string;
  isAvailable: boolean;
  lastUpdated?: string;
  rawTimestamp?: string;
  urbanAqi: number;
  urbanAvgPm25: number;
  urbanMaxPm25: number;
  urbanAvgPm10: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
  ozone: number;
  weather: WeatherObservation;
  grap: GrapStatus;
  stations: StationObservation[];
  dataProvenance: DataProvenance;
  isStale?: boolean;
  notice?: string;
  error?: string;
  message?: string;
}

export interface ReceptorExposure {
  receptorId: string;
  name: string;
  type: 'Hospital' | 'School' | 'ElderCare' | 'TransitShelter';
  lat: number;
  lon: number;
  vulnerabilityFactor: number;
  occupancyDescription: string;
  nearestStation: {
    id: string;
    name: string;
    distanceKm: number;
    stationPm25: number;
  };
  nearestRoad: {
    id: string;
    name: string;
    dieselFreightShare: number;
  };
  localEstimatedPm25: number;
  exposureScore: number;
  riskLevel: RiskLevel;
  breakdown: {
    particulateSeverity: number;
    vulnerabilityWeight: number;
    trafficCorridorLoad: number;
    constructionDustLoad: number;
  };
  whyAtRisk: string[];
  recommendedIntervention: string;
}

export type InterventionType =
  | 'TRAFFIC_DIVERSION'
  | 'HEAVY_VEHICLE_RESTRICTION'
  | 'CONSTRUCTION_DUST_CONTROL'
  | 'GREEN_BUFFER'
  | 'SCHOOL_OUTDOOR_TIMING';

export interface InterventionDefinition {
  id: InterventionType;
  name: string;
  icon: string;
  description: string;
  targetMechanism: string;
  empiricalReductionBasis: string;
  targetScope: string;
}

export interface SimulatedReceptorComparison {
  receptorId: string;
  name: string;
  type: 'Hospital' | 'School' | 'ElderCare' | 'TransitShelter';
  before: {
    exposureScore: number;
    riskLevel: RiskLevel;
    pm2_5: number;
  };
  after: {
    exposureScore: number;
    riskLevel: RiskLevel;
    pm2_5: number;
  };
  delta: {
    exposureChange: number;
    pm25Change: number;
    riskChanged: boolean;
  };
  appliedEffects: string[];
}

export interface SimulationResult {
  scenarioId: string;
  selectedInterventions: InterventionType[];
  interventionsSummary: InterventionDefinition[];
  aggregateMetrics: {
    averageExposureBefore: number;
    averageExposureAfter: number;
    exposureDelta: number;
    percentReduction: number;
    highRiskLocationsBefore: number;
    highRiskLocationsAfter: number;
    locationsDeescalated: number;
  };
  simulatedReceptors: SimulatedReceptorComparison[];
  disclaimer: string;
}

export interface AwsServiceStatus {
  name: string;
  role: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNAVAILABLE';
  [key: string]: any;
}

export interface AwsInfrastructureReport {
  architecture: string;
  region: string;
  services: AwsServiceStatus[];
  systemUptime: string;
  complianceStandard: string;
}

export interface SnsNotification {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  topic: string;
  timestamp: string;
  subject: string;
  message: string;
  affectedSectors: string[];
}

export type NavigationTab =
  | 'overview'
  | 'map'
  | 'exposure-network'
  | 'grap'
  | 'simulator'
  | 'alerts'
  | 'provenance'
  | 'aws';
