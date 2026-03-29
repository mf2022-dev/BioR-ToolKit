# BioR GeoIntel Engine - Architecture & Implementation Plan

**Document Version**: 1.0
**Date**: 2026-03-18
**Author**: BioR Development Team
**Status**: Planning Phase

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Vision & Strategic Objective](#2-vision--strategic-objective)
3. [Current State Analysis](#3-current-state-analysis)
4. [Architecture Design](#4-architecture-design)
5. [Data Layer Architecture (Layer-upon-Layer Model)](#5-data-layer-architecture)
6. [Technology Stack Selection](#6-technology-stack-selection)
7. [Data Sources Catalogue](#7-data-sources-catalogue)
8. [Data Model & Schema Design](#8-data-model--schema-design)
9. [Implementation Phases](#9-implementation-phases)
10. [Integration Points with BioR](#10-integration-points-with-bior)
11. [Performance & Scalability](#11-performance--scalability)
12. [Security Considerations](#12-security-considerations)
13. [Future Strategic Integrations](#13-future-strategic-integrations)
14. [Risk Assessment](#14-risk-assessment)
15. [Budget & Resource Estimate](#15-budget--resource-estimate)
16. [Success Metrics](#16-success-metrics)

---

## 1. Executive Summary

The BioR GeoIntel Engine transforms the BioR platform from a **static benchmark evaluator** into an **operational geospatial intelligence system** for biosurveillance. By layering multiple data sources onto interactive 2D/3D maps, it provides decision-makers with a visual understanding of global biosurveillance infrastructure, threat landscapes, and capability gaps.

**Core Proposition**: Layer-upon-layer geospatial intelligence -- from base cartography through infrastructure, surveillance networks, epidemiological data, genomic tracking, CBRN monitoring, environmental intelligence, and policy readiness -- all toggleable and zoomable from global to national to facility level.

---

## 2. Vision & Strategic Objective

### 2.1 Vision Statement
> Build the world's first open-source, multi-layered geospatial intelligence engine specifically designed for biosurveillance ecosystem mapping, biological threat tracking, and health security readiness assessment.

### 2.2 Strategic Objectives

| # | Objective | Measure |
|---|-----------|---------|
| SO-1 | Visualise all 189 PSEF platforms on an interactive globe | 100% platform coverage with geocoded coordinates |
| SO-2 | Enable multi-layer data overlay | Minimum 10 toggleable data layers |
| SO-3 | Support zoom levels from global to facility | 3 resolution tiers: Global > Regional > National |
| SO-4 | Integrate real-time open data feeds | Minimum 5 live data sources |
| SO-5 | Provide decision-support views | Coverage gap analysis, threat proximity, readiness scoring |
| SO-6 | Maintain zero-cost base operation | All Phase 1 features use free/open-source tools |

### 2.3 Target Users

| User Type | Primary Use Case |
|-----------|-----------------|
| **Policy Makers** | Health security readiness assessment, gap analysis |
| **Biosurveillance Analysts** | Platform distribution, coverage mapping, threat proximity |
| **Military/CBRN Operators** | CBRN sensor network mapping, defence coverage zones |
| **Researchers** | Genomic surveillance network analysis, outbreak tracking |
| **Public Health Officials** | Disease outbreak spatial awareness, resource allocation |

---

## 3. Current State Analysis

### 3.1 BioR Platform (v8.2) - What Exists

| Component | Status | Details |
|-----------|--------|---------|
| PSEF Benchmark | Active | 189 platforms, 50 deep profiles, 6 layers, 10 dimensions |
| Platform Data | Rich | Name, URL, score, category, description, operator, tech stack, profile |
| Geographic Data | **Missing** | No lat/lng coordinates in current data model |
| Operator Info | Partial | Text-based operator field with city/country mentions |
| Navigation | 10 views | About, Overview, Layers(6), Profiles, Comparison, CBRN, All Platforms, Ecosystem |
| Tech Stack | Cloudflare | Hono + Vite + D1 + TypeScript, deployed to Cloudflare Pages |
| File Size | ~451KB | Main script (4,953 lines), benchmark JSON (~300KB) |

### 3.2 What Needs to Be Built

```
CURRENT STATE                          TARGET STATE
-----------------                      ------------------
Static platform list     --------->    Interactive globe with 189 pins
Text-based profiles      --------->    Clickable map markers with popups
Layer taxonomy (6)       --------->    6 visual map layers (colour-coded)
No geographic data       --------->    Full geocoding (lat/lng/country/region)
No threat tracking       --------->    WHO outbreak overlay
No infrastructure view   --------->    BSL-4 labs, CTBTO stations overlay
No readiness scoring     --------->    GHS Index choropleth map
No environmental data    --------->    EURDEP radiation, Safecast overlay
No temporal dimension    --------->    Time slider for historical view
```

---

## 4. Architecture Design

### 4.1 High-Level Architecture

```
+-----------------------------------------------------------------------+
|                         BioR GeoIntel Engine                           |
+-----------------------------------------------------------------------+
|                                                                       |
|  +-------------------+  +-------------------+  +-------------------+  |
|  |   VIEW LAYER      |  |   CONTROL LAYER   |  |   DATA LAYER     |  |
|  |                   |  |                   |  |                   |  |
|  | Globe.gl (3D)     |  | Layer Toggle UI   |  | GeoJSON Store    |  |
|  | MapLibre GL (2D)  |  | Search/Filter     |  | Platform Geocode |  |
|  | deck.gl (Heatmap) |  | Time Slider       |  | External APIs    |  |
|  | D3.js (Charts)    |  | Zoom Controls     |  | Static Datasets  |  |
|  +-------------------+  +-------------------+  +-------------------+  |
|                                                                       |
+-------------------------------|---------------------------------------+
                                |
                    +-----------+-----------+
                    |  EXISTING BioR v8.2   |
                    |  (Hono + Cloudflare)  |
                    +-----------------------+
```

### 4.2 Component Architecture

```
BioR GeoIntel Tab (new PSEF Benchmark view)
|
+-- Map Container
|   +-- Base Map Layer (MapLibre GL JS + OpenStreetMap/MapTiler)
|   +-- Globe View Toggle (Globe.gl for 3D globe mode)
|   +-- Layer Engine (deck.gl for GPU-accelerated overlays)
|   |   +-- Layer 01: Platform Locations (189 PSEF platforms)
|   |   +-- Layer 02: BSL-4/BSL-3 Laboratories
|   |   +-- Layer 03: CTBTO IMS Monitoring Stations
|   |   +-- Layer 04: WHO Disease Outbreaks (live)
|   |   +-- Layer 05: GHS Index Choropleth (195 countries)
|   |   +-- Layer 06: CBRN Sensor Networks
|   |   +-- Layer 07: Genomic Surveillance Coverage
|   |   +-- Layer 08: Environmental Monitoring (Radiation)
|   |   +-- Layer 09: Population Density Heatmap
|   |   +-- Layer 10: Policy Readiness Zones
|   +-- Controls Overlay
|       +-- Layer Toggle Panel (checkboxes)
|       +-- Search Bar
|       +-- Legend
|       +-- Time Slider (for temporal data)
|       +-- Resolution Selector (Global/Regional/National)
|
+-- Detail Panel (sidebar)
|   +-- Platform Detail Card (on click)
|   +-- Region Summary (on area select)
|   +-- Layer Statistics
|
+-- Analytics Panel (bottom)
    +-- Coverage Gap Analysis
    +-- Threat Proximity Calculator
    +-- Layer Correlation Matrix
```

### 4.3 View Modes

| Mode | Library | Use Case |
|------|---------|----------|
| **2D Map** | MapLibre GL JS | Default view - detailed analysis, measurement |
| **3D Globe** | Globe.gl | Presentation mode - global overview, arcs |
| **Satellite** | MapLibre + Satellite tiles | Infrastructure verification |
| **Heatmap** | deck.gl HeatmapLayer | Density analysis, coverage gaps |

---

## 5. Data Layer Architecture (Layer-upon-Layer Model)

### 5.1 The 10-Layer Stack

Each layer is independently toggleable, with adjustable opacity, and can be combined for multi-dimensional analysis.

```
LAYER 10: Policy & Readiness          [Choropleth - GHS Index scores]
  |
LAYER 09: Population & Demographics   [Heatmap - population density]
  |
LAYER 08: Environmental Monitoring    [Points - EURDEP, Safecast, air quality]
  |
LAYER 07: Genomic Coverage            [Polygons - sequencing lab coverage zones]
  |
LAYER 06: CBRN Infrastructure         [Icons - sensors, detectors, response teams]
  |
LAYER 05: Active Threats/Outbreaks    [Pulsing dots - WHO DONs, ProMED alerts]
  |
LAYER 04: Surveillance Networks       [Lines/Arcs - data flow connections]
  |
LAYER 03: Laboratory Infrastructure   [Points - BSL-4/3 labs worldwide]
  |
LAYER 02: Platform Locations          [Pins - 189 PSEF platforms, colour by layer]
  |
LAYER 01: Base Cartography            [Tiles - OpenStreetMap/MapTiler base map]
  |
[Earth Surface]
```

### 5.2 Layer Detail Specifications

#### Layer 01: Base Cartography (Always On)
- **Source**: OpenStreetMap via MapLibre GL JS
- **Style**: Dark mode (matching BioR theme)
- **Features**: Country borders, major cities, terrain
- **Zoom Range**: 1-18
- **Cost**: FREE (OpenStreetMap)

#### Layer 02: PSEF Platform Locations
- **Data**: 189 platforms from benchmark-data.json (geocoded)
- **Visualisation**: Colour-coded pins by PSEF layer
  - L1 Surveillance: Green (#22c55e)
  - L2 Genomic: Cyan (#38bdf8)
  - L3 Defence: Red (#ef4444)
  - L4a CBRN: Amber (#f59e0b)
  - L4b Hardware: Purple (#8b5cf6)
  - L5 Policy: Pink (#ec4899)
- **Interaction**: Click for popup with platform profile
- **Clustering**: Auto-cluster at low zoom levels
- **Source**: Static (from existing BioR data + geocoding)
- **Cost**: FREE

#### Layer 03: Laboratory Infrastructure
- **Data**: ~110 BSL-4 labs, 3,000+ BSL-3 labs worldwide
- **Source**: Global BioLabs (globalbiolabs.org) - public data
- **Visualisation**: Biohazard icons, sized by BSL level
- **Interaction**: Click for lab name, country, BSL level, biorisk score
- **Cost**: FREE (public domain research data)

#### Layer 04: Surveillance Network Connections
- **Data**: Ecosystem connections from PSEF benchmark
- **Visualisation**: Arcs between connected platforms (3D globe), lines (2D map)
- **Colour**: By connection strength/type
- **Source**: Static (from existing benchmark data)
- **Cost**: FREE

#### Layer 05: Active Threats & Outbreaks
- **Data**: WHO Disease Outbreak News (DONs)
- **Source**: WHO REST API (`/api/news/outbreaks`)
- **Visualisation**: Pulsing red dots for active outbreaks, sized by severity
- **Update Frequency**: Daily (cached on Cloudflare KV)
- **Additional Sources**: ProMED-mail, EIOS (if API available)
- **Cost**: FREE (public WHO API)

#### Layer 06: CBRN Monitoring Infrastructure
- **Data**: CTBTO IMS stations (337 facilities)
- **Source**: CTBTO public station list + coordinates
- **Visualisation**: Distinct icons per station type:
  - Seismic (50 primary + 120 auxiliary)
  - Hydroacoustic (11 stations)
  - Infrasound (60 stations)
  - Radionuclide (80 stations + 16 labs)
- **Additional**: BioFire Defence deployed locations (from PSEF data)
- **Cost**: FREE (public data)

#### Layer 07: Genomic Surveillance Coverage
- **Data**: GISAID submission density by country
- **Visualisation**: Choropleth (countries shaded by sequencing submissions)
- **Source**: GISAID metadata summary (public), PulseNet coverage
- **Resolution**: Country-level
- **Cost**: FREE (public metadata)

#### Layer 08: Environmental Monitoring
- **Data**: 
  - EURDEP radiation monitoring (5,500+ stations in Europe)
  - Safecast radiation data (global community network)
  - Air quality index (OpenAQ)
- **Visualisation**: Coloured dots (green-yellow-red gradient)
- **Update**: Hourly for radiation, daily for air quality
- **Cost**: FREE (all open data)

#### Layer 09: Population & Demographics
- **Data**: WorldPop / Natural Earth population density
- **Visualisation**: Heatmap overlay
- **Use**: Correlate surveillance coverage with population density
- **Resolution**: ~1km grid cells
- **Cost**: FREE (public datasets)

#### Layer 10: Policy & Health Security Readiness
- **Data**: GHS Index (195 countries, 6 categories, 37 indicators)
- **Source**: ghsindex.org (open-source data)
- **Visualisation**: Country choropleth map
- **Categories**: 
  1. Prevention
  2. Detection & Reporting
  3. Rapid Response
  4. Health System
  5. Compliance with International Norms
  6. Risk Environment
- **Interaction**: Click country for detailed breakdown
- **Cost**: FREE (open data)

### 5.3 Resolution Tiers

| Tier | Zoom Level | View | Layers Active |
|------|-----------|------|---------------|
| **Global** | 1-3 | Whole earth | Country choropleths, clustered platforms, arcs |
| **Regional** | 4-7 | Continent/subregion | Individual platforms, lab locations, outbreak zones |
| **National** | 8-12 | Country/state | Facility-level detail, sensor positions, detailed popups |
| **Local** | 13-18 | City/facility | Satellite imagery, individual buildings (future) |

---

## 6. Technology Stack Selection

### 6.1 Core Libraries (All Free / Open-Source)

| Library | Version | Purpose | Size | CDN |
|---------|---------|---------|------|-----|
| **MapLibre GL JS** | v5.x | 2D interactive map rendering | ~200KB gzipped | jsdelivr |
| **Globe.gl** | v2.x | 3D globe visualisation | ~150KB gzipped | jsdelivr |
| **deck.gl** | v9.x | GPU-accelerated data layers | ~300KB gzipped | jsdelivr |
| **Turf.js** | v7.x | Geospatial analysis (distance, area, intersect) | ~85KB gzipped | jsdelivr |
| **D3.js** | v7.x | Data-driven charts (already considered) | ~90KB gzipped | jsdelivr |

### 6.2 CDN URLs

```html
<!-- MapLibre GL JS -->
<link href="https://cdn.jsdelivr.net/npm/maplibre-gl@5/dist/maplibre-gl.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/maplibre-gl@5/dist/maplibre-gl.min.js"></script>

<!-- Globe.gl (3D Globe) -->
<script src="https://cdn.jsdelivr.net/npm/globe.gl@2"></script>

<!-- deck.gl (GPU Layers) -->
<script src="https://cdn.jsdelivr.net/npm/deck.gl@9/dist.min.js"></script>

<!-- Turf.js (Geospatial Analysis) -->
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>
```

### 6.3 Base Map Tile Sources (Free Options)

| Provider | Free Tier | Style | Best For |
|----------|-----------|-------|----------|
| **OpenStreetMap** | Unlimited | Standard | Default base map |
| **Stadia Maps** | 200K tiles/month | Dark/Light/Satellite | Dark mode (matches BioR) |
| **MapTiler** | 100K tiles/month | Vector + Satellite | High-quality vector tiles |
| **CARTO** | 75K tiles/month | Dark Matter / Positron | Analytics-focused dark style |
| **Natural Earth** | Unlimited (static) | Vector GeoJSON | Offline country boundaries |

### 6.4 Why This Stack (Decision Rationale)

```
Requirement                     | Solution
-------------------------------|----------------------------------
Free / No API key required     | MapLibre + OpenStreetMap (not Google Maps)
3D globe for presentations     | Globe.gl (Three.js wrapper, free)
Handle 189+ data points fast   | deck.gl (GPU-accelerated WebGL)
Dark theme matching BioR       | Stadia/CARTO dark tiles or custom style
Works in Cloudflare Workers    | All client-side (CDN libraries)
No Node.js runtime needed      | Pure browser JavaScript
Mobile-responsive              | MapLibre responsive by default
Offline capable (static data)  | GeoJSON files in public/static/
```

---

## 7. Data Sources Catalogue

### 7.1 Confirmed Free Data Sources

| # | Source | Type | Format | Update | URL | Status |
|---|--------|------|--------|--------|-----|--------|
| 1 | **Natural Earth** | Country boundaries | GeoJSON | Static | naturalearthdata.com | Public domain |
| 2 | **WHO GHO** | Health indicators | JSON/CSV | Quarterly | who.int/data/gho | Free API |
| 3 | **WHO Outbreaks API** | Disease outbreaks | JSON | Daily | who.int/api/news/outbreaks | Free REST API |
| 4 | **GHS Index** | Health security scores | CSV | Biennial | ghsindex.org | Open data |
| 5 | **Global BioLabs** | BSL-4/3 lab locations | Web scrape | Annual | globalbiolabs.org/map | Public research |
| 6 | **CTBTO IMS** | Nuclear monitoring stations | PDF/Map | Static | ctbto.org/ims-map | Public info |
| 7 | **GISAID** | Genomic submissions | Metadata | Monthly | gisaid.org | Registration |
| 8 | **OpenAQ** | Air quality monitoring | JSON | Hourly | openaq.org | Free API |
| 9 | **EURDEP** | Radiation monitoring (EU) | JSON | Hourly | eurdep.jrc.ec.europa.eu | Free API |
| 10 | **Safecast** | Radiation (global) | GeoJSON | Real-time | safecast.org | CC0 |
| 11 | **HDX** | Humanitarian datasets | Various | Varied | data.humdata.org | Open data |
| 12 | **WorldPop** | Population density | GeoTIFF | Annual | worldpop.org | Open access |
| 13 | **ProMED** | Disease alerts | RSS/Text | Real-time | promedmail.org | Free |
| 14 | **NNDSS** | US notifiable diseases | CSV | Weekly | data.cdc.gov | Free |
| 15 | **JRC EIOS** | Epidemic intelligence | API | Real-time | data.jrc.ec.europa.eu | Research access |

### 7.2 Data Acquisition Priority

```
IMMEDIATE (Phase 1 - Static/Pre-compiled)
  +-- Natural Earth country GeoJSON (boundaries)
  +-- PSEF 189 platform geocoded coordinates
  +-- GHS Index country scores (pre-compiled)
  +-- BSL-4 laboratory list (pre-compiled from research papers)
  +-- CTBTO IMS station coordinates (pre-compiled from public list)

SHORT-TERM (Phase 2 - API Integration)
  +-- WHO Outbreaks REST API (live)
  +-- OpenAQ air quality API (live)
  +-- EURDEP radiation API (live)

MEDIUM-TERM (Phase 3 - Research Access)
  +-- Google Earth Engine (apply for research access)
  +-- GISAID metadata API (requires registration)
  +-- EIOS epidemic intelligence (requires partnership)

LONG-TERM (Phase 4 - Strategic Partnerships)
  +-- Google Earth AI / PDFM / TimesFM
  +-- NATO CBRN data feeds
  +-- WHO Hub for Pandemic Intelligence
```

---

## 8. Data Model & Schema Design

### 8.1 Platform Geocoding Schema

Add new fields to each platform in `benchmark-data.json`:

```json
{
  "r": 1,
  "n": "Nextstrain",
  "l": "L2_Genomic",
  "s": 95,
  "geo": {
    "hq": {
      "lat": 47.6062,
      "lng": -122.3321,
      "city": "Seattle",
      "country": "US",
      "country_name": "United States"
    },
    "secondary": [
      {
        "lat": 47.5596,
        "lng": 7.5886,
        "city": "Basel",
        "country": "CH",
        "country_name": "Switzerland"
      }
    ],
    "coverage_scope": "global",
    "region": "North America",
    "coverage_countries": ["US", "GB", "DE", "AU", "JP", "..."]
  },
  "...existing fields..."
}
```

### 8.2 GeoJSON Layer Schemas

#### a) Platform Points Layer (`geointel-platforms.json`)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.3321, 47.6062]
      },
      "properties": {
        "id": "nextstrain",
        "name": "Nextstrain",
        "layer": "L2_Genomic",
        "score": 95,
        "military": false,
        "operator": "Fred Hutchinson Cancer Center",
        "country": "US",
        "scope": "global",
        "color": "#38bdf8"
      }
    }
  ]
}
```

#### b) Laboratory Layer (`geointel-bsl4-labs.json`)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-84.3880, 33.7490]
      },
      "properties": {
        "name": "CDC - Centers for Disease Control",
        "level": "BSL-4",
        "country": "US",
        "city": "Atlanta, Georgia",
        "operator": "US Government (CDC)",
        "focus": "Ebola, Marburg, Smallpox",
        "biorisk_score": 87
      }
    }
  ]
}
```

#### c) CTBTO Stations Layer (`geointel-ctbto.json`)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [16.3738, 48.2082]
      },
      "properties": {
        "station_id": "PS01",
        "name": "CTBTO Vienna Lab",
        "type": "radionuclide",
        "country": "AT",
        "status": "operational"
      }
    }
  ]
}
```

#### d) GHS Index Choropleth (`geointel-ghs-index.json`)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "...country polygon..." },
      "properties": {
        "iso_a3": "USA",
        "name": "United States",
        "ghs_overall": 75.9,
        "ghs_prevention": 83.1,
        "ghs_detection": 98.2,
        "ghs_response": 79.7,
        "ghs_health_system": 73.8,
        "ghs_compliance": 85.3,
        "ghs_risk_environment": 69.9,
        "ghs_rank": 1,
        "platforms_count": 42,
        "bsl4_count": 13
      }
    }
  ]
}
```

### 8.3 Relationship Schema

```
Country
  |-- has_many --> Platforms (via geo.hq.country)
  |-- has_many --> BSL4_Labs
  |-- has_many --> CTBTO_Stations
  |-- has_one  --> GHS_Score
  |-- has_many --> Active_Outbreaks (live)
  |-- has_many --> Env_Monitors

Platform
  |-- belongs_to --> Country (HQ)
  |-- has_many   --> Secondary_Locations
  |-- has_many   --> Ecosystem_Connections (arcs)
  |-- belongs_to --> PSEF_Layer (L1-L5)
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2) - "The Map Comes Alive"

**Goal**: Deliver a working GeoIntel tab showing 189 platforms on an interactive map.

**Deliverables**:
1. Geocode all 189 platforms (lat/lng from operator text)
2. Create `public/static/geointel/` data directory
3. Build GeoIntel tab UI in PSEF Benchmark
4. Implement 2D map with MapLibre GL JS
5. Add platform pins (colour-coded by layer)
6. Click-to-detail popups
7. Clustering at low zoom levels
8. Layer toggle panel (show/hide by PSEF layer)
9. Search functionality on the map
10. Dark mode styling (matching BioR theme)

**Data Files Created**:
- `geointel-platforms.json` (189 geocoded platforms)
- Updated `benchmark-data.json` with `geo` field

**Dependencies**: None (all free libraries)

**Estimated Effort**: 3-4 development sessions

---

### Phase 2: Infrastructure Layers (Week 3-4) - "See the Network"

**Goal**: Add laboratory and monitoring infrastructure layers.

**Deliverables**:
1. BSL-4 laboratory locations layer (~110 labs, 34 countries)
2. CTBTO IMS stations layer (337 facilities, 4 types)
3. GHS Index choropleth layer (195 countries)
4. Ecosystem connection arcs (from existing PSEF data)
5. Layer opacity controls
6. Legend panel
7. Statistics panel (per-layer counts, coverage %)
8. 3D Globe view toggle (Globe.gl)

**Data Files Created**:
- `geointel-bsl4-labs.json`
- `geointel-ctbto.json`
- `geointel-ghs-index.json`
- `geointel-connections.json`

**Dependencies**: Phase 1 complete

**Estimated Effort**: 3-4 development sessions

---

### Phase 3: Live Data Integration (Week 5-6) - "Real-Time Intelligence"

**Goal**: Connect live data feeds for outbreak tracking and environmental monitoring.

**Deliverables**:
1. WHO Outbreaks API integration (live pulsing dots)
2. Caching layer (Cloudflare KV for API responses)
3. Time slider for temporal navigation
4. Environmental monitoring layer (radiation, air quality)
5. Heatmap mode (deck.gl) for density analysis
6. Coverage gap analysis tool
7. Export/screenshot functionality

**Data Sources Integrated**:
- WHO REST API (live)
- OpenAQ (live, optional)
- EURDEP (live, optional)

**Dependencies**: Phase 2 complete, Cloudflare KV namespace

**Estimated Effort**: 4-5 development sessions

---

### Phase 4: Advanced Analytics (Week 7-8) - "Intelligence Products"

**Goal**: Transform raw map data into actionable intelligence.

**Deliverables**:
1. Threat proximity calculator (distance from outbreak to nearest sensor)
2. Coverage gap analysis (areas with population but no surveillance)
3. Country profile view (click country for full biosecurity summary)
4. Region comparison mode (NATO, EU, Asia-Pacific, Africa, Americas)
5. Multi-layer correlation analysis
6. Printable/exportable intelligence reports
7. Mobile-optimised responsive layout

**Dependencies**: Phase 3 complete

**Estimated Effort**: 3-4 development sessions

---

### Phase 5: Strategic Expansion (Month 3+) - "Next-Gen Intelligence"

**Goal**: Integrate advanced AI and partnership-based data sources.

**Potential Deliverables**:
1. Google Earth Engine integration (if research access approved)
2. TimesFM integration for outbreak prediction (open-source)
3. Satellite imagery overlay (if MapTiler/Planet API available)
4. GISAID genomic density mapping (if registered)
5. NATO CBRN data integration (if partnership established)
6. WHO Hub for Pandemic Intelligence connection
7. Google Earth AI / PDFM integration (if partner access granted)

**Dependencies**: Partnership applications, API keys, research access

---

## 10. Integration Points with BioR

### 10.1 Navigation Integration

The GeoIntel view will be added as a new tab in the PSEF Benchmark navigation bar:

```
Existing Tabs:
[About PSEF] [Overview] [Layers v] [Profiles] [Comparison] [CBRN] [All 189] [Ecosystem]

New Tab Added:
[About PSEF] [Overview] [Layers v] [GeoIntel] [Profiles] [Comparison] [CBRN] [All 189] [Ecosystem]
                                     ^^^^^^^^
                                    NEW TAB
```

### 10.2 Cross-View Linking

- **Platform Profiles --> GeoIntel**: "Show on Map" button in each profile
- **GeoIntel --> Platform Detail**: Click platform pin to open detail modal
- **Layer Views --> GeoIntel**: "View on Map" button in layer statistics
- **CBRN View --> GeoIntel**: "CBRN Coverage Map" button
- **All Platforms --> GeoIntel**: "Map View" toggle button

### 10.3 Code Integration

```typescript
// New view case in bmShowView():
case 'geointel': main.innerHTML = bmRenderGeoIntel(); bmInitGeoIntel(); break;

// New tab in navigation:
'<button class="bm-tab" data-bmview="geointel" onclick="bmShowView(\'geointel\')">' +
  '<i class="fas fa-globe-americas" style="margin-right:4px"></i>GeoIntel</button>'

// New function structure:
function bmRenderGeoIntel() { /* Returns HTML shell with map container */ }
function bmInitGeoIntel() { /* Initializes MapLibre, loads layers, binds events */ }
function bmLoadGeoLayer(layerName) { /* Loads/toggles individual layers */ }
function bmGeoSearch(query) { /* Searches platforms/locations on map */ }
function bmGeoPopup(platformName) { /* Shows detail popup on map */ }
```

### 10.4 Data Flow

```
benchmark-data.json (existing)
  |
  +--[geocoding]---> geointel-platforms.json (new)
  |
  +--[static compile]---> geointel-bsl4-labs.json (new)
  |                       geointel-ctbto.json (new)
  |                       geointel-ghs-index.json (new)
  |
  +--[API fetch]--------> WHO Outbreaks (live, cached in KV)
                          OpenAQ (live, cached in KV)
```

---

## 11. Performance & Scalability

### 11.1 Client-Side Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial map load | < 2 seconds | Lazy-load libraries, minimal initial data |
| Layer toggle | < 200ms | Pre-loaded GeoJSON, GPU rendering via deck.gl |
| 189 platform pins | 60fps | WebGL rendering, clustering at low zoom |
| Choropleth (195 countries) | 60fps | Simplified GeoJSON (110m Natural Earth) |
| 3D globe rotation | 60fps | Globe.gl Three.js rendering |

### 11.2 Data Size Budget

| Dataset | Estimated Size | Strategy |
|---------|---------------|----------|
| Platform GeoJSON | ~50KB | Inline with benchmark data |
| Country boundaries (110m) | ~250KB | Simplified Natural Earth |
| BSL-4 labs | ~15KB | Minimal GeoJSON |
| CTBTO stations | ~20KB | Minimal GeoJSON |
| GHS Index + boundaries | ~300KB | Combined choropleth data |
| CDN libraries | ~800KB | Loaded from CDN, browser cached |
| **Total additional** | **~1.4MB** | Acceptable for broadband |

### 11.3 Caching Strategy

```
Browser Cache:
  - CDN libraries (MapLibre, Globe.gl, deck.gl) - 7 day cache
  - Static GeoJSON files - 1 day cache
  - Country boundaries - 30 day cache (rarely change)

Cloudflare KV (for live data):
  - WHO Outbreaks - TTL: 1 hour
  - OpenAQ readings - TTL: 30 minutes
  - EURDEP radiation - TTL: 1 hour

Cloudflare Edge Cache:
  - API proxy responses - 5 minute cache
  - Static assets - 1 year (with hash busting)
```

---

## 12. Security Considerations

| Risk | Mitigation |
|------|-----------|
| API key exposure | No API keys needed for Phase 1-2 (all free/public data) |
| Data integrity | All static GeoJSON files validated at build time |
| XSS via popups | Sanitise all platform data before rendering in popups |
| Tile server abuse | Use Cloudflare CDN caching to reduce upstream requests |
| Sensitive locations | BSL-4 data is already published research (not classified) |
| CTBTO station data | Only public station list (not detection data) |
| Live API abuse | Rate limiting via Cloudflare KV + edge caching |

---

## 13. Future Strategic Integrations

### 13.1 Google Earth AI Ecosystem (Announced March 13, 2026)

| Component | Function | Access Level | BioR Use Case |
|-----------|----------|-------------|---------------|
| **Google Earth AI** | Planet-scale intelligence | Partner access | Satellite-based outbreak detection |
| **PDFM** | Population dynamics modelling | Research API | Population movement during outbreaks |
| **TimesFM** | Time-series forecasting | Open-source (GitHub) | Cholera/dengue prediction (+35% accuracy) |
| **AlphaEarth** | Satellite image embeddings | Research access | High-res infrastructure mapping |
| **Earth Engine** | Geospatial processing | Free for research | Environmental data processing |
| **3D Tiles API** | Photorealistic 3D | Developer API ($) | Immersive decision-maker presentations |

### 13.2 Integration Roadmap

```
2026 Q2: Apply for Google Earth Engine research access
2026 Q3: Integrate TimesFM for outbreak prediction (open-source)
2026 Q4: Apply for Google Earth AI partnership
2027 Q1: PDFM integration for population modelling
2027 Q2: Full Google Earth AI integration
```

### 13.3 Other Strategic Partnerships

| Organisation | Data/Capability | Contact Point |
|-------------|----------------|---------------|
| WHO Hub (Berlin) | Pandemic intelligence | Partnership programme |
| ECDC | TESSy surveillance data | Data sharing agreement |
| NATO CBRN CoE | Military threat data | NATO partnership |
| CTBTO | Real-time detection data | Scientific cooperation |
| Africa CDC | Continental surveillance | Technical cooperation |

---

## 14. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| MapLibre tile quota exceeded | Map tiles stop loading | Low | Multiple tile providers as fallback |
| Geocoding errors | Incorrect platform placement | Medium | Manual verification of all 189 coordinates |
| WHO API changes | Outbreak layer breaks | Medium | Cache last known data, fallback to static |
| Bundle size too large | Slow page load | Medium | Lazy-load map libraries only when GeoIntel tab opened |
| Browser WebGL not supported | Map won't render | Low | Fallback to static map image |
| Data staleness | Outdated outbreak info | Medium | Clear TTL indicators, last-updated timestamps |
| Scope creep | Never-ending Phase 5 | High | Strict phase boundaries, MVP-first approach |

---

## 15. Budget & Resource Estimate

### 15.1 Phase 1-2 (Zero Cost)

| Item | Cost |
|------|------|
| MapLibre GL JS | FREE (open-source) |
| Globe.gl | FREE (open-source) |
| deck.gl | FREE (open-source) |
| OpenStreetMap tiles | FREE (fair use) |
| Natural Earth data | FREE (public domain) |
| GHS Index data | FREE (open data) |
| BSL-4 lab data | FREE (published research) |
| CTBTO station data | FREE (public information) |
| Development effort | Self-funded |
| **Total Phase 1-2** | **$0** |

### 15.2 Phase 3 (Minimal Cost)

| Item | Cost |
|------|------|
| Cloudflare KV (caching) | FREE tier (100K reads/day) |
| WHO API | FREE |
| OpenAQ API | FREE |
| MapTiler tiles (optional upgrade) | FREE tier (100K tiles/month) |
| **Total Phase 3** | **$0** (within free tiers) |

### 15.3 Phase 4-5 (Optional Paid)

| Item | Cost |
|------|------|
| Google Maps 3D Tiles | ~$200/month free credit |
| MapTiler paid tier | ~$25/month |
| Google Earth Engine | FREE for research |
| **Total Phase 4-5** | **$0-225/month** |

---

## 16. Success Metrics

### 16.1 Phase 1 Completion Criteria

- [ ] All 189 platforms geocoded with verified coordinates
- [ ] Interactive map renders within 2 seconds
- [ ] 6 PSEF layers toggleable on/off
- [ ] Platform popups show name, score, layer, operator
- [ ] Search finds platforms by name/country
- [ ] Dark mode styling matches BioR
- [ ] Mobile-responsive layout works on tablets
- [ ] No console errors in production

### 16.2 Phase 2 Completion Criteria

- [ ] BSL-4 labs displayed (100+ locations)
- [ ] CTBTO stations displayed (300+ locations)
- [ ] GHS Index choropleth for 195 countries
- [ ] Ecosystem arcs connect related platforms
- [ ] 3D Globe view works
- [ ] Layer opacity controls functional
- [ ] Statistics panel updates per visible layers

### 16.3 Overall Success Indicators

| KPI | Target |
|-----|--------|
| Map load time | < 2 seconds |
| Layer toggle speed | < 200ms |
| Data coverage | 100% of 189 platforms geocoded |
| User engagement | GeoIntel tab becomes top-3 most visited |
| Decision-maker feedback | "This changes how we see the landscape" |

---

## Appendix A: Platform Geocoding Reference

The 189 platforms need to be geocoded. Most operator fields contain city/country information. Example geocoding approach:

```
Platform: Nextstrain
Operator: "Fred Hutchinson Cancer Center (Seattle, USA)"
Geocode: { lat: 47.6062, lng: -122.3321, city: "Seattle", country: "US" }

Platform: GISAID
Operator: "GISAID Initiative e.V. (registered non-profit, Germany)"
Geocode: { lat: 48.1351, lng: 11.5820, city: "Munich", country: "DE" }

Platform: DHIS2
Operator: "HISP Centre at the University of Oslo (UiO), Norway"
Geocode: { lat: 59.9139, lng: 10.7522, city: "Oslo", country: "NO" }
```

Approach: Parse operator text -> extract city/country -> use known coordinates.

---

## Appendix B: Comparable Systems

| System | Description | What BioR GeoIntel Does Better |
|--------|-------------|-------------------------------|
| **HealthMap** | Disease outbreak mapping | We layer infrastructure + policy + genomics, not just outbreaks |
| **Global BioLabs Map** | BSL-4 lab locations | We add surveillance platforms + CBRN + environmental context |
| **GHS Index Map** | Country readiness scores | We overlay operational capabilities + real infrastructure |
| **CTBTO IMS Map** | Nuclear monitoring | We contextualise within broader CBRN + bio framework |
| **WHO Disease Outbreak Map** | Active outbreaks | We correlate with response capability + platform proximity |
| **Google Earth AI** | Satellite intelligence | We add domain-specific biosurveillance context |

**BioR GeoIntel is unique because it combines ALL of these into a single, coherent, multi-layered view specifically designed for biosurveillance decision-making.**

---

*End of GeoIntel Architecture & Implementation Plan v1.0*
