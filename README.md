<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/WebGL-Simulation-990000?style=for-the-badge&logo=webgl&logoColor=white" alt="WebGL" />
</p>

<h1 align="center">🏙️ LinkedInCity</h1>

<p align="center">
  <strong>Your LinkedIn activity as a stunning interactive 3D city skyline</strong>
</p>

<p align="center">
  <em>Transform your professional engagement into a living, breathing cityscape — drive through streets built from your posts, articles, and connections.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-visualization-modes">Views</a> •
  <a href="#%EF%B8%8F-3d-simulation">Simulation</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-deployment">Deploy</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏗️ **Isometric City View** | Beautiful SVG-based isometric 3D skyline with animated building entry |
| 🗺️ **Bird's Eye Heatmap** | GitHub-style activity grid with hover tooltips |
| 🚗 **3D City Simulation** | Full WebGL city you can **drive through** with WASD controls |
| 🚦 **Traffic System** | Autonomous cars, trucks, buses, taxis, ambulances, and police cars |
| 🚶 **Pedestrians** | Animated citizens walking along footpaths |
| 🌦️ **Weather Effects** | Storm (rain + lightning), Snow, Autumn Leaves — with ground accumulation |
| 🌙 **Day/Night Cycle** | Toggle between daytime and nighttime lighting |
| 🗺️ **Minimap** | Real-time overhead minimap with player position |
| 🎨 **6 Premium Themes** | Professional, Corporate, Recruiter, Sales, Premium, Executive |
| ⏱️ **Time Filters** | All Time, 1 Year, 6 Months, 3 Months, 1 Month, 1 Week |
| 📊 **Stats Dashboard** | Total activities, peak day, longest streak, current streak |
| 🔗 **URL Routing** | Share your city via `linkedincity.app/your-username` |
| 🔍 **Full SEO** | Meta tags, Open Graph, JSON-LD structured data |
| 📱 **Responsive** | Works beautifully on desktop and tablet |

---

## 🎮 Visualization Modes

### ◇ Isometric View
A gorgeous SVG-rendered isometric city skyline. Each building represents one day of LinkedIn activity — the taller the building, the more active you were. Buildings feature windows, rooftop antennae, and hover effects with detailed tooltips.

### ▦ Bird's Eye View
A top-down heatmap grid inspired by GitHub's contribution graph. Color intensity maps to activity level. Hover any cell to see the exact count and date.

### 🏙️ 3D Simulation
A **full WebGL city** powered by Three.js where you can:
- **Drive a car** using `W/A/S/D` or arrow keys
- Watch **autonomous traffic** (sedans, SUVs, sports cars, taxis, police, ambulances, buses)
- See **pedestrians** walking along footpaths
- Toggle **weather** (storm with rain & lightning, snow with ground accumulation, autumn leaves)
- Switch between **day and night** lighting
- Navigate using the live **minimap**

---

## 🎨 Themes

| Theme | Color | Description |
|-------|-------|-------------|
| **Professional** | 🔵 LinkedIn Blue | The signature LinkedIn look |
| **Corporate** | 🟢 Matrix Green | Cyberpunk terminal aesthetic |
| **Recruiter** | 🟣 Purple | Bold and eye-catching |
| **Sales** | 🔷 Cyan | Clean and professional |
| **Premium** | 🟡 Gold | Luxurious and premium |
| **Executive** | ⚪ Ice Blue | Refined and elegant |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/adi4sure/LinkedInCity.git

# Navigate to project
cd LinkedInCity

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at **http://localhost:3000/**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
LinkedInCity/
├── index.html                          # SEO shell, meta tags, structured data
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite + SPA fallback middleware
├── vercel.json                         # Vercel deployment rewrites
├── README.md
└── src/
    ├── main.jsx                        # React entry + HelmetProvider
    ├── App.jsx                         # Routing, auth flow, SEO, theme state
    │
    ├── constants/
    │   ├── themes.js                   # 6 color themes with 5-level palettes
    │   └── graph.js                    # Isometric grid layout constants
    │
    ├── utils/
    │   ├── colorUtils.js               # Hex/RGB conversion, interpolation
    │   └── dataUtils.js                # Data normalization, filtering, stats
    │
    ├── hooks/
    │   ├── useLinkedInData.js           # Deterministic activity data generator
    │   ├── useContributionData.js       # Filtering + stats processing
    │   ├── useMountAnimation.js         # Mount animation trigger
    │   └── useMousePosition.js          # Mouse tracking for tooltips
    │
    └── components/ActivityGraph3D/
        ├── index.js                    # Barrel exports
        ├── LinkedInConnect.jsx         # Landing page (reviews, demo profiles)
        ├── ActivityGraph3D.jsx         # Main controller (views, filters, themes)
        ├── Building.jsx                # Isometric 3D building geometry
        ├── IsometricGrid.jsx           # SVG isometric city grid
        ├── BirdsEyeGrid.jsx            # Top-down heatmap view
        ├── CitySimulation.jsx          # Full WebGL 3D simulation
        ├── CityAssets.js               # Decorative assets (benches, gardens, kiosks)
        ├── CitySignage.js              # Traffic signals, street signs, billboards
        ├── CityTraffic.js              # Traffic system (car/truck/bus movement)
        ├── CityVehicles.js             # 9 vehicle types with detailed 3D models
        ├── WeatherSystem.js            # Storm, snow, leaves, lightning effects
        ├── PedestrianSystem.js         # Pedestrians + tree builders
        ├── Tooltip.jsx                 # Hover tooltip with flip positioning
        ├── StatsBar.jsx                # Activity stats display
        ├── ThemePicker.jsx             # Theme selector with color swatches
        ├── ViewToggle.jsx              # View mode switcher
        ├── GraphLegend.jsx             # Activity level legend
        └── useDragRotation.js          # Drag rotation hook
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and functional components |
| **Three.js** | 3D WebGL rendering engine for the city simulation |
| **Vite 5** | Lightning-fast build tool and dev server |
| **react-helmet-async** | Dynamic SEO meta tag management |
| **Vanilla CSS** | Inline styles for zero-dependency styling |

---

## 🔧 How It Works

### Data Generation
Since LinkedIn doesn't offer a public activity API, LinkedInCity uses a **deterministic pseudo-random number generator** seeded by the username. This means:

- ✅ Every username produces a **unique, consistent city** every time
- ✅ Activity patterns are **realistic** — weekday bias, seasonal variation, content burst days
- ✅ **No API keys** or LinkedIn login required
- ✅ **No user data** is collected or stored

### City Architecture
The 3D city is procedurally generated from activity data:

1. **Activity → Building Height**: Each day maps to a building. Higher activity = taller skyscraper
2. **Grid Layout**: Buildings are arranged in a city grid with roads, footpaths, and intersections
3. **Decorations**: Trees, benches, gardens, and kiosks are placed procedurally
4. **Traffic**: Vehicles follow road segments with lane-based positioning
5. **Pedestrians**: Citizens walk along footpath strips with bobbing animations

### Collision Detection
The drivable car uses AABB (Axis-Aligned Bounding Box) collision detection against all buildings, preventing the player from driving through structures.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` is pre-configured with SPA rewrites for clean URL routing (`/username`, `/username/simulation`, etc.)

### Other Platforms
The app builds to a standard static site:
```bash
npm run build
# Output in ./dist — deploy anywhere that serves static files
```

---

## 🎮 Controls (Simulation Mode)

| Key | Action |
|-----|--------|
| `W` / `↑` | Accelerate forward |
| `S` / `↓` | Brake / Reverse |
| `A` / `←` | Turn left |
| `D` / `→` | Turn right |

### HUD Elements
- **Speed gauge** (bottom-left) — Current speed in km/h
- **Profile badge** (top-left) — Username and title
- **Weather controls** (top-right) — Clear, Storm, Snow, Leaves
- **Day/Night toggle** (top-right) — Switch lighting
- **Minimap** (bottom-right) — Overhead view with player dot

---

## 📊 Feature Comparison with GitCity

| Feature | GitCity | LinkedInCity |
|---------|---------|--------------|
| Data Source | GitHub GraphQL API | Deterministic generator |
| Activity Type | Git commits | LinkedIn posts/engagement |
| Isometric View | ✅ | ✅ |
| Bird's Eye View | ✅ | ✅ |
| 3D Simulation | ✅ | ✅ |
| Drivable Car | ✅ | ✅ |
| Traffic System | ✅ | ✅ |
| Pedestrians | ✅ | ✅ |
| Weather Effects | ✅ | ✅ |
| Day/Night Cycle | ✅ | ✅ |
| Minimap | ✅ | ✅ |
| Themes | 6 | 6 |
| Time Filters | ✅ | ✅ |
| SEO | ✅ | ✅ |
| URL Routing | ✅ | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Developer

<table>
  <tr>
    <td align="center">
      <strong>Aditya Chourassia</strong><br/>
      <a href="https://github.com/adi4sure">GitHub</a> •
      <a href="https://www.linkedin.com/in/aditya-chourassia">LinkedIn</a>
    </td>
  </tr>
</table>

---

<p align="center">
  <strong>⭐ Star this repo if you find it cool!</strong>
</p>

