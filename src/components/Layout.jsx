import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NotificationPanel, ToastContainer } from './UI';
import {
  LayoutDashboard, Map, Package2, Route, AlertTriangle,
  BarChart3, ShoppingBag, Shield, MapPin, AlertCircle,
  Star, History, Briefcase, DollarSign, Leaf, ShoppingCart,
  Building2, Bell, Search, ChevronDown, Settings, LogOut,
  ChevronsLeft, ChevronsRight, Users
} from 'lucide-react';

// ── Workspace configs ──────────────────────────────────────
const workspaces = {
  admin: {
    label: 'Authority',
    sub: 'Lagos Operations',
    sections: [
      { heading: 'Overview', links: [
        { to: '/admin',          label: 'Dashboard',       icon: LayoutDashboard, end: true },
        { to: '/admin/bins',     label: 'Bin Network',     icon: Package2 },
      ]},
      { heading: 'Operations', links: [
        { to: '/admin/reports',  label: 'Incident Reports', icon: AlertTriangle },
      ]},
      { heading: 'Intelligence', links: [
        { to: '/admin/analytics',label: 'Waste Metrics',   icon: BarChart3 },
        { to: '/admin/users',    label: 'Users',           icon: Users },
      ]},
      { heading: 'Marketplace', links: [
        { to: '/recycler/marketplace', label: 'Recyclables Exchange', icon: ShoppingBag },
      ]},
    ],
  },
  household: {
    label: 'Citizen',
    sub: 'Resident Portal',
    sections: [
      { heading: 'Overview', links: [
        { to: '/household',       label: 'Dashboard',    icon: LayoutDashboard, end: true },
        { to: '/household/bin',   label: 'Nearby Bins',  icon: MapPin },
      ]},
      { heading: 'Actions', links: [
        { to: '/household/scan',  label: 'Report Issue', icon: AlertCircle },
        { to: '/household/rewards',label: 'Rewards',    icon: Star },
        { to: '/household/history',label: 'Activity',   icon: History },
      ]},
    ],
  },
  collector: {
    label: 'Collector',
    sub: 'Field Operations',
    sections: [
      { heading: 'Overview', links: [
        { to: '/collector',        label: 'Dashboard',  icon: LayoutDashboard, end: true },
        { to: '/collector/map',    label: 'My Routes',  icon: Route },
      ]},
      { heading: 'Work', links: [
        { to: '/collector/jobs',     label: 'Available Jobs', icon: Briefcase },
        { to: '/collector/earnings', label: 'Earnings',       icon: DollarSign },
        { to: '/collector/history',  label: 'History',        icon: History },
      ]},
    ],
  },
  recycler: {
    label: 'Marketplace',
    sub: 'Recyclables Exchange',
    sections: [
      { heading: 'Overview', links: [
        { to: '/recycler',             label: 'Dashboard',   icon: LayoutDashboard, end: true },
        { to: '/recycler/marketplace', label: 'Marketplace', icon: ShoppingBag },
      ]},
      { heading: 'My Activity', links: [
        { to: '/recycler/claims',    label: 'My Claims',  icon: Package2 },
        { to: '/recycler/analytics', label: 'Analytics',  icon: BarChart3 },
        { to: '/recycler/history',   label: 'History',    icon: History },
      ]},
    ],
  },
  farmer: {
    label: 'Organic Buyer',
    sub: 'Agricultural Inputs',
    sections: [
      { heading: 'Overview', links: [
        { to: '/farmer',             label: 'Dashboard',    icon: LayoutDashboard, end: true },
        { to: '/farmer/marketplace', label: 'Organic Market', icon: Leaf },
      ]},
      { heading: 'My Activity', links: [
        { to: '/farmer/orders',   label: 'My Orders',   icon: ShoppingCart },
        { to: '/farmer/profile',  label: 'Profile',     icon: Building2 },
        { to: '/farmer/history',  label: 'History',     icon: History },
      ]},
    ],
  },
};

const wsColors = {
  admin:     { dot: '#E53935', accent: '#F87171' },
  household: { dot: '#1A7F4E', accent: '#4ADE80' },
  collector: { dot: '#1E88E5', accent: '#60A5FA' },
  recycler:  { dot: '#D4A017', accent: '#FDBA74' },
  farmer:    { dot: '#2E7D32', accent: '#4ADE80'  },
};

function NavItem({ to, label, Icon, end }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium transition-all duration-100
        ${isActive
          ? 'text-[var(--ink)] bg-[var(--active)]'
          : 'text-[var(--sub)] hover:text-[var(--ink)] hover:bg-[var(--active)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={15} className={isActive ? 'text-[var(--brand)]' : 'text-[var(--dim)]'} />
          <span className="truncate">{label}</span>
          {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-[var(--brand)]" />}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { currentUser, setRole, notifications, markNotificationRead, toasts, removeToast, unreadCount } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const role = currentUser.role;
  const ws = workspaces[role] || workspaces.admin;
  const color = wsColors[role] || wsColors.admin;

  const switchWorkspace = (r) => {
    setRole(r);
    navigate(`/${r}`);
    setWsOpen(false);
  };

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--canvas)' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col h-full border-r border-[var(--wire)] shrink-0 transition-all duration-200 overflow-hidden`}
        style={{ width: collapsed ? 64 : 240, background: 'var(--card)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--wire)] shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded flex items-center justify-center text-white text-[12px] font-bold shrink-0" style={{ background: 'var(--brand)' }}>EG</div>
              <span className="text-[15px] font-semibold text-[var(--ink)] tracking-tight">Eko-Guard</span>
            </div>
          )}
          {collapsed && <div className="w-7 h-7 rounded flex items-center justify-center text-white text-[12px] font-bold mx-auto" style={{ background: 'var(--brand)' }}>EG</div>}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="text-[var(--dim)] hover:text-[var(--sub)] transition-colors">
              <ChevronsLeft size={15} />
            </button>
          )}
        </div>

        {/* Workspace switcher */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-2 border-b border-[var(--wire)] shrink-0">
            <button
              onClick={() => setWsOpen(o => !o)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[var(--active)] transition-colors text-left"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color.dot }} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--ink)] truncate leading-tight">{ws.label}</p>
                <p className="text-[11px] text-[var(--sub)] truncate">{ws.sub}</p>
              </div>
              <ChevronDown size={13} className={`text-[var(--dim)] transition-transform ${wsOpen ? 'rotate-180' : ''}`} />
            </button>
            {wsOpen && (
              <div className="mt-1 rounded-md border border-[var(--wire-strong)] overflow-hidden anim-fade-up" style={{ background: 'var(--raised)' }}>
                {Object.entries(workspaces).map(([key, w]) => (
                  <button
                    key={key}
                    onClick={() => switchWorkspace(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--active)] transition-colors ${role === key ? 'bg-[var(--active)]' : ''}`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: wsColors[key]?.dot }} />
                    <div>
                      <p className="text-[13px] font-medium text-[var(--ink)]">{w.label}</p>
                      <p className="text-[11px] text-[var(--sub)]">{w.sub}</p>
                    </div>
                    {role === key && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {collapsed ? (
            ws.sections.flatMap(s => s.links).map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-center w-9 h-9 mx-auto rounded transition-colors
                  ${isActive ? 'bg-[var(--active)] text-[var(--brand)]' : 'text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--active)]'}`
                }
                title={link.label}
              >
                <link.icon size={16} />
              </NavLink>
            ))
          ) : (
            ws.sections.map((section, si) => (
              <div key={si}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--dim)]">
                  {section.heading}
                </p>
                {section.links.map(link => (
                  <NavItem key={link.to} to={link.to} label={link.label} Icon={link.icon} end={link.end} />
                ))}
              </div>
            ))
          )}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[var(--wire)] px-3 py-3 shrink-0 space-y-1">
          {!collapsed && (
            <>
              <NavItem to="/admin" label="Settings" Icon={Settings} end />
              <button
                onClick={() => { setRole(null); navigate('/'); }}
                className="flex items-center gap-3 px-3 py-2 w-full rounded text-[13px] font-medium text-[var(--sub)] hover:text-[var(--ink)] hover:bg-[var(--active)] transition-colors"
              >
                <LogOut size={15} className="text-[var(--dim)]" />
                Sign Out
              </button>
            </>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="flex items-center justify-center w-9 h-9 mx-auto rounded text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--active)] transition-colors">
              <ChevronsRight size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 flex items-center gap-4 px-5 border-b border-[var(--wire)] shrink-0" style={{ background: 'var(--card)' }}>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded flex items-center justify-center text-white text-[12px] font-bold" style={{ background: 'var(--brand)' }}>EG</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />
            <input
              readOnly
              placeholder="Search bins, reports, listings..."
              className="w-full h-8 pl-8 pr-3 rounded text-[12px] text-[var(--sub)] placeholder-[var(--dim)] border border-[var(--wire)] focus:outline-none cursor-pointer"
              style={{ background: 'var(--active)' }}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--dim)] border border-[var(--wire)] rounded px-1 py-0.5">⌘K</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-8 h-8 flex items-center justify-center rounded text-[var(--sub)] hover:text-[var(--ink)] hover:bg-[var(--active)] transition-colors"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--err)' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-[var(--wire)] hidden sm:block" />

            {/* Profile */}
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[var(--active)] transition-colors">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                style={{ background: 'var(--brand)' }}
              >
                {initials}
              </div>
              <span className="hidden sm:block text-[13px] font-medium text-[var(--ink)] max-w-[120px] truncate">{currentUser.name}</span>
              <ChevronDown size={13} className="text-[var(--dim)] hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-[var(--wire)] shrink-0" style={{ background: 'var(--card)' }}>
          {ws.sections.flatMap(s => s.links).slice(0, 5).map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2.5 text-[10px] transition-colors gap-1
                ${isActive ? 'text-[var(--brand)]' : 'text-[var(--dim)]'}`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
