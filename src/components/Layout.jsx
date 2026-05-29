import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NotificationPanel, CircularProgress } from './UI';

const navConfig = {
  household: [
    { to: '/household', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/household/bin', label: 'My Bin', icon: '🗑️' },
    { to: '/household/scan', label: 'Scan Waste', icon: '📷' },
    { to: '/household/rewards', label: 'Rewards', icon: '⭐' },
    { to: '/household/history', label: 'History', icon: '📋' },
  ],
  collector: [
    { to: '/collector', label: 'Dashboard', icon: '📊', end: true },
    { to: '/collector/map', label: 'Route Map', icon: '🗺️' },
    { to: '/collector/jobs', label: 'Jobs', icon: '📦' },
    { to: '/collector/earnings', label: 'Earnings', icon: '💰' },
    { to: '/collector/history', label: 'History', icon: '📋' },
  ],
  recycler: [
    { to: '/recycler', label: 'Dashboard', icon: '📊', end: true },
    { to: '/recycler/marketplace', label: 'Marketplace', icon: '♻️' },
    { to: '/recycler/claims', label: 'My Claims', icon: '📌' },
    { to: '/recycler/analytics', label: 'Analytics', icon: '📈' },
    { to: '/recycler/history', label: 'History', icon: '📋' },
  ],
  farmer: [
    { to: '/farmer', label: 'Dashboard', icon: '📊', end: true },
    { to: '/farmer/marketplace', label: 'Organic Market', icon: '🌿' },
    { to: '/farmer/orders', label: 'My Orders', icon: '📦' },
    { to: '/farmer/profile', label: 'Farm Profile', icon: '🌾' },
    { to: '/farmer/history', label: 'History', icon: '📋' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/bins', label: 'All Bins Map', icon: '🗺️' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/reports', label: 'Reports', icon: '📄' },
  ],
};

const roleColors = { household: 'green', collector: 'blue', recycler: 'purple', farmer: 'emerald', admin: 'red' };

export default function Layout() {
  const { currentUser, setRole, unreadCount, fillAllBins, triggerNotification, resetApp, addToast } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();
  const role = currentUser.role;
  const links = navConfig[role] || [];

  const switchRole = (r) => {
    setRole(r);
    navigate(`/${r}`);
    setDemoOpen(false);
  };

  const handleReset = () => {
    resetApp();
    navigate('/');
    setDemoOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#2D0A4E] overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1a0a2e] border-r border-purple-800 shrink-0">
        <div className="p-5 border-b border-purple-800">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <span className="text-white font-black text-xl tracking-tight">EcoGuard</span>
          </div>
          <p className="text-purple-500 text-xs mt-1 capitalize">{role} Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-purple-300 hover:bg-purple-800/50 hover:text-white'}`}>
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-800 space-y-3">
          <div className="flex items-center gap-3">
            <CircularProgress value={currentUser.sustainabilityScore} size={44} stroke={5} label={`${currentUser.sustainabilityScore}`} />
            <div>
              <p className="text-white text-sm font-semibold truncate max-w-[120px]">{currentUser.name}</p>
              <p className="text-purple-400 text-xs">{currentUser.points} pts</p>
            </div>
            <button onClick={() => setNotifOpen(true)} className="ml-auto relative text-purple-300 hover:text-white">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
          </div>
          <button onClick={() => switchRole('household')} className="w-full text-xs text-purple-400 hover:text-white border border-purple-700 hover:border-purple-500 rounded-lg py-1.5 transition-all">
            Switch Role
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1a0a2e] border-b border-purple-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-white font-black text-lg">EcoGuard</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotifOpen(true)} className="relative text-purple-300">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            <CircularProgress value={currentUser.sustainabilityScore} size={36} stroke={4} label={`${currentUser.sustainabilityScore}`} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex bg-[#1a0a2e] border-t border-purple-800">
          {links.slice(0, 5).map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-xs transition-all
                ${isActive ? 'text-green-400' : 'text-purple-500'}`}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-[10px] mt-0.5">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Demo Controls */}
      <div className="fixed bottom-4 left-4 z-50">
        <button onClick={() => setDemoOpen(d => !d)}
          className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg transition-all">
          🎮 Demo
        </button>
        {demoOpen && (
          <div className="absolute bottom-12 left-0 bg-[#1a0a2e] border border-purple-700 rounded-2xl p-4 w-56 shadow-2xl space-y-3">
            <p className="text-white text-xs font-bold uppercase tracking-wider">Demo Controls — EcoGuard</p>
            <div>
              <p className="text-purple-400 text-xs mb-1">Switch Role</p>
              <select onChange={e => switchRole(e.target.value)} value={role}
                className="w-full bg-purple-900 text-white text-xs rounded-lg px-2 py-1.5 border border-purple-700">
                {['household', 'collector', 'recycler', 'farmer', 'admin'].map(r => (
                  <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <button onClick={fillAllBins} className="w-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold py-1.5 rounded-lg hover:bg-amber-500/30 transition-all">
              🗑️ Fill All Bins (85%)
            </button>
            <button onClick={triggerNotification} className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold py-1.5 rounded-lg hover:bg-blue-500/30 transition-all">
              🔔 Trigger Notification
            </button>
            <button onClick={handleReset} className="w-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold py-1.5 rounded-lg hover:bg-red-500/30 transition-all">
              🔄 Reset App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
