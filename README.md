<div align="center">

[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.3928660.svg)](http://dx.doi.org/10.5281/zenodo.3928660)
![Licence](https://img.shields.io/badge/Licence-CC%20BY%204.0-blue.svg)
![Version](https://img.shields.io/badge/Version-8.1.0-green.svg)
![Platform](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-4285F4?logo=google&logoColor=white)
![Language](https://img.shields.io/badge/Language-JavaScript-f7df1e?logo=javascript&logoColor=black)
![Period](https://img.shields.io/badge/Analysis%20Period-1986–2024-orange)
[![Citation Badge](https://api.juleskreuer.eu/citation-badge.php?doi=10.1038/s41597-020-00600-4)](https://juleskreuer.eu/projekte/citation-badge/)

<br/>

# 🌿 Brazilian Secondary Vegetation Mapping
### Benchmark Maps of Annual Increment, Extent, Age, and Loss of Secondary Vegetation in Brazil

<br/>

> **Silva-Junior, C. H. L., et al. (2020)**
> *Benchmark maps of 33 years of secondary forest age for Brazil*
> **Scientific Data** · https://doi.org/10.1038/s41597-020-00600-4

<br/>

</div>

---

## 🌎 Overview

This repository provides the complete **Google Earth Engine (GEE)** pipeline for mapping the annual increment, extent, age, and loss of secondary vegetation across **Brazil** and **Amazonia** at **30-meter spatial resolution** for the period **1986–2024**.

Land-use and land-cover maps from the [MapBiomas Project](https://brasil.mapbiomas.org/en/colecoes-mapbiomas) (Collection 10.1) are used as input data. The algorithm identifies secondary vegetation by detecting transitions from anthropic land use back to native vegetation classes in the MapBiomas annual time series. This dataset provides critical spatially explicit information for supporting carbon emissions reduction, biodiversity, and restoration policies.

| Product | Description | Variable type |
|:---|:---|:---:|
| **Age** | Cumulative age of secondary vegetation in each pixel | Integer (years) |
| **Extent** | Annual binary map of secondary vegetation presence | Binary (0/1) |
| **Increment** | Pixels that transitioned from anthropic use to secondary vegetation | Binary (0/1) |
| **Loss** | Pixels where secondary vegetation was cleared | Binary (0/1) |

---

## 📊 Key Results

<div align="center">

<img src="https://drive.google.com/uc?export=view&id=14V3whfA9IqoZIvs4SbOjiYszlNK8GVvZ" width="700">

**Figure 1.** Conceptual diagram of the land-use dynamics underlying the secondary vegetation mapping algorithm. Old-growth forest (1985) is cleared by fire and converted to agriculture and livestock. Abandoned land undergoes early succession, developing into secondary forest. A second deforestation cycle (2018) illustrates the recurrent nature of secondary vegetation dynamics detected annually from the MapBiomas land-cover time series.

</div>

---

## 🖥️ System Requirements

### Software dependencies

| Software | Version | Notes |
|:---|:---|:---|
| Google Earth Engine | Browser-based (2024) | Free account required: https://earthengine.google.com |

### Operating systems tested

- Windows 10/11 (64-bit)
- macOS 12+
- Ubuntu 22.04 LTS

### Non-standard hardware

No non-standard hardware is required. All computations run on Google's cloud infrastructure.

---

## ⚙️ Installation Guide

### Google Earth Engine

No local installation is required. GEE runs entirely in the browser.

1. Register for a free GEE account at https://earthengine.google.com (approval typically takes 1–2 business days)
2. Open the [GEE Code Editor](https://code.earthengine.google.com)
3. Copy and paste the contents of the desired script (see [Repository Structure](#-repository-structure) below)

**Typical setup time:** < 5 minutes (after account approval).

---

## 📁 Repository Structure

```
gee_brazil_sv/
│
├── 🌐 gee_brazil_sv_code.js                        ← Brazil mapping script (v8.1)
├── 🌐 gee_amazonia_sv_code.js                      ← Amazonia mapping script (v3)
├── 🔽 gee_brazil_sv_toolkit_download.js            ← Download toolkit by boundaries (v0.0.2)
├── 📤 Secondary_Vegetation_TIFfile_Export_Tool.js  ← Per-year GeoTIFF export tool
│
├── 📂 figures/                                     ← Repository figures
└── 📄 README.md
```

### Script descriptions

#### `gee_brazil_sv_code.js` — Brazil Mapping Script (v8.1)

Maps the annual increment, extent, age, and loss of secondary vegetation across **all of Brazil** using MapBiomas Brazil Collection 10.1 (1986–2024). Configurable via the block at the top of the script:

```javascript
var firstYear           = 1985;               // First year of the data series
var lastYear            = 2024;               // Last year of the data series
var mapbiomasCollection = 'collection10_1';   // MapBiomas collection version
var mappingVersion      = 'v8_1';             // Version of the mapping process
var assetFolder         = 'users/ybyrabr/public'; // Destination folder for exported assets
```

Exports four multi-band GEE assets (one band per year): `secondary_forest_increment_`, `secondary_forest_extent_`, `secondary_forest_age_`, and `secondary_forest_loss_`.

#### `gee_amazonia_sv_code.js` — Amazonia Mapping Script (v3)

Maps secondary vegetation specifically within the **Amazonia biome** using MapBiomas Amazonia Collection 6 (1986–2023). Configurable similarly:

```javascript
var firstYear           = 1985;          // First year of the data series
var lastYear            = 2023;          // Last year of the data series
var mapbiomasCollection = 'collection6'; // MapBiomas Amazonia collection version
var mappingVersion      = 'v3';          // Version of the mapping process
var assetFolder         = 'users/ybyrabr/public'; // Destination folder for exported assets
```

#### `Secondary_Vegetation_TIFfile_Export_Tool.js` — GeoTIFF Export Tool

Exports the secondary vegetation datasets as **annual GeoTIFF files** to Google Drive, one file per year. Configurable via the top block:

```javascript
var collection    = 'collection9'; // MapBiomas collection name
var mappingVersion = 'v71';        // Mapping version
var lastYear      = 2023;          // Last year to export
var startYear     = 1986;          // Start year (age, extent, increment)
var lossStartYear = 1987;          // Start year (loss dataset)
var type          = 3;             // Vegetation type (3 = Forest Formation)
```

#### `gee_brazil_sv_toolkit_download.js` — Download Toolkit (v0.0.2)

An interactive GEE application that allows users to **visualize and download** secondary vegetation data by administrative boundaries (states and municipalities), watersheds, biomes, and protected areas — without writing any code.

---

## 🚀 How to Use

### Step 1 — Run the mapping script (generate GEE assets)

1. Open the [GEE Code Editor](https://code.earthengine.google.com)
2. Copy and paste `gee_brazil_sv_code.js` (Brazil) or `gee_amazonia_sv_code.js` (Amazonia)
3. Adjust the configuration block at the top if needed (e.g., `lastYear`, `assetFolder`)
4. Click **Run** — all export tasks appear in the **Tasks** panel
5. Click **Run** on each task to start the exports to your GEE asset folder

> **Expected run time:** 5–60 minutes per task (cloud-based; varies with server load and region size).

### Step 2 — Export as annual GeoTIFF files to Google Drive (optional)

If you prefer to download annual GeoTIFF rasters rather than using GEE assets:

1. Copy and paste `Secondary_Vegetation_TIFfile_Export_Tool.js` into the GEE Code Editor
2. Edit the configuration block to match the asset version and years you want
3. Click **Run** — export tasks appear in the **Tasks** panel
4. Click **Run** on each task to export to Google Drive

> **Output:** One GeoTIFF per year per product (age, extent, increment, loss), clipped to Brazil at 30 m resolution.

### Step 3 — Download by geographic boundary (optional)

For downloading data clipped to specific states, municipalities, biomes, or protected areas:

1. Copy and paste `gee_brazil_sv_toolkit_download.js` into the GEE Code Editor, or access it directly: https://code.earthengine.google.com/13bfcedb77ac7bac9ea1fb962b587a54?hideCode=true
2. Select the desired boundary and data type
3. Click **Export images to Google Drive**

> **Expected run time:** < 5 minutes per export.

---

## 🛰️ GEE Data Assets

The processed datasets are publicly available as multi-band GEE assets. Each band represents one year, named `classification_YYYY`. To load the latest version in GEE:

```javascript
var age       = ee.Image('users/ybyrabr/public/secondary_forest_age_collection10_1_v8_1');
var extent    = ee.Image('users/ybyrabr/public/secondary_forest_extent_collection10_1_v8_1');
var increment = ee.Image('users/ybyrabr/public/secondary_forest_increment_collection10_1_v8_1');
var loss      = ee.Image('users/ybyrabr/public/secondary_forest_loss_collection10_1_v8_1');
```

### Brazil

| Version | MapBiomas | Period | Coverage | Asset prefix |
|:---:|:---:|:---:|:---|:---|
| **v8.1** ⭐ | 10.1 | 1986–2024 | Forest Formation | `users/ybyrabr/public/secondary_forest_{product}_collection10_1_v8_1` |
| v8 | 10 | 1986–2024 | Forest Formation | `users/ybyrabr/public/secondary_forest_{product}_collection10_v8` |
| v7.2 | 9 | 1986–2023 | Forest Formation | `users/ybyrabr/public/secondary_forest_{product}_collection9_v72` |
| v7.1 | 9 | 1986–2023 | All Native Vegetation | `users/ybyrabr/public/secondary_vegetation_{product}_collection9_v71` |
| v7 | 9 | 1986–2023 | All Native Vegetation | `users/ybyrabr/public/secondary_vegetation_{product}_collection9_v7` |
| v61 | 8 | 1986–2022 | All Native Vegetation | `users/ybyrabr/public/secondary_vegetation_{product}_collection8_v61` |
| v5 | 7.1 | 1986–2021 | All Native Vegetation | `users/celsohlsj/public/secondary_vegetation_{product}_collection71_v5` |
| v4 | 6.0 | 1986–2020 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_collection6_v4` |
| v3 | 5.0 | 1986–2019 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_collection5_v3` |
| v2 | 4.1 | 1986–2018 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_collection41_v2` |

> Replace `{product}` with `age`, `extent`, `increment`, or `loss`.

### Amazonia

| Version | MapBiomas | Period | Coverage | Asset prefix |
|:---:|:---:|:---:|:---|:---|
| v3 | 6.0 | 1986–2023 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_amazonia_collection6_v6` |
| v2 | 3.0 | 1986–2020 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_amazonia_collection3_v2` |
| v1 | 2.0 | 1986–2018 | Forest Formation | `users/celsohlsj/public/secondary_forest_{product}_amazonia_collection2_v1` |

### Direct download (v2 — Zenodo)

The final data layers (v2) are also available in the Zenodo repository: https://doi.org/10.5281/zenodo.3928660

---

## ⚗️ Methodology Summary

The algorithm operates in four sequential steps applied annually to the MapBiomas land-cover time series:

### Processing steps

| Step | Description |
|:---:|:---|
| **1** | Reclassify MapBiomas classes into forest / non-forest binary maps; apply Oil Palm and Water masks |
| **2** | Identify annual **increment**: pixels transitioning from anthropic use (year *t*−1) to forest (year *t*) |
| **3** | Accumulate **extent**: all pixels with secondary vegetation present, including regrowth continuity |
| **3.1** | Detect **loss**: extent pixels at year *t*−1 that became non-forest at year *t* |
| **4** | Calculate **age**: cumulative years of continuous secondary vegetation presence |

### Key masking layers

| Mask | Source | Purpose |
|:---|:---|:---|
| Oil Palm extent | Descals et al. (2024) · [doi:10.5194/essd-16-5111-2024](https://doi.org/10.5194/essd-16-5111-2024) | Exclude oil palm plantations |
| Water extent | MapBiomas classes 33 (river/lake/ocean) and 31 (aquaculture) | Exclude permanent water bodies |
| Anthropic mask | MapBiomas classes 15, 19, 20, 21, 24, 30, 35, 39, 40, 41, 46, 47, 48, 62 | Define prior anthropic use |

### Spatial specifications

| Parameter | Value |
|:---|:---:|
| Spatial resolution | 30 m |
| Projection | EPSG:4326 (WGS84) |
| Analysis period — Brazil | 1986–2024 |
| Analysis period — Amazonia | 1986–2023 |
| Output format | Multi-band GEE Image (one band per year) |

---

## 📖 Citation

If you use this code or data, please cite:

```bibtex
@article{silvajunior2020,
  author  = {Silva-Junior, Celso H. L. and Heinrich, Viola H. A. and Freire, Ana T. G.
             and Broggio, Igor S. and Rosan, Thais M. and Doblas, Juan and Anderson,
             Liana O. and Rousseau, Guillaume X. and Shimabukuro, Yosio E. and
             Silva, Carlos A. and House, Joanna I. and Aragão, Luiz E. O. C.},
  title   = {Benchmark maps of 33 years of secondary forest age for {Brazil}},
  journal = {Scientific Data},
  year    = {2020},
  doi     = {10.1038/s41597-020-00600-4}
}
```

### Additional related publications

- Silva-Junior, C. H. L., et al. **Benchmark maps of 33 years of secondary forest age for Brazil.** *Scientific Data* (2020). https://doi.org/10.1038/s41597-020-00600-4 [![Citation Badge](https://api.juleskreuer.eu/citation-badge.php?doi=10.1038/s41597-020-00600-4)](https://juleskreuer.eu/projekte/citation-badge/)

- Heinrich, V. H., Dalagnol, R., et al. **Large carbon sink potential of secondary forests in the Brazilian Amazon to mitigate climate change.** *Nature Communications* (2021). https://doi.org/10.1038/s41467-021-22050-1 [![Citation Badge](https://api.juleskreuer.eu/citation-badge.php?doi=10.1038/s41467-021-22050-1)](https://juleskreuer.eu/projekte/citation-badge/)

- Heinrich, V. H., Sitch, S., et al. **RE:Growth — A toolkit for analyzing secondary forest aboveground carbon dynamics in the Brazilian Amazon.** *Frontiers in Forests and Global Change* (2023). https://doi.org/10.3389/ffgc.2023.1230734 [![Citation Badge](https://api.juleskreuer.eu/citation-badge.php?doi=10.3389/ffgc.2023.1230734)](https://juleskreuer.eu/projekte/citation-badge/)

---

## 💰 Funder and Support

- This mapping was funded by the **National Council for Scientific and Technological Development — CNPq**, Brazil, through the project *"YBYRÁ-BR: Space-Time Quantification of CO₂ Emissions and Removals by Brazilian Forests"*, Process CNPq **401741/2023-0** (from v6.1)
- This mapping was supported by the **Coordination for the Improvement of Higher Education Personnel — CAPES**, Brazil, Finance Code 001 (v2 to v5)

<div align="center">

<img src="https://drive.google.com/uc?export=view&id=1Sy2kFD6TYUXMuCqPsDi0AaG2G2BwICIB" width="600">

</div>

---

## 📋 License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

See the [LICENSE](LICENSE) file for full details or visit https://creativecommons.org/licenses/by/4.0.

---

<div align="center">

Made with 🌿 for Brazilian forest conservation research

[![GitHub](https://img.shields.io/badge/celsohlsj-gee__brazil__sv-2ea44f?logo=github)](https://github.com/celsohlsj/gee_brazil_sv)

</div>
