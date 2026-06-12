import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader, KPICard, Card, CardHeader, Badge, Btn, ActivityFeed } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from '../../components/UI';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const claimsData = [
  { month: 'Sep', kg: 420 }, { month: 'Oct', kg: 680 }, { month: 'Nov', kg: 540 },
  { month: 'Dec', kg: 890 }, { month: 'Jan', kg: 1150 },
];

export default function RecyclerDashboard() {
  const { marketplaceListings, activity } = useApp();
  const navigate = useNavigate();

  const available = marketplaceListings.filter(l => l.status === 'Available');
  const totalKg   = available.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="space-y-6 anim-fade-up">
      <PageHeader
        title="Recycler Dashboard"
        subtitle="Marketplace & Analytics Overview"
        actions={<Btn size="sm" onClick={() => navigate('/recycler/marketplace')}><ShoppingBag size={13} />Browse Listings</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Available Listings"  value={available.length}          delta="Ready to claim" deltaType="neutral" />
        <KPICard label="Total Available (kg)" value={totalKg.toLocaleString()} delta="Across all types" />
        <KPICard label="My Active Claims"     value={2}                        delta="Pending delivery" deltaType="neutral" />
        <KPICard label="Total Sourced (kg)"   value="1,150"                    delta="↑ 29% vs Dec"    deltaType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-2">
            <CardHeader title="Monthly Sourcing Volume" subtitle="Kg of recyclables claimed — last 5 months" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={claimsData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="month" tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--dim)', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Bar dataKey="kg" name="Sourced" fill="#D4A017" radius={[3, 3, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card pad={false}>
          <div className="p-4 pb-3">
            <CardHeader title="Material Breakdown" subtitle="By type (available)" />
          </div>
          <div className="px-4 pb-4 space-y-3">
            {Object.entries(
              available.reduce((acc, l) => { acc[l.material] = (acc[l.material] || 0) + l.qty; return acc; }, {})
            ).map(([mat, qty]) => (
              <div key={mat}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px]" style={{ color: 'var(--ink)' }}>{mat}</span>
                  <span className="text-[12px] font-mono" style={{ color: 'var(--sub)' }}>{qty} kg</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--active)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((qty / totalKg) * 100, 100)}%`, background: 'var(--brand)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent listings */}
      <Card pad={false}>
        <div className="p-5 pb-3">
          <CardHeader
            title="Recent Listings"
            subtitle="Newly added recyclable materials"
            actions={<Btn variant="outline" size="sm" onClick={() => navigate('/recycler/marketplace')}>View All <ArrowRight size={12} /></Btn>}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['Material','Grade','Qty (kg)','Price/kg','Seller','Location','Status'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {available.slice(0, 5).map(l => (
                <tr key={l.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{l.material}</td>
                  <td className="px-5 py-3"><Badge variant={l.grade === 'A' ? 'success' : l.grade === 'B' ? 'warning' : 'muted'}>Grade {l.grade}</Badge></td>
                  <td className="px-5 py-3 text-[13px] font-mono" style={{ color: 'var(--ink)' }}>{l.qty.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: '#D4A017' }}>₦{l.price.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.seller}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{l.location}</td>
                  <td className="px-5 py-3"><Badge variant="success">{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
