<div align="center">

# 🌿 Ecolyse
### Understand your impact. Change your footprint.

An interactive, scientifically calibrated personal carbon footprint calculator and climate intelligence platform.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](#license)

[Key Features](#key-features) • [Methodology & Data](#scientific-methodology--data-sources) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Contributing](#contributing)

---

</div>

## 📌 Overview

**Ecolyse** bridges personal daily habits with planetary boundaries. Built for both individual consumers and academic environmental studies, Ecolyse calculates consumption-based greenhouse gas emissions across 7 lifestyle sectors with granular, regional calibration (including India CEA grid baselines, BEE appliance standards, and Indian Railways vs Aviation metrics).

Unlike superficial footprint quizzes, Ecolyse delivers real-time sensitivity analysis via an interactive **"What-If" Behavioral Simulator**, contextualizes results against **Paris Agreement 2030 targets**, and visualizes macro trends through an integrated **Climate Data Lab**.

---

## ✨ Key Features

### 🧮 1. Multi-Category Emission Wizard
Granular assessment across 7 lifestyle dimensions:
- ⚡ **Home Energy:** Grid electricity consumption, rooftop solar offsets (PM Surya Ghar), BEE star-rated AC efficiency, and cooking fuels (LPG, PNG, Induction, Biomass).
- 🚗 **Commute & Transportation:** Petrol/diesel/CNG cars, 2-wheelers, EV scooters/cars, metro/train, and carpooling dynamics.
- ✈️ **Travel & Long-Distance Aviation:** Flight frequency, cabin class weighting, and high-efficiency Indian Railways / Vande Bharat alternatives.
- 🥗 **Diet & Food Systems:** Dietary archetypes (Vegan, Vegetarian, Eggetarian, Non-Veg), dairy consumption, seasonal mandi vs. processed sourcing, and food waste factors.
- 🛍️ **Consumer Goods & E-Commerce:** Apparel replacement cycles, fast electronics refreshes, refurbished goods adoption, and quick-commerce delivery footprints.
- ♻️ **Waste Management:** Doorstep scrap recycling (Kabadiwala network), decentralized organic composting, and single-use plastic reduction.
- 📱 **Digital & Lifestyle Footprint:** Streaming, network cloud intensity, and conscious material purchasing.

### 📊 2. Dynamic Results & Analytics Dashboard
- **Metric Tonnes CO₂e Counter:** Real-time annual carbon accounting.
- **Benchmark Comparisons:** Instant visual comparison against the India National Average (1.9 t), Paris 2030 Climate Target (2.1 t), Global Average (4.8 t), and US Average (14.9 t).
- **Carbon Breakdown Visualizer:** Interactive Recharts radial, donut, and sector charts.
- **Ecological Equivalents:** Translate raw emissions into intuitive metrics like tree absorption equivalents and km driven.

### 🎛️ 3. "What-If" Decarbonization Simulator
- Test prospective lifestyle changes using live sliders (e.g., install 50% rooftop solar, eliminate food waste, switch 3 flights to rail).
- Instant before-and-after carbon delta feedback with actionable savings projections.

### 🎯 4. Prioritized Action Plan
- Curated recommendations ranked by difficulty, financial cost, timeframe, and impact badges (`HIGH IMPACT`, `QUICK WIN`, `COST SAVER`, `CLEAN TECH`).

### 🌍 5. Climate Data Lab & Atmospheric Literacy
- **Global Emissions Map & Sector Breakdown:** Explore country-level emission metrics and macro industrial contributions.
- **Atmospheric Physics & Accounting:** Comprehensive breakdown of Scope 1, Scope 2, and Scope 3 boundaries and Greenhouse Gas Potentials ($CO_2$, $CH_4$, $N_2O$, F-Gases).

### 🖥️ 6. Presentation Mode
- Dedicated interactive slide deck with keyboard navigation and fullscreen support for academic demos, webinars, and classroom lectures.

---

## 🔬 Scientific Methodology & Data Sources

Ecolyse computes personal emissions using the **GHG Protocol** corporate & community accounting framework over a cradle-to-grave Life Cycle Assessment (LCA) boundary:

$$\text{Total Emissions } (t\,\text{CO}_2\text{e}) = \sum (\text{Activity Data} \times \text{Emission Factor}) \times (1 - \text{Mitigation Factor})$$

### Primary Emission Data Sources:
- **Grid Power:** Central Electricity Authority (CEA) CO₂ Baseline Database for the Indian Power Sector (v19, 2023) — *0.716 kg CO₂e / kWh*.
- **Solar & Renewables:** IPCC AR6 Annex III Life Cycle Assessment benchmarks — *0.025 kg CO₂e / kWh*.
- **Appliance & Cooking Standards:** Bureau of Energy Efficiency (BEE) & Petroleum Planning & Analysis Cell (PPAC).
- **Food & Agriculture:** Poore & Nemecek (2018), *Reducing food's environmental impacts through producers and consumers* (Science).
- **Aviation & Transport:** UK Department for Environment, Food & Rural Affairs (DEFRA / DESNZ) Carbon Conversion Factors.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts & Visualizations:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ecolyse.git
   cd ecolyse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Run the linter:**
   ```bash
   npm run lint
   ```

---

## 🧭 Project Structure

```text
ecolyse/
├── public/               # Static assets & icons
├── src/
│   ├── components/
│   │   ├── calculator/   # Multi-step wizard, question renderers, tooltips
│   │   ├── climateData/  # Global data lab, choropleth maps, sector breakdown
│   │   ├── home/         # Landing hero, atmosphere canvas, impact simulators
│   │   ├── layout/       # Navbar, Footer, and responsive wrappers
│   │   ├── learn/        # Atmospheric science, educational modules
│   │   ├── methodology/  # GHG protocol scopes, emission tables, citations
│   │   ├── presentation/ # Fullscreen slide presentation mode
│   │   └── results/      # Counter, What-If simulator, action plan, charts
│   ├── context/          # State management (ThemeContext, CalculatorContext)
│   ├── data/             # Emission factors, datasets, questions, presets
│   ├── types/            # TypeScript domain interfaces and type definitions
│   └── utils/            # Calculation engine and formatting helpers
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is licensed under the MIT License.
