import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  PageHeader, Card, CardHeader, KPICard, Table, Badge, FillBar,
  Btn, SearchInput, Select, ChartTooltip, StatRow, KebabMenu, Tabs
} from '../../components/UI';
import { wasteVolumeData, zoneData, wasteComposition } from '../../data/mockData';
import { Download, Filter, Eye, AlertTriangle, Trash2, UserCheck, UserX } from 'lucide-react';

// ── Bin Network ────────────────────────────────────────────
export function AdminBinsMap() {
  const { bins } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = bins.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) ||
                        b.location.toLowerCase().includes(search.toLowerCase()) ||
                        b.zone.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusVariant = { full: 'critical', moderate: 'warning', active: 'success', offline: 'muted' };

  const columns = [
    { key: 'id',        label: 'Bin ID',    width: 110, render: v => <span className="font-mono text-[12px]">{v}</span> },
    { key: 'location',  label: 'Location',  render: (v, row) => (
      <div>
        <p className="text-[13px]">{v}</p>
        <p className="text-[11px] text-[var(--sub)]">{row.zone}</p>
      </div>
    )},
    { key: 'fill',      label: 'Fill Level', width: 160, render: v => <FillBar value={v} /> },
    { key: 'odor',      label: 'Odor (ppm)', width: 100, render: v => (
      <span className="font-mono text-[12px]" style={{ color: v >= 4 ? '#F87171' : v >= 2 ? '#FDBA74' : '#4ADE80' }}>{v}</span>
    )},
    { key: 'status',    label: 'Status',    width: 100, render: v => <Badge variant={statusVariant[v] || 'muted'}>{v}</Badge> },
    { key: 'lastPickup',label: 'Last Pickup',width: 140, render: v => <span className="text-[12px] text-[var(--sub)]">{new Date(v).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span> },
    { key: 'collector', label: 'Collector', render: v => <span className="text-[12px]">{v || '—'}</span> },
    { key: 'id', key: '_actions', label: '', width: 48, sort: false,
      render: (_, row) => (
        <KebabMenu items={[
          { label: 'View Details', icon: <Eye size={13} /> },
          { label: 'Alert Collector', icon: <AlertTriangle size={13} /> },
          'divider',
          { label: 'Mark Offline', icon: <Trash2 size={13} />, destructive: true },
        ]} />
      )
    },
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="Bin Network"
        subtitle={`${bins.length} registered smart bins across Lagos`}
        actions={<Btn variant="outline" size="sm"><Download size={13} />Export CSV</Btn>}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Bins"    value={bins.length} />
        <KPICard label="At Capacity"   value={bins.filter(b=>b.status==='full').length}    deltaType="down" delta="Needs pickup" />
        <KPICard label="Moderate"      value={bins.filter(b=>b.status==='moderate').length} deltaType="neutral" />
        <KPICard label="Offline"       value={bins.filter(b=>b.status==='offline').length}  deltaType={bins.filter(b=>b.status==='offline').length>0?'down':'neutral'} />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search bin ID, location, zone..." className="w-64" />
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option value="all">All Status</option>
          <option value="full">Full</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="offline">Offline</option>
        </Select>
        <span className="text-[12px] text-[var(--sub)] ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <Table
        columns={columns}
        data={filtered}
        emptyTitle="No bins match your filters"
        emptyDesc="Try adjusting the search or status filter."
      />
    </div>
  );
}

// ── Analytics ──────────────────────────────────────────────
export function AdminAnalytics() {
  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="Waste Metrics"
        subtitle="Environmental data and collection performance analytics"
        actions={
          <>
            <select className="h-9 px-3 text-[13px] rounded border border-[var(--wire)] bg-[var(--card)] text-[var(--ink)] focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <Btn variant="outline" size="sm"><Download size={13} />Export</Btn>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Collected"     value="24,840" suffix=" kg" delta="↑ 8% vs last week" deltaType="up" />
        <KPICard label="Collection Eff."     value="79"     suffix="%"   delta="↓ 3% vs last week" deltaType="down" />
        <KPICard label="Avg Fill Cycle"      value="3.2"    suffix=" days" delta="Normal range"     deltaType="neutral" />
        <KPICard label="Odor Incidents"      value={7}                    delta="↑ 2 this week"     deltaType="down" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-2">
            <CardHeader title="Daily Waste Volume" subtitle="Kg by material type — last 7 days" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={wasteVolumeData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="day" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Bar dataKey="organic" name="Organic" fill="#1A7F4E" radius={[2,2,0,0]} stackId="a" />
              <Bar dataKey="plastic" name="Plastic"  fill="#D4A017" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="paper"   name="Paper"    fill="#1E88E5" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="metal"   name="Metal"    fill="#8B949E" radius={[2,2,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 px-5 pb-4">
            {[['Organic','#1A7F4E'],['Plastic','#D4A017'],['Paper','#1E88E5'],['Metal','#8B949E']].map(([n,c])=>(
              <div key={n} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-[11px] text-[var(--sub)]">{n}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={false}>
          <div className="p-5">
            <CardHeader title="Zone Performance" subtitle="Collection efficiency %" />
          </div>
          <div className="px-4 pb-5 space-y-3">
            {zoneData.map(z => (
              <div key={z.zone}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] text-[var(--ink)]">{z.zone}</span>
                  <span className="text-[12px] font-medium" style={{ color: z.efficiency >= 85 ? '#4ADE80' : z.efficiency >= 70 ? '#FDBA74' : '#F87171' }}>
                    {z.efficiency}%
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--active)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${z.efficiency}%`,
                    background: z.efficiency >= 85 ? '#1A7F4E' : z.efficiency >= 70 ? '#D4A017' : '#E53935'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data table */}
      <Card pad={false}>
        <div className="p-5 pb-3">
          <CardHeader title="Zone Summary" subtitle="Detailed statistics per zone" actions={<Btn variant="outline" size="sm"><Download size={13} />CSV</Btn>} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[var(--wire)]">
                {['Zone','Efficiency','Bins','Pickups','Trend'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-[var(--sub)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zoneData.map(z => (
                <tr key={z.zone} className="border-b border-[var(--wire)] last:border-0 hover:bg-[var(--active)] transition-colors">
                  <td className="px-5 py-3 text-[13px] text-[var(--ink)] font-medium">{z.zone}</td>
                  <td className="px-5 py-3">
                    <Badge variant={z.efficiency >= 85 ? 'success' : z.efficiency >= 70 ? 'warning' : 'critical'}>
                      {z.efficiency}%
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[var(--ink)]">{z.bins}</td>
                  <td className="px-5 py-3 text-[13px] text-[var(--ink)]">{z.pickups}</td>
                  <td className="px-5 py-3 text-[12px] text-[var(--sub)]">Last 7 days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Users ──────────────────────────────────────────────────
export function AdminUsers() {
  const { users } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.zone.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleVariant = { citizen: 'brand', collector: 'info', recycler: 'warning', buyer: 'success', admin: 'critical' };

  const columns = [
    { key: 'name',   label: 'Name',   render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0" style={{ background: 'var(--brand)' }}>
          {v.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <span className="text-[13px]">{v}</span>
      </div>
    )},
    { key: 'role',   label: 'Role',   width: 110, render: v => <Badge variant={roleVariant[v]||'muted'}>{v}</Badge> },
    { key: 'zone',   label: 'Zone',   width: 120 },
    { key: 'score',  label: 'Score',  width: 80,  render: v => (
      <span className="font-mono text-[12px]" style={{ color: v >= 80 ? '#4ADE80' : v >= 50 ? '#FDBA74' : '#F87171' }}>{v}</span>
    )},
    { key: 'reports',label: 'Reports',width: 80 },
    { key: 'joined', label: 'Joined', width: 120, render: v => <span className="text-[12px] text-[var(--sub)]">{new Date(v).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'2-digit' })}</span> },
    { key: 'status', label: 'Status', width: 100, render: v => <Badge variant={v === 'Active' ? 'success' : 'critical'}>{v}</Badge> },
    { key: '_actions', label: '', width: 48, sort: false,
      render: (_, row) => (
        <KebabMenu items={[
          { label: 'View Profile', icon: <Eye size={13} /> },
          { label: 'Activate',     icon: <UserCheck size={13} /> },
          'divider',
          { label: 'Suspend',      icon: <UserX size={13} />, destructive: true },
        ]} />
      )
    },
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered users across all workspaces`}
        actions={<Btn variant="outline" size="sm"><Download size={13} />Export</Btn>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Users"  value={users.length} />
        <KPICard label="Active"       value={users.filter(u=>u.status==='Active').length}    deltaType="up" />
        <KPICard label="Suspended"    value={users.filter(u=>u.status==='Suspended').length} deltaType={users.filter(u=>u.status==='Suspended').length>0?'down':'neutral'} />
        <KPICard label="Avg Score"    value={Math.round(users.reduce((s,u)=>s+u.score,0)/users.length)} suffix="%" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or zone..." className="w-64" />
        <Select value={roleFilter} onChange={setRoleFilter}>
          <option value="all">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="collector">Collector</option>
          <option value="recycler">Recycler</option>
          <option value="buyer">Buyer</option>
        </Select>
        <span className="text-[12px] text-[var(--sub)] self-center ml-auto">{filtered.length} result{filtered.length!==1?'s':''}</span>
      </div>
      <Table columns={columns} data={filtered} emptyTitle="No users found" />
    </div>
  );
}

// ── Reports / Incidents ────────────────────────────────────
export function AdminReports() {
  const { incidents, resolveIncident, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const tabData = {
    all:       incidents,
    open:      incidents.filter(i => i.status === 'Open'),
    assigned:  incidents.filter(i => i.status === 'Assigned'),
    resolved:  incidents.filter(i => ['Resolved','Closed'].includes(i.status)),
  };

  const filtered = tabData[tab].filter(i =>
    i.id.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const sevVariant = { Critical: 'critical', High: 'warning', Medium: 'info', Low: 'muted' };
  const statusVariant = { Open: 'critical', Assigned: 'warning', 'In Review': 'info', Resolved: 'success', Closed: 'muted' };

  const columns = [
    { key: 'id',       label: 'ID',       width: 100, render: v => <span className="font-mono text-[12px]">{v}</span> },
    { key: 'category', label: 'Category', width: 130 },
    { key: 'location', label: 'Location', render: (v, row) => (
      <div>
        <p className="text-[13px]">{v}</p>
        <p className="text-[11px] text-[var(--sub)]">{row.zone}</p>
      </div>
    )},
    { key: 'severity', label: 'Severity', width: 100, render: v => <Badge variant={sevVariant[v]||'muted'}>{v}</Badge> },
    { key: 'filedBy',  label: 'Filed By', width: 130 },
    { key: 'date',     label: 'Date',     width: 140, render: v => <span className="text-[12px] text-[var(--sub)]">{new Date(v).toLocaleDateString('en-NG', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span> },
    { key: 'status',   label: 'Status',   width: 110, render: v => <Badge variant={statusVariant[v]||'muted'}>{v}</Badge> },
    { key: '_actions', label: '', width: 48, sort: false,
      render: (_, row) => (
        <KebabMenu items={[
          { label: 'View Details', icon: <Eye size={13} /> },
          { label: 'Assign',       icon: <UserCheck size={13} /> },
          { label: 'Resolve',      onClick: () => { resolveIncident(row.id); addToast(`Incident ${row.id} marked resolved.`, 'success'); } },
          'divider',
          { label: 'Close',        destructive: true },
        ]} />
      )
    },
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="Incident Reports"
        subtitle="Citizen-filed waste issues and compliance cases"
        actions={<Btn variant="outline" size="sm"><Download size={13} />Export</Btn>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Reports"  value={incidents.length} />
        <KPICard label="Open"           value={incidents.filter(i=>i.status==='Open').length}     deltaType="down" delta="Needs action" />
        <KPICard label="Critical"       value={incidents.filter(i=>i.severity==='Critical').length} deltaType="down" />
        <KPICard label="Resolved"       value={incidents.filter(i=>['Resolved','Closed'].includes(i.status)).length} deltaType="up" />
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'all',      label: 'All',     count: incidents.length },
          { key: 'open',     label: 'Open',    count: incidents.filter(i=>i.status==='Open').length },
          { key: 'assigned', label: 'Assigned',count: incidents.filter(i=>i.status==='Assigned').length },
          { key: 'resolved', label: 'Resolved',count: incidents.filter(i=>['Resolved','Closed'].includes(i.status)).length },
        ]}
      />
      <div className="flex gap-3 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search ID, location, category..." className="w-64" />
        <span className="text-[12px] text-[var(--sub)] self-center ml-auto">{filtered.length} result{filtered.length!==1?'s':''}</span>
      </div>
      <Table columns={columns} data={filtered} emptyTitle="No incidents match your filters" />
    </div>
  );
}
