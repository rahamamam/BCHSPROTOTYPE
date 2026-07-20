// ── Shared staff-side data model & mock roster ───────────────────────────────
// Central mock data used by the nurse & receptionist facing screens.
// Designed to be swapped for Supabase real-time rows later.

export type TriageLevel = 1 | 2 | 3 | 4 | 5;

// Ordered clinical journey — index maps to a patient's `statusStep`.
export const CLINICAL_STAGES = [
  "Registered",
  "Awaiting Triage",
  "In Assessment",
  "Treatment",
  "Awaiting Results",
  "Ready for Discharge",
  "Discharged",
] as const;

export type ClinicalStage = (typeof CLINICAL_STAGES)[number];

export type Vitals = {
  hr: number; // heart rate bpm
  bp: string; // blood pressure
  spo2: number; // oxygen saturation %
  temp: number; // celsius
};

export type StaffPatient = {
  id: string; // ticket
  mrn: string;
  name: string;
  dob: string;
  age: number;
  sex: "M" | "F" | "X";
  triageLevel: TriageLevel;
  stage: ClinicalStage;
  location: string;
  chiefComplaint: string;
  waitMinutes: number;
  arrival: string;
  assignedNurse: string; // "You" for the logged-in nurse's patients
  vitals: Vitals;
  allergies: string[];
  notes: string;
  flags: string[]; // e.g. "Fall risk", "NPO", "Isolation"
  updatedAgo: string; // "2m ago"
};

export const TRIAGE_META: Record<
  TriageLevel,
  { label: string; color: string; light: string; short: string }
> = {
  1: { label: "Resuscitation", short: "Critical", color: "#C0392B", light: "#FEE2E2" },
  2: { label: "Emergent", short: "Urgent", color: "#D97706", light: "#FEF3C7" },
  3: { label: "Urgent", short: "Urgent", color: "#B45309", light: "#FEFCE8" },
  4: { label: "Less Urgent", short: "Non-urgent", color: "#15803D", light: "#DCFCE7" },
  5: { label: "Non-Urgent", short: "Minimal", color: "#475569", light: "#F1F5F9" },
};

export const CURRENT_NURSE = {
  name: "RN Priya Anand",
  short: "P. Anand",
  role: "Registered Nurse",
  zone: "Zone B · Ambulatory",
  shift: "07:00 – 19:00",
};

// Full department roster. Patients assigned to "You" belong to the
// logged-in nurse and drive the consolidated watch view.
export const ROSTER: StaffPatient[] = [
  {
    id: "B-011",
    mrn: "MRN-882104",
    name: "Eleanor Whitfield",
    dob: "02 Jun 1948",
    age: 78,
    sex: "F",
    triageLevel: 2,
    stage: "In Assessment",
    location: "Bay 3",
    chiefComplaint: "Chest tightness, shortness of breath",
    waitMinutes: 4,
    arrival: "09:58 AM",
    assignedNurse: "You",
    vitals: { hr: 102, bp: "158/94", spo2: 93, temp: 37.1 },
    allergies: ["Penicillin"],
    notes: "ECG ordered. Cardiac enzymes pending. Monitor closely.",
    flags: ["Cardiac monitor", "Fall risk"],
    updatedAgo: "2m ago",
  },
  {
    id: "B-014",
    mrn: "MRN-773920",
    name: "Darius Okoro",
    dob: "19 Nov 1991",
    age: 34,
    sex: "M",
    triageLevel: 3,
    stage: "Awaiting Results",
    location: "Bay 7",
    chiefComplaint: "Right lower quadrant abdominal pain",
    waitMinutes: 12,
    arrival: "10:12 AM",
    assignedNurse: "You",
    vitals: { hr: 88, bp: "128/78", spo2: 98, temp: 38.2 },
    allergies: [],
    notes: "CT abdomen completed, awaiting radiology read. NPO maintained.",
    flags: ["NPO"],
    updatedAgo: "6m ago",
  },
  {
    id: "B-016",
    mrn: "MRN-660015",
    name: "Sofia Nakamura",
    dob: "27 Feb 2015",
    age: 11,
    sex: "F",
    triageLevel: 3,
    stage: "Treatment",
    location: "Peds 2",
    chiefComplaint: "Asthma exacerbation",
    waitMinutes: 0,
    arrival: "10:20 AM",
    assignedNurse: "You",
    vitals: { hr: 116, bp: "104/66", spo2: 95, temp: 36.8 },
    allergies: ["Ibuprofen"],
    notes: "On second salbutamol neb. Reassess respiratory effort in 15 min.",
    flags: ["Pediatric", "Parent present"],
    updatedAgo: "1m ago",
  },
  {
    id: "B-019",
    mrn: "MRN-123456",
    name: "Marcus Chen",
    dob: "14 Mar 1989",
    age: 37,
    sex: "M",
    triageLevel: 4,
    stage: "Awaiting Triage",
    location: "Waiting Area B",
    chiefComplaint: "Laceration to left forearm",
    waitMinutes: 23,
    arrival: "10:42 AM",
    assignedNurse: "You",
    vitals: { hr: 76, bp: "122/80", spo2: 99, temp: 36.6 },
    allergies: [],
    notes: "Wound covered, bleeding controlled. Tetanus status to confirm.",
    flags: [],
    updatedAgo: "4m ago",
  },
  {
    id: "B-021",
    mrn: "MRN-540781",
    name: "Grace Mulligan",
    dob: "08 Sep 1962",
    age: 63,
    sex: "F",
    triageLevel: 4,
    stage: "Ready for Discharge",
    location: "Bay 5",
    chiefComplaint: "Migraine with nausea",
    waitMinutes: 0,
    arrival: "09:30 AM",
    assignedNurse: "You",
    vitals: { hr: 72, bp: "118/76", spo2: 99, temp: 36.5 },
    allergies: ["Codeine"],
    notes: "Symptoms resolved after antiemetic + analgesia. Discharge paperwork pending.",
    flags: [],
    updatedAgo: "9m ago",
  },
  // ── Other nurses' patients (fill out the department board) ──
  {
    id: "B-012",
    mrn: "MRN-901233",
    name: "Tomás Rivera",
    dob: "11 Jan 1975",
    age: 51,
    sex: "M",
    triageLevel: 2,
    stage: "Treatment",
    location: "Resus 1",
    chiefComplaint: "Suspected stroke — facial droop",
    waitMinutes: 0,
    arrival: "09:44 AM",
    assignedNurse: "RN K. Doyle",
    vitals: { hr: 94, bp: "172/98", spo2: 96, temp: 36.9 },
    allergies: [],
    notes: "Code stroke activated. CT head done.",
    flags: ["Code stroke"],
    updatedAgo: "3m ago",
  },
  {
    id: "B-013",
    mrn: "MRN-334509",
    name: "Amara Singh",
    dob: "23 Jul 2000",
    age: 25,
    sex: "F",
    triageLevel: 5,
    stage: "Awaiting Triage",
    location: "Waiting Area A",
    chiefComplaint: "Prescription refill / minor rash",
    waitMinutes: 41,
    arrival: "10:05 AM",
    assignedNurse: "RN K. Doyle",
    vitals: { hr: 70, bp: "116/74", spo2: 100, temp: 36.4 },
    allergies: [],
    notes: "",
    flags: [],
    updatedAgo: "11m ago",
  },
  {
    id: "B-015",
    mrn: "MRN-118820",
    name: "Henry Lapointe",
    dob: "30 Apr 1955",
    age: 71,
    sex: "M",
    triageLevel: 3,
    stage: "In Assessment",
    location: "Bay 9",
    chiefComplaint: "Dizziness, possible dehydration",
    waitMinutes: 8,
    arrival: "10:18 AM",
    assignedNurse: "RN M. Osei",
    vitals: { hr: 90, bp: "104/62", spo2: 97, temp: 37.0 },
    allergies: ["Sulfa"],
    notes: "IV fluids started.",
    flags: ["Fall risk"],
    updatedAgo: "7m ago",
  },
];
