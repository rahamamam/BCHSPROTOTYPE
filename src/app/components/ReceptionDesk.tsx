import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bell,
  Check,
  MapPin,
  PhoneCall,
  Smartphone,
  UserPlus,
  Users,
} from "lucide-react";
import { CURRENT_NURSE, ROSTER, StaffPatient, TRIAGE_META, TriageLevel } from "./staff-data";

type WaitEntry = {
  id: string;
  name: string;
  triageLevel: TriageLevel;
  channel: "physical" | "virtual";
  waitMinutes: number;
  called: boolean;
};

const INITIAL_QUEUE: WaitEntry[] = [
  { id: "B-019", name: "Marcus Chen", triageLevel: 4, channel: "physical", waitMinutes: 23, called: false },
  { id: "B-020", name: "Priya Ramesh", triageLevel: 4, channel: "virtual", waitMinutes: 19, called: false },
  { id: "B-022", name: "Liam O'Brien", triageLevel: 5, channel: "virtual", waitMinutes: 34, called: false },
  { id: "B-023", name: "Fatima Yusuf", triageLevel: 3, channel: "physical", waitMinutes: 15, called: false },
  { id: "B-024", name: "Noah Bergeron", triageLevel: 5, channel: "virtual", waitMinutes: 41, called: false },
  { id: "B-025", name: "Chloe Tremblay", triageLevel: 4, channel: "physical", waitMinutes: 11, called: false },
];

export function ReceptionDesk() {
  const [queue, setQueue] = useState<WaitEntry[]>(INITIAL_QUEUE);
  const [nowServing, setNowServing] = useState<string[]>(["B-017", "B-018"]);

  const physical = queue.filter((q) => q.channel === "physical" && !q.called).length;
  const virtual = queue.filter((q) => q.channel === "virtual" && !q.called).length;
  const capacity = Math.round((physical / 30) * 100);

  function callPatient(id: string) {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, called: true } : q)));
    setNowServing((prev) => [id, ...prev].slice(0, 3));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="font-display font-extrabold text-foreground text-2xl md:text-3xl">Reception Desk</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Check-in, queue control & virtual waiting room
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
          <UserPlus size={16} /> New check-in
        </button>
      </div>

      {/* Congestion stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Physical waiting", value: physical, icon: Users, tone: "var(--accent)" },
          { label: "Virtual waiting", value: virtual, icon: Smartphone, tone: "var(--primary)" },
          { label: "Room capacity", value: `${capacity}%`, icon: MapPin, tone: capacity > 70 ? "#C0392B" : "#15803D" },
          { label: "Now serving", value: nowServing.length, icon: Bell, tone: "var(--foreground)" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <s.icon size={15} />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="font-data font-bold text-2xl" style={{ color: s.tone }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Now serving bar */}
      <div className="bg-primary rounded-2xl p-5 mb-5">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Now serving</p>
        <div className="flex flex-wrap gap-3">
          {nowServing.map((n) => (
            <div key={n} className="bg-white/15 rounded-xl px-5 py-3 text-center">
              <p className="font-display font-black text-white text-2xl">{n}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Queue management */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Waiting queue</p>
            <span className="text-xs text-muted-foreground">Call next when a bay opens</span>
          </div>
          <div>
            {queue.filter((q) => !q.called).length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                Everyone has been called. 🎉
              </div>
            )}
            {queue
              .filter((q) => !q.called)
              .map((q) => {
                const t = TRIAGE_META[q.triageLevel];
                return (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <span
                      className="font-data text-sm font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: t.light, color: t.color }}
                    >
                      {q.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{q.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          {q.channel === "virtual" ? (
                            <>
                              <Smartphone size={11} /> Virtual
                            </>
                          ) : (
                            <>
                              <Users size={11} /> In-person
                            </>
                          )}
                        </span>
                        <span>· {q.waitMinutes}m wait</span>
                      </div>
                    </div>
                    <button
                      onClick={() => callPatient(q.id)}
                      className="flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shrink-0"
                    >
                      <PhoneCall size={13} /> Call
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Called / assignment panel */}
        <div className="space-y-5">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Called in — assign to nurse</p>
            </div>
            <div>
              {queue.filter((q) => q.called).length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No patients called yet. Use “Call” to bring a patient in from the waiting room.
                </div>
              )}
              {queue
                .filter((q) => q.called)
                .map((q) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {q.name} <span className="font-data text-xs text-muted-foreground">· {q.id}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Notified · heading to reception</p>
                    </div>
                    <select className="bg-input-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Assign nurse…</option>
                      <option>{CURRENT_NURSE.name}</option>
                      <option>RN K. Doyle</option>
                      <option>RN M. Osei</option>
                    </select>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Virtual waiting note */}
          <div className="bg-primary/[0.06] border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <Smartphone size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Congestion control</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Calling a virtual patient sends a push notification asking them to return to the hospital.
                Keep the physical room under 80% capacity by pacing call-ins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active department caseload snapshot */}
      <div className="bg-card rounded-2xl border border-border p-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">In-department patients</p>
          <span className="text-xs text-muted-foreground">{ROSTER.length} active</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ROSTER.map((p: StaffPatient) => {
            const t = TRIAGE_META[p.triageLevel];
            return (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-muted/50 rounded-lg px-2.5 py-1.5"
                title={`${p.name} · ${p.stage}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                <span className="font-data text-xs font-bold text-foreground">{p.id}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{p.stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 text-center mt-6">
        Mock data — connect Supabase for live, multi-device queue sync.{" "}
        <ArrowRight size={11} className="inline" />
      </p>
    </div>
  );
}
