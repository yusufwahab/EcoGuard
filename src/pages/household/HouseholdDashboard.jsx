import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  KPICard, Card, CardHeader, PageHeader, Badge, FillBar,
  ActivityFeed, IntelPanel, Btn
} from '../../components/UI';
import { MapPin, AlertCircle, Star, ArrowRight, Recycle } from 'lucide-react';

export default function HouseholdDashboard() {
  const { currentUser, bins, incidents, activity } = useApp();
  const navigate = useNavigate();

  const nearbyBins = bins.slice(0, 4);
  const myReports  = incidents.filter(i => i.filedBy === 'Adaeze Okonkwo');
  const fullNearby = nearbyBins.filter(b => b.status === 'full' || b.fill > 70);

  const statusVariant = { full: 'critical', moderate: 'warning', active: 'success', offline: 'muted' };

  return (
    <div className="space-y-6 anim-fade-up">
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}.`}
        subtitle="Citizen Portal · Lagos"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Your Points"     value={currentUser.points} delta="845 pts earned" deltaType="up" />
        <KPICard label="Sustainability"  value={currentUser.sustainabilityScore} suffix="%" delta="Top 25% in zone" deltaType="up" />
        <KPICard label="Reports Filed"   value={myReports.length + 3} delta="2 resolved" deltaType="neutral" />
        <KPICard label="Nearby Bins"     value={nearbyBins.length} delta={`${fullNearby.length} need pickup`} deltaType={fullNearby.length > 0 ? 'down' : 'neutral'} />
      </div>

      {/* Alert if bins full nearby */}
      {fullNearby.length > 0 && (
        <IntelPanel
          type="warning"
          title="Nearby Bin Alert"
          updatedAt="Live"
          body={`${fullNearby.length} bin${fullNearby.length > 1 ? 's' : ''} near you ${fullNearby.length > 1 ? 'are' : 'is'} at high capacity. Consider using an alternate bin or filing a report if overflowing.`}
          actions={
            <Btn size="sm" onClick={() => navigate('/household/bin')}>View Nearby Bins</Btn>
          }
        />
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: AlertCircle, label: 'Report an Issue',    sub: 'File a waste complaint', to: '/household/scan',    color: '#E53935' },
          { icon: MapPin,      label: 'Find Nearest Bin',   sub: 'Locate bins near you',   to: '/household/bin',     color: '#1A7F4E' },
          { icon: Star,        label: 'Redeem Rewards',     sub: `${currentUser.points} points available`, to: '/household/rewards', color: '#D4A017' },
        ].map(({ icon: Icon, label, sub, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="flex items-center gap-4 p-4 rounded-md border text-left group transition-all duration-150"
            style={{ background: 'var(--card)', borderColor: 'var(--wire)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--active)'; e.currentTarget.style.borderColor = 'var(--wire-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.borderColor = 'var(--wire)'; }}
          >
            <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: `${color}1A`, color }}>
              <Icon size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{label}</p>
              <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{sub}</p>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--dim)' }} className="shrink-0" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Nearby bins */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-3">
            <CardHeader
              title="Nearby Smart Bins"
              subtitle="Bins within your area"
              actions={<Btn variant="outline" size="sm" onClick={() => navigate('/household/bin')}>View All</Btn>}
            />
          </div>
          <div className="px-5 pb-5 space-y-1">
            {nearbyBins.map(bin => (
              <div key={bin.id} className="flex items-center gap-4 py-3 border-b border-(--wire) last:border-0">
                <div>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{bin.location}</p>
                  <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{bin.zone}</p>
                </div>
                <div className="ml-auto flex items-center gap-3 shrink-0">
                  <div className="w-24">
                    <FillBar value={bin.fill} />
                  </div>
                  <Badge variant={statusVariant[bin.status] || 'muted'}>{bin.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity + reports */}
        <div className="space-y-4">
          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="My Reports" subtitle={`${myReports.length + 3} filed`} />
            </div>
            {myReports.length === 0 ? (
              <p className="px-4 pb-4 text-[12px]" style={{ color: 'var(--sub)' }}>No reports filed yet.</p>
            ) : (
              <div className="px-4 pb-4 space-y-2">
                {myReports.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-mono" style={{ color: 'var(--dim)' }}>{r.id}</span>
                    <span className="text-[12px] flex-1 truncate" style={{ color: 'var(--sub)' }}>{r.category}</span>
                    <Badge variant={{ Open: 'critical', Resolved: 'success', 'In Review': 'info' }[r.status] || 'muted'}>
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
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
