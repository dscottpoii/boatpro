import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Utility: Haversine formula to calculate distance in nautical miles
function haversineNm(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth's radius in nautical miles
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple gazetteer for key ports
const gazetteer = {
  'annapolis': { name: 'Annapolis, MD', lat: 38.9784, lon: -76.4922 },
  'solomons': { name: 'Solomons, MD', lat: 38.318, lon: -76.454 },
  'norfolk': { name: 'Norfolk, VA', lat: 36.8508, lon: -76.2859 },
  'portsmouth': { name: 'Portsmouth, VA', lat: 36.835, lon: -76.298 },
  'baltimore': { name: 'Baltimore, MD', lat: 39.285, lon: -76.613 },
  'hampton': { name: 'Hampton, VA', lat: 37.0299, lon: -76.3453 },
  'cambridge': { name: 'Cambridge, MD', lat: 38.5631, lon: -76.0788 },
  'st. michaels': { name: 'St. Michaels, MD', lat: 38.7851, lon: -76.2244 },
  'oxford': { name: 'Oxford, MD', lat: 38.6851, lon: -76.1727 }
};

// Mock marina database
const marinas = [
  {
    name: "Annapolis Yacht Basin",
    city: "Annapolis, MD",
    lat: 38.972,
    lon: -76.485,
    vhf: "VHF 17",
    phone: "410-267-9146",
    fuel: "Diesel, Gas",
    notes: "Transient slips; depth ~10 ft at MLW",
    amenities: ["Fuel", "Pump-out", "Showers", "WiFi"]
  },
  {
    name: "Zahniser's Yachting Center",
    city: "Solomons, MD",
    lat: 38.330,
    lon: -76.459,
    vhf: "VHF 9/16",
    phone: "410-326-2161",
    fuel: "Diesel, Gas",
    notes: "Full-service yard; popular fuel stop",
    amenities: ["Fuel", "Repairs", "Pump-out", "Restaurant"]
  },
  {
    name: "Tidewater Yacht Marina",
    city: "Portsmouth, VA",
    lat: 36.835,
    lon: -76.298,
    vhf: "VHF 16",
    phone: "757-393-2525",
    fuel: "Diesel, Gas",
    notes: "ICW Mile 0; easy in/out",
    amenities: ["Fuel", "Pump-out", "Showers", "Laundry"]
  },
  {
    name: "Herrington Harbour North",
    city: "Tracys Landing, MD",
    lat: 38.7526,
    lon: -76.5819,
    vhf: "VHF 16",
    phone: "410-741-5100",
    fuel: "Diesel, Gas",
    notes: "Well-protected harbor; excellent facilities",
    amenities: ["Fuel", "Pool", "Showers", "Restaurant", "WiFi"]
  },
  {
    name: "Deltaville Yachting Center",
    city: "Deltaville, VA",
    lat: 37.5492,
    lon: -76.3272,
    vhf: "VHF 16",
    phone: "804-776-9898",
    fuel: "Diesel, Gas",
    notes: "Full-service marina; protected basin",
    amenities: ["Fuel", "Repairs", "Pump-out", "Ship Store"]
  }
];

// Mock bridges and locks
const bridgesLocks = [
  {
    type: "Bridge",
    name: "Great Bridge Bascule Bridge",
    location: "Great Bridge, VA (ICW MM 12)",
    lat: 36.7450,
    lon: -76.2342,
    closedClearanceFt: 8,
    contact: "757-547-4470",
    schedule: "Opens on the hour, 6 AM–7 PM (seasonal variability)",
    notes: "Pairs with Great Bridge Lock immediately south; monitor VHF 13"
  },
  {
    type: "Lock",
    name: "Great Bridge Lock",
    location: "ICW Albemarle & Chesapeake Canal",
    lat: 36.7425,
    lon: -76.2350,
    contact: "USACE 757-547-3311",
    schedule: "On demand, typically on the hour; monitor VHF 13",
    notes: "Check USACE + USCG BNM day-of for maintenance windows"
  },
  {
    type: "Bridge",
    name: "Centerville Turnpike Bridge",
    location: "Chesapeake, VA (ICW MM 15.8)",
    lat: 36.7100,
    lon: -76.2147,
    closedClearanceFt: 12,
    contact: "757-547-4470",
    schedule: "Opens on signal except rush hours (7-9 AM, 4-6 PM weekdays)",
    notes: "Plan passage outside restricted hours"
  }
];

// Geocode helper
function geocode(place) {
  if (!place) return null;

  const key = place.toLowerCase().trim();

  // Direct match
  if (gazetteer[key]) return gazetteer[key];

  // Partial match
  for (const [k, v] of Object.entries(gazetteer)) {
    if (key.includes(k) || k.includes(key.split(',')[0].trim())) {
      return v;
    }
  }

  return null;
}

// Find marinas along route corridor
function findMarinasAlongRoute(fromLat, fromLon, toLat, toLon, maxDistanceNm = 10) {
  const routeMarinas = [];

  // Calculate route midpoint and bearing
  const midLat = (fromLat + toLat) / 2;
  const midLon = (fromLon + toLon) / 2;

  for (const marina of marinas) {
    // Calculate distance from route centerline (simplified)
    const distFromStart = haversineNm(fromLat, fromLon, marina.lat, marina.lon);
    const distFromEnd = haversineNm(marina.lat, marina.lon, toLat, toLon);
    const totalRouteDist = haversineNm(fromLat, fromLon, toLat, toLon);

    // If marina is somewhat along the route
    if (distFromStart < totalRouteDist + maxDistanceNm &&
        distFromEnd < totalRouteDist + maxDistanceNm) {
      routeMarinas.push({
        ...marina,
        distanceFromStart: distFromStart.toFixed(1)
      });
    }
  }

  // Sort by distance from start
  return routeMarinas.sort((a, b) => parseFloat(a.distanceFromStart) - parseFloat(b.distanceFromStart));
}

// Main route planning endpoint
app.post('/api/plan', (req, res) => {
  try {
    const { vessel, route } = req.body;

    if (!vessel || !route || !route.from || !route.to) {
      return res.status(400).json({
        error: 'Missing required fields: vessel and route with from/to locations'
      });
    }

    // Geocode start and end points
    const fromPoint = geocode(route.from);
    const toPoint = geocode(route.to);

    if (!fromPoint || !toPoint) {
      return res.status(400).json({
        error: 'Could not geocode start or end location. Please use known ports like Annapolis, Norfolk, Baltimore, etc.'
      });
    }

    const totalDistance = haversineNm(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon);

    // Generate route legs (simplified - real implementation would use marine routing)
    const legs = [];
    const waypoints = [];

    // Chesapeake Bay routes - add intermediate stops
    if ((route.from.toLowerCase().includes('annapolis') && route.to.toLowerCase().includes('norfolk')) ||
        (route.to.toLowerCase().includes('annapolis') && route.from.toLowerCase().includes('norfolk'))) {

      const solomons = gazetteer.solomons;

      legs.push({
        from: fromPoint.name,
        to: solomons.name,
        distNm: haversineNm(fromPoint.lat, fromPoint.lon, solomons.lat, solomons.lon).toFixed(1),
        etaHrs: (haversineNm(fromPoint.lat, fromPoint.lon, solomons.lat, solomons.lon) / 7).toFixed(1) // Assume 7 knots
      });

      legs.push({
        from: solomons.name,
        to: toPoint.name,
        distNm: haversineNm(solomons.lat, solomons.lon, toPoint.lat, toPoint.lon).toFixed(1),
        etaHrs: (haversineNm(solomons.lat, solomons.lon, toPoint.lat, toPoint.lon) / 7).toFixed(1)
      });

      waypoints.push(
        { name: "Thomas Point Light", lat: 38.8978, lon: -76.4382, notes: "Keep clear of shoals east of the light" },
        { name: "Drum Point", lat: 38.3208, lon: -76.4158, notes: "Mind traffic in Patuxent River entrance" },
        { name: "Point Lookout", lat: 38.0333, lon: -76.3167, notes: "Enter Potomac River; strong currents possible" },
        { name: "Thimble Shoal Channel", lat: 37.0000, lon: -76.1833, notes: "Follow marks; commercial traffic heavy" }
      );
    } else {
      // Simple point-to-point route
      legs.push({
        from: fromPoint.name,
        to: toPoint.name,
        distNm: totalDistance.toFixed(1),
        etaHrs: (totalDistance / 7).toFixed(1)
      });

      waypoints.push(
        { name: "Waypoint 1", lat: fromPoint.lat, lon: fromPoint.lon, notes: "Departure point" },
        { name: "Waypoint 2", lat: toPoint.lat, lon: toPoint.lon, notes: "Arrival point" }
      );
    }

    // Find marinas along route
    const routeMarinas = findMarinasAlongRoute(
      fromPoint.lat, fromPoint.lon,
      toPoint.lat, toPoint.lon
    );

    // Generate advisories based on vessel constraints
    const advisories = [];

    if (vessel.draft_ft > 7) {
      advisories.push(`Deep draft (${vessel.draft_ft} ft): Verify depths at all marinas and approach channels. Recommend checking NOAA charts for controlling depths.`);
    }

    if (vessel.air_clearance_ft < 65) {
      advisories.push(`Air draft (${vessel.air_clearance_ft} ft): Verify all fixed bridge clearances. Some Chesapeake Bay bridges have minimum clearances of 50 ft at MHW.`);
    }

    if (vessel.loa_ft > 60) {
      advisories.push(`Large vessel (${vessel.loa_ft} ft LOA): Call ahead to reserve transient slips. Some marinas have length restrictions.`);
    }

    // Fuel range advisory (rough calculation)
    const totalFuelRange = 300; // Assume 300 nm range for typical yacht
    if (totalDistance > totalFuelRange * 0.7) {
      advisories.push(`Route distance (${totalDistance.toFixed(0)} nm) requires fuel stop. Plan refueling at marinas with diesel/gas.`);
    }

    advisories.push('Check NOAA weather forecast 24-48 hours before departure. Avoid Chesapeake Bay in winds >20 knots.');
    advisories.push('Monitor VHF 16 for weather updates and bridge/lock coordination.');

    // Filter bridges/locks relevant to route (simplified)
    const relevantCrossings = bridgesLocks.filter(crossing => {
      if (!crossing.lat || !crossing.lon) return false;
      const distFromRoute = Math.min(
        haversineNm(fromPoint.lat, fromPoint.lon, crossing.lat, crossing.lon),
        haversineNm(crossing.lat, crossing.lon, toPoint.lat, toPoint.lon)
      );
      return distFromRoute < totalDistance + 20; // Within 20 nm of route
    });

    // Return comprehensive route plan
    res.json({
      vessel: {
        ...vessel,
        summary: `${vessel.year} ${vessel.make} ${vessel.model}`
      },
      route: {
        from: fromPoint.name,
        to: toPoint.name,
        totalDistanceNm: totalDistance.toFixed(1),
        estimatedTimeHrs: (totalDistance / 7).toFixed(1) // Assume 7 knot cruising speed
      },
      legs,
      waypoints,
      marinas: routeMarinas,
      crossings: relevantCrossings,
      advisories,
      metadata: {
        generatedAt: new Date().toISOString(),
        disclaimer: 'This route plan is for general reference only. Always verify with current charts, NOTAMs, Local Notices to Mariners, and weather forecasts before departure.'
      }
    });

  } catch (error) {
    console.error('Route planning error:', error);
    res.status(500).json({
      error: 'Internal server error during route planning',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Boat Pros Route Planning API', version: '1.0.0' });
});

// List available ports endpoint
app.get('/api/ports', (req, res) => {
  res.json({
    ports: Object.values(gazetteer),
    count: Object.keys(gazetteer).length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚢 Boat Pros API Server running on http://localhost:${PORT}`);
  console.log(`📍 Route planning endpoint: POST http://localhost:${PORT}/api/plan`);
  console.log(`❤️  Health check: GET http://localhost:${PORT}/api/health`);
});
