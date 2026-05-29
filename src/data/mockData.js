export const mockBins = [
  { id: 'BIN-001', location: 'Lekki Phase 1, Block A', fillLevels: { organic: 72, recyclable: 45, general: 88 }, lastCollected: '2025-01-10T08:00:00', status: 'flagged', lat: 6.4281, lng: 3.4219 },
  { id: 'BIN-002', location: 'Victoria Island, Plot 5', fillLevels: { organic: 30, recyclable: 60, general: 40 }, lastCollected: '2025-01-11T10:00:00', status: 'active', lat: 6.4281, lng: 3.4219 },
  { id: 'BIN-003', location: 'Ikoyi, Awolowo Rd', fillLevels: { organic: 90, recyclable: 85, general: 95 }, lastCollected: '2025-01-09T14:00:00', status: 'full', lat: 6.4550, lng: 3.4350 },
  { id: 'BIN-004', location: 'Surulere, Bode Thomas', fillLevels: { organic: 20, recyclable: 35, general: 25 }, lastCollected: '2025-01-12T09:00:00', status: 'active', lat: 6.5000, lng: 3.3500 },
  { id: 'BIN-005', location: 'Yaba, Herbert Macaulay', fillLevels: { organic: 65, recyclable: 78, general: 55 }, lastCollected: '2025-01-11T16:00:00', status: 'active', lat: 6.5100, lng: 3.3700 },
  { id: 'BIN-006', location: 'Ikeja, Allen Avenue', fillLevels: { organic: 82, recyclable: 91, general: 70 }, lastCollected: '2025-01-10T11:00:00', status: 'flagged', lat: 6.6018, lng: 3.3515 },
  { id: 'BIN-007', location: 'Ajah, Sangotedo', fillLevels: { organic: 15, recyclable: 22, general: 18 }, lastCollected: '2025-01-12T07:00:00', status: 'active', lat: 6.4700, lng: 3.5600 },
  { id: 'BIN-008', location: 'Gbagada, Phase 2', fillLevels: { organic: 55, recyclable: 48, general: 62 }, lastCollected: '2025-01-11T13:00:00', status: 'active', lat: 6.5500, lng: 3.3900 },
];

export const mockNotifications = [
  { id: 1, title: 'Bin BIN-003 is Full', body: 'Ikoyi bin has reached 95% capacity. Collection needed.', time: '2025-01-12T10:30:00', read: false, icon: '🗑️', type: 'warning' },
  { id: 2, title: 'Points Earned!', body: 'You earned 15 points for scanning a plastic bottle.', time: '2025-01-12T09:15:00', read: false, icon: '⭐', type: 'success' },
  { id: 3, title: 'Collection Completed', body: 'Your bin at Lekki Phase 1 was collected successfully.', time: '2025-01-11T14:00:00', read: true, icon: '✅', type: 'success' },
  { id: 4, title: 'New Marketplace Listing', body: '45kg of sorted plastics available near you.', time: '2025-01-11T08:00:00', read: true, icon: '♻️', type: 'info' },
  { id: 5, title: 'Route Optimised', body: 'Your collection route has been updated for today.', time: '2025-01-10T07:30:00', read: true, icon: '🗺️', type: 'info' },
];

export const mockMarketplaceListings = [
  { id: 1, type: 'Plastics', quantity: 45, unit: 'kg', location: 'Lekki Phase 1', distance: '1.2km', quality: 4, posted: '2025-01-12T08:00:00', claimed: false, compostGrade: null },
  { id: 2, type: 'Paper', quantity: 30, unit: 'kg', location: 'Victoria Island', distance: '2.5km', quality: 5, posted: '2025-01-12T07:30:00', claimed: false, compostGrade: null },
  { id: 3, type: 'Metals', quantity: 12, unit: 'kg', location: 'Ikoyi', distance: '3.1km', quality: 3, posted: '2025-01-11T16:00:00', claimed: false, compostGrade: null },
  { id: 4, type: 'Glass', quantity: 20, unit: 'kg', location: 'Surulere', distance: '4.8km', quality: 4, posted: '2025-01-11T14:00:00', claimed: false, compostGrade: null },
  { id: 5, type: 'Plastics', quantity: 60, unit: 'kg', location: 'Yaba', distance: '5.2km', quality: 2, posted: '2025-01-11T10:00:00', claimed: false, compostGrade: null },
  { id: 6, type: 'Paper', quantity: 18, unit: 'kg', location: 'Ikeja', distance: '6.0km', quality: 5, posted: '2025-01-10T09:00:00', claimed: false, compostGrade: null },
];

export const mockOrganicListings = [
  { id: 1, type: 'Food Scraps', quantity: 80, unit: 'kg', location: 'Lekki Phase 1', distance: '1.2km', compostGrade: 'A', availableFrom: '2025-01-13', fertilizerValue: 2400, posted: '2025-01-12T08:00:00', claimed: false },
  { id: 2, type: 'Yard Waste', quantity: 120, unit: 'kg', location: 'Victoria Island', distance: '2.5km', compostGrade: 'B', availableFrom: '2025-01-13', fertilizerValue: 1800, posted: '2025-01-12T07:00:00', claimed: false },
  { id: 3, type: 'Mixed Organic', quantity: 55, unit: 'kg', location: 'Ikoyi', distance: '3.1km', compostGrade: 'A', availableFrom: '2025-01-14', fertilizerValue: 3100, posted: '2025-01-11T15:00:00', claimed: false },
  { id: 4, type: 'Food Scraps', quantity: 40, unit: 'kg', location: 'Surulere', distance: '4.8km', compostGrade: 'C', availableFrom: '2025-01-14', fertilizerValue: 900, posted: '2025-01-11T12:00:00', claimed: false },
  { id: 5, type: 'Yard Waste', quantity: 200, unit: 'kg', location: 'Gbagada', distance: '5.5km', compostGrade: 'B', availableFrom: '2025-01-15', fertilizerValue: 2200, posted: '2025-01-10T10:00:00', claimed: false },
];

export const mockCollectionJobs = [
  { id: 'JOB-001', binId: 'BIN-001', location: 'Lekki Phase 1, Block A', distance: '1.2km', fillLevels: { organic: 72, recyclable: 45, general: 88 }, urgency: 'Urgent', status: 'available', earnings: 850 },
  { id: 'JOB-002', binId: 'BIN-003', location: 'Ikoyi, Awolowo Rd', distance: '2.8km', fillLevels: { organic: 90, recyclable: 85, general: 95 }, urgency: 'Urgent', status: 'available', earnings: 1200 },
  { id: 'JOB-003', binId: 'BIN-005', location: 'Yaba, Herbert Macaulay', distance: '4.1km', fillLevels: { organic: 65, recyclable: 78, general: 55 }, urgency: 'Normal', status: 'available', earnings: 700 },
  { id: 'JOB-004', binId: 'BIN-006', location: 'Ikeja, Allen Avenue', distance: '6.3km', fillLevels: { organic: 82, recyclable: 91, general: 70 }, urgency: 'Normal', status: 'available', earnings: 950 },
  { id: 'JOB-005', binId: 'BIN-008', location: 'Gbagada, Phase 2', distance: '8.0km', fillLevels: { organic: 55, recyclable: 48, general: 62 }, urgency: 'Scheduled', status: 'available', earnings: 600 },
];

export const mockScanHistory = [
  { id: 0, type: 'Plastic Waste (Willerbin)', category: 'recyclable', date: '2025-01-12T10:45:00', confidence: 94, points: 15, icon: '🧴' },
  { id: 1, type: 'Plastic Bottle', category: 'recyclable', date: '2025-01-12T09:15:00', confidence: 91, points: 15, icon: '🍶' },
  { id: 2, type: 'Banana Peel', category: 'organic', date: '2025-01-12T08:30:00', confidence: 97, points: 10, icon: '🍌' },
  { id: 3, type: 'Cardboard Box', category: 'recyclable', date: '2025-01-11T18:00:00', confidence: 88, points: 20, icon: '📦' },
  { id: 4, type: 'Food Waste', category: 'organic', date: '2025-01-11T13:00:00', confidence: 94, points: 10, icon: '🍱' },
  { id: 5, type: 'Broken Glass', category: 'general', date: '2025-01-10T20:00:00', confidence: 85, points: 5, icon: '🪟' },
  { id: 6, type: 'Aluminium Can', category: 'recyclable', date: '2025-01-10T11:00:00', confidence: 96, points: 15, icon: '🥫' },
  { id: 7, type: 'Vegetable Scraps', category: 'organic', date: '2025-01-09T19:30:00', confidence: 92, points: 10, icon: '🥦' },
];

export const mockRewards = [
  { id: 1, name: '₦500 Airtime', cost: 200, image: '📱', category: 'Voucher' },
  { id: 2, name: 'Free Composting Bag', cost: 150, image: '🌱', category: 'Product' },
  { id: 3, name: 'Lagos Eco Certificate', cost: 500, image: '🏆', category: 'Certificate' },
  { id: 4, name: '₦1000 Grocery Voucher', cost: 400, image: '🛒', category: 'Voucher' },
  { id: 5, name: 'Solar Lantern', cost: 800, image: '🔦', category: 'Product' },
  { id: 6, name: 'Tree Planting Credit', cost: 300, image: '🌳', category: 'Impact' },
];

export const mockBadges = [
  { id: 1, name: 'First Scan', icon: '🔍', earned: true, description: 'Complete your first waste scan' },
  { id: 2, name: 'Green Streak', icon: '🔥', earned: true, description: 'Sort waste 7 days in a row' },
  { id: 3, name: 'Recycler Pro', icon: '♻️', earned: true, description: 'Recycle 50 items' },
  { id: 4, name: 'Organic Hero', icon: '🌿', earned: false, description: 'Divert 100kg of organic waste' },
  { id: 5, name: 'Community Leader', icon: '👑', earned: false, description: 'Reach top 3 on leaderboard' },
  { id: 6, name: 'Zero Waste Week', icon: '🌍', earned: false, description: 'Zero general waste for 7 days' },
  { id: 7, name: 'Point Millionaire', icon: '💎', earned: false, description: 'Accumulate 1000 points' },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Amaka Obi', score: 94, points: 1240 },
  { rank: 2, name: 'Chidi Nwosu', score: 89, points: 1105 },
  { rank: 3, name: 'Fatima Bello', score: 85, points: 980 },
  { rank: 4, name: 'You', score: 78, points: 845, isUser: true },
  { rank: 5, name: 'Emeka Eze', score: 72, points: 760 },
];

export const mockUsers = [
  { id: 1, name: 'Amaka Obi', role: 'household', joined: '2024-08-15', activityScore: 94, status: 'active' },
  { id: 2, name: 'Chidi Nwosu', role: 'collector', joined: '2024-09-01', activityScore: 88, status: 'active' },
  { id: 3, name: 'Fatima Bello', role: 'recycler', joined: '2024-07-20', activityScore: 76, status: 'active' },
  { id: 4, name: 'Emeka Eze', role: 'farmer', joined: '2024-10-05', activityScore: 65, status: 'active' },
  { id: 5, name: 'Ngozi Adeyemi', role: 'household', joined: '2024-11-12', activityScore: 45, status: 'suspended' },
  { id: 6, name: 'Tunde Bakare', role: 'collector', joined: '2024-12-01', activityScore: 30, status: 'active' },
];

export const mockWasteClassifications = [
  { type: 'Plastic Bottle', category: 'recyclable', confidence: 91, points: 15, icon: '🍶' },
  { type: 'Banana Peel', category: 'organic', confidence: 97, points: 10, icon: '🍌' },
  { type: 'Cardboard Box', category: 'recyclable', confidence: 88, points: 20, icon: '📦' },
  { type: 'Food Waste', category: 'organic', confidence: 94, points: 10, icon: '🍱' },
  { type: 'Broken Glass', category: 'general', confidence: 85, points: 5, icon: '🪟' },
  { type: 'Aluminium Can', category: 'recyclable', confidence: 96, points: 15, icon: '🥫' },
  { type: 'Newspaper', category: 'recyclable', confidence: 93, points: 12, icon: '📰' },
  { type: 'Vegetable Scraps', category: 'organic', confidence: 92, points: 10, icon: '🥦' },
];
