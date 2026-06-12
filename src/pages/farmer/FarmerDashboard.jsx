import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader, KPICard, Card, CardHeader, Badge, Btn, ActivityFeed } from '../../components/UI';
import { Leaf, ShoppingCart, ArrowRight } from 'lucide-react';

export default function FarmerDashboard() {
  const { organicListings, activity } = useApp();
  const navigate = useNavigate();
  const available = organicListings.filter(l => l.status === 'Available');

  return (
    <div className="space-y-6 anim-fade-up">
      <PageHeader
        title="Organic Buyer Dashboard"
        subtitle="Agricultural Inputs · Compost & Organic Materials"
        actions={<Btn size="sm" onClick={() => navigate('/farmer/marketplace')}><Leaf size={13} />Browse Organic Market</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Available Listings"  value={available.length}    delta="Ready to order"    deltaType="neutral" />
        <KPICard label="Total Available"     value={`${available.reduce((s,l)=>s+l.qty,0)} kg`} />
        <KPICard label="My Active Orders"    value={1}                   delta="Pending delivery"  deltaType="neutral" />
        <KPICard label="Total Sourced (kg)"  value="1,840"               delta="↑ 15% vs last qtr" deltaType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-3">
            <CardHeader
              title="Available Organic Materials"
              subtitle="Food scraps, yard waste, and mixed organic"
              actions={<Btn variant="outline" size="sm" onClick={() => navigate('/farmer/marketplace')}>View All <ArrowRight size={12} /></Btn>}
            />
          </div>
          <div className="px-5 pb-5 space-y-1">
            {available.slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center gap-4 py-3 border-b border-(--wire) last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--ink)' }}>{l.type}</p>
                  <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{l.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-medium font-mono" style={{ color: 'var(--ink)' }}>{l.qty} kg</p>
                  <Badge variant={l.grade === 'A' ? 'success' : l.grade === 'B' ? 'warning' : 'muted'}>Grade {l.grade}</Badge>
                </div>
                <div className="text-right shrink-0 min-w-[70px]">
                  <p className="text-[13px] font-semibold" style={{ color: '#1A7F4E' }}>₦{l.fertValue.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: 'var(--dim)' }}>fert. value</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Quick Stats" subtitle="This season" />
            </div>
            <div className="px-4 pb-4 space-y-2.5">
              {[
                ['Compost Grade A',   '840 kg'],
                ['Compost Grade B',   '680 kg'],
                ['Total Orders',      '12'],
                ['Avg Lead Time',     '2.3 days'],
                ['Cost Saved vs Chem.','₦48,000'],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[13px]">
                  <span style={{ color: 'var(--sub)' }}>{k}</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Recent Activity" />
            </div>
            <div className="px-4 pb-4">
              <ActivityFeed events={activity.slice(0, 5)} max={5} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
