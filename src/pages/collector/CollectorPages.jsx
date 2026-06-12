import { useApp } from '../../context/AppContext';
import {
  PageHeader, Card, CardHeader, KPICard, Badge, FillBar,
  Btn, Table, KebabMenu, Tabs
} from '../../components/UI';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from '../../components/UI';
import { Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';

// ── Available Jobs ─────────────────────────────────────────
export function CollectionJobs() {
  const { collectionJobs, acceptJob, completeJob, addToast } = useApp();
  const [tab, setTab] = useState('available');

  const urgencyVariant = { Critical: 'critical', Urgent: 'warning', Normal: 'info', Scheduled: 'muted' };
  const statusVariant  = { available: 'muted', active: 'warning', completed: 'success' };

  const tabData = {
    available: collectionJobs.filter(j => j.status === 'available'),
    active:    collectionJobs.filter(j => j.status === 'active'),
    completed: collectionJobs.filter(j => j.status === 'completed'),
  };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Available Jobs" subtitle="Collection opportunities in your area" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Available"  value={tabData.available.length} />
        <KPICard label="Active"     value={tabData.active.length}    deltaType="neutral" />
        <KPICard label="Completed"  value={tabData.completed.length} deltaType="up" />
        <KPICard label="Potential"  value={`₦${tabData.available.reduce((s,j)=>s+j.earnings,0).toLocaleString()}`} delta="If all accepted" deltaType="neutral" />
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'available', label: 'Available',  count: tabData.available.length },
          { key: 'active',    label: 'Active',     count: tabData.active.length },
          { key: 'completed', label: 'Completed',  count: tabData.completed.length },
        ]}
      />

      <div className="space-y-3">
        {tabData[tab].map(job => (
          <Card key={job.id} pad={false}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono" style={{ color: 'var(--dim)' }}>{job.id}</span>
                    <Badge variant={urgencyVariant[job.urgency] || 'muted'}>{job.urgency}</Badge>
                    <Badge variant={statusVariant[job.status] || 'muted'}>{job.status}</Badge>
                  </div>
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{job.location}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--sub)' }}>{job.zone} Zone · {job.distance}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[18px] font-semibold" style={{ color: '#D4A017' }}>₦{job.earnings.toLocaleString()}</p>
                  <p className="text-[11px]" style={{ color: 'var(--sub)' }}>earnings</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-(--wire)">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Fill Level</span>
                  <div className="flex-1"><FillBar value={job.fill} /></div>
                </div>
                <div className="flex gap-2">
                  {job.status === 'available' && (
                    <Btn size="sm" onClick={() => { acceptJob(job.id); addToast(`Job ${job.id} accepted.`, 'success'); }}>
                      <Briefcase size={12} />Accept Job
                    </Btn>
                  )}
                  {job.status === 'active' && (
                    <Btn size="sm" onClick={() => completeJob(job.id)}>
                      <CheckCircle size={12} />Mark Complete
                    </Btn>
                  )}
                  <Btn variant="outline" size="sm">View on Map</Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {tabData[tab].length === 0 && (
          <div className="py-14 text-center">
            <Briefcase size={28} className="mx-auto mb-3" style={{ color: 'var(--dim)' }} />
            <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>No {tab} jobs</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--sub)' }}>
              {tab === 'available' ? 'Check back soon for new collection opportunities.' : 'Completed jobs will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Earnings ───────────────────────────────────────────────
const earningsData = [
  { day: 'Mon', earnings: 2850 },
  { day: 'Tue', earnings: 3200 },
  { day: 'Wed', earnings: 1900 },
  { day: 'Thu', earnings: 4100 },
  { day: 'Fri', earnings: 3750 },
  { day: 'Sat', earnings: 5200 },
  { day: 'Sun', earnings: 2600 },
];

export function CollectorEarnings() {
  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Earnings" subtitle="Your collection earnings and performance" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="This Week"     value="₦23,600"  delta="↑ 12% vs last week" deltaType="up" />
        <KPICard label="This Month"    value="₦91,200"  delta="↑ 8% vs last month" deltaType="up" />
        <KPICard label="Jobs Done"     value={47}       delta="This month" deltaType="neutral" />
        <KPICard label="Avg per Job"   value="₦1,940"   delta="Above avg" deltaType="up" />
      </div>

      <Card pad={false}>
        <div className="p-5 pb-2">
          <CardHeader title="Weekly Earnings" subtitle="Last 7 days (₦)" />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={earningsData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <XAxis dataKey="day" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<ChartTooltip unit="₦" />} />
            <Bar dataKey="earnings" name="Earnings" fill="#1A7F4E" radius={[3, 3, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
        <p className="px-5 pb-4 text-[11px]" style={{ color: 'var(--dim)' }}>Daily earnings in Nigerian Naira</p>
      </Card>

      <Card pad={false}>
        <div className="p-5 pb-3">
          <CardHeader title="Earnings Breakdown" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['Day','Jobs','Km Covered','Earnings','Status'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earningsData.map((d, i) => (
                <tr key={d.day} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{d.day}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{Math.floor(d.earnings / 700)}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--sub)' }}>{(d.earnings / 400).toFixed(1)} km</td>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: '#D4A017' }}>₦{d.earnings.toLocaleString()}</td>
                  <td className="px-5 py-3"><Badge variant="success">Paid</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── History ────────────────────────────────────────────────
export function CollectorHistory() {
  const { collectionJobs } = useApp();
  const all = [
    ...collectionJobs.map(j => ({ ...j, date: '2025-01-12' })),
    { id: 'JOB-006', binId: 'BIN-002', location: 'Victoria Island, Plot 5', zone: 'Victoria Is.', fill: 80, urgency: 'Normal', status: 'completed', earnings: 780, date: '2025-01-11' },
    { id: 'JOB-007', binId: 'BIN-008', location: 'Gbagada, Phase 2',        zone: 'Gbagada',     fill: 65, urgency: 'Normal', status: 'completed', earnings: 650, date: '2025-01-11' },
  ];

  const urgencyVariant = { Critical: 'critical', Urgent: 'warning', Normal: 'info', Scheduled: 'muted' };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Collection History" subtitle="Past jobs and performance log" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Jobs"     value={all.length} />
        <KPICard label="Completed"      value={all.filter(j=>j.status==='completed').length} deltaType="up" />
        <KPICard label="Total Earned"   value={`₦${all.filter(j=>j.status==='completed').reduce((s,j)=>s+j.earnings,0).toLocaleString()}`} />
        <KPICard label="Avg per Job"    value="₦1,940" />
      </div>
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['Job ID','Location','Zone','Urgency','Fill %','Earnings','Date'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map(j => (
                <tr key={j.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                  <td className="px-5 py-3 text-[12px] font-mono" style={{ color: 'var(--dim)' }}>{j.id}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{j.location}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{j.zone}</td>
                  <td className="px-5 py-3"><Badge variant={urgencyVariant[j.urgency]||'muted'}>{j.urgency}</Badge></td>
                  <td className="px-5 py-3 text-[12px] font-mono" style={{ color: j.fill >= 80 ? '#F87171' : '#4ADE80' }}>{j.fill}%</td>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: '#D4A017' }}>₦{j.earnings.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{j.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
