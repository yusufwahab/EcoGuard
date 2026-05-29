import { createContext, useContext, useState, useEffect } from 'react';
import { mockBins, mockNotifications, mockMarketplaceListings, mockCollectionJobs, mockOrganicListings, mockScanHistory } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    name: 'Adaeze Okonkwo',
    role: null,
    points: 845,
    sustainabilityScore: 78,
  });
  const [bins, setBins] = useState(mockBins);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [marketplaceListings, setMarketplaceListings] = useState(mockMarketplaceListings);
  const [organicListings, setOrganicListings] = useState(mockOrganicListings);
  const [collectionJobs, setCollectionJobs] = useState(mockCollectionJobs);
  const [scanHistory, setScanHistory] = useState(mockScanHistory);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ecoguard_role');
    if (saved) setCurrentUser(u => ({ ...u, role: saved }));
  }, []);

  const setRole = (role) => {
    localStorage.setItem('ecoguard_role', role);
    setCurrentUser(u => ({ ...u, role }));
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const addPoints = (pts) => setCurrentUser(u => ({ ...u, points: u.points + pts }));

  const addScan = (item) => setScanHistory(h => [item, ...h]);

  const updateBinFill = (binId, levels) => {
    setBins(b => b.map(bin => bin.id === binId ? { ...bin, fillLevels: { ...bin.fillLevels, ...levels } } : bin));
  };

  const fillAllBins = () => {
    setBins(b => b.map(bin => ({ ...bin, fillLevels: { organic: 85, recyclable: 85, general: 85 }, status: 'flagged' })));
    addToast('All bins filled to 85%', 'warning');
  };

  const triggerNotification = () => {
    const n = { id: Date.now(), title: 'Demo Notification', body: 'This is a test notification from Demo Controls.', time: new Date().toISOString(), read: false, icon: '🔔', type: 'info' };
    setNotifications(ns => [n, ...ns]);
    addToast('New notification added', 'success');
  };

  const resetApp = () => {
    localStorage.removeItem('ecoguard_role');
    setCurrentUser({ name: 'Adaeze Okonkwo', role: null, points: 845, sustainabilityScore: 78 });
    setBins(mockBins);
    setNotifications(mockNotifications);
    setMarketplaceListings(mockMarketplaceListings);
    setCollectionJobs(mockCollectionJobs);
    setScanHistory(mockScanHistory);
  };

  const markNotificationRead = (id) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const claimListing = (id) => {
    setMarketplaceListings(l => l.map(x => x.id === id ? { ...x, claimed: true } : x));
  };

  const acceptJob = (id) => {
    setCollectionJobs(j => j.map(x => x.id === id ? { ...x, status: 'active' } : x));
  };

  const completeJob = (id) => {
    setCollectionJobs(j => j.map(x => x.id === id ? { ...x, status: 'completed' } : x));
    const job = collectionJobs.find(x => x.id === id);
    if (job) updateBinFill(job.binId, { organic: 5, recyclable: 5, general: 5 });
    addToast('Job completed! Earnings updated.', 'success');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, setRole, bins, setBins, notifications, setNotifications,
      marketplaceListings, setMarketplaceListings, organicListings, setOrganicListings,
      collectionJobs, setCollectionJobs, scanHistory, setScanHistory,
      toasts, addToast, removeToast, addPoints, addScan, updateBinFill,
      fillAllBins, triggerNotification, resetApp, markNotificationRead,
      claimListing, acceptJob, completeJob, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
