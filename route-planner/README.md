# Boat Pros - Yacht Delivery Route Planner

A professional yacht delivery route planning application built with React and Node.js. This application helps yacht delivery captains plan optimal routes along the US East Coast and Intracoastal Waterway (ICW).

## Features

### Frontend (React + Vite)
- **Vessel Specification Form** - Input yacht details including make, model, dimensions, draft, air clearance
- **Interactive Route Planning** - Plan routes between major East Coast ports
- **Route Summary** - View detailed route legs, waypoints, and total distance in nautical miles
- **Marina Database** - Browse marinas along your route with fuel, VHF, and contact information
- **Bridges & Locks** - View schedules and contact info for bridges and locks along the route
- **Smart Advisories** - Get vessel-specific warnings based on draft, air clearance, and LOA
- **PDF Export** - Download comprehensive route runbooks as PDF
- **Responsive Design** - Works on desktop and mobile devices
- **Modern UI** - Built with Tailwind CSS and Framer Motion animations

### Backend (Node.js + Express)
- **Route Planning API** - Calculate routes with waypoints and distances
- **Marina Matching** - Find marinas along your route corridor
- **Vessel Constraint Analysis** - Generate advisories based on vessel specifications
- **Geocoding** - Convert port names to coordinates for major East Coast locations
- **Bridge/Lock Data** - Filter relevant crossings for your route

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **jsPDF + jsPDF-AutoTable** - PDF generation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing

## Project Structure

```
route-planner/
├── src/
│   ├── BoatProsLanding.jsx   # Main application component
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind CSS imports
├── dist/                      # Production build output
├── vite.config.js             # Vite configuration with API proxy
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json

backend/
├── server.js                  # Express API server
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd route-planner
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Development

Run both servers simultaneously for full functionality:

1. **Start Backend API Server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3001`

2. **Start Frontend Dev Server** (Terminal 2)
   ```bash
   cd route-planner
   npm run dev
   ```
   App runs on `http://localhost:5173`

The Vite dev server is configured to proxy `/api/*` requests to the backend server.

### Production Build

1. **Build Frontend**
   ```bash
   cd route-planner
   npm run build
   ```
   Output: `route-planner/dist/`

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## API Endpoints

### POST /api/plan
Plan a yacht delivery route.

**Request Body:**
```json
{
  "vessel": {
    "make": "Hinckley",
    "model": "Bermuda 40",
    "year": 2018,
    "loa_ft": 40,
    "beam_ft": 12,
    "draft_ft": 5.5,
    "air_clearance_ft": 55,
    "power_plants": "Single Yanmar 75hp",
    "last_survey_date": "2024-03-15"
  },
  "route": {
    "from": "Annapolis, MD",
    "to": "Norfolk, VA"
  }
}
```

**Response:**
```json
{
  "vessel": { ... },
  "route": {
    "from": "Annapolis, MD",
    "to": "Norfolk, VA",
    "totalDistanceNm": "128.1",
    "estimatedTimeHrs": "18.3"
  },
  "legs": [
    {
      "from": "Annapolis, MD",
      "to": "Solomons, MD",
      "distNm": "39.7",
      "etaHrs": "5.7"
    },
    ...
  ],
  "waypoints": [...],
  "marinas": [...],
  "crossings": [...],
  "advisories": [...],
  "metadata": { ... }
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Boat Pros Route Planning API",
  "version": "1.0.0"
}
```

### GET /api/ports
List available ports for route planning.

**Response:**
```json
{
  "ports": [
    { "name": "Annapolis, MD", "lat": 38.9784, "lon": -76.4922 },
    ...
  ],
  "count": 9
}
```

## Supported Ports

Current gazetteer includes:
- Annapolis, MD
- Solomons, MD
- Norfolk, VA
- Portsmouth, VA
- Baltimore, MD
- Hampton, VA
- Cambridge, MD
- St. Michaels, MD
- Oxford, MD

## Future Enhancements

### Integration Roadmap
Replace stub data with real maritime services:

1. **Geocoding & Routing**
   - Integrate Mapbox or Google Maps API for geocoding
   - Use marine routing engines (Navionics, C-Map, Waterway Guide API)
   - ENC-aware routing with depth data and aids to navigation

2. **Marina Data**
   - Waterway Guide API
   - ActiveCaptain community data
   - Real-time fuel pricing

3. **Bridges & Locks**
   - USCG Local/Broadcast Notices to Mariners (LNM/BNM)
   - USACE lock schedules and status
   - Bridge opening schedules from state DOTs

4. **Weather & Tides**
   - NOAA NWS marine forecasts
   - NOAA Tides & Currents API
   - Wind/wave predictions

5. **Safety & Regulations**
   - USCG NOTAM integration
   - Special anchorage areas
   - Speed zones and no-wake areas

### Feature Roadmap
- [ ] User authentication and saved routes
- [ ] Multi-day itinerary planning
- [ ] Fuel consumption calculator
- [ ] Weather overlay on route map
- [ ] Live AIS ship tracking integration
- [ ] Mobile app (React Native)
- [ ] Route sharing and collaboration
- [ ] Integration with boat monitoring systems

## Development Notes

### Haversine Distance Calculation
The app uses the Haversine formula to calculate great-circle distances between coordinates. Results are in nautical miles (1 nm = 1.852 km).

### Route Planning Logic
- For well-known routes (e.g., Annapolis → Norfolk), the system suggests proven waypoints
- Generic routes use simple point-to-point calculations
- Marinas within 10 nm of the route corridor are included
- Bridges/locks within 20 nm of the route are flagged

### Vessel Advisories
The system generates warnings based on:
- **Draft > 7 ft**: Deep draft warnings for marina approaches
- **Air clearance < 65 ft**: Fixed bridge clearance checks
- **LOA > 60 ft**: Large vessel slip availability
- **Route distance > 210 nm**: Fuel stop recommendations

## Contributing

This is an Annapolis-based yacht delivery service application. For feature requests or bug reports, contact the development team.

## License

Proprietary - Boat Pros Yacht Delivery

## Disclaimer

**This route planning tool is for general reference only.** Always verify routes with:
- Current NOAA charts and publications
- USCG Local/Broadcast Notices to Mariners
- NOTAMs (Notices to Airmen/Mariners)
- Current weather forecasts (NOAA NWS Marine)
- Bridge/lock schedules (call day-of for confirmation)
- Marina availability and approach depths

Never rely solely on automated planning tools for navigation. Professional seamanship and local knowledge are essential for safe yacht delivery operations.

---

**Boat Pros — Yacht Delivery**
Annapolis, Maryland
Professional yacht delivery with old-school seamanship and modern precision.
