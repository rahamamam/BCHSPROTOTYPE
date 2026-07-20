import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Check,
  CheckSquare,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  MapPin,
  Save,
  Search,
  Square,
  Thermometer,
  User,
  Users,
  Wind,
  X,
} from "lucide-react";
import {
  CLINICAL_STAGES,
  ClinicalStage,
  CURRENT_NURSE,
  ROSTER,
  StaffPatient,
  TRIAGE_META,
  TriageLevel,
} from "./staff-data";

type Scope = "mine" | "all";

// ── Small UI atoms ───────────────────────────────────────────────────────────

function TriageChip({ level }: { level: TriageLevel }) {
  const t = TRIAGE_META[level];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: t.light, color: t.color }}
    >
      L{level}
      <span className="hidden lg:inline font-medium opacity-80">· {t.short}</span>
    </span>
  );
}

function StageBadge({ stage }: { stage: ClinicalStage }) {
  const idx = CLINICAL_STAGES.indexOf(stage);
  const pct = (idx / (CLINICAL_STAGES.length - 1)) * 100;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-sm text-foreground truncate">{stage}</span>
      <div className="hidden xl:block w-16 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Detail / edit drawer ─────────────────────────────────────────────────────

function DetailDrawer({
  patient,
  onClose,
  onSave,
}: {
  patient: StaffPatient;
  onClose: () => void;
  onSave: (p: StaffPatient) => void;
}) {
  const [draft, setDraft] = useState<StaffPatient>(patient);
  const t = TRIAGE_META[draft.triageLevel];
  const dirty = JSON.stringify(draft) !== JSON.stringify(patient);

  const vitalItems = [
    { icon: Heart, label: "Heart rate", value: `${draft.vitals.hr}`, unit: "bpm" },
    { icon: Activity, label: "Blood pressure", value: draft.vitals.bp, unit: "mmHg" },
    { icon: Wind, label: "SpO₂", value: `${draft.vitals.spo2}`, unit: "%" },
    { icon: Thermometer, label: "Temp", value: `${draft.vitals.temp}`, unit: "°C" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-40 flex justify-end"
      initial={{ background: "rgba(0,0,0,0)" }}
      animate={{ background: "rgba(12,27,42,0.35)" }}
      exit={{ background: "rgba(0,0,0,0)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-background h-full overflow-y-auto scrollbar-hide shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-primary px-5 py-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <User size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white text-lg leading-tight truncate">
              {draft.name}
            </p>
            <p className="text-white/60 text-xs font-data">
              {draft.id} · {draft.mrn} · {draft.age}
              {draft.sex}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Chief complaint */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Chief complaint
            </p>
            <p className="text-sm text-foreground">{draft.chiefComplaint}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {draft.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> Arrived {draft.arrival}
              </span>
            </div>
          </div>

          {/* Editable triage */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
              Triage level
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 4, 5] as TriageLevel[]).map((lvl) => {
                const meta = TRIAGE_META[lvl];
                const active = draft.triageLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setDraft({ ...draft, triageLevel: lvl })}
                    className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      active ? "" : "border-transparent bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                    style={active ? { background: meta.light, color: meta.color, borderColor: meta.color } : undefined}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-2 font-medium" style={{ color: t.color }}>
              {t.label}
            </p>
          </div>

          {/* Editable stage */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
              Clinical stage
            </p>
            <div className="space-y-1">
              {CLINICAL_STAGES.map((s) => {
                const active = draft.stage === s;
                return (
                  <button
                    key={s}
                    onClick={() => setDraft({ ...draft, stage: s })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                      active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        active ? "bg-white/25" : "border border-border"
                      }`}
                    >
                      {active && <Check size={10} />}
                    </span>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location edit */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Location / bay
            </label>
            <input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Vitals (read-only snapshot) */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Latest vitals
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {vitalItems.map((v) => (
                <div key={v.label} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <v.icon size={13} />
                    <span className="text-xs">{v.label}</span>
                  </div>
                  <p className="font-data font-bold text-foreground">
                    {v.value}
                    <span className="text-xs text-muted-foreground font-normal ml-1">{v.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies + flags */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
              Alerts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {draft.allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: "#FEE2E2", color: "#C0392B" }}
                >
                  <AlertTriangle size={11} /> {a}
                </span>
              ))}
              {draft.flags.map((f) => (
                <span
                  key={f}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {f}
                </span>
              ))}
              {draft.allergies.length === 0 && draft.flags.length === 0 && (
                <span className="text-xs text-muted-foreground">No known allergies or flags</span>
              )}
            </div>
          </div>

          {/* Editable notes */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Care notes
            </label>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={4}
              placeholder="Add an observation or update…"
              className="w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!dirty}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Save size={15} /> Save changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Batch action bar ─────────────────────────────────────────────────────────

function BatchBar({
  count,
  onApply,
  onClear,
}: {
  count: number;
  onApply: (stage: ClinicalStage) => void;
  onClear: () => void;
}) {
  const [stage, setStage] = useState<ClinicalStage>("In Assessment");
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl"
    >
      <div className="bg-foreground text-background rounded-2xl shadow-2xl px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-data text-xs font-bold">
            {count}
          </span>
          <span className="text-sm font-medium">selected</span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-xs text-background/60 shrink-0">Set stage to</span>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as ClinicalStage)}
            className="flex-1 bg-white/10 border border-white/15 rounded-lg px-2.5 py-1.5 text-sm text-background focus:outline-none"
          >
            {CLINICAL_STAGES.map((s) => (
              <option key={s} value={s} className="text-foreground">
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-sm text-background/70 hover:text-background px-2 py-1.5 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => onApply(stage)}
            className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <Check size={14} /> Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Nurse Station ───────────────────────────────────────────────────────

export function NurseStation({ patients, onUpdate }: { patients: StaffPatient[]; onUpdate: (p: StaffPatient) => void }) {
  const [scope, setScope] = useState<Scope>("mine");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (scope === "mine" && p.assignedNurse !== "You") return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.chiefComplaint.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [patients, scope, query]);

  const openPatient = patients.find((p) => p.id === openId) || null;
  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (allVisibleSelected) return new Set();
      return new Set(filtered.map((p) => p.id));
    });
  }

  function applyBatch(stage: ClinicalStage) {
    patients
      .filter((p) => selected.has(p.id))
      .forEach((p) => onUpdate({ ...p, stage, updatedAgo: "just now" }));
    setSelected(new Set());
  }

  const mineCount = patients.filter((p) => p.assignedNurse === "You").length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-28">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="font-display font-extrabold text-foreground text-2xl md:text-3xl">
            Nurse Station
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {CURRENT_NURSE.name} · {CURRENT_NURSE.zone}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live board · {CURRENT_NURSE.shift}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setScope("mine")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              scope === "mine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User size={14} /> My patients
            <span className="font-data text-xs opacity-70">{mineCount}</span>
          </button>
          <button
            onClick={() => setScope("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              scope === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={14} /> Department
            <span className="font-data text-xs opacity-70">{patients.length}</span>
          </button>
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ticket, complaint…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl transition-colors"
        >
          <Filter size={14} />
          {allVisibleSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      {/* Table / list */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Column header — desktop */}
        <div className="hidden md:grid grid-cols-[36px_1.6fr_1.4fr_1fr_0.7fr_0.5fr_28px] gap-3 px-4 py-3 border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span />
          <span>Patient</span>
          <span>Chief complaint</span>
          <span>Stage</span>
          <span>Location</span>
          <span>Wait</span>
          <span />
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-16 text-center text-sm text-muted-foreground">
            No patients match your filters.
          </div>
        )}

        {filtered.map((p) => {
          const isSel = selected.has(p.id);
          return (
            <div
              key={p.id}
              className={`grid grid-cols-[36px_1fr_28px] md:grid-cols-[36px_1.6fr_1.4fr_1fr_0.7fr_0.5fr_28px] gap-3 px-4 py-3 border-b border-border last:border-0 items-center transition-colors ${
                isSel ? "bg-primary/[0.04]" : "hover:bg-muted/40"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(p.id)}
                className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label={isSel ? "Deselect" : "Select"}
              >
                {isSel ? <CheckSquare size={19} className="text-primary" /> : <Square size={19} />}
              </button>

              {/* Patient (name + triage) */}
              <button onClick={() => setOpenId(p.id)} className="flex items-center gap-2.5 min-w-0 text-left">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{p.name}</span>
                    <TriageChip level={p.triageLevel} />
                  </div>
                  <p className="font-data text-xs text-muted-foreground">
                    {p.id} · {p.age}
                    {p.sex}
                    {p.assignedNurse !== "You" && (
                      <span className="ml-1.5 text-muted-foreground/70">· {p.assignedNurse}</span>
                    )}
                  </p>
                  {/* mobile-only extra */}
                  <p className="md:hidden text-xs text-muted-foreground mt-1 truncate">{p.chiefComplaint}</p>
                  <div className="md:hidden mt-1">
                    <StageBadge stage={p.stage} />
                  </div>
                </div>
              </button>

              {/* Chief complaint — desktop */}
              <span className="hidden md:block text-sm text-muted-foreground truncate">
                {p.chiefComplaint}
              </span>

              {/* Stage — desktop */}
              <div className="hidden md:block min-w-0">
                <StageBadge stage={p.stage} />
              </div>

              {/* Location — desktop */}
              <span className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground truncate">
                <MapPin size={12} className="shrink-0" /> {p.location}
              </span>

              {/* Wait — desktop */}
              <span className="hidden md:block font-data text-sm text-foreground">
                {p.waitMinutes > 0 ? `${p.waitMinutes}m` : "—"}
              </span>

              {/* Open chevron */}
              <button
                onClick={() => setOpenId(p.id)}
                className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View details"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Batch bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <BatchBar count={selected.size} onApply={applyBatch} onClear={() => setSelected(new Set())} />
        )}
      </AnimatePresence>

      {/* Detail drawer */}
      <AnimatePresence>
        {openPatient && (
          <DetailDrawer
            patient={openPatient}
            onClose={() => setOpenId(null)}
            onSave={(p) => {
              onUpdate({ ...p, updatedAgo: "just now" });
              setOpenId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
