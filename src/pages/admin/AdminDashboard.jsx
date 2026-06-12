import { useApp } from '../../context/AppContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  KPICard, Card, CardHeader, PageHeader, ActivityFeed,
  IntelPanel, Badge, FillBar, Btn, ChartTooltip
} from '../../components/UI';
import { wasteVolumeData, zoneData, wasteComposition } from '../../data/mockData';
import { RefreshCw, Download } from 'lucide-react';

function BinStatusRow({ bin }) {
  const statusMap = {
    full:     { variant: 'critical', label: 'Full'     },
    moderate: { variant: 'warning',  label: 'Moderate' },
    active:   { variant: 'success',  label: 'Active'   },
    offline:  { variant: 'muted',    label: 'Offline'  },
  };
  const s = statusMap[bin.status] || statusMap.active;
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--wire)] last:border-0">
      <span className="text-[12px] font-mono text-[var(--sub)] w-20 shrink-0">{bin.id}</span>
      <span className="flex-1 text-[12px] text-[var(--ink)] truncate min-w-0">{bin.location}</span>
      <div className="w-28 shrink-0">
        <FillBar value={bin.fill} />
      </div>
      <Badge variant={s.variant}>{s.label}</Badge>
    </div>
  );
}

export default function AdminDashboard() {
  const { bins, incidents, activity, currentUser } = useApp();

  const totalBins   = bins.length;
  const fullBins    = bins.filter(b => b.status === 'full').length;
  const openReports = incidents.filter(i => i.status === 'Open').length;
  const criticalInc = incidents.filter(i => i.severity === 'Critical').length;
  const offlineBins = bins.filter(b => b.status === 'offline').length;

  const criticalBins = bins.filter(b => b.status === 'full' || b.status === 'offline')
    .sort((a, b) => b.fill - a.fill)
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 anim-fade-up">

      {/* Header */}
      <PageHeader
        title={`${greeting}, ${currentUser.name.split(' ')[0]}.`}
        subtitle="Lagos Operations · Authority Dashboard"
        actions={
          <>
            <Btn variant="outline" size="sm"><RefreshCw size={13} />Refresh</Btn>
            <Btn variant="outline" size="sm"><Download size={13} />Export</Btn>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard label="Active Bins"    value={totalBins - offlineBins} delta="All monitored"   deltaType="neutral" />
        <KPICard label="Bins at Capacity" value={fullBins}   delta={`${offlineBins} offline`}   deltaType={fullBins > 3 ? 'down' : 'neutral'} />
        <KPICard label="Open Reports"   value={openReports} delta={`${criticalInc} critical`}   deltaType={openReports > 2 ? 'down' : 'neutral'} />
        <KPICard label="Pickups Today"  value={34}          delta="↑ 4 vs yesterday"             deltaType="up" />
        <KPICard label="Avg Odor (ppm)" value="2.1"         delta="Within safe range"            deltaType="neutral" />
      </div>

      {/* Intelligence panel */}
      {fullBins > 0 && (
        <IntelPanel
          type="warning"
          title="Network Alert"
          updatedAt="Updated just now"
          body={`${fullBins} bin${fullBins > 1 ? 's' : ''} have reached capacity in the last 24 hours — BIN-009 (Mushin, 97%), BIN-003 (Ikoyi, 94%), BIN-006 (Ikeja, 88%). Recommend dispatching collectors to Mushin and Ikoyi immediately.`}
          actions={
            <>
              <Btn size="sm">View Bins</Btn>
              <Btn variant="outline" size="sm">Dismiss</Btn>
            </>
          }
        />
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Weekly waste volume */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-2">
            <CardHeader
              title="Weekly Waste Volume"
              subtitle="Kg collected by material type — last 7 days"
              actions={
                <select className="h-7 px-2 text-[12px] rounded border border-[var(--wire)] bg-[var(--active)] text-[var(--sub)] focus:outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              }
            />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={wasteVolumeData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="day" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Line type="monotone" dataKey="organic"  name="Organic"  stroke="#1A7F4E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="plastic"  name="Plastic"  stroke="#D4A017" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="metal"    name="Metal"    stroke="#8B949E" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="paper"    name="Paper"    stroke="#1E88E5" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 px-5 pb-4">
            {[['Organic','#1A7F4E'],['Plastic','#D4A017'],['Metal','#8B949E'],['Paper','#1E88E5']].map(([n,c])=>(
              <div key={n} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-[11px] text-[var(--sub)]">{n}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Waste composition */}
        <Card pad={false}>
          <div className="p-5">
            <CardHeader title="Waste Composition" subtitle="MTD breakdown by type" />
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={wasteComposition} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                  {wasteComposition.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--raised)', border: '1px solid var(--wire-strong)', borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-5 space-y-2">
            {wasteComposition.map(e => (
              <div key={e.name} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="flex-1 text-[12px] text-[var(--sub)]">{e.name}</span>
                <span className="text-[12px] font-medium text-[var(--ink)]">{e.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Zone efficiency */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-2">
            <CardHeader title="Collection Efficiency by Zone" subtitle="% of bins collected on schedule" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zoneData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="zone" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={36} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Bar dataKey="efficiency" name="Efficiency" radius={[3, 3, 0, 0]} maxBarSize={32}>
                {zoneData.map((e, i) => (
                  <Cell key={i} fill={e.efficiency >= 85 ? '#1A7F4E' : e.efficiency >= 70 ? '#D4A017' : '#E53935'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="px-5 pb-4 text-[11px] text-[var(--dim)]">Green ≥ 85% · Amber 70–84% · Red &lt; 70%</p>
        </Card>

        {/* Activity feed */}
        <Card pad={false}>
          <div className="p-5 pb-3">
            <CardHeader title="Live Activity" subtitle="Real-time system events" />
          </div>
          <div className="px-5 pb-5">
            <ActivityFeed events={activity} max={8} />
          </div>
        </Card>
      </div>

      {/* Critical bins */}
      <Card pad={false}>
        <div className="p-5 pb-3">
          <CardHeader
            title="Critical Bins"
            subtitle="Bins requiring immediate attention"
            actions={<Btn variant="outline" size="sm">View All Bins</Btn>}
          />
        </div>
        <div className="px-5 pb-4">
          {criticalBins.length === 0 ? (
            <p className="text-[13px] text-[var(--sub)] py-4">All bins are within normal operating levels.</p>
          ) : (
            criticalBins.map(bin => <BinStatusRow key={bin.id} bin={bin} />)
          )}
        </div>
      </Card>

    </div>
  );
}
