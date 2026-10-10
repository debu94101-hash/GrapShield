import {
  CityConfig,
  MonitoringStation,
  VulnerableLocation,
  RoadCorridor,
  ConstructionZone
} from '../types';

export interface CityDataset {
  config: CityConfig;
  stations: MonitoringStation[];
  vulnerableLocations: VulnerableLocation[];
  roads: RoadCorridor[];
  constructionZones: ConstructionZone[];
}

export const CITIES_REGISTRY: Record<string, CityDataset> = {
  delhi: {
    config: {
      id: 'delhi',
      name: 'Delhi-NCR',
      state: 'NCT of Delhi / Haryana / UP',
      zone: 'Northern Gangetic Plain',
      regulatoryBody: 'CAQM / DPCC / CPCB',
      actionPlanName: 'CAQM Statutory GRAP',
      centerLat: 28.6139,
      centerLon: 77.2090,
      bounds: {
        minLat: 28.4800,
        maxLat: 28.8200,
        minLon: 77.0200,
        maxLon: 77.3800,
      },
      waterwayName: 'Yamuna River',
      waterwayPathPoints: [
        [28.810, 77.195],
        [28.750, 77.215],
        [28.710, 77.230],
        [28.670, 77.238],
        [28.631, 77.250],
        [28.580, 77.265],
        [28.540, 77.300],
        [28.490, 77.330],
      ],
    },
    stations: [
      { id: 'st_del_anand_vihar', name: 'Anand Vihar', code: 'DPCC-01', agency: 'DPCC / CPCB', lat: 28.6502, lon: 77.3027, zone: 'East', microClimateFactor: 1.28, nearbyRoads: ['Vikas Marg', 'Outer Ring Road (Ghazipur)'] },
      { id: 'st_del_punjabi_bagh', name: 'Punjabi Bagh', code: 'DPCC-02', agency: 'DPCC / CPCB', lat: 28.6683, lon: 77.1167, zone: 'West', microClimateFactor: 1.15, nearbyRoads: ['Ring Road', 'Rohtak Road'] },
      { id: 'st_del_ito', name: 'ITO Central', code: 'CPCB-01', agency: 'CPCB', lat: 28.6312, lon: 77.2410, zone: 'Central', microClimateFactor: 1.18, nearbyRoads: ['Vikas Marg', 'Ring Road (ITO Junction)'] },
      { id: 'st_del_rk_puram', name: 'R.K. Puram', code: 'DPCC-03', agency: 'DPCC / CPCB', lat: 28.5632, lon: 77.1867, zone: 'South', microClimateFactor: 0.98, nearbyRoads: ['Ring Road (Bhikaji Cama)', 'Outer Ring Road'] },
      { id: 'st_del_dwarka_sec8', name: 'Dwarka Sector 8', code: 'DPCC-04', agency: 'DPCC / CPCB', lat: 28.5700, lon: 77.0712, zone: 'West', microClimateFactor: 1.05, nearbyRoads: ['Dwarka Expressway link', 'Palam Road'] },
      { id: 'st_del_mandir_marg', name: 'Mandir Marg', code: 'DPCC-05', agency: 'DPCC / CPCB', lat: 28.6364, lon: 77.1994, zone: 'Central', microClimateFactor: 0.88, nearbyRoads: ['Panchkuian Marg', 'Shankar Road'] },
      { id: 'st_del_jahangirpuri', name: 'Jahangirpuri', code: 'DPCC-06', agency: 'DPCC / CPCB', lat: 28.7259, lon: 77.1654, zone: 'North', microClimateFactor: 1.25, nearbyRoads: ['GT Karnal Road (NH-44)', 'Outer Ring Road'] },
      { id: 'st_del_bawana', name: 'Bawana Industrial', code: 'DPCC-07', agency: 'DPCC / CPCB', lat: 28.7762, lon: 77.0510, zone: 'North', microClimateFactor: 1.32, nearbyRoads: ['Bawana Industrial Corridor', 'Western Peripheral link'] },
      { id: 'st_del_okhla_ph2', name: 'Okhla Phase II', code: 'DPCC-08', agency: 'DPCC / CPCB', lat: 28.5308, lon: 77.2713, zone: 'South', microClimateFactor: 1.22, nearbyRoads: ['Mathura Road', 'Maa Anandmayee Marg'] },
      { id: 'st_del_wazirpur', name: 'Wazirpur Industrial', code: 'DPCC-09', agency: 'DPCC / CPCB', lat: 28.6999, lon: 77.1655, zone: 'North', microClimateFactor: 1.26, nearbyRoads: ['Ring Road (Shalimar Bagh)', 'GT Karnal Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_del_aiims', name: 'AIIMS New Delhi', type: 'Hospital', lat: 28.5672, lon: 77.2100, vulnerabilityFactor: 0.95, occupancyDescription: '2,478 inpatient beds, pediatric & pulmonary critical care ICUs', nearestStationId: 'st_del_rk_puram', nearestRoadId: 'road_del_ring_road' },
      { id: 'vul_del_safdarjung', name: 'Safdarjung Hospital & VMMC', type: 'Hospital', lat: 28.5702, lon: 77.2064, vulnerabilityFactor: 0.92, occupancyDescription: '2,800 beds, national burn & respiratory emergency center', nearestStationId: 'st_del_rk_puram', nearestRoadId: 'road_del_ring_road' },
      { id: 'vul_del_max_patparganj', name: 'Max Super Speciality Hospital Patparganj', type: 'Hospital', lat: 28.6293, lon: 77.3054, vulnerabilityFactor: 0.90, occupancyDescription: '400+ beds, cardiac & respiratory care unit', nearestStationId: 'st_del_anand_vihar', nearestRoadId: 'road_del_vikas_marg' },
      { id: 'vul_del_dps_rkpuram', name: 'Delhi Public School R.K. Puram', type: 'School', lat: 28.5615, lon: 77.1832, vulnerabilityFactor: 0.88, occupancyDescription: '9,500 students (Ages 5-18), active outdoor sports grounds', nearestStationId: 'st_del_rk_puram', nearestRoadId: 'road_del_ring_road' },
      { id: 'vul_del_modern_school', name: 'Modern School Barakhamba Road', type: 'School', lat: 28.6305, lon: 77.2285, vulnerabilityFactor: 0.85, occupancyDescription: '2,600 students, central Delhi arterial perimeter', nearestStationId: 'st_del_ito', nearestRoadId: 'road_del_vikas_marg' },
      { id: 'vul_del_vasant_elder', name: 'Vasant Kunj Senior Citizen Living', type: 'ElderCare', lat: 28.5284, lon: 77.1583, vulnerabilityFactor: 0.94, occupancyDescription: '180 senior residents with chronic respiratory comorbidities', nearestStationId: 'st_del_rk_puram', nearestRoadId: 'road_del_outer_ring' },
      { id: 'vul_del_anand_shelter', name: 'Anand Vihar Transit Night Shelter', type: 'TransitShelter', lat: 28.6475, lon: 77.3060, vulnerabilityFactor: 0.91, occupancyDescription: '450 daily transient laborers and unhoused families', nearestStationId: 'st_del_anand_vihar', nearestRoadId: 'road_del_vikas_marg' },
    ],
    roads: [
      { id: 'road_del_ring_road', name: 'Mahatma Gandhi Ring Road', type: 'Arterial Ring', lengthKm: 51, averagePcuDay: 165000, dieselFreightShare: 0.32, coordinates: [[28.56, 77.18], [28.57, 77.21], [28.63, 77.24], [28.67, 77.12], [28.56, 77.18]] },
      { id: 'road_del_outer_ring', name: 'Outer Ring Road Corridor', type: 'Arterial Ring', lengthKm: 47, averagePcuDay: 182000, dieselFreightShare: 0.38, coordinates: [[28.54, 77.16], [28.54, 77.25], [28.65, 77.31], [28.72, 77.15]] },
      { id: 'road_del_nh44', name: 'NH-44 (GT Karnal Road)', type: 'Interstate Highway', lengthKm: 28, averagePcuDay: 142000, dieselFreightShare: 0.48, coordinates: [[28.69, 77.18], [28.74, 77.15], [28.82, 77.11]] },
      { id: 'road_del_vikas_marg', name: 'Vikas Marg (ITO to Anand Vihar)', type: 'Transit Choke', lengthKm: 9.5, averagePcuDay: 128000, dieselFreightShare: 0.28, coordinates: [[28.63, 77.24], [28.64, 77.28], [28.65, 77.30]] },
    ],
    constructionZones: [
      { id: 'cnst_del_anand_vihar', name: 'RRTS Anand Vihar Underground Flyover', lat: 28.6490, lon: 77.3050, footprintSqm: 42000, dustGenerationIndex: 0.85, antiSmogGunDeployed: true },
      { id: 'cnst_del_dwarka', name: 'Dwarka Expressway Package 2 Intersection', lat: 28.5720, lon: 77.0650, footprintSqm: 68000, dustGenerationIndex: 0.78, antiSmogGunDeployed: false },
    ]
  },

  mumbai: {
    config: {
      id: 'mumbai',
      name: 'Mumbai',
      state: 'Maharashtra',
      zone: 'Western Coastal Megacity',
      regulatoryBody: 'MPCB / BMC / CPCB',
      actionPlanName: 'BMC Graded Clean Air Mitigation Protocol',
      centerLat: 19.0760,
      centerLon: 72.8777,
      bounds: {
        minLat: 18.8900,
        maxLat: 19.2800,
        minLon: 72.7700,
        maxLon: 72.9900,
      },
      waterwayName: 'Arabian Sea Coastal Shoreline',
      waterwayPathPoints: [
        [18.900, 72.810],
        [18.960, 72.815],
        [19.030, 72.820],
        [19.090, 72.825],
        [19.160, 72.810],
        [19.240, 72.790],
      ],
    },
    stations: [
      { id: 'st_mum_bkc', name: 'Bandra Kurla Complex (BKC)', code: 'MPCB-01', agency: 'MPCB / CPCB', lat: 19.0664, lon: 72.8687, zone: 'Central', microClimateFactor: 1.25, nearbyRoads: ['BKC Connector', 'Santacruz-Chembur Link Road'] },
      { id: 'st_mum_colaba', name: 'Colaba Coastal', code: 'CPCB-MUM01', agency: 'CPCB', lat: 18.9067, lon: 72.8147, zone: 'South', microClimateFactor: 0.88, nearbyRoads: ['Marine Drive', 'Cuffe Parade Road'] },
      { id: 'st_mum_chembur', name: 'Chembur Industrial', code: 'MPCB-02', agency: 'MPCB / CPCB', lat: 19.0522, lon: 72.8994, zone: 'East', microClimateFactor: 1.30, nearbyRoads: ['Eastern Freeway', 'Sion-Panvel Highway'] },
      { id: 'st_mum_andheri', name: 'Andheri Chakala', code: 'MPCB-03', agency: 'MPCB / CPCB', lat: 19.1136, lon: 72.8697, zone: 'West', microClimateFactor: 1.20, nearbyRoads: ['Western Express Highway', 'Andheri-Kurla Road'] },
      { id: 'st_mum_kurla', name: 'Kurla West Junction', code: 'MPCB-04', agency: 'MPCB / CPCB', lat: 19.0726, lon: 72.8845, zone: 'Central', microClimateFactor: 1.22, nearbyRoads: ['LBS Marg', 'CST Road'] },
      { id: 'st_mum_borivali', name: 'Borivali East', code: 'MPCB-05', agency: 'MPCB / CPCB', lat: 19.2290, lon: 72.8600, zone: 'North', microClimateFactor: 1.02, nearbyRoads: ['Western Express Highway (Dahisar)'] },
      { id: 'st_mum_navi_mumbai', name: 'Navi Mumbai (Vashi)', code: 'MPCB-06', agency: 'MPCB / CPCB', lat: 19.0770, lon: 72.9980, zone: 'East', microClimateFactor: 1.15, nearbyRoads: ['Thane-Belapur Road', 'Palm Beach Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_mum_kem', name: 'KEM Hospital & Seth GS Medical College', type: 'Hospital', lat: 19.0028, lon: 72.8427, vulnerabilityFactor: 0.96, occupancyDescription: '2,250 beds, premier public referral and critical trauma center', nearestStationId: 'st_mum_bkc', nearestRoadId: 'road_mum_weh' },
      { id: 'vul_mum_lilavati', name: 'Lilavati Hospital & Research Centre Bandra', type: 'Hospital', lat: 19.0515, lon: 72.8290, vulnerabilityFactor: 0.91, occupancyDescription: '320 beds, specialized cardiovascular & respiratory ICU', nearestStationId: 'st_mum_bkc', nearestRoadId: 'road_mum_weh' },
      { id: 'vul_mum_tata_memorial', name: 'Tata Memorial Cancer Centre Parel', type: 'Hospital', lat: 19.0049, lon: 72.8431, vulnerabilityFactor: 0.97, occupancyDescription: 'Immuno-compromised oncology patient cohorts', nearestStationId: 'st_mum_bkc', nearestRoadId: 'road_mum_eeh' },
      { id: 'vul_mum_cathedral', name: 'The Cathedral & John Connon School Fort', type: 'School', lat: 18.9340, lon: 72.8330, vulnerabilityFactor: 0.86, occupancyDescription: '2,000 primary students in dense downtown corridor', nearestStationId: 'st_mum_colaba', nearestRoadId: 'road_mum_eeh' },
      { id: 'vul_mum_dhirubhai', name: 'Dhirubhai Ambani International School BKC', type: 'School', lat: 19.0660, lon: 72.8680, vulnerabilityFactor: 0.88, occupancyDescription: '1,100 students adjacent to high-traffic BKC connector', nearestStationId: 'st_mum_bkc', nearestRoadId: 'road_mum_weh' },
      { id: 'vul_mum_dharavi_shelter', name: 'Dharavi Transit Shelter & Public Dispensary', type: 'TransitShelter', lat: 19.0400, lon: 72.8550, vulnerabilityFactor: 0.93, occupancyDescription: 'Densely populated transit and informal workforce hub', nearestStationId: 'st_mum_kurla', nearestRoadId: 'road_mum_weh' },
    ],
    roads: [
      { id: 'road_mum_weh', name: 'Western Express Highway (WEH)', type: 'Interstate Highway', lengthKm: 25.3, averagePcuDay: 195000, dieselFreightShare: 0.28, coordinates: [[19.05, 72.84], [19.11, 72.85], [19.18, 72.86], [19.24, 72.86]] },
      { id: 'road_mum_eeh', name: 'Eastern Express Highway & Freeway', type: 'Interstate Highway', lengthKm: 23.6, averagePcuDay: 170000, dieselFreightShare: 0.42, coordinates: [[18.95, 72.84], [19.04, 72.88], [19.12, 72.93], [19.18, 72.96]] },
      { id: 'road_mum_sclr', name: 'Santacruz-Chembur Link Road (SCLR)', type: 'Transit Choke', lengthKm: 6.5, averagePcuDay: 110000, dieselFreightShare: 0.25, coordinates: [[19.07, 72.85], [19.07, 72.88], [19.06, 72.90]] },
    ],
    constructionZones: [
      { id: 'cnst_mum_coastal_road', name: 'Mumbai Coastal Road Project Sector 2', lat: 19.0050, lon: 72.8150, footprintSqm: 85000, dustGenerationIndex: 0.82, antiSmogGunDeployed: true },
      { id: 'cnst_mum_metro3', name: 'Metro Line 3 Cuffe Parade-SEEPZ Depot', lat: 19.1200, lon: 72.8700, footprintSqm: 54000, dustGenerationIndex: 0.76, antiSmogGunDeployed: false },
    ]
  },

  kolkata: {
    config: {
      id: 'kolkata',
      name: 'Kolkata',
      state: 'West Bengal',
      zone: 'Eastern Indo-Gangetic Terminus',
      regulatoryBody: 'WBPCB / KMC / CPCB',
      actionPlanName: 'WBPCB Graded Clean Air Mitigation Plan',
      centerLat: 22.5726,
      centerLon: 88.3639,
      bounds: {
        minLat: 22.4500,
        maxLat: 22.6800,
        minLon: 88.2600,
        maxLon: 88.4800,
      },
      waterwayName: 'Hooghly (Ganga) River',
      waterwayPathPoints: [
        [22.670, 88.340],
        [22.620, 88.350],
        [22.580, 88.345],
        [22.550, 88.325],
        [22.500, 88.300],
        [22.460, 88.280],
      ],
    },
    stations: [
      { id: 'st_kol_victoria', name: 'Victoria Memorial Hall', code: 'WBPCB-01', agency: 'WBPCB / CPCB', lat: 22.5448, lon: 88.3426, zone: 'Central', microClimateFactor: 0.92, nearbyRoads: ['AJC Bose Road', 'Red Road'] },
      { id: 'st_kol_rabindra', name: 'Rabindra Bharati University', code: 'WBPCB-02', agency: 'WBPCB / CPCB', lat: 22.6284, lon: 88.3789, zone: 'North', microClimateFactor: 1.28, nearbyRoads: ['BT Road', 'Jessore Road'] },
      { id: 'st_kol_ballygunge', name: 'Ballygunge Army Camp', code: 'WBPCB-03', agency: 'WBPCB / CPCB', lat: 22.5298, lon: 88.3644, zone: 'South', microClimateFactor: 1.10, nearbyRoads: ['Gariahat Road', 'Hazra Road'] },
      { id: 'st_kol_jadavpur', name: 'Jadavpur University', code: 'WBPCB-04', agency: 'WBPCB / CPCB', lat: 22.4955, lon: 88.3705, zone: 'South', microClimateFactor: 1.14, nearbyRoads: ['Raja SC Mullick Road', 'EM Bypass'] },
      { id: 'st_kol_howrah', name: 'Howrah Railway Terminal', code: 'WBPCB-05', agency: 'WBPCB / CPCB', lat: 22.5830, lon: 88.3410, zone: 'West', microClimateFactor: 1.32, nearbyRoads: ['Howrah Bridge Approach', 'Grand Trunk Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_kol_sskm', name: 'SSKM Hospital & IPGMER', type: 'Hospital', lat: 22.5390, lon: 88.3430, vulnerabilityFactor: 0.95, occupancyDescription: '3,200 beds, primary state multi-specialty institute', nearestStationId: 'st_kol_victoria', nearestRoadId: 'road_kol_ajc' },
      { id: 'vul_kol_calcutta_med', name: 'Calcutta Medical College Hospital', type: 'Hospital', lat: 22.5730, lon: 88.3610, vulnerabilityFactor: 0.94, occupancyDescription: 'Historic 1,900 bed acute medical center in dense zone', nearestStationId: 'st_kol_victoria', nearestRoadId: 'road_kol_cr' },
      { id: 'vul_kol_la_martiniere', name: 'La Martiniere for Boys & Girls', type: 'School', lat: 22.5450, lon: 88.3580, vulnerabilityFactor: 0.87, occupancyDescription: '3,400 students on Loudon Street corridor', nearestStationId: 'st_kol_victoria', nearestRoadId: 'road_kol_ajc' },
      { id: 'vul_kol_shanti_elder', name: 'Shanti Nivas Senior Living Hazra', type: 'ElderCare', lat: 22.5240, lon: 88.3520, vulnerabilityFactor: 0.92, occupancyDescription: '120 senior citizens with cardiovascular fragility', nearestStationId: 'st_kol_ballygunge', nearestRoadId: 'road_kol_ajc' },
    ],
    roads: [
      { id: 'road_kol_em_bypass', name: 'Eastern Metropolitan Bypass', type: 'Arterial Ring', lengthKm: 21.0, averagePcuDay: 145000, dieselFreightShare: 0.35, coordinates: [[22.48, 88.39], [22.54, 88.40], [22.59, 88.40], [22.62, 88.39]] },
      { id: 'road_kol_ajc', name: 'AJC Bose Road Flyover Corridor', type: 'Transit Choke', lengthKm: 8.5, averagePcuDay: 130000, dieselFreightShare: 0.30, coordinates: [[22.54, 88.33], [22.54, 88.36], [22.55, 88.37]] },
      { id: 'road_kol_bt_road', name: 'Barrackpore Trunk (BT) Road', type: 'Interstate Highway', lengthKm: 18.0, averagePcuDay: 115000, dieselFreightShare: 0.44, coordinates: [[22.61, 88.37], [22.65, 88.38], [22.70, 88.38]] },
    ],
    constructionZones: [
      { id: 'cnst_kol_metro_orange', name: 'New Garia-Airport Metro Corridor Package', lat: 22.5600, lon: 88.4050, footprintSqm: 48000, dustGenerationIndex: 0.79, antiSmogGunDeployed: false },
    ]
  },

  lucknow: {
    config: {
      id: 'lucknow',
      name: 'Lucknow',
      state: 'Uttar Pradesh',
      zone: 'Central Indo-Gangetic Basin',
      regulatoryBody: 'UPPCB / CPCB',
      actionPlanName: 'UPPCB Graded Clean Air Emergency Plan',
      centerLat: 26.8467,
      centerLon: 80.9462,
      bounds: {
        minLat: 26.7400,
        maxLat: 26.9600,
        minLon: 80.8400,
        maxLon: 81.0600,
      },
      waterwayName: 'Gomti River',
      waterwayPathPoints: [
        [26.930, 80.880],
        [26.880, 80.920],
        [26.860, 80.940],
        [26.850, 80.970],
        [26.820, 81.010],
      ],
    },
    stations: [
      { id: 'st_lko_lalbagh', name: 'Lalbagh Commercial', code: 'UPPCB-LKO01', agency: 'UPPCB / CPCB', lat: 26.8460, lon: 80.9380, zone: 'Central', microClimateFactor: 1.25, nearbyRoads: ['MG Marg', 'Hazratganj Main'] },
      { id: 'st_lko_talkatora', name: 'Talkatora Industrial', code: 'UPPCB-LKO02', agency: 'UPPCB / CPCB', lat: 26.8320, lon: 80.8920, zone: 'West', microClimateFactor: 1.34, nearbyRoads: ['Talkatora Road', 'Kanpur Road'] },
      { id: 'st_lko_gomti', name: 'Gomti Nagar Residential', code: 'UPPCB-LKO03', agency: 'UPPCB / CPCB', lat: 26.8580, lon: 80.9980, zone: 'East', microClimateFactor: 1.05, nearbyRoads: ['Shaheed Path', 'Lohia Path'] },
      { id: 'st_lko_kendriya', name: 'Kendriya Vidyalaya Aliganj', code: 'UPPCB-LKO04', agency: 'UPPCB / CPCB', lat: 26.8920, lon: 80.9420, zone: 'North', microClimateFactor: 1.12, nearbyRoads: ['Sitapur Road (NH-24)'] },
    ],
    vulnerableLocations: [
      { id: 'vul_lko_sgpgi', name: 'Sanjay Gandhi PGIMS (SGPGI)', type: 'Hospital', lat: 26.7480, lon: 80.9380, vulnerabilityFactor: 0.96, occupancyDescription: '1,400 tertiary ICU beds, super-specialty renal & pulmonary care', nearestStationId: 'st_lko_talkatora', nearestRoadId: 'road_lko_shaheed' },
      { id: 'vul_lko_kgmu', name: 'King George\'s Medical University (KGMU)', type: 'Hospital', lat: 26.8700, lon: 80.9150, vulnerabilityFactor: 0.95, occupancyDescription: '4,500 beds, largest public medical college in Uttar Pradesh', nearestStationId: 'st_lko_lalbagh', nearestRoadId: 'road_lko_mg' },
      { id: 'vul_lko_cms', name: 'City Montessori School (Gomti Nagar Campus)', type: 'School', lat: 26.8520, lon: 80.9850, vulnerabilityFactor: 0.89, occupancyDescription: '8,500 students, high density campus', nearestStationId: 'st_lko_gomti', nearestRoadId: 'road_lko_shaheed' },
      { id: 'vul_lko_elder', name: 'Awadh Senior Citizen Haven Aliganj', type: 'ElderCare', lat: 26.8850, lon: 80.9480, vulnerabilityFactor: 0.93, occupancyDescription: '140 senior residents', nearestStationId: 'st_lko_kendriya', nearestRoadId: 'road_lko_sitapur' },
    ],
    roads: [
      { id: 'road_lko_shaheed', name: 'Amar Shaheed Path Corridor', type: 'Arterial Ring', lengthKm: 23.0, averagePcuDay: 135000, dieselFreightShare: 0.40, coordinates: [[26.77, 80.92], [26.81, 80.98], [26.86, 81.01]] },
      { id: 'road_lko_mg', name: 'Mahatma Gandhi Marg (Hazratganj)', type: 'Transit Choke', lengthKm: 7.2, averagePcuDay: 95000, dieselFreightShare: 0.22, coordinates: [[26.84, 80.92], [26.85, 80.95]] },
      { id: 'road_lko_sitapur', name: 'Sitapur Highway (NH-24 Entry)', type: 'Interstate Highway', lengthKm: 16.0, averagePcuDay: 110000, dieselFreightShare: 0.46, coordinates: [[26.88, 80.94], [26.93, 80.93]] },
    ],
    constructionZones: [
      { id: 'cnst_lko_metro_ext', name: 'Lucknow Metro Phase 1B East-West Corridor', lat: 26.8550, lon: 80.9350, footprintSqm: 38000, dustGenerationIndex: 0.81, antiSmogGunDeployed: false },
    ]
  },

  bengaluru: {
    config: {
      id: 'bengaluru',
      name: 'Bengaluru',
      state: 'Karnataka',
      zone: 'Deccan Plateau Tech Corridor',
      regulatoryBody: 'KSPCB / BBMP / CPCB',
      actionPlanName: 'KSPCB Clean Air Mitigation Protocol',
      centerLat: 12.9716,
      centerLon: 77.5946,
      bounds: {
        minLat: 12.8300,
        maxLat: 13.1200,
        minLon: 77.4600,
        maxLon: 77.7400,
      },
      waterwayName: 'Vrishabhavathi River Basin',
      waterwayPathPoints: [
        [13.040, 77.520],
        [12.970, 77.530],
        [12.910, 77.510],
        [12.850, 77.480],
      ],
    },
    stations: [
      { id: 'st_blr_silkboard', name: 'Central Silk Board Junction', code: 'KSPCB-01', agency: 'KSPCB / CPCB', lat: 12.9176, lon: 77.6238, zone: 'South', microClimateFactor: 1.35, nearbyRoads: ['Hosur Road', 'Outer Ring Road (Silk Board)'] },
      { id: 'st_blr_peenya', name: 'Peenya Industrial Area', code: 'KSPCB-02', agency: 'KSPCB / CPCB', lat: 13.0334, lon: 77.5178, zone: 'North-West', microClimateFactor: 1.30, nearbyRoads: ['Tumkur Road (NH-48)', 'Outer Ring Road'] },
      { id: 'st_blr_btm', name: 'BTM Layout', code: 'CPCB-BLR01', agency: 'CPCB', lat: 12.9135, lon: 77.6101, zone: 'South', microClimateFactor: 1.12, nearbyRoads: ['Bannerghatta Road', 'Outer Ring Road'] },
      { id: 'st_blr_hebbal', name: 'Hebbal Flyover Junction', code: 'KSPCB-03', agency: 'KSPCB / CPCB', lat: 13.0358, lon: 77.5970, zone: 'North', microClimateFactor: 1.24, nearbyRoads: ['Bellary Road (Airport Highway)', 'Outer Ring Road'] },
      { id: 'st_blr_cityrail', name: 'City Railway Station / Majestic', code: 'KSPCB-04', agency: 'KSPCB / CPCB', lat: 12.9780, lon: 77.5690, zone: 'Central', microClimateFactor: 1.20, nearbyRoads: ['Subedar Chatram Road', 'Platform Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_blr_victoria', name: 'Victoria Hospital & BMCRI', type: 'Hospital', lat: 12.9620, lon: 77.5750, vulnerabilityFactor: 0.94, occupancyDescription: '1,800 inpatient beds in high-congestion central market zone', nearestStationId: 'st_blr_cityrail', nearestRoadId: 'road_blr_majestic' },
      { id: 'vul_blr_jayadeva', name: 'Sri Jayadeva Institute of Cardiovascular Sciences', type: 'Hospital', lat: 12.9200, lon: 77.5980, vulnerabilityFactor: 0.96, occupancyDescription: '1,150 specialized cardiac and respiratory ICU beds', nearestStationId: 'st_blr_btm', nearestRoadId: 'road_blr_orr' },
      { id: 'vul_blr_bishop', name: 'Bishop Cotton Boys\' School Residency Road', type: 'School', lat: 12.9690, lon: 77.6010, vulnerabilityFactor: 0.86, occupancyDescription: '4,200 students on central artery', nearestStationId: 'st_blr_cityrail', nearestRoadId: 'road_blr_majestic' },
      { id: 'vul_blr_silk_shelter', name: 'Silk Board Interstate Bus Transit Shelter', type: 'TransitShelter', lat: 12.9180, lon: 77.6250, vulnerabilityFactor: 0.92, occupancyDescription: 'High density commuter and transit worker shelter', nearestStationId: 'st_blr_silkboard', nearestRoadId: 'road_blr_orr' },
    ],
    roads: [
      { id: 'road_blr_orr', name: 'Outer Ring Road (ORR) Tech Belt', type: 'Arterial Ring', lengthKm: 60.0, averagePcuDay: 190000, dieselFreightShare: 0.34, coordinates: [[12.91, 77.62], [12.95, 77.69], [13.01, 77.66], [13.04, 77.59]] },
      { id: 'road_blr_hosur', name: 'Hosur Road / Electronic City Elevated', type: 'Interstate Highway', lengthKm: 14.5, averagePcuDay: 160000, dieselFreightShare: 0.42, coordinates: [[12.91, 77.62], [12.87, 77.66], [12.84, 77.68]] },
      { id: 'road_blr_majestic', name: 'KG Road & Majestic Choke Point', type: 'Transit Choke', lengthKm: 4.8, averagePcuDay: 115000, dieselFreightShare: 0.26, coordinates: [[12.97, 77.57], [12.98, 77.58]] },
    ],
    constructionZones: [
      { id: 'cnst_blr_metro_blue', name: 'Namma Metro Blue Line (Silk Board to Airport)', lat: 12.9400, lon: 77.6600, footprintSqm: 72000, dustGenerationIndex: 0.84, antiSmogGunDeployed: true },
    ]
  },

  patna: {
    config: {
      id: 'patna',
      name: 'Patna',
      state: 'Bihar',
      zone: 'Middle Gangetic High-Particulate Basin',
      regulatoryBody: 'BSPCB / CPCB',
      actionPlanName: 'Bihar Clean Air Emergency Action Plan',
      centerLat: 25.5941,
      centerLon: 85.1376,
      bounds: {
        minLat: 25.5200,
        maxLat: 25.6800,
        minLon: 85.0400,
        maxLon: 85.2400,
      },
      waterwayName: 'Ganga River Corridor',
      waterwayPathPoints: [
        [25.650, 85.060],
        [25.630, 85.120],
        [25.620, 85.170],
        [25.600, 85.220],
      ],
    },
    stations: [
      { id: 'st_pat_samanpura', name: 'Samanpura Raja Bazar', code: 'BSPCB-01', agency: 'BSPCB / CPCB', lat: 25.6080, lon: 85.0920, zone: 'West', microClimateFactor: 1.32, nearbyRoads: ['Bailey Road (Jawaharlal Nehru Marg)'] },
      { id: 'st_pat_planetarium', name: 'Indira Gandhi Planetarium', code: 'BSPCB-02', agency: 'BSPCB / CPCB', lat: 25.6105, lon: 85.1340, zone: 'Central', microClimateFactor: 1.20, nearbyRoads: ['Bailey Road', 'Fraser Road'] },
      { id: 'st_pat_shikarpur', name: 'Shikarpur Patna City', code: 'BSPCB-03', agency: 'BSPCB / CPCB', lat: 25.5920, lon: 85.2050, zone: 'East', microClimateFactor: 1.28, nearbyRoads: ['Ashok Rajpath', 'Old Bypass (NH-31)'] },
      { id: 'st_pat_danapur', name: 'Danapur DRDO Complex', code: 'BSPCB-04', agency: 'BSPCB / CPCB', lat: 25.6290, lon: 85.0450, zone: 'West', microClimateFactor: 1.15, nearbyRoads: ['Danapur-Khagaul Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_pat_pmch', name: 'Patna Medical College Hospital (PMCH)', type: 'Hospital', lat: 25.6210, lon: 85.1580, vulnerabilityFactor: 0.96, occupancyDescription: '2,300 beds on narrow Ashok Rajpath river corridor', nearestStationId: 'st_pat_planetarium', nearestRoadId: 'road_pat_ashok' },
      { id: 'vul_pat_igims', name: 'Indira Gandhi Institute of Medical Sciences (IGIMS)', type: 'Hospital', lat: 25.6120, lon: 85.0880, vulnerabilityFactor: 0.94, occupancyDescription: '1,050 specialized oncology & critical care beds', nearestStationId: 'st_pat_samanpura', nearestRoadId: 'road_pat_bailey' },
      { id: 'vul_pat_loyola', name: 'St. Michael\'s High School Digha Ghat', type: 'School', lat: 25.6450, lon: 85.1050, vulnerabilityFactor: 0.88, occupancyDescription: '3,800 students on riverbank highway', nearestStationId: 'st_pat_samanpura', nearestRoadId: 'road_pat_bailey' },
      { id: 'vul_pat_shelter', name: 'Patna Junction Transient Night Shelter', type: 'TransitShelter', lat: 25.6020, lon: 85.1360, vulnerabilityFactor: 0.92, occupancyDescription: '600 daily laborers and transit occupants', nearestStationId: 'st_pat_planetarium', nearestRoadId: 'road_pat_bypass' },
    ],
    roads: [
      { id: 'road_pat_bailey', name: 'Bailey Road (Jawaharlal Nehru Marg)', type: 'Arterial Ring', lengthKm: 14.2, averagePcuDay: 125000, dieselFreightShare: 0.32, coordinates: [[25.61, 85.06], [25.61, 85.11], [25.61, 85.14]] },
      { id: 'road_pat_bypass', name: 'New Patna Bypass (NH-30)', type: 'Interstate Highway', lengthKm: 18.5, averagePcuDay: 135000, dieselFreightShare: 0.52, coordinates: [[25.56, 85.08], [25.57, 85.15], [25.58, 85.22]] },
      { id: 'road_pat_ashok', name: 'Ashok Rajpath River Corridor', type: 'Transit Choke', lengthKm: 7.8, averagePcuDay: 85000, dieselFreightShare: 0.24, coordinates: [[25.62, 85.14], [25.61, 85.18]] },
    ],
    constructionZones: [
      { id: 'cnst_pat_metro', name: 'Patna Metro Corridor 1 & 2 Underground Works', lat: 25.6050, lon: 85.1300, footprintSqm: 52000, dustGenerationIndex: 0.86, antiSmogGunDeployed: false },
    ]
  },

  ahmedabad: {
    config: {
      id: 'ahmedabad',
      name: 'Ahmedabad',
      state: 'Gujarat',
      zone: 'Western Industrial & Textile Belt',
      regulatoryBody: 'GPCB / AMC / CPCB',
      actionPlanName: 'GPCB Graded Clean Air Action Protocol',
      centerLat: 23.0225,
      centerLon: 72.5714,
      bounds: {
        minLat: 22.9200,
        maxLat: 23.1400,
        minLon: 72.4600,
        maxLon: 72.6900,
      },
      waterwayName: 'Sabarmati River & Riverfront',
      waterwayPathPoints: [
        [23.120, 72.580],
        [23.070, 72.575],
        [23.020, 72.570],
        [22.970, 72.585],
        [22.930, 72.595],
      ],
    },
    stations: [
      { id: 'st_ahd_maninagar', name: 'Maninagar Urban', code: 'GPCB-01', agency: 'GPCB / CPCB', lat: 22.9980, lon: 72.6050, zone: 'South-East', microClimateFactor: 1.24, nearbyRoads: ['Maninagar Crossroad', 'NH-8 Bypass'] },
      { id: 'st_ahd_chandkheda', name: 'Chandkheda North', code: 'GPCB-02', agency: 'GPCB / CPCB', lat: 23.1120, lon: 72.5820, zone: 'North', microClimateFactor: 1.10, nearbyRoads: ['SP Ring Road', 'Kalol Highway'] },
      { id: 'st_ahd_vatva', name: 'Vatva GIDC Industrial Area', code: 'GPCB-03', agency: 'GPCB / CPCB', lat: 22.9560, lon: 72.6320, zone: 'East', microClimateFactor: 1.38, nearbyRoads: ['Vatva Industrial Road', 'Expressway link'] },
      { id: 'st_ahd_bopal', name: 'Bopal Western Perimeter', code: 'CPCB-AHD01', agency: 'CPCB', lat: 23.0340, lon: 72.4720, zone: 'West', microClimateFactor: 1.05, nearbyRoads: ['Sardar Patel Ring Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_ahd_civil', name: 'Ahmedabad Civil Hospital Asarwa', type: 'Hospital', lat: 23.0530, lon: 72.6030, vulnerabilityFactor: 0.95, occupancyDescription: '2,800 beds, one of the largest hospital complexes in Asia', nearestStationId: 'st_ahd_maninagar', nearestRoadId: 'road_ahd_132' },
      { id: 'vul_ahd_sterling', name: 'Sterling Hospital Gurukul Drive', type: 'Hospital', lat: 23.0540, lon: 72.5310, vulnerabilityFactor: 0.91, occupancyDescription: '310 beds, respiratory and cardiac intensive care', nearestStationId: 'st_ahd_bopal', nearestRoadId: 'road_ahd_sg' },
      { id: 'vul_ahd_dps', name: 'Delhi Public School Bopal', type: 'School', lat: 23.0380, lon: 72.4680, vulnerabilityFactor: 0.87, occupancyDescription: '4,500 students', nearestStationId: 'st_ahd_bopal', nearestRoadId: 'road_ahd_sp' },
      { id: 'vul_ahd_elder', name: 'Sabarmati Senior Care Ashram Road', type: 'ElderCare', lat: 23.0420, lon: 72.5680, vulnerabilityFactor: 0.93, occupancyDescription: '150 senior residents', nearestStationId: 'st_ahd_maninagar', nearestRoadId: 'road_ahd_ashram' },
    ],
    roads: [
      { id: 'road_ahd_sg', name: 'Sarkhej-Gandhinagar (SG) Highway', type: 'Interstate Highway', lengthKm: 28.5, averagePcuDay: 165000, dieselFreightShare: 0.38, coordinates: [[22.98, 72.50], [23.04, 72.52], [23.12, 72.54]] },
      { id: 'road_ahd_sp', name: 'Sardar Patel (SP) Ring Road', type: 'Arterial Ring', lengthKm: 76.0, averagePcuDay: 180000, dieselFreightShare: 0.48, coordinates: [[22.95, 72.48], [23.03, 72.47], [23.12, 72.52], [23.11, 72.65]] },
      { id: 'road_ahd_132', name: '132 Feet Inner Ring Road', type: 'Arterial Ring', lengthKm: 34.0, averagePcuDay: 140000, dieselFreightShare: 0.28, coordinates: [[23.01, 72.54], [23.05, 72.55], [23.06, 72.60]] },
    ],
    constructionZones: [
      { id: 'cnst_ahd_bullet_train', name: 'Mumbai-Ahmedabad High Speed Rail Sabarmati Hub', lat: 23.0750, lon: 72.5850, footprintSqm: 65000, dustGenerationIndex: 0.83, antiSmogGunDeployed: true },
    ]
  },

  hyderabad: {
    config: {
      id: 'hyderabad',
      name: 'Hyderabad',
      state: 'Telangana',
      zone: 'Deccan Plateau Urban Agglomeration',
      regulatoryBody: 'TSPCB / GHMC / CPCB',
      actionPlanName: 'TSPCB Clean Air Mitigation Plan',
      centerLat: 17.3850,
      centerLon: 78.4867,
      bounds: {
        minLat: 17.2600,
        maxLat: 17.5200,
        minLon: 78.3200,
        maxLon: 78.6000,
      },
      waterwayName: 'Musi River Corridor',
      waterwayPathPoints: [
        [17.380, 78.380],
        [17.375, 78.440],
        [17.370, 78.480],
        [17.365, 78.540],
      ],
    },
    stations: [
      { id: 'st_hyd_sanathnagar', name: 'Sanathnagar Industrial', code: 'TSPCB-01', agency: 'TSPCB / CPCB', lat: 17.4580, lon: 78.4450, zone: 'North-West', microClimateFactor: 1.28, nearbyRoads: ['Balanagar Main Road', 'Moosapet Junction'] },
      { id: 'st_hyd_zoopark', name: 'Nehru Zoological Park', code: 'TSPCB-02', agency: 'TSPCB / CPCB', lat: 17.3510, lon: 78.4520, zone: 'South', microClimateFactor: 0.95, nearbyRoads: ['Bahadurpura Road', 'National Highway 44'] },
      { id: 'st_hyd_gachibowli', name: 'Gachibowli Financial District', code: 'CPCB-HYD01', agency: 'CPCB', lat: 17.4400, lon: 78.3480, zone: 'West', microClimateFactor: 1.15, nearbyRoads: ['Outer Ring Road (ORR)', 'Hitec City Main'] },
      { id: 'st_hyd_uppal', name: 'Uppal Commercial Corridor', code: 'TSPCB-03', agency: 'TSPCB / CPCB', lat: 17.4020, lon: 78.5600, zone: 'East', microClimateFactor: 1.22, nearbyRoads: ['Warangal Highway (NH-163)', 'Inner Ring Road'] },
    ],
    vulnerableLocations: [
      { id: 'vul_hyd_nims', name: 'Nizam\'s Institute of Medical Sciences (NIMS) Punjagutta', type: 'Hospital', lat: 17.4220, lon: 78.4520, vulnerabilityFactor: 0.95, occupancyDescription: '1,500 specialty beds on central arterial flyover corridor', nearestStationId: 'st_hyd_sanathnagar', nearestRoadId: 'road_hyd_punjagutta' },
      { id: 'vul_hyd_osmania', name: 'Osmania General Hospital Afzal Gunj', type: 'Hospital', lat: 17.3730, lon: 78.4770, vulnerabilityFactor: 0.94, occupancyDescription: '1,168 beds adjacent to Musi River high traffic belt', nearestStationId: 'st_hyd_zoopark', nearestRoadId: 'road_hyd_pvnr' },
      { id: 'vul_hyd_hps', name: 'The Hyderabad Public School Begumpet', type: 'School', lat: 17.4410, lon: 78.4620, vulnerabilityFactor: 0.88, occupancyDescription: '3,100 students on Sardar Patel Road', nearestStationId: 'st_hyd_sanathnagar', nearestRoadId: 'road_hyd_punjagutta' },
      { id: 'vul_hyd_shelter', name: 'Secunderabad Railway Terminal Shelter', type: 'TransitShelter', lat: 17.4340, lon: 78.5010, vulnerabilityFactor: 0.91, occupancyDescription: 'High density transient worker accommodation', nearestStationId: 'st_hyd_sanathnagar', nearestRoadId: 'road_hyd_punjagutta' },
    ],
    roads: [
      { id: 'road_hyd_orr', name: 'Nehru Outer Ring Road (ORR Expressway)', type: 'Expressway', lengthKm: 158.0, averagePcuDay: 185000, dieselFreightShare: 0.45, coordinates: [[17.38, 78.33], [17.45, 78.34], [17.51, 78.42], [17.48, 78.55]] },
      { id: 'road_hyd_pvnr', name: 'PVNR Elevated Expressway & Airport Road', type: 'Interstate Highway', lengthKm: 11.6, averagePcuDay: 130000, dieselFreightShare: 0.32, coordinates: [[17.39, 78.44], [17.34, 78.42], [17.30, 78.40]] },
      { id: 'road_hyd_punjagutta', name: 'Punjagutta - Begumpet Commercial Arterial', type: 'Transit Choke', lengthKm: 6.2, averagePcuDay: 110000, dieselFreightShare: 0.22, coordinates: [[17.42, 78.45], [17.44, 78.47]] },
    ],
    constructionZones: [
      { id: 'cnst_hyd_metro_phase2', name: 'Hyderabad Metro Phase 2 Airport Express Works', lat: 17.3600, lon: 78.4100, footprintSqm: 58000, dustGenerationIndex: 0.78, antiSmogGunDeployed: false },
    ]
  }
};

export const CITIES_LIST: { id: string; name: string; state: string; zone: string }[] = Object.values(CITIES_REGISTRY).map(c => ({
  id: c.config.id,
  name: c.config.name,
  state: c.config.state,
  zone: c.config.zone,
}));
