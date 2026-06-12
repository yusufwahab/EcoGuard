import { useState } from 'react';
import { PageHeader, KPICard, Card, CardHeader, Badge, Btn, Tabs } from '../../components/UI';
import { MapPin, Phone, Mail, Leaf } from 'lucide-react';

// ── Orders ─────────────────────────────────────────────────
const sampleOrders = [
  { id: 'ORD-001', type: 'Food Scraps',        qty: 200, grade: 'A', location: 'Agege',   placed: '2025-01-10', status: 'Delivered'  },
  { id: 'ORD-002', type: 'Yard Waste',          qty: 150, grade: 'B', location: 'Ojota',   placed: '2025-01-08', status: 'In Transit' },
  { id: 'ORD-003', type: 'Mixed Organic',       qty: 80,  grade: 'B', location: 'Mushin',  placed: '2025-01-06', status: 'Pending'    },
  { id: 'ORD-004', type: 'Food Scraps',         qty: 300, grade: 'A', location: 'Yaba',    placed: '2025-01-04', status: 'Delivered'  },
  { id: 'ORD-005', type: 'Agricultural Waste',  qty: 120, grade: 'A', location: 'Badagry', placed: '2024-12-28', status: 'Delivered'  },
];

export function FarmerOrders() {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all'
    ? sampleOrders
    : sampleOrders.filter(o => o.status.toLowerCase().replace(' ', '-') === tab);
  const sv = s => s === 'Delivered' ? 'success' : s === 'In Transit' ? 'warning' : 'muted';

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="My Orders" subtitle="Track organic material orders and delivery status" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Orders"  value={sampleOrders.length} />
        <KPICard label="Delivered"     value={sampleOrders.filter(o => o.status === 'Delivered').length}   deltaType="up" />
        <KPICard label="In Transit"    value={sampleOrders.filter(o => o.status === 'In Transit').length}  deltaType="neutral" />
        <KPICard label="Total Sourced" value={`${sampleOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.qty, 0)} kg`} />
      </div>

      <Tabs
        tabs={[
          { key: 'all',        label: 'All' },
          { key: 'pending',    label: 'Pending' },
          { key: 'in-transit', label: 'In Transit' },
          { key: 'delivered',  label: 'Delivered' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['Order ID', 'Material', 'Qty', 'Grade', 'Location', 'Placed', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest"
                    style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                  <td className="px-5 py-3 text-[12px] font-mono" style={{ color: 'var(--dim)' }}>{o.id}</td>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{o.type}</td>
                  <td className="px-5 py-3 text-[13px] font-mono" style={{ color: 'var(--ink)' }}>{o.qty} kg</td>
                  <td className="px-5 py-3"><Badge variant={o.grade === 'A' ? 'success' : 'warning'}>Grade {o.grade}</Badge></td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{o.location}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{o.placed}</td>
                  <td className="px-5 py-3"><Badge variant={sv(o.status)}>{o.status}</Badge></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[13px]" style={{ color: 'var(--sub)' }}>
                    No orders in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────
export function FarmerProfile() {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name:     'Biodun Adeyemi',
    farm:     'Adeyemi Organic Farm',
    location: 'Badagry, Lagos State',
    phone:    '+234 803 456 7890',
    email:    'biodun@adeyemifarm.ng',
    size:     '2.4 hectares',
    type:     'Mixed Crops',
    bio:      'Independent smallholder farmer growing cassava, yam, and vegetables. Sourcing organic compost to reduce input costs and improve soil health.',
  });

  const field = (label, key, multiline = false) => (
    <div key={key}>
      <label className="block text-[11px] font-medium uppercase tracking-wide mb-1.5" style={{ color: 'var(--dim)' }}>{label}</label>
      {edit ? (
        multiline ? (
          <textarea rows={3} value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            className="w-full px-3 py-2 rounded border text-[13px] focus:outline-none resize-none"
            style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
          />
        ) : (
          <input value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
            style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
          />
        )
      ) : (
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink)' }}>{form[key]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader
        title="My Profile"
        subtitle="Manage your farmer account and preferences"
        actions={
          edit ? (
            <>
              <Btn variant="outline" onClick={() => setEdit(false)}>Cancel</Btn>
              <Btn onClick={() => setEdit(false)}>Save Changes</Btn>
            </>
          ) : (
            <Btn variant="outline" onClick={() => setEdit(true)}>Edit Profile</Btn>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1" pad={false}>
          <div className="p-5 flex flex-col items-center text-center border-b border-(--wire)">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold mb-3"
              style={{ background: 'rgba(26,127,78,0.15)', color: 'var(--brand)' }}>
              {form.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <p className="text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>{form.name}</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sub)' }}>{form.farm}</p>
            <div className="flex items-center gap-1.5 mt-2" style={{ color: 'var(--dim)' }}>
              <MapPin size={11} />
              <span className="text-[11px]">{form.location}</span>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {[[Phone, form.phone], [Mail, form.email], [Leaf, `${form.size} · ${form.type}`]].map(([Icon, val]) => (
              <div key={val} className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--sub)' }}>
                <Icon size={13} style={{ color: 'var(--dim)' }} />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2" pad={false}>
          <div className="p-5 pb-3 border-b border-(--wire)">
            <CardHeader title="Account Details" subtitle="Personal and farm information" />
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('Full Name', 'name')}
              {field('Farm Name', 'farm')}
              {field('Location', 'location')}
              {field('Phone', 'phone')}
              {field('Email', 'email')}
              {field('Farm Size', 'size')}
              {field('Crop Type', 'type')}
            </div>
            {field('Bio', 'bio', true)}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Orders This Season" value={5} />
        <KPICard label="Total Sourced"      value="850 kg"   deltaType="up" />
        <KPICard label="Cost Saved"         value="₦48,000"  deltaType="up" />
        <KPICard label="Preferred Grade"    value="Grade A" />
      </div>
    </div>
  );
}

// ── History ────────────────────────────────────────────────
const historyRows = [
  { id: 'ORD-001', type: 'Food Scraps',      qty: 200, grade: 'A', supplier: 'Lagos Waste Mgmt',  date: '2025-01-10', fertValue: 12000 },
  { id: 'ORD-004', type: 'Food Scraps',      qty: 300, grade: 'A', supplier: 'Eco-Guard Lagos',   date: '2025-01-04', fertValue: 18000 },
  { id: 'ORD-005', type: 'Agric Waste',      qty: 120, grade: 'A', supplier: 'Badagry Council',   date: '2024-12-28', fertValue: 7200  },
  { id: 'ORD-007', type: 'Yard Waste',       qty: 90,  grade: 'B', supplier: 'Green City Ltd',    date: '2024-12-20', fertValue: 5400  },
  { id: 'ORD-008', type: 'Mixed Organic',    qty: 140, grade: 'B', supplier: 'Surulere WMC',      date: '2024-12-15', fertValue: 8400  },
  { id: 'ORD-010', type: 'Food Scraps',      qty: 200, grade: 'A', supplier: 'Lagos Waste Mgmt',  date: '2024-12-08', fertValue: 12000 },
];

export function FarmerHistory() {
  const total   = historyRows.reduce((s, o) => s + o.qty, 0);
  const fvTotal = historyRows.reduce((s, o) => s + o.fertValue, 0);
  const suppCount = new Set(historyRows.map(o => o.supplier)).size;

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Sourcing History" subtitle="Complete history of organic material purchases" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Transactions"     value={historyRows.length} />
        <KPICard label="Total Sourced"    value={`${total} kg`}                     deltaType="up" />
        <KPICard label="Fert. Value"      value={`₦${fvTotal.toLocaleString()}`}    deltaType="up" />
        <KPICard label="Unique Suppliers" value={suppCount} />
      </div>

      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--wire)">
                {['Order ID', 'Material', 'Qty', 'Grade', 'Supplier', 'Date', 'Fert. Value'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest"
                    style={{ color: 'var(--sub)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyRows.map(o => (
                <tr key={o.id} className="border-b border-(--wire) last:border-0 hover:bg-(--active) transition-colors">
                  <td className="px-5 py-3 text-[12px] font-mono" style={{ color: 'var(--dim)' }}>{o.id}</td>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{o.type}</td>
                  <td className="px-5 py-3 text-[13px] font-mono" style={{ color: 'var(--ink)' }}>{o.qty} kg</td>
                  <td className="px-5 py-3"><Badge variant={o.grade === 'A' ? 'success' : 'warning'}>Grade {o.grade}</Badge></td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{o.supplier}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--sub)' }}>{o.date}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold" style={{ color: 'var(--brand)' }}>₦{o.fertValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
