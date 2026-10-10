# GRAP SHIELD
## Live Urban Air-Risk Digital Twin & Intervention Intelligence Platform

> **Live Verified Data → AWS Serverless Architecture → Urban Digital Twin → Risk Engine → GRAP Engine → Intervention Simulator → Exposure Variance**

---

## 1. Project Overview

**GRAP SHIELD** is a national-scale production-grade urban air-risk digital twin and decision-support command center engineered across major Indian states and metropolitan centers (**Delhi-NCR**, **Mumbai**, **Kolkata**, **Lucknow**, **Bengaluru**, **Patna**, **Ahmedabad**, and **Hyderabad**). Unlike traditional ambient air quality index (AQI) dashboards that passively report sensor numbers, GRAP SHIELD transforms **live verified atmospheric telemetry** into an actionable **Urban Exposure Relationship Network** to protect vulnerable populations (hospitals, schools, elder care centers) and simulate statutory interventions under the **Commission for Air Quality Management (CAQM)** and State Clean Air Action Plans.

### Supported States & Megacity Urban Twins (Live Data Only)
1. **Delhi-NCR** (NCT of Delhi / Haryana / UP) — CAQM Statutory GRAP
2. **Mumbai** (Maharashtra) — BMC Graded Clean Air Mitigation Protocol
3. **Kolkata** (West Bengal) — WBPCB Graded Clean Air Mitigation Plan
4. **Lucknow** (Uttar Pradesh) — UPPCB NCAP Graded Emergency Action Plan
5. **Bengaluru** (Karnataka) — KSPCB Clean Air Mitigation Protocol
6. **Patna** (Bihar) — Bihar Clean Air Emergency Action Plan
7. **Ahmedabad** (Gujarat) — GPCB Graded Clean Air Action Protocol
8. **Hyderabad** (Telangana) — TSPCB Clean Air Mitigation Plan

### Core Capabilities
1. **Live Verified Atmospheric Ingestion Only**: Queries official Copernicus CAMS atmospheric models and CAAQMS in-situ monitoring stations with zero data fabrication.
2. **Urban Digital Twin Mapping**: Real-time GIS vector layers of city-specific monitoring stations, arterial ring roads, high-emission diesel freight corridors, active construction dust sites, and vulnerable human receptors.
3. **Urban Exposure Relationship Engine**: Deterministic spatial proximity and downwind aerosol transport decay calculations ($e^{-d / \sigma}$) connecting pollution sources to receptor inhalation dosage.
4. **Graded Decision Engine**: Dynamically evaluates Stage I (Poor), Stage II (Very Poor), Stage III (Severe), and Stage IV (Severe+) thresholds and statutory government enforcement orders across each state.
5. **Signature "BEFORE → INTERVENTION → AFTER" Simulator**: Allows environmental planners and municipal authorities to model the immediate exposure reduction of:
   - 🚦 **Traffic Diversion** (Rerouting arterial ring traffic to peripheral expressways)
   - 🚛 **Heavy Vehicle Restriction** (BS-VI diesel freight perimeter cordons)
   - 🏗 **Construction Dust Control** (High-pressure anti-smog guns & chemical binders)
   - 🌳 **Green Buffer & Mist Cannons** (Vegetative bio-shields and mist settling)
   - 🏫 **School Outdoor Timing Shift** (Moving physical assemblies past boundary layer inversion hours)

---

## 2. Zero-Graph-DB Relationship Architecture

**GRAP SHIELD does NOT use FalkorDB, Neo4j, or any external graph database.**

Instead, it implements an **Urban Exposure Relationship Engine** using relational application structures, spatial geometry math, and **Amazon DynamoDB Single-Table Design**:

```text
Air Station (CAMS / CAAQMS Telemetry)
     ↓
Pollution Observation (PM2.5, PM10, NO2, Wind Vector)
     ↓
Corridor Influence (PCU volume, diesel freight fraction)
     ↓
Spatial Transport Kernel (Gaussian wind dispersion w_spatial)
     ↓
Vulnerable Receptor (Hospital ICU, Primary School, Elder Care)
     ↓
Composite Exposure Dosage (0 - 100 Scale)
     ↓
CAQM Statutory Condition (Stage I - IV Escalation)
     ↓
Recommended Spatial Intervention
```

---

## 3. AWS Serverless Infrastructure

GRAP SHIELD is built on 7 core AWS services:

```text
LIVE VERIFIED SOURCES (Open-Meteo Copernicus CAMS & CPCB Registry)
        │
        ▼ (rate: 15 minutes)
AMAZON EVENTBRIDGE (grap-shield-ingestion-cron)
        │
        ▼
AWS LAMBDA INGESTION WORKER (grap-shield-ingestion-worker)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
AMAZON S3 RAW LAKE            AMAZON DYNAMODB (GrapShieldUrbanTwin)
(s3://grap-shield-delhi)      (Single-Table PK/SK Design)
   │                               │
   └───────────────┬───────────────┘
                   ▼
AWS LAMBDA RISK ENGINE (grap-shield-risk-evaluator)
   │
   ├─► Computes Receptor Exposure Dosage
   ├─► Evaluates Statutory CAQM GRAP Rules (Stages I-IV)
   │
   ├─► Threshold breach? ──► AMAZON SNS (Topic: grap-shield-emergency-alerts)
   │
   ▼
AMAZON API GATEWAY (REST v1)
   │
   ▼
WEB DIGITAL TWIN INTERFACE (React + Vite + Tailwind CSS)
```

### AWS Components:
- **AWS Lambda**: Node.js 20.x serverless workers for telemetry ingestion, spatial exposure computation, and GRAP rule evaluation.
- **Amazon DynamoDB**: Single-table operational data store (`GrapShieldUrbanTwin`) with sub-millisecond lookup latency.
- **Amazon S3**: Raw JSON telemetry storage (`s3://grap-shield-telemetry-delhi/raw-observations/YYYY/MM/DD/`).
- **Amazon EventBridge**: Scheduled cron expression (`rate(15 minutes)`) ensuring continuous data freshness.
- **Amazon SNS**: Emergency dispatch topics (`grap-shield-emergency-alerts`) notifying municipal agencies when critical exposure is breached.
- **Amazon CloudWatch**: End-to-end telemetry monitoring, structured JSON audit logging, and alarms.
- **Amazon API Gateway**: Secure regional REST gateway with rate throttling.

---

## 4. Amazon DynamoDB Single-Table Design

| Entity | PK | SK | GSI1PK | Attributes Stored |
| :--- | :--- | :--- | :--- | :--- |
| **Air Observation** | `STATION#{station_id}` | `OBS#{timestamp}` | `OBSERVATION` | `pm2_5`, `pm10`, `aqi`, `no2`, `windSpeed`, `windDir` |
| **Vulnerable Receptor** | `RECEPTOR#{receptor_id}` | `METADATA` | `VULNERABILITY` | `name`, `type`, `lat`, `lon`, `vulnerabilityFactor`, `nearestStation` |
| **Risk State** | `RISK_STATE#{date}` | `RECEPTOR#{receptor_id}` | `RISK_LEVEL#{level}` | `exposureScore`, `riskLevel`, `breakdown`, `drivers` |
| **GRAP State** | `GRAP_EVAL#{date}` | `STAGE#{stage}` | `GRAP_STATE` | `stageNumber`, `triggers`, `mandatoryActions` |
| **Simulation Run** | `SIMULATION#{scenario_id}`| `RUN#{timestamp}` | `SCENARIO` | `interventions`, `deltaExposure`, `beforeMetrics`, `afterMetrics` |

---

## 5. Live Verified Data Provenance — No Fake Data Policy

GRAP SHIELD strictly enforces **zero data fabrication**:
- **Never uses `Math.random()`, fake, mock, demo data, or hardcoded sensor measurements.**
- Primary verified provider: **Open-Meteo Air Quality API** (incorporating European Centre for Medium-Range Weather Forecasts ECMWF and Copernicus Atmosphere Monitoring Service CAMS) combined with meteorological wind and planetary boundary layer variables.
- Statutory baseline: **Central Pollution Control Board (CPCB) NAQI formulations** and **Commission for Air Quality Management (CAQM)** statutory gazettes.
- If upstream sources become unreachable, the platform reports: **`Source temporarily unavailable`** rather than generating fake numbers.

---

## 6. The Signature Feature: BEFORE → INTERVENTION → AFTER

When a user selects an intervention or combination of interventions, the deterministic scenario engine calculates:

$$\Delta\text{Exposure} = \text{Exposure}_{\text{Simulated}} - \text{Exposure}_{\text{Baseline}}$$

### Supported Interventions:
1. **Traffic Diversion**: Reroutes commercial vehicles to Eastern/Western Peripheral Expressways. Lowers near-road particulate tailpipe emissions by 18-24%.
2. **Heavy Vehicle Restriction**: Ban on non-BS-VI diesel freight trucks entering Delhi. Lowers corridor diesel exhaust particulates by 32%.
3. **Construction Dust Control**: Mandates 40m anti-smog guns and wind-breaker screens. Suppresses fugitive PM10 by 35% within 1.5 km perimeter.
4. **Green Buffer & Mist Cannons**: Multi-tier vegetative buffer strips with fine mist cannons. Reduces localized ambient PM2.5 by 16-22%.
5. **School Outdoor Timing Shift**: Reschedules assemblies and physical sports past morning inversion hours. Yields a 45% reduction in pediatric inhalation exposure.

*Statutory Notice: All scenario projections are clearly labeled **"SCENARIO SIMULATION — NOT A MEASURED FUTURE VALUE"**.*

---

## 7. Local Development & Deployment

### Prerequisites
- Node.js 20.x or higher
- npm or bun

### Setup
```bash
# Clone and install dependencies
npm install

# Start full-stack development server (Express + Vite middlewares)
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

### AWS SAM Deployment
```bash
# Build SAM artifacts
sam build

# Deploy to AWS Mumbai (ap-south-1)
sam deploy --guided --stack-name grap-shield-prod --region ap-south-1
```

---

## 8. License
Apache-2.0
