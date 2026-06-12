import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, KPICard, Card, Badge, Btn, SearchInput, Select, Modal } from '../../components/UI';
import { Plus } from 'lucide-react';

const materialColors = {
  'PET Bottles': '#1E88E5', 'Cardboard': '#D4A017', 'Metal Scrap': '#8B949E',
  'Glass': '#2E7D32', 'Aluminium': '#1A7F4E',
};

export default function RecyclerMarketplace() {
  const { marketplaceListings, claimListing, addToast } = useApp();
  const [search,  setSearch]  = useState('');
  const [matFilter, setMat]   = useState('all');
  const [gradeFilter, setGrade] = useState('all');
  const [createOpen, setCreate] = useState(false);
  const [claimTarget, setClaimTarget] = useState(null);
  const [newForm, setNewForm] = useState({ material: '', grade: 'A', qty: '', price: '', location: '' });

  const filtered = marketplaceListings.filter(l => {
    const q = search.toLowerCase();
    const matchQ = l.material.toLowerCase().includes(q) || l.seller.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
    const matchM = matFilter === 'all' || l.material === matFilter;
    const matchG = gradeFilter === 'all' || l.grade === gradeFilter;
    return matchQ && matchM && matchG;
  });

  const materials = [...new Set(marketplaceListings.map(l => l.material))];
  const available = filtered.filter(l => l.status === 'Available');
  const claimed   = filtered.filter(l => l.status === 'Sold');

  const confirmClaim = () => {
    claimListing(claimTarget.id);
    addToast(`Claim submitted for ${claimTarget.qty}kg ${claimTarget.material}.`, 'success');
    setClaimTarget(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    addToast(`Listing created: ${newForm.qty}kg ${newForm.material}`, 'success');
    setCreate(false);
    setNewForm({ material: '', grade: 'A', qty: '', price: '', location: '' });
  };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="Recyclables Marketplace"
        subtitle="Source and trade recyclable materials across Lagos"
        actions={<Btn onClick={() => setCreate(true)}><Plus size={13} />Create Listing</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Listings"  value={marketplaceListings.length} />
        <KPICard label="Available"       value={marketplaceListings.filter(l=>l.status==='Available').length} deltaType="up" />
        <KPICard label="Total Kg Listed" value={marketplaceListings.filter(l=>l.status==='Available').reduce((s,l)=>s+l.qty,0).toLocaleString()} />
        <KPICard label="Avg Price/kg"    value="₦1,820" delta="Market rate" deltaType="neutral" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search material, seller, location..." className="w-64" />
        <Select value={matFilter} onChange={setMat}>
          <option value="all">All Materials</option>
          {materials.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Select value={gradeFilter} onChange={setGrade}>
          <option value="all">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </Select>
        <span className="text-[12px] self-center ml-auto" style={{ color: 'var(--sub)' }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(l => {
          const color = materialColors[l.material] || '#8B949E';
          return (
            <Card key={l.id} pad={false}>
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background: `${color}22`, color }}>
                      {l.material.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{l.material}</p>
                      <Badge variant={l.grade === 'A' ? 'success' : l.grade === 'B' ? 'warning' : 'muted'}>Grade {l.grade}</Badge>
                    </div>
                  </div>
                  <Badge variant={l.status === 'Available' ? 'success' : l.status === 'Pending' ? 'warning' : 'muted'}>
                    {l.status}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-md mb-3" style={{ background: 'var(--active)' }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Quantity</p>
                    <p className="text-[14px] font-semibold font-mono" style={{ color: 'var(--ink)' }}>{l.qty.toLocaleString()} {l.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--dim)' }}>Price / kg</p>
                    <p className="text-[14px] font-semibold" style={{ color: '#D4A017' }}>₦{l.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Seller info */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--sub)' }}>Seller</span>
                    <span style={{ color: 'var(--ink)' }}>{l.seller}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--sub)' }}>Location</span>
                    <span style={{ color: 'var(--ink)' }}>{l.location}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--sub)' }}>Listed</span>
                    <span style={{ color: 'var(--dim)' }}>{l.listed}</span>
                  </div>
                </div>

                {/* Total value */}
                <div className="flex justify-between items-center pt-3 border-t border-(--wire)">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--dim)' }}>Total Value</p>
                    <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>₦{(l.qty * l.price).toLocaleString()}</p>
                  </div>
                  {l.status === 'Available' && (
                    <Btn size="sm" onClick={() => setClaimTarget(l)}>Claim</Btn>
                  )}
                  {l.status !== 'Available' && (
                    <Badge variant="muted">{l.status}</Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>No listings match your filters</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--sub)' }}>Try adjusting the search or filters above.</p>
        </div>
      )}

      {/* Claim confirmation */}
      <Modal
        open={!!claimTarget}
        onClose={() => setClaimTarget(null)}
        title="Confirm Claim"
        footer={
          <>
            <Btn variant="outline" onClick={() => setClaimTarget(null)}>Cancel</Btn>
            <Btn onClick={confirmClaim}>Confirm Claim</Btn>
          </>
        }
      >
        {claimTarget && (
          <div className="space-y-3">
            <p className="text-[13px]" style={{ color: 'var(--sub)' }}>You are about to claim this listing:</p>
            <div className="p-3 rounded-md border space-y-2" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
              {[['Material', `${claimTarget.material} — Grade ${claimTarget.grade}`], ['Quantity', `${claimTarget.qty} kg`], ['Price', `₦${claimTarget.price.toLocaleString()}/kg`], ['Total', `₦${(claimTarget.qty * claimTarget.price).toLocaleString()}`], ['Seller', claimTarget.seller], ['Location', claimTarget.location]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[13px]">
                  <span style={{ color: 'var(--sub)' }}>{k}</span>
                  <span style={{ color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Create listing */}
      <Modal
        open={createOpen}
        onClose={() => setCreate(false)}
        title="Create Listing"
        footer={
          <>
            <Btn variant="outline" onClick={() => setCreate(false)}>Cancel</Btn>
            <Btn onClick={handleCreate}>Publish Listing</Btn>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {[
            ['Material Type', 'material', 'text', 'e.g. PET Bottles'],
            ['Quantity (kg)', 'qty', 'number', 'e.g. 200'],
            ['Price per kg (₦)', 'price', 'number', 'e.g. 1200'],
            ['Location', 'location', 'text', 'e.g. Lekki Phase 1'],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>{label}</label>
              <input
                type={type}
                placeholder={ph}
                value={newForm[key]}
                onChange={e => setNewForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
                style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
              />
            </div>
          ))}
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Grade</label>
            <div className="flex gap-2">
              {['A', 'B', 'C'].map(g => (
                <button type="button" key={g} onClick={() => setNewForm(f => ({ ...f, grade: g }))}
                  className="px-4 py-1.5 rounded text-[13px] font-medium border transition-all"
                  style={newForm.grade === g ? { background: 'var(--brand)', color: 'white', borderColor: 'var(--brand)' } : { background: 'var(--active)', color: 'var(--sub)', borderColor: 'var(--wire)' }}>
                  Grade {g}
                </button>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
