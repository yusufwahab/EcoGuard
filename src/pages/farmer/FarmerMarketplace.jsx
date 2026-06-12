import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, KPICard, Card, Badge, Btn, SearchInput, Select, Modal } from '../../components/UI';
import { Leaf } from 'lucide-react';

export default function FarmerMarketplace() {
  const { organicListings, setOrganic, addToast } = useApp();
  const [search,  setSearch]  = useState('');
  const [grade,   setGrade]   = useState('all');
  const [target,  setTarget]  = useState(null);

  const filtered = organicListings.filter(l => {
    const q = search.toLowerCase();
    const matchQ = l.type.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
    const matchG = grade === 'all' || l.grade === grade;
    return matchQ && matchG;
  });

  const claimOrganic = () => {
    setOrganic(list => list.map(l => l.id === target.id ? { ...l, status: 'Claimed' } : l));
    addToast(`Order placed: ${target.qty}kg ${target.type}`, 'success');
    setTarget(null);
  };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Organic Market" subtitle="Source compostable materials for agricultural use" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Available" value={organicListings.filter(l=>l.status==='Available').length} />
        <KPICard label="Total Kg"  value={organicListings.filter(l=>l.status==='Available').reduce((s,l)=>s+l.qty,0).toLocaleString()} />
        <KPICard label="Grade A"   value={organicListings.filter(l=>l.grade==='A'&&l.status==='Available').length} deltaType="up" />
        <KPICard label="Claimed"   value={organicListings.filter(l=>l.status==='Claimed').length} />
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search type or location..." className="w-60" />
        <Select value={grade} onChange={setGrade}>
          <option value="all">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </Select>
        <span className="text-[12px] self-center ml-auto" style={{ color: 'var(--sub)' }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(l => (
          <Card key={l.id} pad={false}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(26,127,78,0.15)', color: 'var(--brand)' }}>
                    <Leaf size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{l.type}</p>
                    <Badge variant={l.grade==='A'?'success':l.grade==='B'?'warning':'muted'}>Grade {l.grade}</Badge>
                  </div>
                </div>
                <Badge variant={l.status==='Available'?'success':'muted'}>{l.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-md mb-3" style={{ background: 'var(--active)' }}>
                <div>
                  <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Quantity</p>
                  <p className="text-[14px] font-semibold font-mono" style={{ color: 'var(--ink)' }}>{l.qty} kg</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Fert. Value</p>
                  <p className="text-[14px] font-semibold" style={{ color: '#1A7F4E' }}>₦{l.fertValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: 'var(--sub)' }}>Location</span>
                  <span style={{ color: 'var(--ink)' }}>{l.location}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: 'var(--sub)' }}>Listed</span>
                  <span style={{ color: 'var(--dim)' }}>{l.listed}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-(--wire)">
                {l.status === 'Available' ? (
                  <Btn size="sm" onClick={() => setTarget(l)}>
                    <Leaf size={12} />Order Materials
                  </Btn>
                ) : (
                  <Badge variant="muted">{l.status}</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title="Confirm Order"
        footer={
          <>
            <Btn variant="outline" onClick={() => setTarget(null)}>Cancel</Btn>
            <Btn onClick={claimOrganic}>Confirm Order</Btn>
          </>
        }
      >
        {target && (
          <div className="space-y-3">
            <p className="text-[13px]" style={{ color: 'var(--sub)' }}>Confirm your order for:</p>
            <div className="p-3 rounded-md border space-y-2" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
              {[['Type', target.type], ['Grade', `Grade ${target.grade}`], ['Quantity', `${target.qty} kg`], ['Fertilizer Value', `₦${target.fertValue.toLocaleString()}`], ['Location', target.location]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[13px]">
                  <span style={{ color: 'var(--sub)' }}>{k}</span>
                  <span style={{ color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
