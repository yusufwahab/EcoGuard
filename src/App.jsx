import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/UI';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import RoleSelection from './pages/RoleSelection';

// Household
import HouseholdDashboard from './pages/household/HouseholdDashboard';
import ScanWaste from './pages/household/ScanWaste';
import MyBin from './pages/household/MyBin';
import Rewards from './pages/household/Rewards';
import HouseholdHistory from './pages/household/HouseholdHistory';

// Collector
import CollectorDashboard from './pages/collector/CollectorDashboard';
import RouteMap from './pages/collector/RouteMap';
import { CollectionJobs, CollectorEarnings, CollectorHistory } from './pages/collector/CollectorPages';

// Recycler
import RecyclerDashboard from './pages/recycler/RecyclerDashboard';
import RecyclerMarketplace from './pages/recycler/RecyclerMarketplace';
import { RecyclerClaims, RecyclerAnalytics, RecyclerHistory } from './pages/recycler/RecyclerPages';

// Farmer
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerMarketplace from './pages/farmer/FarmerMarketplace';
import { FarmerOrders, FarmerProfile, FarmerHistory } from './pages/farmer/FarmerPages';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminBinsMap, AdminAnalytics, AdminUsers, AdminReports } from './pages/admin/AdminPages';

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      {/* Always accessible */}
      <Route path="/"       element={<Landing />} />
      <Route path="/select" element={currentUser.role ? <Navigate to={`/${currentUser.role}`} replace /> : <RoleSelection />} />

      {/* Household */}
      <Route path="/household" element={<Layout />}>
        <Route index element={<HouseholdDashboard />} />
        <Route path="bin" element={<MyBin />} />
        <Route path="scan" element={<ScanWaste />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="history" element={<HouseholdHistory />} />
      </Route>

      {/* Collector */}
      <Route path="/collector" element={<Layout />}>
        <Route index element={<CollectorDashboard />} />
        <Route path="map" element={<RouteMap />} />
        <Route path="jobs" element={<CollectionJobs />} />
        <Route path="earnings" element={<CollectorEarnings />} />
        <Route path="history" element={<CollectorHistory />} />
      </Route>

      {/* Recycler */}
      <Route path="/recycler" element={<Layout />}>
        <Route index element={<RecyclerDashboard />} />
        <Route path="marketplace" element={<RecyclerMarketplace />} />
        <Route path="claims" element={<RecyclerClaims />} />
        <Route path="analytics" element={<RecyclerAnalytics />} />
        <Route path="history" element={<RecyclerHistory />} />
      </Route>

      {/* Farmer */}
      <Route path="/farmer" element={<Layout />}>
        <Route index element={<FarmerDashboard />} />
        <Route path="marketplace" element={<FarmerMarketplace />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="history" element={<FarmerHistory />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="bins" element={<AdminBinsMap />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
