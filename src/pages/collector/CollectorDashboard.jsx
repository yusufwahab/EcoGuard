import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  KPICard, Card, CardHeader, PageHeader, Badge, FillBar, Btn, IntelPanel
} from '../../components/UI';
import { Route, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function CollectorDashboard() {
  const { currentUser, collectionJobs, routes, bins, addToast } = useApp();
  const navigate = useNavigate();

  const activeRoute    = routes.find(r => r.status === 'In Progress');
  const urgentJobs     = collectionJobs.filter(j => j.urgency === 'Critical' || j.urgency === 'Urgent');
  const availableJobs  = collectionJobs.filter(j => j.status === 'available');
  const todayEarnings  = collectionJobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.earnings, 0);

  const statusVariant = { full: 'critical', moderate: 'warning', active: 'success' };

  return (
    <div className="space-y-6 anim-fade-up">
      <PageHeader
        title="Collector Dashboard"
        subtitle="Field Operations · Today's Overview"
        actions={<Btn variant="outline" size="sm" onClick={() => navigate('/collector/map')}>
          <Route size={13} />View My Routes
        </Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Available Jobs"    value={availableJobs.length}   delta="Ready to accept"     deltaType="neutral" />
        <KPICard label="Urgent Pickups"    value={urgentJobs.length}      delta="Act within 2 hrs"    deltaType={urgentJobs.length > 0 ? 'down' : 'neutral'} />
        <KPICard label="Today's Earnings"  value={`₦${todayEarnings.toLocaleString()}`} delta="Completed jobs"   deltaType="up" />
        <KPICard label="Active Route"      value={activeRoute ? activeRoute.id : 'None'} delta={activeRoute ? `${activeRoute.progress}/${activeRoute.bins} bins` : 'No active route'} deltaType="neutral" />
      </div>

      {urgentJobs.length > 0 && (
        <IntelPanel
          type="warning"
          title="Urgent Pickups"
          updatedAt="Live"
          body={`${urgentJobs.length} bin${urgentJobs.length > 1 ? 's are' : ' is'} at critical capacity and require immediate collection. Accept jobs and proceed to pickup locations.`}
          actions={<Btn size="sm" onClick={() => navigate('/collector/jobs')}>View Jobs</Btn>}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Active route */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-3">
            <CardHeader
              title={activeRoute ? `Active Route — ${activeRoute.id}` : 'No Active Route'}
              subtitle={activeRoute ? `${activeRoute.zone} Zone · ${activeRoute.distance} km` : 'Accept a job to start a route'}
              actions={
                activeRoute
                  ? <Badge variant="warning">In Progress</Badge>
                  : <Btn size="sm" onClick={() => navigate('/collector/jobs')}>Find Jobs</Btn>
              }
            />
          </div>

          {activeRoute ? (
            <div className="px-5 pb-5">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[12px] mb-2" style={{ color: 'var(--sub)' }}>
                  <span>Route Progress</span>
                  <span className="font-mono">{activeRoute.progress} / {activeRoute.bins} bins</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--active)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(activeRoute.progress / activeRoute.bins) * 100}%`, background: 'var(--brand)' }} />
                </div>
              </div>

              {/* Bin list from route zone */}
              <div className="space-y-1">
                {bins.filter(b => b.zone === activeRoute.zone).slice(0, activeRoute.bins).map((bin, i) => {
                  const done = i < activeRoute.progress;
                  return (
                    <div key={bin.id}
                      className="flex items-center gap-3 py-2.5 border-b border-(--wire) last:border-0"
                      style={{ opacity: done ? 0.5 : 1 }}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: done ? 'rgba(26,127,78,0.2)' : 'var(--active)' }}>
                        {done
                          ? <CheckCircle size={12} style={{ color: '#4ADE80' }} />
                          : <span className="text-[10px] font-mono" style={{ color: 'var(--dim)' }}>{i + 1}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] truncate" style={{ color: done ? 'var(--dim)' : 'var(--ink)' }}>{bin.location}</p>
                      </div>
                      <div className="w-20 shrink-0"><FillBar value={bin.fill} /></div>
                      <Badge variant={statusVariant[bin.status] || 'muted'}>{bin.fill}%</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="px-5 pb-8 text-center">
              <Route size={32} className="mx-auto mb-3" style={{ color: 'var(--dim)' }} />
              <p className="text-[13px]" style={{ color: 'var(--sub)' }}>Accept a collection job to begin your route.</p>
            </div>
          )}
        </Card>

        {/* Pending routes & jobs */}
        <div className="space-y-4">
          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Pending Routes" subtitle="Assigned but not started" />
            </div>
            <div className="px-4 pb-4 space-y-2">
              {routes.filter(r => r.status === 'Pending').map(r => (
                <div key={r.id}
                  className="p-3 rounded-md border"
                  style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-medium" style={{ color: 'var(--ink)' }}>{r.id} — {r.zone}</span>
                    <Badge variant="muted">Pending</Badge>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{r.bins} bins · {r.distance} km · {r.fullBins} full</p>
                </div>
              ))}
              {routes.filter(r => r.status === 'Pending').length === 0 && (
                <p className="text-[12px]" style={{ color: 'var(--sub)' }}>No pending routes.</p>
              )}
            </div>
          </Card>

          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Quick Stats" subtitle="Today's performance" />
            </div>
            <div className="px-4 pb-4 space-y-2.5">
              {[
                ['Bins Cleared',  '12'],
                ['Distance',      '18.4 km'],
                ['Shift Time',    '4h 22m'],
                ['On-Time Rate',  '91%'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[13px]">
                  <span style={{ color: 'var(--sub)' }}>{k}</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
