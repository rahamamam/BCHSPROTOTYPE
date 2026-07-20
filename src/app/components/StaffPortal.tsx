import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ClipboardList,
  LayoutGrid,
  LogIn,
  Lock,
  ShieldCheck,
  Stethoscope,
  Watch,
} from "lucide-react";
import { CURRENT_NURSE, ROSTER, StaffPatient } from "./staff-data";
import { NurseStation } from "./NurseStation";
import { NurseWatch } from "./NurseWatch";
import { ReceptionDesk } from "./ReceptionDesk";

type StaffScreen = "station" | "watch" | "reception";

const NAV: { id: StaffScreen; label: string; short: string; icon: React.ElementType }[] = [
  { id: "station", label: "Nurse Station", short: "Station", icon: ClipboardList },
  { id: "watch", label: "Watch View", short: "Watch", icon: Watch },
  { id: "reception", label: "Reception Desk", short: "Reception", icon: LayoutGrid },
];

// ── Staff login ──────────────────────────────────────────────────────────────

function StaffLogin({ onLogin }: { onLogin: () => void }) {
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-foreground px-6 py-4 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/6 pointer-events-none" />
        <div className="w-9 h-9 rounded-xl bg-white/12 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-base leading-tight">BCHS Staff Portal</p>
          <p className="text-white/45 text-xs">Clinical &amp; Front Desk Access</p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-1.5 bg-white/8 px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60 text-xs font-medium">Secure access</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Stethoscope size={26} className="text-primary" />
            </div>
            <h1 className="font-display font-extrabold text-foreground mb-2 text-3xl">
              Staff Sign In
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              For nurses and reception staff. Sign in to manage patient statuses and the waiting queue.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-7 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-1.5">Staff ID</label>
            <input
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. RN-4471"
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4 transition-all placeholder:text-muted-foreground/60"
            />
            <label className="block text-sm font-medium text-foreground mb-1.5">PIN</label>
            <div className="relative mb-5">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              onClick={onLogin}
              className="w-full bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all py-3.5 text-sm"
            >
              <LogIn size={16} /> Sign in to portal
            </button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo mode — sign in with any values to explore the staff screens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Staff portal shell ───────────────────────────────────────────────────────

export function StaffPortal({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState<StaffScreen>("station");
  // Shared roster state so edits from the station persist across screens.
  const [roster, setRoster] = useState<StaffPatient[]>(ROSTER);

  function updatePatient(updated: StaffPatient) {
    setRoster((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  if (!authed) {
    return <StaffLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-20">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
          <Stethoscope size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground hidden md:block leading-none mb-0.5">BCHS Staff Portal</p>
          <p className="text-sm font-semibold text-foreground truncate leading-none">{CURRENT_NURSE.name}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-full text-xs font-medium text-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="hidden md:inline">On shift</span>
        </span>
        <button
          onClick={onExit}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted shrink-0"
        >
          Exit
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card shrink-0">
          <nav className="flex-1 p-4 space-y-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setScreen(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  screen === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={17} strokeWidth={screen === id ? 2.5 : 1.8} />
                {label}
              </button>
            ))}
          </nav>
          <div className="m-4 p-4 bg-muted/60 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
            <p className="text-sm font-semibold text-foreground">{CURRENT_NURSE.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{CURRENT_NURSE.role}</p>
            <button
              onClick={onExit}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Switch role <ArrowRight size={11} />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {screen === "station" && <NurseStation patients={roster} onUpdate={updatePatient} />}
              {screen === "watch" && <NurseWatch patients={roster} />}
              {screen === "reception" && <ReceptionDesk />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav — mobile & kiosk */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
        <div className="flex">
          {NAV.map(({ id, short, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`relative flex-1 flex flex-col items-center gap-1 pt-3 pb-4 transition-all ${
                screen === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {screen === id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <Icon size={20} strokeWidth={screen === id ? 2.5 : 1.6} />
              <span className="font-medium text-xs">{short}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
