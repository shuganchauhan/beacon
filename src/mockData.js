// ============================================================
// BEACON — Production Mock Data
// ============================================================

export const STATUS_CONFIG = {
  OPEN:               { label: "Open",               color: "bg-blue-100 text-blue-700 border-blue-200",     dot: "bg-blue-500" },
  ENGAGED:            { label: "Engaged",            color: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  SOLUTION_PROPOSED:  { label: "Solution Proposed",  color: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-500" },
  FUNDED:             { label: "Funded",             color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  IN_PROGRESS:        { label: "In Progress",        color: "bg-cyan-100 text-cyan-700 border-cyan-200",      dot: "bg-cyan-500" },
  PROTOTYPE:          { label: "Prototype Ready",    color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  COMPLETED:          { label: "Completed",          color: "bg-green-100 text-green-700 border-green-200",   dot: "bg-green-500" },
};

export const CATEGORIES = [
  "Infrastructure & Bridges",
  "Water Quality & Sanitation",
  "Agriculture & Food Security",
  "Healthcare Access",
  "Renewable Energy",
  "Disaster Management",
  "Education & Digital Literacy",
  "Waste Management",
];

export const UNIVERSITIES = [
  { id: "BIT_MESRA",  name: "BIT Mesra",          city: "Ranchi",         departments: ["Civil Engg", "CS & IT", "Electrical", "Mechanical", "Electronics"] },
  { id: "NIT_JSR",    name: "NIT Jamshedpur",     city: "Jamshedpur",     departments: ["Civil Engg", "CS & IT", "Metallurgy", "Chemical", "Production"] },
  { id: "IIT_ISM",    name: "IIT (ISM) Dhanbad",  city: "Dhanbad",        departments: ["Mining Engg", "CS & IT", "Civil", "Electrical", "Environmental"] },
  { id: "XLRI",       name: "XLRI Jamshedpur",    city: "Jamshedpur",     departments: ["Business", "HR", "Finance", "Operations"] },
];

export const DISTRICTS = [
  "Ranchi", "East Singhbhum", "Dhanbad", "Hazaribagh",
  "Giridih", "Bokaro", "Dumka", "Palamu", "Gumla", "Simdega",
];

// ============================================================
// SEED PROBLEMS
// targetUniversity: null = public (visible to all), or university ID = targeted
// mediaFiles: { photos: [...urls], audioNotes: [...] }
// pendingMilestones: student-submitted milestones awaiting university approval
// ============================================================
export const SEED_PROBLEMS = [
  {
    id: "PROB-001",
    title: "Cracked Bridge Piers on Subernarekha River Crossing",
    description: "Severe micro-fractures and concrete scour observed at Pier 3 of the Subernarekha River Bridge at Namkum sector. Heavy truck traffic vibrations are exacerbating structural failure during monsoon surges. An estimated 45,000 residents rely on this bridge daily.",
    category: "Infrastructure & Bridges",
    district: "Ranchi",
    submittedBy: { id: "CIT-001", name: "Birsa Munda", role: "Gram Panchayat Rep, Namkum" },
    submittedAt: "2026-08-01",
    votes: 312,
    status: "PROTOTYPE",
    targetUniversity: "BIT_MESRA",
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [
        { id: "AUD-001", label: "Voice Report — Birsa Munda", duration: "0:42", recordedAt: "2026-08-01 09:14 AM" },
      ],
    },
    assignedUniversity: "BIT_MESRA",
    engagedTeam: {
      faculty: { name: "Dr. Rajesh Kumar", dept: "Civil & Structural Engg", email: "rajesh.kumar@bitmesra.ac.in" },
      students: ["STU-001", "STU-002", "STU-003"],
    },
    proposedSolution: {
      title: "IoT-Enabled Structural Health Monitoring Sensor Array",
      summary: "Deploy a LoRaWAN mesh of piezoelectric strain sensors on all bridge piers with real-time anomaly alerting dashboard for the District Administration.",
      submittedAt: "2026-08-20",
      fundingAsk: 750000,
      breakdown: { hardware: 320000, software: 180000, fieldWork: 150000, overhead: 100000 },
    },
    funding: {
      partner: "National Highway & Infrastructure Fund",
      totalGranted: 750000,
      trancheReleased: 2,
      escrowBalance: 487500,
    },
    milestones: [
      { id: 1, title: "Problem Validation & Feasibility Study", pct: 15, status: "DONE", completedAt: "2026-08-12", hash: "0x3a4f91b8", approvedBy: "Prof. Ajay Nath" },
      { id: 2, title: "Structural Simulation & IoT Prototype Build", pct: 35, status: "DONE", completedAt: "2026-09-01", hash: "0x7f89a2b1", approvedBy: "Dr. Rajesh Kumar" },
      { id: 3, title: "Field Testing & Sensor Deployment", pct: 35, status: "ACTIVE", completedAt: null, hash: null, approvedBy: null },
      { id: 4, title: "Final District Handover", pct: 15, status: "LOCKED", completedAt: null, hash: null, approvedBy: null },
    ],
    pendingMilestones: [],
    studentCredits: { "STU-001": 4.8, "STU-002": 4.8, "STU-003": 4.2 },
    studentHours: { "STU-001": 48, "STU-002": 52, "STU-003": 41 },
    prototypeImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "PROB-002",
    title: "Heavy Metal Contamination in Drinking Wells — Ramgarh Block",
    description: "Lab reports from the District Health Officer show arsenic and iron levels exceeding BIS 10500 limits in 14 hand pumps across Ramgarh block. Local children showing symptoms of chronic arsenic poisoning.",
    category: "Water Quality & Sanitation",
    district: "Ranchi",
    submittedBy: { id: "CIT-001", name: "Birsa Munda", role: "Gram Panchayat Rep, Namkum" },
    submittedAt: "2026-08-10",
    votes: 198,
    status: "FUNDED",
    targetUniversity: null,
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [
        { id: "AUD-002", label: "Voice Note — Field Observation", duration: "1:12", recordedAt: "2026-08-10 11:30 AM" },
      ],
    },
    assignedUniversity: "NIT_JSR",
    engagedTeam: {
      faculty: { name: "Dr. Sunita Hansda", dept: "Civil & Environmental Engg", email: "sunita@nitjsr.ac.in" },
      students: ["STU-004", "STU-005"],
    },
    proposedSolution: {
      title: "Low-Cost Biochar-Based Arsenic Filtration Units",
      summary: "Install 14 community biochar filter assemblies with real-time TDS monitoring and SMS alerting for Block Development Officers.",
      submittedAt: "2026-08-28",
      fundingAsk: 420000,
      breakdown: { hardware: 180000, materials: 120000, installation: 80000, overhead: 40000 },
    },
    funding: {
      partner: "Tata Steel CSR Foundation",
      totalGranted: 420000,
      trancheReleased: 1,
      escrowBalance: 420000,
    },
    milestones: [
      { id: 1, title: "Water Source Mapping & Lab Analysis", pct: 15, status: "DONE", completedAt: "2026-09-01", hash: "0xab12cd34", approvedBy: "NIT Academic Office" },
      { id: 2, title: "Prototype Filter Unit Build & Lab Testing", pct: 35, status: "ACTIVE", completedAt: null, hash: null, approvedBy: null },
      { id: 3, title: "Community Installation & Field Validation", pct: 35, status: "LOCKED", completedAt: null, hash: null, approvedBy: null },
      { id: 4, title: "BDO Handover & Water Quality Cert", pct: 15, status: "LOCKED", completedAt: null, hash: null, approvedBy: null },
    ],
    pendingMilestones: [],
    studentCredits: { "STU-004": 2.4, "STU-005": 2.0 },
    studentHours: { "STU-004": 22, "STU-005": 18 },
    prototypeImage: null,
  },
  {
    id: "PROB-003",
    title: "No Cold Storage for Farmers — Gumla District",
    description: "Seasonal farmers in Gumla are losing 40–60% of produce due to absence of cold storage within 50km radius. Markets in Ranchi reject over-ripened produce causing ₹2.1Cr annual loss to ~800 farm families.",
    category: "Agriculture & Food Security",
    district: "Gumla",
    submittedBy: { id: "CIT-002", name: "Ramesh Oraon", role: "Kisan Samiti Representative" },
    submittedAt: "2026-07-15",
    votes: 87,
    status: "SOLUTION_PROPOSED",
    targetUniversity: "BIT_MESRA",
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [],
    },
    assignedUniversity: "BIT_MESRA",
    engagedTeam: {
      faculty: { name: "Dr. Anita Toppo", dept: "Electrical Engineering", email: "anita.toppo@bitmesra.ac.in" },
      students: ["STU-001"],
    },
    proposedSolution: {
      title: "Solar-Powered Evaporative Cold Storage Unit (5-Tonne Capacity)",
      summary: "Build a 5-tonne solar-PV powered evaporative cooling chamber using locally available materials. Extend shelf life by 12–18 days without grid power.",
      submittedAt: "2026-08-25",
      fundingAsk: 580000,
      breakdown: { solarPanels: 240000, cooling: 180000, civil: 100000, sensors: 60000 },
    },
    funding: null,
    milestones: [],
    pendingMilestones: [
      { id: "PM-001", studentId: "STU-001", title: "Completed thermodynamic load analysis and site survey", hours: 6, submittedAt: "2026-09-05", status: "PENDING" },
    ],
    studentCredits: { "STU-001": 1.5 },
    studentHours: { "STU-001": 16 },
    prototypeImage: null,
  },
  {
    id: "PROB-004",
    title: "No Specialist Doctors Accessible Within 100km — Simdega",
    description: "Simdega district has zero cardiologist, oncologist or radiologist. Patients travel 140km to Ranchi Medical College. Tribal families skipping critical diagnostics due to travel burden.",
    category: "Healthcare Access",
    district: "Simdega",
    submittedBy: { id: "CIT-003", name: "Father Thomas Minj", role: "Church Health Mission, Simdega" },
    submittedAt: "2026-08-18",
    votes: 241,
    status: "ENGAGED",
    targetUniversity: null,
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [
        { id: "AUD-003", label: "Patient Community Interview", duration: "2:05", recordedAt: "2026-08-17 04:00 PM" },
      ],
    },
    assignedUniversity: "NIT_JSR",
    engagedTeam: {
      faculty: { name: "Dr. Prabhat Ranjan", dept: "CS & AI Lab", email: "pranjan@nitjsr.ac.in" },
      students: ["STU-004"],
    },
    proposedSolution: null,
    funding: null,
    milestones: [],
    pendingMilestones: [],
    studentCredits: { "STU-004": 0.8 },
    studentHours: { "STU-004": 18 },
    prototypeImage: null,
  },
  {
    id: "PROB-005",
    title: "Zero Street Lighting on Mining Colony Roads — Dhanbad",
    description: "Post-sunset visibility near zero on 12km of unlit roads connecting 8 mining colonies to Dhanbad market. Accident rate 3x the state average. Women workers on night shifts report safety incidents weekly.",
    category: "Renewable Energy",
    district: "Dhanbad",
    submittedBy: { id: "CIT-004", name: "Smt. Kamla Devi", role: "Women's Self-Help Group Leader" },
    submittedAt: "2026-08-22",
    votes: 143,
    status: "OPEN",
    targetUniversity: null,
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [
        { id: "AUD-004", label: "Night patrol recording — colony roads", duration: "0:58", recordedAt: "2026-08-21 09:00 PM" },
      ],
    },
    assignedUniversity: null,
    engagedTeam: null,
    proposedSolution: null,
    funding: null,
    milestones: [],
    pendingMilestones: [],
    studentCredits: {},
    studentHours: {},
    prototypeImage: null,
  },
  {
    id: "PROB-006",
    title: "Flash Floods Destroying Agricultural Land — Palamu",
    description: "Unregulated quarrying upstream has destabilised hillside riverbeds causing flash floods every monsoon. 3 villages evacuated in 2026. 1200 acres of cultivable land lost to silt over 3 years.",
    category: "Disaster Management",
    district: "Palamu",
    submittedBy: { id: "CIT-005", name: "Village Council, Latehar Block", role: "Gram Sabha" },
    submittedAt: "2026-07-28",
    votes: 56,
    status: "OPEN",
    targetUniversity: "IIT_ISM",
    mediaFiles: {
      photos: [],
      audioNotes: [],
    },
    assignedUniversity: null,
    engagedTeam: null,
    proposedSolution: null,
    funding: null,
    milestones: [],
    pendingMilestones: [],
    studentCredits: {},
    studentHours: {},
    prototypeImage: null,
  },
  {
    id: "PROB-007",
    title: "Open Waste Dumping Near School — Hazaribagh",
    description: "A 3-acre open dump site active 200m from Kendriya Vidyalaya Hazaribagh. Leachate contamination of nearby borewell confirmed. 1800 students with persistent respiratory complaints.",
    category: "Waste Management",
    district: "Hazaribagh",
    submittedBy: { id: "CIT-001", name: "Birsa Munda", role: "Gram Panchayat Rep" },
    submittedAt: "2026-09-01",
    votes: 29,
    status: "OPEN",
    targetUniversity: null,
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [],
    },
    assignedUniversity: null,
    engagedTeam: null,
    proposedSolution: null,
    funding: null,
    milestones: [],
    pendingMilestones: [],
    studentCredits: {},
    studentHours: {},
    prototypeImage: null,
  },
  {
    id: "PROB-008",
    title: "Digital Literacy Gap — Farmers Missing PM-KISAN Benefits",
    description: "Over 12,000 eligible farmers in Bokaro have not accessed PM-KISAN direct benefit transfers due to inability to complete e-KYC on smartphones. Agents charge ₹200–500 per facilitation.",
    category: "Education & Digital Literacy",
    district: "Bokaro",
    submittedBy: { id: "CIT-002", name: "Ramesh Oraon", role: "Kisan Samiti Representative" },
    submittedAt: "2026-08-05",
    votes: 188,
    status: "COMPLETED",
    targetUniversity: "IIT_ISM",
    mediaFiles: {
      photos: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      ],
      audioNotes: [
        { id: "AUD-005", label: "Farmer interview — PM-KISAN access problems", duration: "1:34", recordedAt: "2026-08-04 02:30 PM" },
      ],
    },
    assignedUniversity: "IIT_ISM",
    engagedTeam: {
      faculty: { name: "Dr. Amitesh Varma", dept: "CS & AI", email: "amitesh@iitism.ac.in" },
      students: ["STU-006"],
    },
    proposedSolution: {
      title: "Offline Voice-Guided e-KYC Kiosk App (Santhali + Hindi)",
      summary: "Tablet kiosk with voice-guided PM-KISAN e-KYC in Santhali and Hindi deployed in Gram Panchayats. Biometric-linked, offline-first architecture.",
      submittedAt: "2026-08-18",
      fundingAsk: 320000,
      breakdown: { software: 160000, hardware: 80000, training: 50000, overhead: 30000 },
    },
    funding: {
      partner: "JSW Foundation",
      totalGranted: 320000,
      trancheReleased: 4,
      escrowBalance: 0,
    },
    milestones: [
      { id: 1, title: "Farmer Needs Survey & Language Corpus", pct: 15, status: "DONE", completedAt: "2026-08-20", hash: "0x1a2b3c4d", approvedBy: "IIT ISM Academic Office" },
      { id: 2, title: "App Development & Voice Model Training", pct: 35, status: "DONE", completedAt: "2026-08-30", hash: "0x5e6f7a8b", approvedBy: "Dr. Amitesh Varma" },
      { id: 3, title: "Kiosk Deployment in 12 Gram Panchayats", pct: 35, status: "DONE", completedAt: "2026-09-02", hash: "0x9c0d1e2f", approvedBy: "Dr. Amitesh Varma" },
      { id: 4, title: "State Handover & GeM Listing", pct: 15, status: "DONE", completedAt: "2026-09-05", hash: "0x3g4h5i6j", approvedBy: "Prof. Dean IIT ISM" },
    ],
    pendingMilestones: [],
    studentCredits: { "STU-006": 6.0 },
    studentHours: { "STU-006": 60 },
    prototypeImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
  },
];

// ============================================================
// STUDENT ROSTER
// ============================================================
export const STUDENT_ROSTER = [
  {
    id: "STU-001", name: "Ananya Roy", roll: "BM/CS/19/047",
    dept: "Computer Science & Engineering", semester: "7th Sem",
    university: "BIT_MESRA", email: "ananya.roy@bitmesra.ac.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-001", maxCredits: 6.0,
  },
  {
    id: "STU-002", name: "Rahul Sharma", roll: "BM/CE/19/031",
    dept: "Civil Engineering", semester: "M.Tech 3rd",
    university: "BIT_MESRA", email: "rahul.sharma@bitmesra.ac.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-001", maxCredits: 6.0,
  },
  {
    id: "STU-003", name: "Priya Soren", roll: "BM/ME/19/088",
    dept: "Mechanical Engineering", semester: "7th Sem",
    university: "BIT_MESRA", email: "priya.soren@bitmesra.ac.in",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-001", maxCredits: 6.0,
  },
  {
    id: "STU-004", name: "Vivek Mahato", roll: "NIT/CS/20/012",
    dept: "Computer Science & Engineering", semester: "6th Sem",
    university: "NIT_JSR", email: "vivek.mahato@nitjsr.ac.in",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-004", maxCredits: 6.0,
  },
  {
    id: "STU-005", name: "Sona Munda", roll: "NIT/CE/20/067",
    dept: "Civil & Environmental Engineering", semester: "6th Sem",
    university: "NIT_JSR", email: "sona.munda@nitjsr.ac.in",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-002", maxCredits: 6.0,
  },
  {
    id: "STU-006", name: "Deepak Hembrom", roll: "ISM/CS/19/003",
    dept: "Computer Science & Engineering", semester: "M.Tech 4th",
    university: "IIT_ISM", email: "deepak.hembrom@iitism.ac.in",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    activeProblem: "PROB-008", maxCredits: 6.0,
  },
];

// ============================================================
// DEMO PERSONAS
// ============================================================
export const DEMO_PERSONAS = [
  {
    id: "citizen",
    roleName: "Citizen / Community Rep",
    subtitle: "Post, vote & track civic problems",
    iconColor: "bg-rose-500",
    accentColor: "rose",
    email: "birsa.munda@namkum.jh",
    user: {
      id: "CIT-001", name: "Birsa Munda",
      title: "Gram Panchayat Representative, Namkum",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      district: "Ranchi",
    },
  },
  {
    id: "university",
    roleName: "University Admin",
    subtitle: "Manage problems, faculty & student teams",
    iconColor: "bg-violet-600",
    accentColor: "violet",
    email: "admin@bitmesra.ac.in",
    user: {
      id: "UNI-001", name: "Prof. Ajay Nath",
      title: "Dean of Research & Innovation, BIT Mesra",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      universityId: "BIT_MESRA",
    },
  },
  {
    id: "student",
    roleName: "Student Innovator",
    subtitle: "Claim problems, submit solutions",
    iconColor: "bg-emerald-600",
    accentColor: "emerald",
    email: "ananya.roy@bitmesra.ac.in",
    user: {
      id: "STU-001", name: "Ananya Roy",
      title: "B.Tech CS, 7th Sem — BIT Mesra",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      universityId: "BIT_MESRA",
    },
  },
  {
    id: "industry",
    roleName: "CSR / Industry Partner",
    subtitle: "Fund validated projects, track milestones",
    iconColor: "bg-amber-500",
    accentColor: "amber",
    email: "csr@nhif.org.in",
    user: {
      id: "IND-001", name: "Vikramaditya Singh",
      title: "Head of CSR & Venture Capital",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      company: "National Highway & Infrastructure Fund",
    },
  },
  {
    id: "government",
    roleName: "Government / Mission Control",
    subtitle: "Oversee all districts, fund flows & procurement",
    iconColor: "bg-blue-700",
    accentColor: "blue",
    email: "collector.ranchi@jharkhand.gov.in",
    user: {
      id: "GOV-001", name: "Shri Rahul Varma, IAS",
      title: "District Magistrate & Collector",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      district: "Jharkhand State",
    },
  },
];

// ============================================================
// ACTIVITY LOG
// ============================================================
export const SEED_ACTIVITY_LOG = [
  { id: "A01", time: "Today 09:30", actor: "Ananya Roy (Student)", action: "Submitted milestone for review: 'LoRaWAN sensor mesh deployed on Pier 3'", problemId: "PROB-001", type: "milestone" },
  { id: "A02", time: "Today 09:00", actor: "Vikramaditya Singh (NHIF)", action: "Tranche 2 funds released — ₹2,62,500 disbursed to BIT Mesra escrow", problemId: "PROB-001", type: "funding" },
  { id: "A03", time: "Yesterday 17:30", actor: "Dr. Rajesh Kumar (Faculty)", action: "Milestone approved: structural simulation complete. Credits updated.", problemId: "PROB-001", type: "approval" },
  { id: "A04", time: "Yesterday 15:00", actor: "Smt. Kamla Devi (Citizen)", action: "New problem submitted with voice note: 'Zero Street Lighting — Dhanbad mining colony'", problemId: "PROB-005", type: "submit" },
  { id: "A05", time: "2 days ago", actor: "Tata Steel CSR Foundation", action: "₹4,20,000 CSR grant deployed for Water Quality project (PROB-002)", problemId: "PROB-002", type: "funding" },
  { id: "A06", time: "2 days ago", actor: "Prof. Ajay Nath (BIT Mesra)", action: "Assigned Dr. Anita Toppo as faculty mentor. 1.5 credits awarded to Ananya Roy.", problemId: "PROB-003", type: "assignment" },
  { id: "A07", time: "3 days ago", actor: "IIT ISM Academic Office", action: "PROB-008 marked COMPLETED — 6.0 credits awarded to Deepak Hembrom", problemId: "PROB-008", type: "milestone" },
  { id: "A08", time: "4 days ago", actor: "Sona Munda (Student)", action: "Claimed PROB-002 — status changed to ENGAGED by NIT Jamshedpur admin", problemId: "PROB-002", type: "engage" },
];
