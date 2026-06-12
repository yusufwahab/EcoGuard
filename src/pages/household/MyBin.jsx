import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, CardHeader, Badge, FillBar, SearchInput, Select, KPICard } from '../../components/UI';
import { MapPin } from 'lucide-react';

const statusVariant = { full: 'critical', moderate: 'warning', active: 'success', offline: 'muted' };

export default function MyBin() {
  const { bins } = useApp();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  const filtered = bins.filter(b => {
    const q = search.toLowerCase();
    const matchQ = b.id.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.zone.toLowerCase().includes(q);
    const matchF = filter === 'all' || b.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Nearby Bins" subtitle="Smart bins across Lagos — tap to view details" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Nearby"  value={bins.length} />
        <KPICard label="Available"     value={bins.filter(b => b.status === 'active').length}    deltaType="up" />
        <KPICard label="Full / Urgent" value={bins.filter(b => b.status === 'full').length}      deltaType={bins.filter(b=>b.status==='full').length>0?'down':'neutral'} />
        <KPICard label="Offline"       value={bins.filter(b => b.status === 'offline').length} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search bin ID, location..." className="w-64" />
        <Select value={filter} onChange={setFilter}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="moderate">Moderate</option>
          <option value="full">Full</option>
          <option value="offline">Offline</option>
        </Select>
        <span className="text-[12px] self-center ml-auto" style={{ color: 'var(--sub)' }}>{filtered.length} bin{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Bin grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(bin => (
          <Card key={bin.id} pad={false}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono mb-1" style={{ color: 'var(--dim)' }}>{bin.id}</p>
                  <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--ink)' }}>{bin.location}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} style={{ color: 'var(--dim)' }} />
                    <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{bin.zone}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[bin.status] || 'muted'}>{bin.status}</Badge>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-(--wire)">
                <div className="flex justify-between text-[11px]" style={{ color: 'var(--sub)' }}>
                  <span>Fill Level</span>
                  <span className="font-mono">{bin.fill}%</span>
                </div>
                <FillBar value={bin.fill} />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-2 rounded" style={{ background: 'var(--active)' }}>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Odor</p>
                    <p className="text-[13px] font-medium font-mono" style={{ color: bin.odor >= 4 ? '#F87171' : bin.odor >= 2 ? '#FDBA74' : '#4ADE80' }}>
                      {bin.odor} ppm
                    </p>
                  </div>
                  <div className="p-2 rounded" style={{ background: 'var(--active)' }}>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Bottles</p>
                    <p className="text-[13px] font-medium font-mono" style={{ color: 'var(--ink)' }}>{bin.bottles.toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-[11px]" style={{ color: 'var(--dim)' }}>
                  Last pickup: {new Date(bin.lastPickup).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>No bins match your search</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--sub)' }}>Try adjusting the filters or search term.</p>
        </div>
      )}
    </div>
  );
}
