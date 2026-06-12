import { createContext, useContext, useState, useEffect } from 'react';
import {
  mockBins, mockNotifications, mockMarketplaceListings, mockOrganicListings,
  mockCollectionJobs, mockScanHistory, mockIncidents, mockActivity, mockRoutes, mockUsers
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    name: 'Adaeze Okonkwo',
    role: null,
    points: 845,
    sustainabilityScore: 78,
  });
  const [bins, setBins]                         = useState(mockBins);
  const [notifications, setNotifications]       = useState(mockNotifications);
  const [marketplaceListings, setListings]      = useState(mockMarketplaceListings);
  const [organicListings, setOrganic]           = useState(mockOrganicListings);
  const [collectionJobs, setJobs]               = useState(mockCollectionJobs);
  const [scanHistory, setScanHistory]           = useState(mockScanHistory);
  const [incidents, setIncidents]               = useState(mockIncidents);
  const [activity]                              = useState(mockActivity);
  const [routes, setRoutes]                     = useState(mockRoutes);
  const [users]                                 = useState(mockUsers);
  const [toasts, setToasts]                     = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ekoguard_role');
    if (saved) setCurrentUser(u => ({ ...u, role: saved }));
  }, []);

  const setRole = (role) => {
    if (role) localStorage.setItem('ekoguard_role', role);
    else localStorage.removeItem('ekoguard_role');
    setCurrentUser(u => ({ ...u, role }));
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const addPoints  = (pts) => setCurrentUser(u => ({ ...u, points: u.points + pts }));
  const addScan    = (item) => setScanHistory(h => [item, ...h]);

  const markNotificationRead = (id) =>
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const claimListing = (id) =>
    setListings(l => l.map(x => x.id === id ? { ...x, status: 'Sold' } : x));

  const acceptJob = (id) =>
    setJobs(j => j.map(x => x.id === id ? { ...x, status: 'active' } : x));

  const completeJob = (id) => {
    setJobs(j => j.map(x => x.id === id ? { ...x, status: 'completed' } : x));
    addToast('Job completed. Earnings updated.', 'success');
  };

  const resolveIncident = (id) =>
    setIncidents(incs => incs.map(x => x.id === id ? { ...x, status: 'Resolved' } : x));

  const fillAllBins = () => {
    setBins(b => b.map(bin => ({ ...bin, fill: 87, status: 'full' })));
    addToast('All bins filled to 87%', 'warning');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, setRole,
      bins, setBins,
      notifications, markNotificationRead,
      marketplaceListings, setListings, claimListing,
      organicListings, setOrganic,
      collectionJobs, setJobs, acceptJob, completeJob,
      scanHistory, setScanHistory, addScan,
      incidents, resolveIncident,
      activity,
      routes, setRoutes,
      users,
      toasts, addToast, removeToast,
      addPoints,
      fillAllBins,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
