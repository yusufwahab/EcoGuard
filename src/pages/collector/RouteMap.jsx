import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, CardHeader, Badge, FillBar, Btn, KPICard } from '../../components/UI';
import { Route, MapPin, CheckCircle } from 'lucide-react';

export default function RouteMap() {
  const { routes, bins, addToast } = useApp();
  const [selected, setSelected] = useState(routes[0]?.id || null);

  const activeRoute = routes.find(r => r.id === selected);
  const routeBins   = activeRoute ? bins.filter(b => b.zone === activeRoute.zone).slice(0, activeRoute.bins) : [];

  const statusVariant  = { full: 'critical', moderate: 'warning', active: 'success', offline: 'muted' };
  const routeVariant   = { 'In Progress': 'warning', Pending: 'muted', Complete: 'success' };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Collection Routes" subtitle="View and manage assigned routes" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Routes"    value={routes.length} />
        <KPICard label="In Progress"     value={routes.filter(r => r.status === 'In Progress').length} deltaType="neutral" />
        <KPICard label="Pending"         value={routes.filter(r => r.status === 'Pending').length} />
        <KPICard label="Completed Today" value={routes.filter(r => r.status === 'Complete').length} deltaType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Route list */}
        <Card pad={false}>
          <div className="p-4 pb-3">
            <CardHeader title="Routes" />
          </div>
          <div className="px-3 pb-4 space-y-1.5">
            {routes.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className="w-full text-left p-3 rounded-md border transition-all"
                style={{
                  background: selected === r.id ? 'rgba(26,127,78,0.1)' : 'var(--active)',
                  borderColor: selected === r.id ? 'var(--brand)' : 'var(--wire)',
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{r.id}</span>
                  <Badge variant={routeVariant[r.status] || 'muted'}>{r.status}</Badge>
                </div>
                <p className="text-[12px]" style={{ color: 'var(--sub)' }}>{r.zone} Zone · {r.bins} bins · {r.distance} km</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--dim)' }}>{r.collector}</p>
                {r.status === 'In Progress' && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--card)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(r.progress / r.bins) * 100}%`, background: 'var(--brand)' }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--sub)' }}>{r.progress}/{r.bins} collected</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Route detail */}
        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-3">
            {activeRoute ? (
              <CardHeader
                title={`${activeRoute.id} — ${activeRoute.zone}`}
                subtitle={`${activeRoute.bins} bins · ${activeRoute.distance} km · Collector: ${activeRoute.collector}`}
                actions={<Badge variant={routeVariant[activeRoute.status] || 'muted'}>{activeRoute.status}</Badge>}
              />
            ) : (
              <CardHeader title="Select a route" />
            )}
          </div>

          {activeRoute ? (
            <div className="px-5 pb-5">
              {/* Map placeholder */}
              <div
                className="rounded-md mb-4 flex items-center justify-center border"
                style={{ height: 180, background: 'var(--active)', borderColor: 'var(--wire)' }}
              >
                <div className="text-center">
                  <MapPin size={24} className="mx-auto mb-2" style={{ color: 'var(--dim)' }} />
                  <p className="text-[12px]" style={{ color: 'var(--sub)' }}>Interactive map — {activeRoute.zone} Zone</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--dim)' }}>{routeBins.length} bin markers · route overlay</p>
                </div>
              </div>

              {/* Bin sequence */}
              <div className="space-y-1">
                {routeBins.map((bin, i) => {
                  const done = i < (activeRoute.progress || 0);
                  return (
                    <div key={bin.id}
                      className="flex items-center gap-3 py-2.5 border-b border-(--wire) last:border-0"
                      style={{ opacity: done ? 0.45 : 1 }}
                    >
                      <span className="text-[11px] font-mono w-5 text-center shrink-0"
                        style={{ color: done ? '#4ADE80' : 'var(--dim)' }}>
                        {done ? '✓' : i + 1}
                      </span>
                      <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--sub)' }}>{bin.id}</span>
                      <span className="flex-1 text-[12px] truncate" style={{ color: 'var(--ink)' }}>{bin.location}</span>
                      <div className="w-20 shrink-0"><FillBar value={bin.fill} /></div>
                      <Badge variant={statusVariant[bin.status] || 'muted'}>{bin.status}</Badge>
                    </div>
                  );
                })}
              </div>

              {activeRoute.status !== 'Complete' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-(--wire)">
                  <Btn onClick={() => addToast('Pickup confirmed for next bin.', 'success')}>
                    <CheckCircle size={13} />Mark Next Collected
                  </Btn>
                  <Btn variant="outline" onClick={() => addToast('Supervisor notified.', 'info')}>
                    Report Issue
                  </Btn>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 pb-10 text-center">
              <Route size={28} className="mx-auto mb-3" style={{ color: 'var(--dim)' }} />
              <p className="text-[13px]" style={{ color: 'var(--sub)' }}>Select a route from the list to view bin sequence.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
