import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  LayoutList,
  ScanLine,
  Thermometer,
  Wind,
} from "lucide-react";
import { CLINICAL_STAGES, CURRENT_NURSE, StaffPatient, TRIAGE_META } from "./staff-data";

// ── Utility ──────────────────────────────────────────────────────────────────

function stagePct(stage: StaffPatient["stage"]) {
  return (CLINICAL_STAGES.indexOf(stage) / (CLINICAL_STAGES.length - 1)) * 100;
}

type AlertLevel = "critical" | "warning" | "ok";

function vitalAlert(p: StaffPatient): AlertLevel {
  if (p.vitals.spo2 < 94 || p.vitals.hr > 110 || p.triageLevel <= 2) return "critical";
  if (p.vitals.temp >= 38 || p.vitals.hr > 100 || p.triageLevel === 3) return "warning";
  return "ok";
}

const ALERT = {
  critical: { dot: "#FF453A", glow: "rgba(255,69,58,0.5)" },
  warning:  { dot: "#FF9F0A", glow: "rgba(255,159,10,0.4)" },
  ok:       { dot: "#30D158", glow: "rgba(48,209,88,0.35)" },
};

// ── Live clock ───────────────────────────────────────────────────────────────

function useClock() {
  const fmt = () => {
    const d = new Date();
    const h = d.getHours() % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Apple Watch Series 11 Frame ──────────────────────────────────────────────
// Realistic device shell: dark titanium case, large-radius squircle, crown + button.

function WatchShell({ children }: { children: React.ReactNode }) {
  // Display area: 200 × 240px. Case adds 9px bezel on all sides.
  const DW = 200, DH = 240;
  const BEZEL = 9;
  const CW = DW + BEZEL * 2;     // 218
  const CH = DH + BEZEL * 2;     // 258
  const DR = 46;                  // display corner radius (squircle approximation)
  const CR = DR + BEZEL;          // case corner radius

  return (
    <div className="relative" style={{ width: CW + 18 }}>
      {/* Drop shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          right: 18,
          borderRadius: CR,
          boxShadow: "0 28px 64px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      />

      {/* Case body */}
      <div
        className="relative"
        style={{
          width: CW,
          height: CH,
          borderRadius: CR,
          background: "linear-gradient(160deg, #3E3E40 0%, #1E1E20 55%, #2E2E30 100%)",
        }}
      >
        {/* Case edge highlight */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            borderRadius: CR,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.5)",
          }}
        />

        {/* Display area */}
        <div
          className="absolute overflow-hidden"
          style={{
            inset: BEZEL,
            borderRadius: DR,
            background: "#000000",
          }}
        >
          {/* Inner bezel glow */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              borderRadius: DR,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          />
          <div className="relative h-full z-0">{children}</div>
        </div>
      </div>

      {/* Digital Crown */}
      <div
        className="absolute"
        style={{
          right: 6,
          top: "26%",
          width: 12,
          height: 50,
          borderRadius: 6,
          background: "linear-gradient(180deg, #4A4A4C 0%, #38383A 40%, #484848 100%)",
          boxShadow: "1px 0 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Crown texture lines */}
        {[8, 14, 20, 26, 32, 38].map((y) => (
          <div
            key={y}
            className="absolute left-1 right-1"
            style={{
              top: y,
              height: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 1,
            }}
          />
        ))}
      </div>

      {/* Side button */}
      <div
        className="absolute"
        style={{
          right: 6,
          top: "26%",
          marginTop: 60,
          width: 12,
          height: 30,
          borderRadius: 6,
          background: "linear-gradient(180deg, #4A4A4C 0%, #38383A 40%, #484848 100%)",
          boxShadow: "1px 0 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}

// ── Watch Status Bar ─────────────────────────────────────────────────────────

function WatchStatusBar({ time }: { time: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
      <span className="text-white font-semibold text-sm tabular-nums tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        {/* Battery icon */}
        <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
          <rect x="0.5" y="0.5" width="15" height="8" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          <rect x="16.5" y="2.5" width="1.5" height="4" rx="0.75" fill="rgba(255,255,255,0.25)" />
          <rect x="1.5" y="1.5" width="11" height="6" rx="1.5" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    </div>
  );
}

// ── Patient Focus Card (single-patient watchOS card) ─────────────────────────

function WatchFocusCard({
  p,
  total,
  current,
}: {
  p: StaffPatient;
  total: number;
  current: number;
}) {
  const alert = vitalAlert(p);
  const alertColors = ALERT[alert];
  const t = TRIAGE_META[p.triageLevel];
  const pct = stagePct(p.stage);
  const firstName = p.name.split(" ")[0];
  const lastI = p.name.split(" ").slice(-1)[0]?.[0] ?? "";

  return (
    <div className="flex flex-col px-3 pb-3" style={{ height: 198 }}>
      {/* Patient header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Alert dot */}
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: alertColors.dot,
              boxShadow: `0 0 8px ${alertColors.glow}`,
            }}
          />
          <span className="text-white font-bold text-xs tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {p.id}
          </span>
        </div>
        {/* Triage badge */}
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
          style={{
            background: t.color + "28",
            color: t.color,
            border: `1px solid ${t.color}55`,
          }}
        >
          L{p.triageLevel} · {t.short}
        </span>
      </div>

      {/* Name & complaint */}
      <div className="mb-2.5">
        <p className="text-white font-semibold text-sm leading-tight">
          {firstName} {lastI}.
        </p>
        <p className="text-white/40 text-[9px] leading-none mt-0.5 truncate">{p.chiefComplaint}</p>
      </div>

      {/* Vitals — 2×2 */}
      <div className="grid grid-cols-2 gap-1 mb-2.5">
        {[
          { Icon: Heart,       v: `${p.vitals.hr}`,    u: "bpm" },
          { Icon: Wind,        v: `${p.vitals.spo2}%`, u: "SpO₂" },
          { Icon: Activity,    v: p.vitals.bp,          u: "mmHg" },
          { Icon: Thermometer, v: `${p.vitals.temp}°`,  u: "C" },
        ].map(({ Icon, v, u }, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Icon size={9} style={{ color: alertColors.dot }} className="shrink-0" />
            <span className="text-white font-bold text-[11px] leading-none tabular-nums">
              {v}
              <span className="text-white/35 text-[8px] font-normal ml-0.5">{u}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Stage progress */}
      <div className="mb-2">
        <div className="h-[3px] bg-white/10 rounded-full overflow-hidden mb-1">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: alertColors.dot,
              boxShadow: `0 0 6px ${alertColors.glow}`,
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-white/60 text-[9px] leading-none truncate">{p.stage}</p>
          <p className="text-white/35 text-[9px] leading-none shrink-0">{p.location}</p>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1 mt-auto">
        {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? 14 : 4,
              height: 4,
              background: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Department List View ─────────────────────────────────────────────────────

function WatchDeptList({
  patients,
  onSelect,
}: {
  patients: StaffPatient[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col" style={{ height: 198 }}>
      {/* Header */}
      <div className="px-3 pt-1 pb-2 flex items-center justify-between">
        <span className="text-white/50 text-[9px] font-bold uppercase tracking-widest">
          Dept · {patients.length} patients
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-1 pb-2">
        {patients.map((p, i) => {
          const alert = vitalAlert(p);
          const alertColors = ALERT[alert];
          const isMine = p.assignedNurse === "You";
          const firstName = p.name.split(" ")[0];
          const lastI = p.name.split(" ").slice(-1)[0]?.[0] ?? "";

          return (
            <button
              key={p.id}
              onClick={() => onSelect(i)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: alertColors.dot,
                  boxShadow: `0 0 5px ${alertColors.glow}`,
                }}
              />
              <span
                className="text-white/55 text-[9px] shrink-0 w-9"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {p.id}
              </span>
              <span className="text-white text-[10px] font-medium flex-1 truncate">
                {firstName} {lastI}.
              </span>
              {isMine && (
                <span className="text-[8px] shrink-0" style={{ color: ALERT.ok.dot }}>
                  ★
                </span>
              )}
              <span className="text-white/20 text-[9px] shrink-0">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function WatchEmpty() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: 198 }}>
      <p className="text-white/25 text-[10px]">No patients assigned</p>
    </div>
  );
}

// ── Main NurseWatch component ─────────────────────────────────────────────────

type WatchScope = "mine" | "dept";
type WatchView = "focus" | "list";

export function NurseWatch({ patients }: { patients: StaffPatient[] }) {
  const [scope, setScope] = useState<WatchScope>("mine");
  const [view, setView] = useState<WatchView>("focus");
  const [idx, setIdx] = useState(0);
  const time = useClock();

  const mine = patients.filter((p) => p.assignedNurse === "You");
  const displayed = scope === "mine" ? mine : patients;
  const safeIdx = Math.min(idx, Math.max(0, displayed.length - 1));
  const current = displayed[safeIdx];

  const criticalCount = mine.filter((p) => vitalAlert(p) === "critical").length;
  const readyCount = mine.filter((p) => p.stage === "Ready for Discharge").length;

  function switchScope(s: WatchScope) {
    setScope(s);
    setIdx(0);
    setView("focus");
  }

  function handleListSelect(i: number) {
    setIdx(i);
    setView("focus");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-foreground text-xl">Watch View</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Apple Watch Series 11 · {CURRENT_NURSE.zone}
            </p>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {criticalCount} critical
            </div>
          )}
        </div>

        {/* Scope toggle pill */}
        <div className="flex items-center bg-muted p-1 rounded-full mb-6">
          {([
            { id: "mine" as const, label: `My Patients`, count: mine.length },
            { id: "dept" as const, label: `All Dept`, count: patients.length },
          ]).map((s) => (
            <button
              key={s.id}
              onClick={() => switchScope(s.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                scope === s.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
              <span
                className={`font-data text-[10px] px-1.5 py-0.5 rounded-full ${
                  scope === s.id ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* Apple Watch frame, centered */}
        <div className="flex justify-center mb-5">
          <WatchShell>
            <div className="flex flex-col h-full">
              <WatchStatusBar time={time} />

              {/* Thin divider */}
              <div className="mx-3 mb-1" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

              {/* Content area */}
              <AnimatePresence mode="wait">
                {view === "list" ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1"
                  >
                    <WatchDeptList patients={displayed} onSelect={handleListSelect} />
                  </motion.div>
                ) : current ? (
                  <motion.div
                    key={current.id + scope}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.16 }}
                    className="flex-1"
                  >
                    <WatchFocusCard p={current} total={displayed.length} current={safeIdx} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <WatchEmpty />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </WatchShell>
        </div>

        {/* Controls beneath watch */}
        <div className="flex items-center justify-center gap-3">
          {view === "focus" && (
            <>
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={safeIdx === 0}
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground disabled:opacity-25 hover:bg-muted transition-all active:scale-95"
                aria-label="Previous patient"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <LayoutList size={13} />
                List view
              </button>

              <button
                onClick={() => setIdx((i) => Math.min(displayed.length - 1, i + 1))}
                disabled={safeIdx === displayed.length - 1}
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground disabled:opacity-25 hover:bg-muted transition-all active:scale-95"
                aria-label="Next patient"
              >
                <ChevronRight size={17} />
              </button>
            </>
          )}

          {view === "list" && (
            <button
              onClick={() => setView("focus")}
              className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <ScanLine size={13} />
              Focus view
            </button>
          )}
        </div>

        {/* Summary strip */}
        <div className="mt-8 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Assigned", value: mine.length, extra: "", valueClass: "text-foreground" },
              {
                label: "Needs attention",
                value: criticalCount,
                extra: "",
                valueClass: criticalCount > 0 ? "text-red-600" : "text-foreground",
              },
              {
                label: "Ready for d/c",
                value: readyCount,
                extra: "",
                valueClass: readyCount > 0 ? "text-green-600" : "text-foreground",
              },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <p className={`font-data font-bold text-2xl leading-none ${s.valueClass}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Nurse shift info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-2xl text-xs text-muted-foreground">
            <Clock size={13} className="shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">{CURRENT_NURSE.name}</span>
              <span className="mx-1.5 text-border">·</span>
              {CURRENT_NURSE.shift}
            </div>
            <span className="font-data text-foreground shrink-0 text-[10px]">{CURRENT_NURSE.zone}</span>
          </div>

          {/* Alert legend */}
          <div className="flex items-center justify-center gap-4 py-2">
            {(["critical", "warning", "ok"] as const).map((a) => (
              <div key={a} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: ALERT[a].dot }}
                />
                <span className="text-[10px] text-muted-foreground capitalize">{a === "ok" ? "Stable" : a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
