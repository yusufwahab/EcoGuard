import { useApp } from '../../context/AppContext';
import { PageHeader, KPICard, Card, CardHeader, Badge, Tabs } from '../../components/UI';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartTooltip } from '../../components/UI';
import { wasteComposition } from '../../data/mockData';

// ── Claims ─────────────────────────────────────────────────
export function RecyclerClaims() {
  const { marketplaceListings } = useApp();
  const claimed = marketplaceListings.filter(l => l.status === 'Sold');

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="My Claims" subtitle="Materials you have claimed from the marketplace" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard label="Total Claims"  value={claimed.length + 4} />
        <KPICard label="Total Sourced" value="1,150 kg" deltaType="up" />
        <KPICard label="Total Spent"   value="₦2.1M" />
      </div>
      {claimed.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>No active claims</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--sub)' }}>Claim listings from the marketplace to see them here.</p>
          </div>
        </Card>
      ) : (
        <Card pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--wire)">
                  {['Material','Grade','Qty','Price/kg','Seller','Location','Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claimed.map(l => (
                  <tr key={l.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active)">
                    <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{l.material}</td>
                    <td className="px-5 py-3"><Badge variant={l.grade==='A'?'success':'warning'}>Grade {l.grade}</Badge></td>
                    <td className="px-5 py-3 text-[13px] font-mono" style={{ color: 'var(--ink)' }}>{l.qty} kg</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: '#D4A017' }}>₦{l.price.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.seller}</td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.location}</td>
                    <td className="px-5 py-3"><Badge variant="success">Claimed</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Analytics ──────────────────────────────────────────────
const monthlyData = [
  { m: 'Aug', kg: 320 }, { m: 'Sep', kg: 420 }, { m: 'Oct', kg: 680 },
  { m: 'Nov', kg: 540 }, { m: 'Dec', kg: 890 }, { m: 'Jan', kg: 1150 },
];

export function RecyclerAnalytics() {
  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Analytics" subtitle="Your sourcing trends and material breakdown" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Monthly Vol."   value="1,150 kg" delta="↑ 29% vs Dec" deltaType="up" />
        <KPICard label="Avg Cost/kg"    value="₦1,820"   delta="↓ 4% vs Dec"  deltaType="up" />
        <KPICard label="Top Material"   value="PET Bottles" />
        <KPICard label="Suppliers Used" value={5} delta="This quarter" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card pad={false}>
          <div className="p-5 pb-2">
            <CardHeader title="Monthly Sourcing" subtitle="Kg claimed per month" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="m" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Bar dataKey="kg" name="Sourced" fill="#D4A017" radius={[3,3,0,0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card pad={false}>
          <div className="p-5">
            <CardHeader title="Material Mix" subtitle="By volume claimed" />
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={wasteComposition} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {wasteComposition.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ background: 'var(--raised)', border: '1px solid var(--wire-strong)', borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-5 space-y-2">
            {wasteComposition.slice(0, 4).map(e => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="flex-1 text-[12px]" style={{ color: 'var(--sub)' }}>{e.name}</span>
                <span className="text-[12px] font-medium" style={{ color: 'var(--ink)' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── History ────────────────────────────────────────────────
export function RecyclerHistory() {
  const { marketplaceListings } = useApp();
  const history = [
    ...marketplaceListings.map(l => ({ ...l, type: 'listing', date: '2025-01-12' })),
    { id: 9, type: 'claim', material: 'Aluminium', qty: 42, price: 4800, seller: 'Amaka Obi', date: '2025-01-10', status: 'Claimed' },
    { id: 10, type: 'claim', material: 'Metal Scrap', qty: 85, price: 3200, seller: 'Emeka Eze', date: '2025-01-09', status: 'Claimed' },
  ];

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Transaction History" subtitle="All marketplace activity" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Transactions"  value={history.length} />
        <KPICard label="Total Claimed" value="3,240 kg" deltaType="up" />
        <KPICard label="Total Spent"   value="₦4.8M" />
        <KPICard label="Active This Month" value={7} />
      </div>
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['#','Material','Qty','Price/kg','Seller','Date','Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(l => (
                <tr key={l.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active)">
                  <td className="px-5 py-3 text-[12px] font-mono" style={{ color: 'var(--dim)' }}>{l.id}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{l.material}</td>
                  <td className="px-5 py-3 text-[13px] font-mono" style={{ color: 'var(--ink)' }}>{l.qty} kg</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#D4A017' }}>₦{l.price?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.seller}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.date}</td>
                  <td className="px-5 py-3"><Badge variant={l.status==='Available'?'success':l.status==='Sold'||l.status==='Claimed'?'brand':'muted'}>{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
