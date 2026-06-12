// ── Bins ───────────────────────────────────────────────────
export const mockBins = [
  { id: 'BIN-001', location: 'Lekki Phase 1, Block A', zone: 'Lekki', fill: 72, odor: 1.8, status: 'moderate', lastPickup: '2025-01-10T08:00:00', collector: 'Adewale Bello', lat: 6.4281, lng: 3.4219, bottles: 842 },
  { id: 'BIN-002', location: 'Victoria Island, Plot 5', zone: 'Victoria Is.', fill: 38, odor: 0.9, status: 'active',   lastPickup: '2025-01-11T10:00:00', collector: 'Ngozi Eze',    lat: 6.4281, lng: 3.4219, bottles: 310 },
  { id: 'BIN-003', location: 'Ikoyi, Awolowo Rd',      zone: 'Ikoyi',        fill: 94, odor: 4.2, status: 'full',     lastPickup: '2025-01-09T14:00:00', collector: 'Adewale Bello', lat: 6.4550, lng: 3.4350, bottles: 1247 },
  { id: 'BIN-004', location: 'Surulere, Bode Thomas',  zone: 'Surulere',     fill: 22, odor: 0.6, status: 'active',   lastPickup: '2025-01-12T09:00:00', collector: 'Emeka Otu',    lat: 6.5000, lng: 3.3500, bottles: 194 },
  { id: 'BIN-005', location: 'Yaba, Herbert Macaulay', zone: 'Yaba',         fill: 61, odor: 2.1, status: 'moderate', lastPickup: '2025-01-11T16:00:00', collector: 'Emeka Otu',    lat: 6.5100, lng: 3.3700, bottles: 678 },
  { id: 'BIN-006', location: 'Ikeja, Allen Avenue',    zone: 'Ikeja',        fill: 88, odor: 3.7, status: 'full',     lastPickup: '2025-01-10T11:00:00', collector: 'Tunde Adeyemi',lat: 6.6018, lng: 3.3515, bottles: 1108 },
  { id: 'BIN-007', location: 'Ajah, Sangotedo',        zone: 'Ajah',         fill: 15, odor: 0.3, status: 'active',   lastPickup: '2025-01-12T07:00:00', collector: 'Tunde Adeyemi',lat: 6.4700, lng: 3.5600, bottles: 123 },
  { id: 'BIN-008', location: 'Gbagada, Phase 2',       zone: 'Gbagada',      fill: 55, odor: 1.9, status: 'moderate', lastPickup: '2025-01-11T13:00:00', collector: 'Ngozi Eze',    lat: 6.5500, lng: 3.3900, bottles: 588 },
  { id: 'BIN-009', location: 'Mushin, Market Rd',      zone: 'Mushin',       fill: 97, odor: 5.1, status: 'full',     lastPickup: '2025-01-08T10:00:00', collector: 'Chidi Nwosu',  lat: 6.5300, lng: 3.3600, bottles: 1380 },
  { id: 'BIN-010', location: 'Oshodi, International',  zone: 'Oshodi',       fill: 43, odor: 1.2, status: 'active',   lastPickup: '2025-01-12T06:00:00', collector: 'Chidi Nwosu',  lat: 6.5500, lng: 3.3400, bottles: 445 },
  { id: 'BIN-011', location: 'Maryland, Ikorodu Rd',   zone: 'Maryland',     fill: 76, odor: 2.8, status: 'moderate', lastPickup: '2025-01-10T15:00:00', collector: 'Tunde Adeyemi',lat: 6.5600, lng: 3.3700, bottles: 904 },
  { id: 'BIN-012', location: 'Agege, Agege Motor Rd',  zone: 'Agege',        fill: 0,  odor: 0.0, status: 'offline',  lastPickup: '2025-01-12T11:00:00', collector: null,            lat: 6.6200, lng: 3.3200, bottles: 0 },
];

// ── Incidents ──────────────────────────────────────────────
export const mockIncidents = [
  { id: 'INC-001', category: 'Overflow',        location: 'Surulere, Bode Thomas',  zone: 'Surulere', severity: 'Critical', filedBy: 'Amaka Obi',    date: '2025-01-12T09:22:00', status: 'Open',      assigned: null,             photo: true },
  { id: 'INC-002', category: 'Illegal Dumping', location: 'Yaba, Herbert Macaulay', zone: 'Yaba',     severity: 'High',     filedBy: 'Chidi Nwosu',  date: '2025-01-12T07:45:00', status: 'Assigned',  assigned: 'Zone Officer 3', photo: true },
  { id: 'INC-003', category: 'Odor',            location: 'Mushin, Market Area',    zone: 'Mushin',   severity: 'Medium',   filedBy: 'Fatima Bello', date: '2025-01-11T18:10:00', status: 'In Review', assigned: 'Inspector Bello',photo: false },
  { id: 'INC-004', category: 'Bin Damage',      location: 'Ikeja, Allen Avenue',    zone: 'Ikeja',    severity: 'Low',      filedBy: 'Emeka Eze',    date: '2025-01-11T14:30:00', status: 'Resolved',  assigned: 'Maintenance 1',  photo: false },
  { id: 'INC-005', category: 'Overflow',        location: 'Ikoyi, Awolowo Rd',      zone: 'Ikoyi',    severity: 'High',     filedBy: 'Ngozi Adeyemi',date: '2025-01-11T11:05:00', status: 'Resolved',  assigned: 'Zone Officer 1', photo: true },
  { id: 'INC-006', category: 'Illegal Dumping', location: 'Mushin, Orile Junction', zone: 'Mushin',   severity: 'Critical', filedBy: 'Tunde Bakare', date: '2025-01-10T20:00:00', status: 'Closed',    assigned: 'Zone Officer 2', photo: true },
  { id: 'INC-007', category: 'Air Quality',     location: 'Agege, Agege Motor Rd',  zone: 'Agege',    severity: 'Medium',   filedBy: 'Amaka Obi',    date: '2025-01-10T16:45:00', status: 'Open',      assigned: null,             photo: false },
  { id: 'INC-008', category: 'Odor',            location: 'Gbagada, Phase 2',       zone: 'Gbagada',  severity: 'Low',      filedBy: 'Fatima Bello', date: '2025-01-10T09:20:00', status: 'In Review', assigned: 'Inspector Adamu',photo: false },
];

// ── Activity Feed ──────────────────────────────────────────
export const mockActivity = [
  { id: 1, text: 'BIN-009 reached 97% capacity — Mushin', category: 'critical', time: '4m ago' },
  { id: 2, text: 'Incident INC-007 filed in Agege Zone', category: 'info',     time: '11m ago' },
  { id: 3, text: 'Collector Adewale completed Route #14', category: 'success', time: '18m ago' },
  { id: 4, text: 'Marketplace: 80kg PET bottles listed',  category: 'info',    time: '26m ago' },
  { id: 5, text: 'BIN-012 went offline — Agege Motor Rd', category: 'warning', time: '34m ago' },
  { id: 6, text: 'BIN-003 serviced — Ikoyi Awolowo Rd',   category: 'success', time: '52m ago' },
  { id: 7, text: 'Air quality alert: Mushin Zone 4.8ppm',  category: 'warning', time: '1h ago' },
  { id: 8, text: 'Route #11 optimised — 3 bins added',    category: 'info',    time: '1h ago' },
  { id: 9, text: 'BIN-006 reached 88% — Ikeja Allen Ave', category: 'warning', time: '2h ago' },
  { id: 10,text: 'INC-005 resolved — Ikoyi Awolowo Rd',   category: 'success', time: '2h ago' },
];

// ── Weekly Waste Volume (kg) ───────────────────────────────
export const wasteVolumeData = [
  { day: 'Mon', organic: 2840, plastic: 1650, metal: 420, paper: 880 },
  { day: 'Tue', organic: 3120, plastic: 1890, metal: 380, paper: 920 },
  { day: 'Wed', organic: 2650, plastic: 1720, metal: 450, paper: 760 },
  { day: 'Thu', organic: 3380, plastic: 2100, metal: 510, paper: 1050 },
  { day: 'Fri', organic: 4200, plastic: 2450, metal: 580, paper: 1380 },
  { day: 'Sat', organic: 4850, plastic: 2800, metal: 620, paper: 1520 },
  { day: 'Sun', organic: 3600, plastic: 2200, metal: 490, paper: 1250 },
];

// ── Zone Performance ───────────────────────────────────────
export const zoneData = [
  { zone: 'Lekki',       efficiency: 87, bins: 48, pickups: 156 },
  { zone: 'Victoria Is.', efficiency: 92, bins: 32, pickups: 124 },
  { zone: 'Ikoyi',       efficiency: 78, bins: 28, pickups: 98  },
  { zone: 'Surulere',    efficiency: 65, bins: 52, pickups: 167 },
  { zone: 'Yaba',        efficiency: 71, bins: 44, pickups: 142 },
  { zone: 'Ikeja',       efficiency: 83, bins: 60, pickups: 198 },
];

// ── Waste Composition ──────────────────────────────────────
export const wasteComposition = [
  { name: 'Organic',   value: 38, color: '#1A7F4E' },
  { name: 'Plastic',   value: 27, color: '#D4A017' },
  { name: 'Paper',     value: 15, color: '#1E88E5' },
  { name: 'Metal',     value: 10, color: '#8B949E' },
  { name: 'General',   value: 10, color: '#484F58' },
];

// ── Notifications ──────────────────────────────────────────
export const mockNotifications = [
  { id: 1, title: 'BIN-009 at 97% Capacity', body: 'Mushin Market Rd bin requires immediate collection.', time: '4m ago', read: false, type: 'critical' },
  { id: 2, title: 'Route #14 Completed',     body: 'Collector Adewale cleared 8 bins in Surulere zone.', time: '18m ago', read: false, type: 'success' },
  { id: 3, title: 'BIN-012 Offline',          body: 'Agege Motor Rd bin is not reporting sensor data.',  time: '34m ago', read: false, type: 'warning' },
  { id: 4, title: 'New Incident Filed',        body: 'Illegal dumping reported near Yaba Herbert Macaulay.', time: '1h ago', read: true, type: 'info' },
  { id: 5, title: 'Air Quality Alert',         body: 'Mushin Zone odor level at 4.8ppm — above threshold.', time: '2h ago', read: true, type: 'warning' },
];

// ── Marketplace Listings ───────────────────────────────────
export const mockMarketplaceListings = [
  { id: 1, material: 'PET Bottles', grade: 'A', qty: 240, unit: 'kg', price: 1200, seller: 'Amaka Obi',    location: 'Lekki Phase 1',  zone: 'Lekki',  listed: '2 days ago', status: 'Available' },
  { id: 2, material: 'Cardboard',   grade: 'B', qty: 180, unit: 'kg', price: 450,  seller: 'Chidi Nwosu',  location: 'Victoria Island', zone: 'Victoria Is.', listed: '3 days ago', status: 'Available' },
  { id: 3, material: 'Metal Scrap', grade: 'A', qty: 85,  unit: 'kg', price: 3200, seller: 'Emeka Eze',    location: 'Ikoyi',           zone: 'Ikoyi',  listed: '1 day ago',  status: 'Sold' },
  { id: 4, material: 'Glass',       grade: 'B', qty: 60,  unit: 'kg', price: 280,  seller: 'Fatima Bello', location: 'Surulere',         zone: 'Surulere',listed: '4 days ago', status: 'Available' },
  { id: 5, material: 'PET Bottles', grade: 'B', qty: 320, unit: 'kg', price: 950,  seller: 'Ngozi Adeyemi',location: 'Yaba',             zone: 'Yaba',   listed: '1 day ago',  status: 'Available' },
  { id: 6, material: 'Cardboard',   grade: 'A', qty: 95,  unit: 'kg', price: 520,  seller: 'Tunde Bakare', location: 'Ikeja',            zone: 'Ikeja',  listed: '5 days ago', status: 'Pending' },
  { id: 7, material: 'Aluminium',   grade: 'A', qty: 42,  unit: 'kg', price: 4800, seller: 'Amaka Obi',    location: 'Lekki Phase 2',   zone: 'Lekki',  listed: '6h ago',     status: 'Available' },
];

// ── Organic Listings ───────────────────────────────────────
export const mockOrganicListings = [
  { id: 1, type: 'Food Scraps',    qty: 80,  unit: 'kg', grade: 'A', fertValue: 2400, location: 'Lekki Phase 1',  listed: '1 day ago',  status: 'Available' },
  { id: 2, type: 'Yard Waste',     qty: 120, unit: 'kg', grade: 'B', fertValue: 1800, location: 'Victoria Island', listed: '2 days ago', status: 'Available' },
  { id: 3, type: 'Mixed Organic',  qty: 55,  unit: 'kg', grade: 'A', fertValue: 3100, location: 'Ikoyi',           listed: '3 days ago', status: 'Claimed' },
  { id: 4, type: 'Food Scraps',    qty: 40,  unit: 'kg', grade: 'C', fertValue: 900,  location: 'Surulere',         listed: '4 days ago', status: 'Available' },
  { id: 5, type: 'Yard Waste',     qty: 200, unit: 'kg', grade: 'B', fertValue: 2200, location: 'Gbagada',          listed: '1 day ago',  status: 'Available' },
];

// ── Collection Jobs ────────────────────────────────────────
export const mockCollectionJobs = [
  { id: 'JOB-001', binId: 'BIN-003', location: 'Ikoyi, Awolowo Rd',      zone: 'Ikoyi',    fill: 94, urgency: 'Urgent',    status: 'available',  earnings: 1200, distance: '2.8km' },
  { id: 'JOB-002', binId: 'BIN-009', location: 'Mushin, Market Rd',       zone: 'Mushin',   fill: 97, urgency: 'Critical',  status: 'available',  earnings: 1500, distance: '4.2km' },
  { id: 'JOB-003', binId: 'BIN-001', location: 'Lekki Phase 1, Block A',  zone: 'Lekki',    fill: 72, urgency: 'Normal',    status: 'available',  earnings: 850,  distance: '1.2km' },
  { id: 'JOB-004', binId: 'BIN-006', location: 'Ikeja, Allen Avenue',     zone: 'Ikeja',    fill: 88, urgency: 'Urgent',    status: 'available',  earnings: 950,  distance: '6.3km' },
  { id: 'JOB-005', binId: 'BIN-008', location: 'Gbagada, Phase 2',        zone: 'Gbagada',  fill: 55, urgency: 'Scheduled', status: 'available',  earnings: 600,  distance: '8.0km' },
];

// ── Routes ─────────────────────────────────────────────────
export const mockRoutes = [
  { id: 'RT-014', zone: 'Surulere', bins: 8, fullBins: 3, distance: 2.4, collector: 'Adewale Bello', status: 'In Progress', progress: 3 },
  { id: 'RT-015', zone: 'Yaba',     bins: 6, fullBins: 2, distance: 1.8, collector: 'Emeka Otu',    status: 'Pending',     progress: 0 },
  { id: 'RT-016', zone: 'Lekki',    bins: 10,fullBins: 4, distance: 4.1, collector: 'Ngozi Eze',    status: 'Pending',     progress: 0 },
  { id: 'RT-013', zone: 'Ikoyi',    bins: 5, fullBins: 5, distance: 1.6, collector: 'Adewale Bello', status: 'Complete',   progress: 5 },
];

// ── Scan History ───────────────────────────────────────────
export const mockScanHistory = [
  { id: 1, type: 'PET Bottle',    category: 'Recyclable', date: '2025-01-12T10:45:00', confidence: 94, points: 15 },
  { id: 2, type: 'Banana Peel',   category: 'Organic',    date: '2025-01-12T09:15:00', confidence: 97, points: 10 },
  { id: 3, type: 'Cardboard Box', category: 'Recyclable', date: '2025-01-12T08:30:00', confidence: 88, points: 20 },
  { id: 4, type: 'Food Waste',    category: 'Organic',    date: '2025-01-11T18:00:00', confidence: 94, points: 10 },
  { id: 5, type: 'Broken Glass',  category: 'General',    date: '2025-01-11T13:00:00', confidence: 85, points: 5  },
  { id: 6, type: 'Aluminium Can', category: 'Recyclable', date: '2025-01-10T20:00:00', confidence: 96, points: 15 },
  { id: 7, type: 'Newspaper',     category: 'Recyclable', date: '2025-01-10T11:00:00', confidence: 93, points: 12 },
  { id: 8, type: 'Veg. Scraps',   category: 'Organic',    date: '2025-01-09T19:30:00', confidence: 92, points: 10 },
];

// ── Rewards ────────────────────────────────────────────────
export const mockRewards = [
  { id: 1, name: '₦500 Airtime',        cost: 200, category: 'Voucher'     },
  { id: 2, name: 'Free Composting Bag', cost: 150, category: 'Product'     },
  { id: 3, name: 'Lagos Eco Certificate', cost: 500, category: 'Certificate' },
  { id: 4, name: '₦1,000 Grocery Voucher', cost: 400, category: 'Voucher'  },
  { id: 5, name: 'Solar Lantern',       cost: 800, category: 'Product'     },
  { id: 6, name: 'Tree Planting Credit',cost: 300, category: 'Impact'      },
];

// ── Badges ─────────────────────────────────────────────────
export const mockBadges = [
  { id: 1, name: 'First Scan',       earned: true,  description: 'Complete your first waste scan' },
  { id: 2, name: 'Green Streak',     earned: true,  description: 'Sort waste 7 days in a row' },
  { id: 3, name: 'Recycler Pro',     earned: true,  description: 'Recycle 50 items' },
  { id: 4, name: 'Organic Hero',     earned: false, description: 'Divert 100kg of organic waste' },
  { id: 5, name: 'Community Leader', earned: false, description: 'Reach top 3 on leaderboard' },
  { id: 6, name: 'Zero Waste Week',  earned: false, description: 'Zero general waste for 7 days' },
];

// ── Users ──────────────────────────────────────────────────
export const mockUsers = [
  { id: 1, name: 'Amaka Obi',       role: 'citizen',   zone: 'Lekki',   joined: '2024-08-15', score: 94, status: 'Active',    reports: 12, points: 1240 },
  { id: 2, name: 'Chidi Nwosu',     role: 'collector', zone: 'Ikeja',   joined: '2024-09-01', score: 88, status: 'Active',    reports: 3,  points: 0    },
  { id: 3, name: 'Fatima Bello',    role: 'recycler',  zone: 'Yaba',    joined: '2024-07-20', score: 76, status: 'Active',    reports: 8,  points: 980  },
  { id: 4, name: 'Emeka Eze',       role: 'buyer',     zone: 'Surulere',joined: '2024-10-05', score: 65, status: 'Active',    reports: 5,  points: 760  },
  { id: 5, name: 'Ngozi Adeyemi',   role: 'citizen',   zone: 'Mushin',  joined: '2024-11-12', score: 45, status: 'Suspended', reports: 2,  points: 340  },
  { id: 6, name: 'Tunde Bakare',    role: 'collector', zone: 'Gbagada', joined: '2024-12-01', score: 30, status: 'Active',    reports: 1,  points: 0    },
  { id: 7, name: 'Adaeze Okonkwo',  role: 'citizen',   zone: 'Victoria Is.',joined: '2024-06-10', score: 82, status: 'Active', reports: 7, points: 1105 },
];

// ── Waste classifications for scanner ─────────────────────
export const wasteClassifications = [
  { type: 'PET Bottle',    category: 'Recyclable', confidence: 91, points: 15 },
  { type: 'Banana Peel',   category: 'Organic',    confidence: 97, points: 10 },
  { type: 'Cardboard Box', category: 'Recyclable', confidence: 88, points: 20 },
  { type: 'Food Waste',    category: 'Organic',    confidence: 94, points: 10 },
  { type: 'Broken Glass',  category: 'General',    confidence: 85, points: 5  },
  { type: 'Aluminium Can', category: 'Recyclable', confidence: 96, points: 15 },
  { type: 'Newspaper',     category: 'Recyclable', confidence: 93, points: 12 },
  { type: 'Veg. Scraps',   category: 'Organic',    confidence: 92, points: 10 },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Amaka Obi',     score: 94, points: 1240 },
  { rank: 2, name: 'Adaeze Okonkwo',score: 82, points: 1105 },
  { rank: 3, name: 'Fatima Bello',  score: 76, points: 980  },
  { rank: 4, name: 'You',           score: 78, points: 845, isUser: true },
  { rank: 5, name: 'Emeka Eze',     score: 65, points: 760  },
];
