import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Ship, Fuel, Anchor, ArrowRight, Phone, Mail, Waves, Navigation, Info } from "lucide-react";

// --- Utility helpers --------------------------------------------------------
const required = (v) => (v !== undefined && v !== null && String(v).trim() !== "");
const asNumber = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// --- Mock data + route planning stub ---------------------------------------
// NOTE: Replace this stub with real integrations (Navionics / Waterway Guide,
// USCG LNM/BNM feeds, NOAA ENC/Co-OPS, Corps locks, bridge schedules, etc.).
const mockMarinas = [
  {
    name: "Annapolis Yacht Basin",
    city: "Annapolis, MD",
    vhf: "VHF 17",
    phone: "410-267-9146",
    fuel: "Diesel, Gas",
    lat: 38.972,
    lon: -76.485,
    notes: "Transient slips; depth ~10 ft at MLW"
  },
  {
    name: "Zahniser's Yachting Center",
    city: "Solomons, MD",
    vhf: "VHF 9/16",
    phone: "410-326-2161",
    fuel: "Diesel, Gas",
    lat: 38.330,
    lon: -76.459,
    notes: "Full-service yard; popular fuel stop"
  },
  {
    name: "Tidewater Yacht Marina",
    city: "Portsmouth, VA",
    vhf: "VHF 16",
    phone: "757-393-2525",
    fuel: "Diesel, Gas",
    lat: 36.835,
    lon: -76.298,
    notes: "ICW Mile 0; easy in/out"
  }
];

const mockBridgesLocks = [
  {
    type: "Bridge",
    name: "Great Bridge Bascule Bridge",
    location: "Great Bridge, VA (ICW MM 12)",
    closedClearanceFt: 8,
    contact: "757-547-4470",
    schedule: "Opens on the hour, 6 AM–7 PM (seasonal variability)",
    notes: "Pairs with Great Bridge Lock immediately south"
  },
  {
    type: "Lock",
    name: "Great Bridge Lock",
    location: "ICW Albemarle & Chesapeake Canal",
    contact: "USACE 757-547-3311",
    schedule: "On demand, typically on the hour; monitor VHF 13",
    notes: "Check USACE + USCG BNM day-of for maintenance windows"
  }
];

function haversineNm(a, b) {
  const R = 3440.065; // nautical miles
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

// Minimal geocode lookup for key ports we reference in mocks.
const simpleGazetteer = {
  annapolis: { lat: 38.9784, lon: -76.4922 },
  solomons: { lat: 38.318, lon: -76.454 },
  norfolk: { lat: 36.8508, lon: -76.2859 },
  portsmouth: { lat: 36.835, lon: -76.298 },
  baltimore: { lat: 39.285, lon: -76.613 },
  hampton: { lat: 37.0299, lon: -76.3453 }
};

function geocodeGuess(place) {
  if (!place) return null;
  const key = String(place).toLowerCase();
  for (const k of Object.keys(simpleGazetteer)) {
    if (key.includes(k)) return simpleGazetteer[k];
  }
  return null; // Unknown to stub; real impl should call a geocoder.
}

function planRouteStub(form) {
  // For Annapolis→Norfolk or similar, stitch simple Chesapeake legs.
  const from = geocodeGuess(form.from);
  const to = geocodeGuess(form.to);

  let legs = [];
  let waypoints = [];

  if (from && to) {
    // If running the classic Bay southbound, propose Solomons and Tidewater as legs.
    if (
      (form.from?.toLowerCase().includes("annapolis") &&
        (form.to?.toLowerCase().includes("norfolk") || form.to?.toLowerCase().includes("portsmouth"))) ||
      (form.to?.toLowerCase().includes("annapolis") &&
        (form.from?.toLowerCase().includes("norfolk") || form.from?.toLowerCase().includes("portsmouth")))
    ) {
      const ann = simpleGazetteer.annapolis;
      const sol = simpleGazetteer.solomons;
      const nor = simpleGazetteer.norfolk;
      legs = [
        { from: "Annapolis", to: "Solomons", distNm: haversineNm(ann, sol).toFixed(1) },
        { from: "Solomons", to: "Norfolk/Portsmouth", distNm: haversineNm(sol, nor).toFixed(1) }
      ];
      waypoints = [
        { name: "Thomas Point Light vicinity", notes: "Keep clear of shoals east of the light" },
        { name: "Drum Point entrance", notes: "Mind traffic in Patuxent River" },
        { name: "Thimble Shoal Channel", notes: "Follow marks; commercial traffic heavy" }
      ];
    } else {
      // Generic single-leg placeholder
      legs = [
        { from: form.from, to: form.to, distNm: from && to ? haversineNm(from, to).toFixed(1) : "—" }
      ];
      waypoints = [
        { name: "Waypoint 1", notes: "Populate via real routing engine" },
        { name: "Waypoint 2", notes: "Populate via real routing engine" }
      ];
    }
  }

  // Filter marinas by rough corridor if possible
  const marinas = mockMarinas;

  // Basic constraints-driven advisories
  const advisories = [];
  const draft = asNumber(form.draft);
  const clearance = asNumber(form.clearance);
  if (draft && draft > 7) advisories.push("Deep draft: verify depths at slips/fuel docks and approach channels.");
  if (clearance && clearance < 65) advisories.push("Air draft under 65 ft: verify fixed bridge clearances along selected route.");

  return {
    legs,
    waypoints,
    marinas,
    crossings: mockBridgesLocks,
    advisories
  };
}

// --- UI Components ----------------------------------------------------------
function Field({ label, name, type = "text", value, onChange, placeholder, required: req, suffix }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}{req && <span className="text-red-600"> *</span>}</span>
      <div className="mt-1 flex rounded-2xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl px-4 py-2 outline-none"
          required={req}
        />
        {suffix && <span className="px-3 py-2 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </label>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <div>
        <div className="text-xs uppercase text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

// --- Main Page --------------------------------------------------------------
export default function BoatProsLanding() {
  const [form, setForm] = useState({
    make: "",
    model: "",
    loa: "",
    year: "",
    beam: "",
    draft: "",
    clearance: "",
    power: "",
    lastSurveyDate: "",
    from: "Annapolis, MD",
    to: "Norfolk, VA"
  });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalNm = useMemo(() => {
    if (!result?.legs?.length) return 0;
    return result.legs.reduce((a, b) => a + Number(b.distNm || 0), 0).toFixed(1);
  }, [result]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const reqs = ["make", "model", "loa", "year", "beam", "draft", "clearance", "power", "from", "to"]; // lastSurveyDate optional
    const missing = reqs.filter((k) => !required(form[k]));
    if (missing.length) {
      alert(`Please complete required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    try {
      // Preferred: call backend planner
      const resp = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vessel: {
            make: form.make,
            model: form.model,
            year: Number(form.year),
            loa_ft: Number(form.loa),
            beam_ft: Number(form.beam),
            draft_ft: Number(form.draft),
            air_clearance_ft: Number(form.clearance),
            power_plants: form.power,
            last_survey_date: form.lastSurveyDate || null
          },
          route: { from: form.from, to: form.to }
        })
      });

      if (!resp.ok) throw new Error(`Planner returned ${resp.status}`);
      const planned = await resp.json();
      // Expected /api/plan response shape (example):
      // {
      //   legs: [{ from, to, distNm, etaHrs? }],
      //   waypoints: [{ name, lat, lon, notes }],
      //   marinas: [{ name, city, vhf, phone, fuel, notes }],
      //   crossings: [{ type: 'Bridge'|'Lock', name, location, closedClearanceFt?, contact, schedule, notes }],
      //   advisories: [string]
      // }
      setResult(planned);
    } catch (err) {
      console.warn("/api/plan failed, using stub:", err);
      const planned = planRouteStub(form);
      setResult(planned);
      setError("Live planner unavailable. Displaying illustrative plan.");
    } finally {
      setSubmitting(false);
    }
  }

  function exportToPDF() {
    if (!result) return;
    import("jspdf").then(({ default: jsPDF }) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF();
        const title = "Boat Pros — Route Runbook";
        doc.setFontSize(16);
        doc.text(title, 14, 18);
        doc.setFontSize(11);
        doc.text(`From: ${form.from}  →  To: ${form.to}`, 14, 26);

        // Legs
        const legRows = (result.legs || []).map((l) => [l.from, l.to, `${l.distNm} nm`]);
        // @ts-ignore
        doc.autoTable({ startY: 32, head: [["From", "To", "Distance (NM)"]], body: legRows });
        let y = doc.lastAutoTable.finalY + 6;

        // Waypoints
        const wpRows = (result.waypoints || []).map((w) => [w.name, w.notes || ""]);
        // @ts-ignore
        doc.autoTable({ startY: y, head: [["Waypoint", "Notes"]], body: wpRows });
        y = doc.lastAutoTable.finalY + 6;

        // Marinas
        const mRows = (result.marinas || []).map((m) => [m.name, m.city || "", m.vhf || "", m.phone || "", m.fuel || ""]);
        // @ts-ignore
        doc.autoTable({ startY: y, head: [["Marina", "City", "VHF", "Phone", "Fuel"]], body: mRows });
        y = doc.lastAutoTable.finalY + 6;

        // Crossings
        const cRows = (result.crossings || []).map((c) => [c.type, c.name, c.location || "", c.schedule || "", c.contact || ""]);
        // @ts-ignore
        doc.autoTable({ startY: y, head: [["Type", "Name", "Location", "Schedule", "Contact"]], body: cRows });
        y = doc.lastAutoTable.finalY + 6;

        // Advisories
        const adv = (result.advisories || []).join("\n• ");
        if (adv) {
          doc.text("Advisories:", 14, y);
          const lines = doc.splitTextToSize(`• ${adv}`, 182);
          doc.text(lines, 14, y + 6);
        }

        const date = new Date().toISOString().slice(0, 10);
        doc.save(`BoatPros_Runbook_${date}.pdf`);
      });
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Boat Pros — Yacht Delivery
          </motion.h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            Annapolis-based, old-school seamanship with modern precision. Submit your vessel specs to auto-generate a route & itinerary.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Stat icon={Navigation} label="Home Port" value="Annapolis, MD" />
            <Stat icon={Waves} label="Operating Theater" value="US East Coast & ICW" />
            <Stat icon={Ship} label="Core Competency" value="Professional Yacht Delivery" />
          </div>
        </div>
      </section>

      {/* Form + Output */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 shadow-md border">
            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="h-5 w-5"/>Request a Custom Route</h2>
            <p className="text-sm text-gray-500">Provide your particulars. We'll optimize the runbook end-to-end.</p>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Make" name="make" value={form.make} onChange={onChange} required />
              <Field label="Model" name="model" value={form.model} onChange={onChange} required />
              <Field label="LOA" name="loa" value={form.loa} onChange={onChange} required suffix="ft" />
              <Field label="Year" name="year" type="number" value={form.year} onChange={onChange} required />
              <Field label="Beam" name="beam" value={form.beam} onChange={onChange} required suffix="ft" />
              <Field label="Draft" name="draft" value={form.draft} onChange={onChange} required suffix="ft" />
              <Field label="Air Clearance" name="clearance" value={form.clearance} onChange={onChange} required suffix="ft" />
              <Field label="Power Plants" name="power" value={form.power} onChange={onChange} required placeholder="e.g., Twin Yanmar 315s" />
              <Field label="Last Survey Date" name="lastSurveyDate" type="date" value={form.lastSurveyDate} onChange={onChange} />
              <Field label="From (Depart)" name="from" value={form.from} onChange={onChange} required placeholder="City, ST or Marina" />
              <Field label="To (Arrive)" name="to" value={form.to} onChange={onChange} required placeholder="City, ST or Marina" />

              <div className="md:col-span-2 mt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500 flex items-center gap-2"><Info className="h-4 w-4"/> By submitting, you consent to route planning using your inputs. Schedules and conditions subject to change.</div>
                <div className="flex items-center gap-3">
                  {result && (
                    <button
                      type="button"
                      onClick={exportToPDF}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-semibold shadow-sm border border-blue-700 text-blue-700 hover:bg-blue-50"
                    >
                      Export PDF
                    </button>
                  )}
                  <button
                    type="submit"
                    className={classNames(
                      "inline-flex items-center gap-2 rounded-2xl px-5 py-2 font-semibold shadow-sm",
                      submitting ? "bg-gray-400 cursor-wait" : "bg-blue-700 hover:bg-blue-800 text-white"
                    )}
                    disabled={submitting}
                  >
                    {submitting ? "Planning…" : "Generate Itinerary"} <ArrowRight className="h-4 w-4"/>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Card */}
        <aside>
          <div className="rounded-3xl bg-white p-6 shadow-md border">
            <h3 className="text-lg font-bold flex items-center gap-2"><Anchor className="h-5 w-5"/>Annapolis Yacht Delivery</h3>
            <p className="text-sm text-gray-600 mt-1">Proven process. Zero surprises. Traditional craftsmanship, modern execution.</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4"/> <span>(410) 555-0123</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4"/> <span>ops@boatpros.delivery</span></div>
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-xs text-blue-900">
              Fuel planning, watch bills, weather windows, and contingency routing baked in. We sweat the details so you don't have to.
            </div>
          </div>
        </aside>
      </section>

      {/* Results */}
      {result && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-md border">
                <h3 className="text-lg font-bold flex items-center gap-2"><Navigation className="h-5 w-5"/>Route Summary</h3>
                {error && <div className="mt-2 rounded-xl bg-amber-50 text-amber-900 text-xs p-2">{error}</div>}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Stat icon={MapPin} label="Departure" value={form.from} />
                  <Stat icon={MapPin} label="Destination" value={form.to} />
                  <Stat icon={Waves} label="Total Distance (NM)" value={totalNm} />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold">Legs</h4>
                  <ol className="mt-2 space-y-2">
                    {result.legs.map((leg, idx) => (
                      <li key={idx} className="rounded-2xl border p-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{leg.from} → {leg.to}</div>
                          <div className="text-xs text-gray-500">Nominal rhumb distance. Final routing to follow marks & depths.</div>
                        </div>
                        <div className="text-sm font-semibold">{leg.distNm} nm</div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold">Advisories</h4>
                  {result.advisories?.length ? (
                    <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                      {result.advisories.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No constraint-driven advisories based on inputs.</p>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold">Representative Waypoints</h4>
                  <ol className="mt-2 space-y-2">
                    {result.waypoints.map((wp, i) => (
                      <li key={i} className="rounded-2xl border p-3">
                        <div className="font-medium">{wp.name}</div>
                        <div className="text-xs text-gray-500">{wp.notes}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md border">
                <h3 className="text-lg font-bold flex items-center gap-2"><Fuel className="h-5 w-5"/>Marinas & Fuel Docks (Illustrative)</h3>
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.marinas.map((m, i) => (
                    <li key={i} className="rounded-2xl border p-4">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-gray-600">{m.city}</div>
                      <div className="mt-2 text-sm">
                        <div>Fuel: {m.fuel}</div>
                        <div>Radio: {m.vhf}</div>
                        <div>Phone: {m.phone}</div>
                        {m.notes && <div className="text-xs text-gray-500 mt-1">{m.notes}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-md border">
                <h3 className="text-lg font-bold">Bridges & Locks (Sample)</h3>
                <ul className="mt-3 space-y-3">
                  {result.crossings.map((c, i) => (
                    <li key={i} className="rounded-2xl border p-3">
                      <div className="text-sm font-semibold">{c.type}: {c.name}</div>
                      <div className="text-xs text-gray-600">{c.location}</div>
                      {c.closedClearanceFt && (
                        <div className="text-xs">Closed Clearance: {c.closedClearanceFt} ft</div>
                      )}
                      <div className="text-xs">Schedule: {c.schedule}</div>
                      <div className="text-xs">Contact: {c.contact}</div>
                      {c.notes && <div className="text-xs text-gray-500 mt-1">{c.notes}</div>}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-xs text-gray-500">
                  Always confirm same-day via USCG Local/Broadcast Notices to Mariners and operator websites.
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md border">
                <h3 className="text-lg font-bold">Next Steps</h3>
                <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
                  <li>We validate tides, weather windows, and depth profiles.</li>
                  <li>We lock marinas/fuel and file bridge/lock timing.</li>
                  <li>We brief the watch plan and depart on schedule.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-gray-500">
          © {new Date().getFullYear()} Boat Pros — Yacht Delivery. All rights reserved. Routing data illustrative; verify with official publications.
        </div>
      </footer>
    </div>
  );
}

// --- Integration Notes ------------------------------------------------------
// 1) Replace planRouteStub() with a server endpoint that:
//    • Geocodes start/end (e.g., Mapbox/Google)
//    • Runs marine routing (ENC-aware, depths, aids to nav). Vendors: Navionics, C-Map, Waterway Guide API.
//    • Pulls marinas/fuel (Waterway Guide, ActiveCaptain).
//    • Resolves bridges/locks schedules & contacts (USCG LNM/BMN feeds, USACE lock pages).
//    • Adds weather/tide windows (NOAA NWS marine, NOAA Tides & Currents).
// 2) Enrich constraints using Draft & Air Clearance to filter hazards/fixed bridges.
// 3) Persist requests and allow PDF export of the final runbook.
