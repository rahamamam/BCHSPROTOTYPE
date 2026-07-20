import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock,
  Heart,
  ListOrdered,
  Map,
  MapPin,
  QrCode,
  RefreshCw,
  Smartphone,
  UserSearch,
  Volume2,
  Wifi,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { StaffPortal } from "./components/StaffPortal";

// ── Types ──────────────────────────────────────────────────────────────────

type AppRole = "landing" | "patient" | "staff";
type AppView = "checkin" | "dashboard";
type Tab = "status" | "map" | "queue" | "virtual";
type TriageLevel = 1 | 2 | 3 | 4 | 5;

// ── Constants ──────────────────────────────────────────────────────────────

const PATIENT = {
  ticket: "B-019",
  name: "Marcus Chen",
  dob: "14 Mar 1989",
  triageLevel: 4 as TriageLevel,
  queuePosition: 7,
  waitMinutes: 23,
  waitArea: "Waiting Area B",
  floor: "Ground Floor",
  checkInTime: "10:42 AM",
  estimatedCallTime: "11:05 AM",
  statusStep: 1,
  department: "General Medicine",
  virtualEligible: true,
};

const TRIAGE_CONFIG: Record<TriageLevel, { label: string; color: string; light: string; desc: string }> = {
  1: { label: "Critical",    color: "#C0392B", light: "#FEE2E2", desc: "Immediate attention required" },
  2: { label: "Urgent",      color: "#D97706", light: "#FEF3C7", desc: "Seen within 30 minutes" },
  3: { label: "Less Urgent", color: "#B45309", light: "#FEFCE8", desc: "Seen within 2 hours" },
  4: { label: "Non-Urgent",  color: "#15803D", light: "#DCFCE7", desc: "Seen within 4 hours" },
  5: { label: "Minimal",     color: "#475569", light: "#F1F5F9", desc: "Routine appointment" },
};

const STATUS_STEPS = [
  { label: "Registered",      time: "10:42 AM" },
  { label: "Awaiting Triage", time: null },
  { label: "In Assessment",   time: null },
  { label: "Treatment",       time: null },
  { label: "Discharged",      time: null },
];

const NOW_SERVING = ["B-011", "B-012"];
const UPCOMING    = ["B-013", "B-014", "B-015", "B-016", "B-017", "B-018", "B-019", "B-020"];

// ── QR Placeholder ─────────────────────────────────────────────────────────

function QRPlaceholder({ size = 72 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" className="opacity-30 text-foreground" fill="currentColor">
      <rect x="0"  y="0"  width="28" height="28" rx="3" />
      <rect x="4"  y="4"  width="20" height="20" rx="1" fill="white" />
      <rect x="8"  y="8"  width="12" height="12" rx="1" />
      <rect x="52" y="0"  width="28" height="28" rx="3" />
      <rect x="56" y="4"  width="20" height="20" rx="1" fill="white" />
      <rect x="60" y="8"  width="12" height="12" rx="1" />
      <rect x="0"  y="52" width="28" height="28" rx="3" />
      <rect x="4"  y="56" width="20" height="20" rx="1" fill="white" />
      <rect x="8"  y="60" width="12" height="12" rx="1" />
      <rect x="34" y="4"  width="8" height="8" />
      <rect x="34" y="16" width="8" height="8" />
      <rect x="4"  y="34" width="8" height="8" />
      <rect x="16" y="34" width="8" height="8" />
      <rect x="34" y="34" width="8" height="8" />
      <rect x="46" y="34" width="8" height="8" />
      <rect x="58" y="46" width="8" height="8" />
      <rect x="34" y="58" width="8" height="8" />
      <rect x="46" y="58" width="8" height="8" />
      <rect x="58" y="68" width="8" height="8" />
      <rect x="68" y="58" width="8" height="8" />
    </svg>
  );
}

// ── HelpTooltip ────────────────────────────────────────────────────────────

function HelpTooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label="How to get a patient ID"
        className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
      >
        <CircleHelp size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 w-72 bg-foreground text-background rounded-xl shadow-xl p-4"
            style={{ pointerEvents: "none" }}
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rotate-45 rounded-sm" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ── FamilyStatusCard ────────────────────────────────────────────────────────

function FamilyStatusCard({ onBack }: { onBack: () => void }) {
  const triage = TRIAGE_CONFIG[PATIENT.triageLevel];

  return (
    <motion.div
      key="family-result"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-3.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Heart size={15} className="text-primary" />
          Viewing status for your loved one
        </div>
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
          aria-label="Back"
        >
          <X size={16} />
        </button>
      </div>

      {/* Patient identity bar */}
      <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-3 border border-border">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <UserSearch size={17} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{PATIENT.name}</p>
          <p className="text-xs text-muted-foreground font-data">{PATIENT.department}</p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{ background: triage.light, color: triage.color }}
        >
          {PATIENT.ticket}
        </span>
      </div>

      {/* Status summary */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Current Status</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
          <div className="px-5 py-4">
            <p className="text-xs text-muted-foreground mb-1">Queue position</p>
            <p className="font-data font-bold text-foreground text-2xl">#{PATIENT.queuePosition}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-muted-foreground mb-1">Est. wait</p>
            <p className="font-data font-bold text-foreground text-2xl">~{PATIENT.waitMinutes}m</p>
          </div>
        </div>

        {/* Journey steps — read-only */}
        <div className="px-5 py-4">
          <div className="relative">
            <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />
            <div className="space-y-4">
              {STATUS_STEPS.map((step, i) => {
                const done    = i < PATIENT.statusStep;
                const current = i === PATIENT.statusStep;
                const future  = i > PATIENT.statusStep;
                return (
                  <div key={i} className="flex items-center gap-3.5 relative">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        done    ? "bg-primary text-primary-foreground"
                      : current ? "bg-accent text-accent-foreground"
                      :           "bg-muted border border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <Check size={11} /> : current ? (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <span className="font-data text-[10px]">{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${future ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                        {step.label}
                      </p>
                      {done && step.time && (
                        <p className="text-xs text-muted-foreground font-data">{step.time}</p>
                      )}
                      {current && (
                        <p className="text-xs text-accent font-semibold">Active now</p>
                      )}
                    </div>
                    {current && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                        NOW
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Triage level notice */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: triage.light }}
      >
        <AlertCircle size={16} style={{ color: triage.color }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: triage.color }}>
            Triage Level {PATIENT.triageLevel} — {triage.label}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: triage.color, opacity: 0.8 }}>
            {triage.desc}. Your loved one will be called by ticket when a clinician is ready.
          </p>
        </div>
      </div>

      {/* Check-in time */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-card border border-border rounded-xl text-xs text-muted-foreground">
        <Clock size={13} className="shrink-0" />
        Checked in at{" "}
        <span className="font-data font-semibold text-foreground">{PATIENT.checkInTime}</span>
        &nbsp;· Est. called at{" "}
        <span className="font-data font-semibold text-foreground">{PATIENT.estimatedCallTime}</span>
      </div>

      <p className="text-xs text-muted-foreground/60 text-center leading-relaxed px-2">
        This is a read-only view. For medical updates, please speak with a member of the care team at reception.
      </p>
    </motion.div>
  );
}

// ── CheckInScreen ──────────────────────────────────────────────────────────

function CheckInScreen({ onCheckIn }: { onCheckIn: () => void }) {
  const [input, setInput]         = useState("");
  const [mode, setMode]           = useState<"id" | "virtual" | "family">("id");
  const [familyFound, setFamilyFound] = useState(false);

  function handleModeChange(m: "id" | "virtual" | "family") {
    setMode(m);
    setInput("");
    setFamilyFound(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand bar */}
      <div className="bg-primary px-6 py-4 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/8 pointer-events-none" />
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-base leading-tight">
            Brant Community Healthcare System
          </p>
          <p className="text-white/55 text-xs">Patient Self-Service Portal</p>
        </div>
        <div className="ml-auto text-right hidden md:block">
          <p className="text-white/45 text-xs">Emergency: 911</p>
          <p className="text-white/45 text-xs">Switchboard: 519-751-5544</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">

          {/* Greeting */}
          <div className="text-center mb-8">
            <h1 className="font-display font-extrabold text-foreground mb-2 text-4xl">
              Welcome
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Enter your details to access your dashboard — queue position, map, and estimated wait time.
            </p>
          </div>

          {/* Card */}
          <div className="bg-card rounded-2xl border border-border p-7 shadow-sm">
            {/* Mode toggle — 3 tabs */}
            <div className="flex bg-muted rounded-xl p-1 mb-5">
              {(["id", "virtual", "family"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-[10px] transition-all ${
                    mode === m
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "id" ? "Patient ID" : m === "virtual" ? "Virtual Waitroom" : "Family View"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "id" && (
                <motion.div key="id" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Patient ID or ticket number
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. B-019 or MRN-123456"
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4 transition-all placeholder:text-muted-foreground/60"
                  />
                  <button
                    onClick={onCheckIn}
                    className={`w-full bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all ${
                      "py-3.5 text-sm"
                    }`}
                  >
                    Access My Dashboard <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {mode === "virtual" && (
                <motion.div key="virtual" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/[0.06] border border-primary/20 mb-5">
                    <Smartphone size={18} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">
                      Register your phone number to join the virtual waitroom. We will send you a text 15 minutes before your turn so you can wait from anywhere.
                    </p>
                  </div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Mobile phone number
                  </label>
                  <input
                    type="tel"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 519-555-0100"
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4 transition-all placeholder:text-muted-foreground/60"
                  />
                  <button
                    onClick={onCheckIn}
                    className={`w-full bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all ${
                      "py-3.5 text-sm"
                    }`}
                  >
                    <Wifi size={16} /> Register for Virtual Waitroom
                  </button>
                </motion.div>
              )}

              {mode === "family" && (
                <motion.div key="family" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <AnimatePresence mode="wait">
                    {!familyFound ? (
                      <motion.div key="family-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/[0.06] border border-primary/20 mb-5">
                          <Heart size={18} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground leading-relaxed">
                            Enter your loved one{"'"}s patient ID or ticket number to view their current status and estimated wait time.
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-sm font-medium text-foreground">
                            Patient ID or ticket number
                          </label>
                          <HelpTooltip>
                            <p className="text-xs font-semibold mb-2 text-background/90">How to get a Patient ID</p>
                            <div className="space-y-2.5">
                              {[
                                { step: "1", text: "Ask your loved one to share their ticket number (e.g. B-019) — it is shown on their dashboard or printed receipt." },
                                { step: "2", text: "Visit the BCHS Reception or front desk and provide your full name and relationship. Staff can provide the ticket number after verifying your identity." },
                                { step: "3", text: "If your loved one checked in online, they can share their patient ID from the My Status screen — it appears in the top-right of their dashboard." },
                              ].map(({ step, text }) => (
                                <div key={step} className="flex items-start gap-2.5">
                                  <span className="w-4 h-4 rounded-full bg-white/20 text-background text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                                  <p className="text-[11px] leading-relaxed text-background/75">{text}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-1.5">
                              <AlertCircle size={11} className="text-background/50 shrink-0" />
                              <p className="text-[10px] text-background/50">Staff may ask for ID before sharing patient details.</p>
                            </div>
                          </HelpTooltip>
                        </div>

                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="e.g. B-019 or MRN-123456"
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4 transition-all placeholder:text-muted-foreground/60"
                        />
                        <button
                          onClick={() => setFamilyFound(true)}
                          className={`w-full bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all ${
                            "py-3.5 text-sm"
                          }`}
                        >
                          <UserSearch size={16} /> View Status
                        </button>
                      </motion.div>
                    ) : (
                      <FamilyStatusCard onBack={() => { setFamilyFound(false); setInput(""); }} />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider + QR — hidden when family result is showing */}
            {!(mode === "family" && familyFound) && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/40">
                  <QRPlaceholder size={64} />
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <QrCode size={13} className="text-muted-foreground" />
                      <p className="text-xs font-semibold text-foreground">Scan at reception</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pick up a printed QR from the front desk to check in instantly.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground/70 text-center mt-5 max-w-xs mx-auto leading-relaxed">
            Your health data is encrypted and only visible to you and your care team.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── HospitalFloorMap (SVG) ─────────────────────────────────────────────────

function HospitalFloorMap() {
  return (
    <svg
      viewBox="0 0 560 345"
      className="w-full h-auto rounded-xl"
      style={{ maxHeight: 280, background: "#F0F7FB" }}
      aria-label="BCHS ground floor map showing route to Waiting Area B"
    >
      <defs>
        <style>{`
          @keyframes dash-march { to { stroke-dashoffset: -26; } }
          @keyframes marker-pulse {
            0%, 100% { opacity: 0.18; transform: scale(1); }
            50%       { opacity: 0.07; transform: scale(1.7); }
          }
          .route-path {
            stroke-dasharray: 8 5;
            animation: dash-march 1.1s linear infinite;
          }
          .marker-ring {
            transform-box: fill-box;
            transform-origin: center;
            animation: marker-pulse 2.2s ease-in-out infinite;
          }
        `}</style>
        <pattern id="map-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C8DCE8" strokeWidth="0.4" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="560" height="345" fill="#F0F7FB" rx="12" />
      <rect width="560" height="345" fill="url(#map-grid)" rx="12" />

      {/* Building shell */}
      <rect x="18" y="14" width="524" height="316" rx="8" fill="none" stroke="#B8D4DC" strokeWidth="1.8" />

      {/* ── Top row: clinical rooms ── */}
      {/* Triage 1 */}
      <rect x="28" y="24" width="112" height="76" rx="5" fill="#E4F1F6" stroke="#AAD0DC" strokeWidth="1.4" />
      <text x="84" y="54" textAnchor="middle" fontSize="8.5" fill="#4A7C90" fontFamily="DM Sans, sans-serif" fontWeight="600">TRIAGE 1</text>
      <text x="84" y="68" textAnchor="middle" fontSize="7.5" fill="#7AAFC0" fontFamily="DM Sans, sans-serif">Emergency</text>
      <rect x="65" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="77" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="89" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />

      {/* Triage 2 */}
      <rect x="152" y="24" width="112" height="76" rx="5" fill="#E4F1F6" stroke="#AAD0DC" strokeWidth="1.4" />
      <text x="208" y="54" textAnchor="middle" fontSize="8.5" fill="#4A7C90" fontFamily="DM Sans, sans-serif" fontWeight="600">TRIAGE 2</text>
      <text x="208" y="68" textAnchor="middle" fontSize="7.5" fill="#7AAFC0" fontFamily="DM Sans, sans-serif">Emergency</text>
      <rect x="189" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="201" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="213" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />

      {/* Triage 3 */}
      <rect x="276" y="24" width="112" height="76" rx="5" fill="#E4F1F6" stroke="#AAD0DC" strokeWidth="1.4" />
      <text x="332" y="54" textAnchor="middle" fontSize="8.5" fill="#4A7C90" fontFamily="DM Sans, sans-serif" fontWeight="600">TRIAGE 3</text>
      <text x="332" y="68" textAnchor="middle" fontSize="7.5" fill="#7AAFC0" fontFamily="DM Sans, sans-serif">Emergency</text>
      <rect x="313" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="325" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />
      <rect x="337" y="79" width="8" height="8" rx="1.5" fill="#AAD0DC" />

      {/* Imaging / X-Ray */}
      <rect x="400" y="24" width="130" height="76" rx="5" fill="#ECF3F8" stroke="#C0D8E4" strokeWidth="1.4" />
      <text x="465" y="56" textAnchor="middle" fontSize="8.5" fill="#6A9AAE" fontFamily="DM Sans, sans-serif" fontWeight="600">IMAGING</text>
      <text x="465" y="70" textAnchor="middle" fontSize="7.5" fill="#96BCC8" fontFamily="DM Sans, sans-serif">X-Ray · CT · MRI</text>

      {/* ── Main corridor ── */}
      <rect x="18" y="108" width="524" height="26" fill="#E0EDF4" />
      <text x="280" y="124" textAnchor="middle" fontSize="7.5" fill="#9AB8C5" fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="3">MAIN CORRIDOR</text>

      {/* ── Waiting areas row ── */}
      {/* Waiting Area A */}
      <rect x="28" y="142" width="188" height="92" rx="5" fill="#EBF4F9" stroke="#B8D4DC" strokeWidth="1.4" />
      <text x="122" y="178" textAnchor="middle" fontSize="8.5" fill="#6A9AAE" fontFamily="DM Sans, sans-serif" fontWeight="600">WAITING AREA A</text>
      <text x="122" y="191" textAnchor="middle" fontSize="7.5" fill="#96BCC8" fontFamily="DM Sans, sans-serif">General seating</text>
      {[55,72,89,106,140,157,174,191].map((x, i) => (
        <rect key={i} x={x} y="204" width="9" height="9" rx="2" fill="#B8D4DC" />
      ))}
      <rect x="50" y="221" width="156" height="7" rx="3.5" fill="#C8DCE8" />

      {/* Waiting Area B — ACTIVE (patient location) */}
      <rect x="228" y="142" width="188" height="92" rx="5" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" />
      <text x="322" y="174" textAnchor="middle" fontSize="8.5" fill="#15803D" fontFamily="DM Sans, sans-serif" fontWeight="700">WAITING AREA B</text>
      <text x="322" y="187" textAnchor="middle" fontSize="7.5" fill="#16A34A" fontFamily="DM Sans, sans-serif" fontWeight="600">▶ YOUR LOCATION</text>
      {[248,265,282,299,336,353,370,387].map((x, i) => (
        <rect key={i} x={x} y="200" width="9" height="9" rx="2" fill="#86EFAC" />
      ))}
      <rect x="248" y="217" width="148" height="7" rx="3.5" fill="#BBF7D0" />

      {/* Elevator & Stairs */}
      <rect x="428" y="142" width="114" height="92" rx="5" fill="#ECF3F8" stroke="#C0D8E4" strokeWidth="1.4" />
      <text x="485" y="178" textAnchor="middle" fontSize="8.5" fill="#8AAEC0" fontFamily="DM Sans, sans-serif" fontWeight="600">ELEVATOR</text>
      <text x="485" y="191" textAnchor="middle" fontSize="7.5" fill="#A0C0CE" fontFamily="DM Sans, sans-serif">& STAIRS</text>
      <rect x="465" y="200" width="16" height="24" rx="3" fill="#BDD4DE" />
      <text x="473" y="214" textAnchor="middle" fontSize="8" fill="#EBF4F9" fontFamily="sans-serif">▲▼</text>
      <rect x="490" y="200" width="18" height="24" rx="3" fill="#BDD4DE" />
      <line x1="493" y1="205" x2="505" y2="220" stroke="#EBF4F9" strokeWidth="1.5" />
      <line x1="505" y1="205" x2="505" y2="220" stroke="#EBF4F9" strokeWidth="1.5" />

      {/* ── Lower corridor ── */}
      <rect x="18" y="242" width="524" height="22" fill="#E0EDF4" />

      {/* ── Reception desk ── */}
      <rect x="28" y="272" width="504" height="42" rx="5" fill="#D4EAF2" stroke="#0E6575" strokeWidth="1.6" />
      <text x="280" y="289" textAnchor="middle" fontSize="10" fill="#0E6575" fontFamily="DM Sans, sans-serif" fontWeight="700">RECEPTION / FRONT DESK</text>
      <text x="280" y="304" textAnchor="middle" fontSize="7.5" fill="#5A9FAF" fontFamily="DM Sans, sans-serif">Check-in · Inquiries · Patient Services</text>

      {/* Entrance arrow */}
      <text x="280" y="330" textAnchor="middle" fontSize="7.5" fill="#B0CACF" fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="2.5">▼  MAIN ENTRANCE</text>

      {/* ── Route path (entrance → reception → waiting B) ── */}
      <path
        d="M 322 336 L 322 272 L 322 252 L 322 188"
        fill="none"
        stroke="#15803D"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="route-path"
      />
      {/* Small entry arrow at entrance */}
      <polygon points="316,338 322,326 328,338" fill="#15803D" opacity="0.5" />

      {/* Patient marker at Waiting B center */}
      <circle cx="322" cy="188" r="14" fill="#15803D" className="marker-ring" />
      <circle cx="322" cy="188" r="8" fill="#15803D" />
      <circle cx="322" cy="188" r="4" fill="white" />

      {/* You are here label */}
      <rect x="334" y="179" width="66" height="18" rx="4" fill="#15803D" />
      <text x="367" y="191" textAnchor="middle" fontSize="7.5" fill="white" fontFamily="DM Sans, sans-serif" fontWeight="600">You are here</text>
    </svg>
  );
}

// ── StatusTab ──────────────────────────────────────────────────────────────

function StatusTab({ onGoVirtual }: { onGoVirtual: () => void }) {
  const triage = TRIAGE_CONFIG[PATIENT.triageLevel];

  return (
    <div className="space-y-3.5">
      {/* Hero card */}
      <div className="bg-primary rounded-2xl p-6 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border border-white/10" />
        <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full border border-white/10" />

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/55 text-xs font-medium uppercase tracking-widest mb-1">Your Ticket</p>
              <p className="font-display font-black text-white leading-none" style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}>
                {PATIENT.ticket}
              </p>
            </div>
            <div
              className="mt-1 px-3 py-1.5 rounded-full text-xs font-bold shrink-0"
              style={{ background: triage.light, color: triage.color }}
            >
              Level {PATIENT.triageLevel} — {triage.label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">Queue position</p>
              <p className="font-data font-bold text-white text-2xl">#{PATIENT.queuePosition}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">Est. wait</p>
              <p className="font-data font-bold text-white text-2xl">~{PATIENT.waitMinutes}m</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="text-white/50 shrink-0" />
            <span>
              Please wait in{" "}
              <strong className="text-white font-semibold">{PATIENT.waitArea}</strong>
              {" "}· {PATIENT.floor}
            </span>
          </div>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
          Your Journey
        </p>
        <div className="relative">
          <div className="absolute left-3.5 top-4 bottom-4 w-px bg-border" />
          <div className="space-y-5">
            {STATUS_STEPS.map((step, i) => {
              const done    = i < PATIENT.statusStep;
              const current = i === PATIENT.statusStep;
              const future  = i > PATIENT.statusStep;
              return (
                <div key={i} className="flex items-start gap-4 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all ${
                      done    ? "bg-primary text-primary-foreground"
                    : current ? "bg-accent text-accent-foreground"
                    :           "bg-muted border border-border text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <Check size={13} />
                    ) : current ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span className="font-data text-xs">{i + 1}</span>
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-semibold ${future ? "text-muted-foreground" : "text-foreground"}`}>
                      {step.label}
                    </p>
                    {done && step.time && (
                      <p className="text-xs text-muted-foreground mt-0.5 font-data">{step.time}</p>
                    )}
                    {current && (
                      <p className="text-xs text-accent font-semibold mt-0.5">
                        Active · Est. call at {PATIENT.estimatedCallTime}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Triage notice */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: triage.light }}
      >
        <AlertCircle size={17} style={{ color: triage.color }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: triage.color }}>
            Triage {PATIENT.triageLevel} — {triage.label}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: triage.color, opacity: 0.8 }}>
            {triage.desc}. A clinician will call your ticket number when a space becomes available.
          </p>
        </div>
      </div>

      {/* Virtual room CTA */}
      {PATIENT.virtualEligible && (
        <button
          onClick={onGoVirtual}
          className="w-full bg-card border-2 border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/40 hover:bg-primary/[0.03] transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <Smartphone size={22} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Join Virtual Waiting Room</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Leave the hospital and wait from anywhere — we will call you back
            </p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      )}

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3.5">
          <p className="text-xs text-muted-foreground mb-1">Checked in</p>
          <p className="font-data text-sm font-semibold text-foreground">{PATIENT.checkInTime}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3.5">
          <p className="text-xs text-muted-foreground mb-1">Department</p>
          <p className="text-sm font-semibold text-foreground truncate">{PATIENT.department}</p>
        </div>
      </div>
    </div>
  );
}

// ── MapTab ─────────────────────────────────────────────────────────────────

function MapTab() {
  const steps = [
    { text: "Exit through the triage corridor doors",    done: true,  current: false },
    { text: "Turn right past the Reception front desk",  done: true,  current: false },
    { text: "Waiting Area B is on your left — take a seat", done: false, current: true },
  ];

  return (
    <div className="space-y-3.5">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground">Ground Floor</h3>
            <p className="text-xs text-muted-foreground">BCHS · Brantford General Hospital · Ground Floor</p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
            Floor 0
          </span>
        </div>
        <div className="px-4 pb-5">
          <HospitalFloorMap />
        </div>
      </div>

      {/* Directions */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Step-by-step directions
        </p>
        <div className="relative">
          <div className="absolute left-3 top-4 bottom-4 w-px bg-border" />
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    s.done    ? "bg-primary text-primary-foreground"
                  : s.current ? "bg-accent text-accent-foreground"
                  :             "bg-muted border border-border text-muted-foreground"
                  }`}
                >
                  {s.done ? <Check size={11} /> : i + 1}
                </div>
                <div>
                  <p className={`text-sm ${s.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                    {s.text}
                  </p>
                  {s.current && (
                    <p className="text-xs text-accent font-semibold mt-0.5">You are here</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Nearby amenities
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "🚻", label: "Restrooms", sub: "Corridor B" },
            { emoji: "🥤", label: "Vending",   sub: "Near lift" },
            { emoji: "📶", label: "Free Wi-Fi", sub: "BCHS-Guest" },
          ].map((a) => (
            <div key={a.label} className="bg-muted/50 rounded-xl p-3 text-center">
              <span className="text-2xl block mb-1">{a.emoji}</span>
              <p className="text-xs font-semibold text-foreground">{a.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── QueueTab ───────────────────────────────────────────────────────────────

function QueueTab() {
  const [livePulse, setLivePulse] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setLivePulse((p) => !p), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3.5">
      {/* Now serving */}
      <div className="bg-primary rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-2 h-2 rounded-full bg-green-400 transition-opacity duration-700"
            style={{ opacity: livePulse ? 1 : 0.3 }}
          />
          <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            Now Serving
          </p>
          <div className="ml-auto flex items-center gap-1 text-white/40">
            <RefreshCw size={11} className="animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-xs">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {NOW_SERVING.map((n) => (
            <div key={n} className="bg-white/15 rounded-xl p-4 text-center">
              <p className="font-display font-black text-white text-3xl">{n}</p>
              <p className="text-xs text-white/50 mt-1.5">Proceed to desk</p>
            </div>
          ))}
        </div>
      </div>

      {/* Your position */}
      <div className="bg-card border-2 rounded-2xl p-4 flex items-center gap-4" style={{ borderColor: "rgba(232,144,42,0.35)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,144,42,0.1)" }}>
          <span className="font-display font-black text-lg" style={{ color: "var(--accent)" }}>
            #{PATIENT.queuePosition}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Your ticket: <span className="font-data">{PATIENT.ticket}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Position {PATIENT.queuePosition} · Est. {PATIENT.waitMinutes} min remaining
          </p>
        </div>
        <Volume2 size={18} className="text-muted-foreground shrink-0" />
      </div>

      {/* Queue list */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Upcoming queue</p>
        </div>
        <div>
          {UPCOMING.map((n, i) => {
            const isMe = n === PATIENT.ticket;
            return (
              <div
                key={n}
                className={`flex items-center px-5 py-3 border-b border-border last:border-0 transition-colors ${
                  isMe ? "bg-accent/5" : "hover:bg-muted/40"
                }`}
              >
                <span
                  className={`font-data text-sm font-bold w-16 shrink-0 ${
                    isMe ? "text-accent" : "text-foreground"
                  }`}
                >
                  {n}
                </span>
                <div className="flex-1 flex items-center gap-0.5">
                  {Array.from({ length: Math.max(1, 7 - i) }).map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: isMe ? "var(--accent)" : "var(--primary)", opacity: 0.25 + j * 0.08 }}
                    />
                  ))}
                </div>
                <span className="font-data text-xs text-muted-foreground">~{(i + 1) * 3}m</span>
                {isMe && (
                  <span
                    className="ml-2.5 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(232,144,42,0.15)", color: "var(--accent)" }}
                  >
                    You
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Congestion stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="font-data text-2xl font-bold text-foreground">23</p>
          <p className="text-xs text-muted-foreground mt-1">Physical waiting</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: "76%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">76% capacity</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="font-data text-2xl font-bold text-primary">14</p>
          <p className="text-xs text-muted-foreground mt-1">Virtual waiting</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "47%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">47% of queue</p>
        </div>
      </div>
    </div>
  );
}

// ── VirtualRoomTab ─────────────────────────────────────────────────────────

function VirtualRoomTab() {
  const [joined, setJoined]             = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-3.5">
      <AnimatePresence mode="wait">
        {!joined ? (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3.5"
          >
            {/* Intro card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                <Smartphone size={28} className="text-primary" />
              </div>
              <h2 className="font-display font-bold text-foreground text-xl mb-2">
                Virtual Waiting Room
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                As a non-urgent patient, you may leave the hospital and wait from anywhere nearby.
                We will send you a notification 15 minutes before your turn.
              </p>

              <div className="space-y-3.5 mb-6">
                {[
                  { emoji: "📲", text: "Join the virtual queue from this screen" },
                  { emoji: "🏃", text: "Leave the hospital and carry on with your day" },
                  { emoji: "🔔", text: "Receive a push notification 15 min before your turn" },
                  { emoji: "🏥", text: "Return to the hospital and proceed to reception" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5 shrink-0">{item.emoji}</span>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setJoined(true)}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Wifi size={16} /> Join Virtual Queue
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                You can return to physical waiting at any time
              </p>
            </div>

            {/* Congestion overview */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Current Waiting Room Status
              </p>
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Physical waiting room</span>
                    <span className="font-data font-medium text-foreground">23 / 30 seats</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: "76%", background: "var(--accent)" }} />
                  </div>
                  <p className="text-xs text-accent mt-1 font-medium">Busy — consider virtual option</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Virtual queue</span>
                    <span className="font-data font-medium text-foreground">14 patients</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: "47%" }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3.5"
          >
            {/* Active virtual state */}
            <div className="bg-primary rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Wifi size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">You are in the virtual queue</p>
                  <p className="text-xs text-white/55 font-data mt-0.5">
                    {PATIENT.ticket} · Position #{PATIENT.queuePosition}
                  </p>
                </div>
              </div>

              <div className="bg-white/12 rounded-xl p-5 mb-4">
                <p className="text-xs text-white/50 mb-1">Please return to hospital by</p>
                <p className="font-display font-black text-white text-4xl leading-none">10:50 AM</p>
                <p className="text-xs text-white/50 mt-2">
                  We will notify you at <strong className="text-white/80">10:35 AM</strong> — 15 min before your turn
                </p>
              </div>

              <button
                onClick={() => setJoined(false)}
                className="w-full bg-white/15 hover:bg-white/22 text-white rounded-xl py-2.5 text-sm font-medium transition-all"
              >
                Return to Physical Waiting
              </button>
            </div>

            {/* Notifications toggle */}
            <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Bell size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Alerts when your turn is approaching
                </p>
              </div>
              <button
                onClick={() => setNotifications((n) => !n)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications ? "bg-primary" : "bg-switch-background"
                }`}
                aria-label="Toggle notifications"
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Queue snapshot */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Your queue snapshot</p>
                <span className="font-data text-xs text-muted-foreground">Live</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((8 - PATIENT.queuePosition) / 8) * 100}%` }}
                  />
                </div>
                <span className="font-data text-sm font-bold text-foreground shrink-0">
                  {PATIENT.queuePosition} ahead
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Est. call time: <strong className="font-data text-foreground">{PATIENT.estimatedCallTime}</strong>
              </p>
            </div>

            {/* Nearby suggestions */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Nearby while you wait
              </p>
              <div className="space-y-3">
                {[
                  { emoji: "☕", name: "Tim Hortons",         sub: "3 min walk · Main lobby" },
                  { emoji: "💊", name: "Shoppers Drug Mart", sub: "5 min walk · Grand Ave S" },
                  { emoji: "🌿", name: "Hospital Courtyard", sub: "2 min walk · East wing exit" },
                ].map((place) => (
                  <div key={place.name} className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{place.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType; shortLabel: string }[] = [
  { id: "status",  label: "My Status",   shortLabel: "Status",     icon: Activity },
  { id: "map",     label: "Wayfinding",  shortLabel: "Map",        icon: Map },
  { id: "queue",   label: "Live Queue",  shortLabel: "Queue",      icon: ListOrdered },
  { id: "virtual", label: "Virtual Room", shortLabel: "Virtual",   icon: Smartphone },
];

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("status");
  const triage = TRIAGE_CONFIG[PATIENT.triageLevel];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Activity size={16} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground hidden md:block leading-none mb-0.5">Brant Community Healthcare System</p>
          <p className="text-sm font-semibold text-foreground truncate leading-none">{PATIENT.name}</p>
        </div>

        {/* Wait time pill — always visible on mobile */}
        <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-full shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-data text-xs font-medium text-foreground">~{PATIENT.waitMinutes}m</span>
        </div>

        {/* Ticket badge */}
        <div
          className="font-data text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0"
          style={{ background: triage.light, color: triage.color }}
        >
          {PATIENT.ticket}
        </div>

        <button
          onClick={onSignOut}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted ml-0.5 shrink-0"
        >
          Exit
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — md+ */}
        <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card shrink-0">
          <nav className="flex-1 p-4 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={17} strokeWidth={tab === id ? 2.5 : 1.8} />
                {label}
              </button>
            ))}
          </nav>

          {/* Sidebar patient card */}
          <div className="m-4 p-4 bg-muted/60 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground mb-1">Patient</p>
            <p className="text-sm font-semibold text-foreground">{PATIENT.name}</p>
            <p className="font-data text-xs text-muted-foreground mt-0.5">{PATIENT.dob}</p>
            <div className="mt-3 flex items-center justify-between">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: triage.light, color: triage.color }}
              >
                {triage.label}
              </span>
              <button
                onClick={onSignOut}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-4 md:px-8 pt-5 pb-28 md:pb-8 mx-auto max-w-2xl md:max-w-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {tab === "status"  && <StatusTab onGoVirtual={() => setTab("virtual")} />}
                {tab === "map"     && <MapTab />}
                {tab === "queue"   && <QueueTab />}
                {tab === "virtual" && <VirtualRoomTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom tab bar — mobile & kiosk */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
        <div className="flex">
          {TABS.map(({ id, shortLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex-1 flex flex-col items-center gap-1 pt-3 pb-4 transition-all ${
                tab === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab === id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <Icon size={20} strokeWidth={tab === id ? 2.5 : 1.6} />
              <span className="font-medium text-xs">{shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ── Role Landing ─────────────────────────────────────────────────────────────

function RoleLanding({ onPick }: { onPick: (r: "patient" | "staff") => void }) {
  const roles = [
    {
      id: "patient" as const,
      icon: UserRound,
      title: "I'm a Patient or Visitor",
      desc: "Check in, view your status, wayfinding, live queue and the virtual waiting room.",
      cta: "Continue as patient",
      accent: "bg-primary/8 border-primary/20 hover:border-primary/45 hover:bg-primary/12",
      iconBg: "bg-primary/10 group-hover:bg-primary/18",
      iconColor: "text-primary",
    },
    {
      id: "staff" as const,
      icon: Stethoscope,
      title: "I'm Staff",
      desc: "Nurses & reception — manage patient statuses, caseloads and the waiting queue.",
      cta: "Continue as staff",
      accent: "bg-card border-border hover:border-foreground/20 hover:bg-card",
      iconBg: "bg-muted group-hover:bg-foreground/10",
      iconColor: "text-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand header — deeper treatment */}
      <div className="bg-primary relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/8 pointer-events-none" />
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/8 pointer-events-none" />
        <div className="px-6 py-4 flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-tight">
              Brant Community Healthcare System
            </p>
            <p className="text-white/55 text-xs">Digital Front Desk · Brantford General</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-1.5 bg-white/12 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/70 text-xs font-medium">System online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl">
          {/* Greeting */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Welcome
            </p>
            <h1 className="font-display font-extrabold text-foreground mb-3 leading-none text-4xl">
              How can we help?
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Select your role to access your personalised dashboard.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => onPick(r.id)}
                className={`group border rounded-2xl p-6 text-left transition-all duration-200 active:scale-[0.985] ${r.accent}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${r.iconBg}`}>
                  <r.icon size={24} className={r.iconColor} />
                </div>
                <h2 className="font-display font-bold text-foreground text-lg mb-2 leading-tight">{r.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{r.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${r.iconColor}`}>
                  {r.cta}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                </span>
              </button>
            ))}
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <span className="text-xs text-muted-foreground/60">Emergency: 911</span>
            <span className="text-xs text-border">·</span>
            <span className="text-xs text-muted-foreground/60">Switchboard: 519-751-5544</span>
            <span className="text-xs text-border">·</span>
            <span className="text-xs text-muted-foreground/60">Brantford, ON</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<AppRole>("landing");
  const [view, setView] = useState<AppView>("checkin");

  return (
    <div className="size-full relative">
      <AnimatePresence mode="wait">
        {role === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="size-full"
          >
            <RoleLanding
              onPick={(r) => {
                setRole(r);
                setView("checkin");
              }}
            />
          </motion.div>
        )}

        {role === "patient" && (
          <motion.div
            key="patient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="size-full"
          >
            {view === "checkin" ? (
              <CheckInScreen onCheckIn={() => setView("dashboard")} />
            ) : (
              <Dashboard onSignOut={() => setRole("landing")} />
            )}
          </motion.div>
        )}

        {role === "staff" && (
          <motion.div
            key="staff"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="size-full"
          >
            <StaffPortal onExit={() => setRole("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
