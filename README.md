# 🛡️ GRAP Shield

### AWS-Powered Multi-City Air Quality Intelligence & GRAP Monitoring Platform

> Turning environmental observations into actionable pollution-response intelligence.

---

## 🌍 Overview

**GRAP Shield** is a full-stack, AWS-deployed air-quality intelligence platform designed to help users understand pollution conditions across multiple cities and identify the applicable **Graded Response Action Plan (GRAP)** stage.

Unlike a conventional AQI dashboard, GRAP Shield focuses on connecting environmental observations with **GRAP-based response awareness**, helping users understand not only *what the air quality is*, but also *what regulatory response stage may apply*.

The platform presents air-quality and environmental observations through an interactive dashboard while maintaining transparency around data availability and provenance.

---

## 🎯 Problem

Air-quality dashboards often provide numbers without enough context.

Users may see an AQI or pollutant value but still have questions:

- What does the current pollution level mean?
- Which GRAP stage is applicable?
- What environmental conditions are contributing to the situation?
- Where did the observation come from?
- Is the data actually available or temporarily unavailable?

**GRAP Shield addresses this gap by connecting environmental observations with GRAP-stage intelligence and clear data-status information.**

---

## 💡 Solution

GRAP Shield provides a centralized platform for:

**Environmental Observations → Pollution Analysis → GRAP Evaluation → Actionable Intelligence**

The system processes available observations and presents them through a modern web dashboard designed for quick understanding and decision support.

---

## 🚀 Key Features

### 🌍 Multi-City Monitoring
Monitor air-quality conditions across supported cities from a single platform.

### 📊 Pollution Intelligence
View important pollutant measurements including:

- PM2.5
- PM10
- NO₂
- SO₂
- CO
- O₃

### 🌦️ Environmental Conditions
Supporting environmental observations can include:

- Temperature
- Humidity
- Wind speed
- Wind direction
- Atmospheric pressure

### 🚨 GRAP Stage Monitoring
GRAP Shield evaluates available air-quality observations against the configured GRAP logic and displays the applicable response stage.

### 🔎 Data Transparency
The platform emphasizes data provenance and availability.

When an observation is unavailable, the system can communicate its unavailable status instead of presenting unsupported information as verified live data.

### 📈 Interactive Dashboard
A modern dashboard provides:

- Air-quality overview
- Pollutant information
- GRAP status
- Environmental conditions
- City-level information
- Data-status indicators

---

## 🏗️ Architecture

```text
                 ┌──────────────────────┐
                 │   Environmental      │
                 │   Data Sources       │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   GRAP Shield        │
                 │   Backend Engine     │
                 │   Node.js / Express  │
                 └──────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
       ┌─────────────────┐    ┌─────────────────┐
       │ Air Quality     │    │ GRAP Evaluation │
       │ Processing      │    │ & Logic         │
       └────────┬────────┘    └────────┬────────┘
                │                      │
                └──────────┬───────────┘
                           ▼
                 ┌──────────────────────┐
                 │   React Dashboard    │
                 │   TypeScript + Vite  │
                 └──────────┬───────────┘
                            │
                            ▼
                       👤 User
