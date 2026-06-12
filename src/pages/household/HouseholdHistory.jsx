import { useApp } from '../../context/AppContext';
import { PageHeader, Card, CardHeader, Badge, KPICard, Tabs } from '../../components/UI';
import { useState } from 'react';

export default function HouseholdHistory() {
  const { scanHistory, incidents } = useApp();
  const [tab, setTab] = useState('scans');

  const catVariant = { Recyclable: 'brand', Organic: 'success', General: 'muted' };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Activity History" subtitle="Your waste classification and reporting history" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Scans"    value={scanHistory.length} />
        <KPICard label="Recyclable"     value={scanHistory.filter(s => s.category === 'Recyclable').length} deltaType="up" />
        <KPICard label="Organic"        value={scanHistory.filter(s => s.category === 'Organic').length} />
        <KPICard label="Reports Filed"  value={incidents.length} />
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'scans',   label: 'Scan History',    count: scanHistory.length },
          { key: 'reports', label: 'Filed Reports',   count: incidents.length },
        ]}
      />

      {tab === 'scans' && (
        <Card pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--wire)">
                  {['Item','Category','Date','Confidence','Points'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scanHistory.map(s => (
                  <tr key={s.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                    <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{s.type}</td>
                    <td className="px-5 py-3"><Badge variant={catVariant[s.category] || 'muted'}>{s.category}</Badge></td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>
                      {new Date(s.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono" style={{ color: '#4ADE80' }}>{s.confidence}%</td>
                    <td className="px-5 py-3 text-[12px] font-medium" style={{ color: '#D4A017' }}>+{s.points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'reports' && (
        <Card pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--wire)">
                  {['Report ID','Category','Location','Severity','Status','Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 8).map(r => (
                  <tr key={r.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                    <td className="px-5 py-3 text-[12px] font-mono" style={{ color: 'var(--dim)' }}>{r.id}</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--ink)' }}>{r.category}</td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{r.location}</td>
                    <td className="px-5 py-3">
                      <Badge variant={{ Critical:'critical', High:'warning', Medium:'info', Low:'muted' }[r.severity] || 'muted'}>{r.severity}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={{ Open:'critical', Assigned:'warning', 'In Review':'info', Resolved:'success', Closed:'muted' }[r.status] || 'muted'}>{r.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>
                      {new Date(r.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </td>
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
