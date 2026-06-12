import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, CardHeader, Badge, Btn, Select, Modal } from '../../components/UI';
import { wasteClassifications } from '../../data/mockData';
import { Camera, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

const categories = ['Overflow', 'Illegal Dumping', 'Odor', 'Bin Damage', 'Air Quality', 'Other'];
const zones = ['Lekki', 'Victoria Is.', 'Ikoyi', 'Surulere', 'Yaba', 'Ikeja', 'Gbagada', 'Mushin', 'Agege'];

export default function ScanWaste() {
  const { addToast, addScan, addPoints } = useApp();
  const [mode, setMode] = useState('report'); // 'report' | 'scan'
  const [form, setForm] = useState({ category: '', zone: '', description: '', urgency: 'Medium' });
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.zone) { addToast('Please fill all required fields.', 'error'); return; }
    setConfirmModal(true);
  };

  const confirmSubmit = () => {
    setConfirmModal(false);
    setSubmitted(true);
    addToast('Report submitted successfully. Reference: INC-' + Math.floor(Math.random() * 900 + 100), 'success');
  };

  const doScan = () => {
    setScanning(true);
    setTimeout(() => {
      const item = wasteClassifications[Math.floor(Math.random() * wasteClassifications.length)];
      setScanResult(item);
      setScanning(false);
      addScan({ ...item, date: new Date().toISOString(), id: Date.now() });
      addPoints(item.points);
      addToast(`+${item.points} pts — ${item.type} classified as ${item.category}`, 'success');
    }, 2200);
  };

  const catVariant = { Recyclable: 'brand', Organic: 'success', General: 'muted' };

  return (
    <div className="space-y-5 anim-fade-up max-w-2xl">
      <PageHeader title="Actions" subtitle="Report a waste issue or classify waste" />

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-md w-fit" style={{ background: 'var(--active)' }}>
        {[['report', 'Report Issue'], ['scan', 'Classify Waste']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setMode(k); setSubmitted(false); setScanResult(null); }}
            className="px-4 py-1.5 rounded text-[13px] font-medium transition-all"
            style={mode === k ? { background: 'var(--card)', color: 'var(--ink)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' } : { color: 'var(--sub)' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Report mode ── */}
      {mode === 'report' && (
        <Card>
          <CardHeader title="File an Incident Report" subtitle="Document a waste management issue in your area" />

          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(26,127,78,0.15)' }}>
                <CheckCircle size={24} style={{ color: 'var(--brand)' }} />
              </div>
              <p className="text-[16px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>Report Submitted</p>
              <p className="text-[13px] mb-6" style={{ color: 'var(--sub)' }}>Our team will review your report and take action.</p>
              <Btn onClick={() => { setSubmitted(false); setForm({ category: '', zone: '', description: '', urgency: 'Medium' }); }}>
                File Another Report
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Category *</label>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
                    style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Zone *</label>
                  <select
                    value={form.zone}
                    onChange={e => set('zone', e.target.value)}
                    className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
                    style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
                  >
                    <option value="">Select zone</option>
                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Urgency</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High', 'Critical'].map(u => (
                    <button type="button" key={u} onClick={() => set('urgency', u)}
                      className="px-3 py-1.5 rounded text-[12px] font-medium border transition-all"
                      style={form.urgency === u
                        ? { background: 'var(--brand)', color: 'white', borderColor: 'var(--brand)' }
                        : { background: 'var(--active)', color: 'var(--sub)', borderColor: 'var(--wire)' }
                      }>
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-3 py-2 rounded border text-[13px] resize-none focus:outline-none"
                  style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--sub)' }}>
                  <MapPin size={13} style={{ color: 'var(--dim)' }} />
                  Location will be attached automatically
                </div>
                <Btn type="submit">Submit Report</Btn>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* ── Scan mode ── */}
      {mode === 'scan' && (
        <Card>
          <CardHeader title="Classify Waste" subtitle="Simulate AI waste classification and earn points" />
          <div className="flex flex-col items-center py-6 text-center">
            {!scanResult && !scanning && (
              <>
                <div className="relative mb-6 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--wire-strong)', width: 240, height: 180 }}>
                  <img src="/Sorted_Waste.png" alt="Sorted waste" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,13,15,0.45)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
                      <Camera size={22} style={{ color: 'rgba(255,255,255,0.8)' }} />
                    </div>
                  </div>
                </div>
                <p className="text-[14px] font-medium mb-1" style={{ color: 'var(--ink)' }}>Point & classify</p>
                <p className="text-[12px] mb-6" style={{ color: 'var(--sub)' }}>Our AI identifies waste type and awards you points for proper sorting.</p>
                <Btn onClick={doScan}><Camera size={14} />Classify Waste Item</Btn>
              </>
            )}

            {scanning && (
              <>
                <div className="relative mb-6 rounded-xl overflow-hidden border animate-pulse" style={{ borderColor: 'var(--brand)', width: 240, height: 180 }}>
                  <img src="/Sorted_Waste.png" alt="Sorted waste" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,13,15,0.55)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-tint)', border: '2px solid var(--brand)' }}>
                      <Camera size={22} style={{ color: 'var(--brand)' }} />
                    </div>
                  </div>
                </div>
                <p className="text-[14px] font-medium mb-1" style={{ color: 'var(--ink)' }}>Analysing...</p>
                <p className="text-[12px]" style={{ color: 'var(--sub)' }}>AI model processing waste item</p>
              </>
            )}

            {scanResult && !scanning && (
              <div className="w-full max-w-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: 'rgba(26,127,78,0.15)' }}>
                  <CheckCircle size={24} style={{ color: '#4ADE80' }} />
                </div>
                <p className="text-[16px] font-semibold mb-4" style={{ color: 'var(--ink)' }}>Classification Complete</p>
                <div className="p-4 rounded-md border text-left mb-5" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Item</span>
                    <span className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{scanResult.type}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Category</span>
                    <Badge variant={catVariant[scanResult.category] || 'muted'}>{scanResult.category}</Badge>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Confidence</span>
                    <span className="text-[13px] font-mono font-medium" style={{ color: '#4ADE80' }}>{scanResult.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Points Earned</span>
                    <span className="text-[13px] font-medium" style={{ color: '#D4A017' }}>+{scanResult.points} pts</span>
                  </div>
                </div>
                <Btn onClick={() => setScanResult(null)}>Classify Another</Btn>
              </div>
            )}
          </div>
        </Card>
      )}

      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Report Submission"
        footer={
          <>
            <Btn variant="outline" onClick={() => setConfirmModal(false)}>Cancel</Btn>
            <Btn onClick={confirmSubmit}>Submit Report</Btn>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-[13px]" style={{ color: 'var(--sub)' }}>Please confirm the details of your incident report:</p>
          <div className="p-3 rounded-md border space-y-2" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--sub)' }}>Category</span>
              <span style={{ color: 'var(--ink)' }}>{form.category}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--sub)' }}>Zone</span>
              <span style={{ color: 'var(--ink)' }}>{form.zone}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--sub)' }}>Urgency</span>
              <span style={{ color: 'var(--ink)' }}>{form.urgency}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
