import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Recycle, Leaf, BarChart2, Bell, Users, CheckCircle } from 'lucide-react';

const stats = [
  { value: '12',    label: 'Smart Bins'       },
  { value: '6',     label: 'Zones Monitored'  },
  { value: '847 T', label: 'Waste Diverted'   },
  { value: '₦2.4M', label: 'Value Recovered'  },
];

const features = [
  {
    icon: BarChart2,
    title: 'Real-Time Intelligence',
    body: 'Live fill levels, odor sensors, and zone-by-zone analytics across every monitored bin in Lagos.',
  },
  {
    icon: Bell,
    title: 'Citizen Incident Reporting',
    body: 'Residents flag overflow, illegal dumping, and odor events. Every report routes directly to the responsible authority.',
  },
  {
    icon: Recycle,
    title: 'Recyclables Marketplace',
    body: 'Collectors and recyclers transact directly. Grade-based pricing, verified sellers, full transaction history.',
  },
  {
    icon: Leaf,
    title: 'Organic Materials Loop',
    body: 'Food scraps and yard waste flow to farmers as certified compost — closing the agricultural inputs loop.',
  },
  {
    icon: Truck,
    title: 'Collector Dispatch',
    body: 'Optimised route assignments, earnings tracking, and per-job completion records for every collection team.',
  },
  {
    icon: Users,
    title: 'Multi-Stakeholder Access',
    body: 'Five distinct workspaces — Authority, Citizen, Collector, Recycler, Organic Buyer — each purpose-built.',
  },
];

const workspaces = [
  { icon: Shield,  label: 'Authority',      desc: 'City-wide oversight & analytics',  color: '#E53935' },
  { icon: Users,   label: 'Citizen',        desc: 'Household reporting & rewards',    color: '#1E88E5' },
  { icon: Truck,   label: 'Collector',      desc: 'Route management & earnings',      color: '#D4A017' },
  { icon: Recycle, label: 'Recycler',        desc: 'Marketplace & sourcing',           color: '#1A7F4E' },
  { icon: Leaf,    label: 'Organic Buyer',  desc: 'Agricultural compost inputs',      color: '#2E7D32' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-14 border-b"
        style={{ background: 'rgba(10,13,15,0.9)', backdropFilter: 'blur(12px)', borderColor: 'var(--wire)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <Shield size={14} color="white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>EKO-GUARD</span>
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded ml-1" style={{ background: 'var(--brand-tint)', color: 'var(--brand-lite)' }}>BETA</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] hidden sm:block" style={{ color: 'var(--sub)' }}>by EarthLies</span>
          <button
            onClick={() => navigate('/select')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-[13px] font-medium transition-all"
            style={{ background: 'var(--brand)', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-lite)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
          >
            Enter Platform <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium mb-8"
          style={{ borderColor: 'var(--wire-strong)', color: 'var(--sub)', background: 'var(--card)' }}>
          <span className="w-1.5 h-1.5 rounded-full anim-pulse-dot" style={{ background: 'var(--brand)' }} />
          Live — Lagos Metropolitan Area
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5 max-w-3xl leading-tight" style={{ color: 'var(--ink)' }}>
          Smart Waste Infrastructure<br />
          <span style={{ color: 'var(--brand-lite)' }}>for Lagos</span>
        </h1>

        <p className="text-[15px] max-w-xl mb-10 leading-relaxed" style={{ color: 'var(--sub)' }}>
          EKO-GUARD connects citizens, collectors, recyclers, and city authorities on a single data platform — turning waste into a managed, monetised resource.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button
            onClick={() => navigate('/select')}
            className="flex items-center gap-2 px-6 py-2.5 rounded text-[14px] font-semibold transition-all"
            style={{ background: 'var(--brand)', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-lite)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
          >
            Enter Platform <ArrowRight size={15} />
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2.5 rounded border text-[14px] font-medium transition-all"
            style={{ borderColor: 'var(--wire-strong)', color: 'var(--sub)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--wire-strong)'; e.currentTarget.style.color = 'var(--sub)'; }}
          >
            View Architecture
          </button>
        </div>

        {/* Hero image */}
        <div className="relative w-full max-w-4xl rounded-xl overflow-hidden border mx-auto"
          style={{ borderColor: 'var(--wire-strong)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <img src="/willerbin-waste.png" alt="Smart waste bins" className="w-full h-64 sm:h-96 object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,13,15,0.7) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2">
            {['Lekki Phase 1', 'Victoria Island', 'Ikoyi', 'Surulere', 'Yaba', 'Ikeja'].map(z => (
              <span key={z} className="px-2.5 py-1 rounded text-[11px] font-medium border"
                style={{ background: 'rgba(10,13,15,0.75)', borderColor: 'var(--wire-strong)', color: 'var(--sub)' }}>
                {z}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────── */}
      <section className="border-y mx-6 sm:mx-0" style={{ borderColor: 'var(--wire)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label}
              className={`flex flex-col items-center justify-center py-8 ${i < stats.length - 1 ? 'border-r' : ''}`}
              style={{ borderColor: 'var(--wire)' }}>
              <p className="text-[28px] font-bold font-mono mb-1" style={{ color: 'var(--ink)' }}>{s.value}</p>
              <p className="text-[12px] uppercase tracking-wide" style={{ color: 'var(--sub)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--brand-lite)' }}>Platform Capabilities</p>
          <h2 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Every stakeholder. One system.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 rounded-lg border transition-all"
                style={{ background: 'var(--card)', borderColor: 'var(--wire)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--wire-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--wire)'}>
                <div className="w-8 h-8 rounded flex items-center justify-center mb-4"
                  style={{ background: 'var(--brand-tint)', color: 'var(--brand-lite)' }}>
                  <Icon size={16} />
                </div>
                <p className="text-[14px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>{f.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sub)' }}>{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Workspaces preview ──────────────────────────────── */}
      <section className="border-t px-6 py-20" style={{ borderColor: 'var(--wire)', background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--brand-lite)' }}>Five Workspaces</p>
            <h2 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Purpose-built for every role</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-10">
            {workspaces.map(w => {
              const Icon = w.icon;
              return (
                <div key={w.label} className="flex flex-col items-center text-center p-5 rounded-lg border transition-all"
                  style={{ background: 'var(--raised)', borderColor: 'var(--wire)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = w.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--wire)'}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${w.color}18`, color: w.color }}>
                    <Icon size={18} />
                  </div>
                  <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>{w.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--sub)' }}>{w.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/select')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded text-[14px] font-semibold transition-all"
              style={{ background: 'var(--brand)', color: 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-lite)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
            >
              Select Your Workspace <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--brand-lite)' }}>The Loop</p>
          <h2 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>How EKO-GUARD works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Monitor & Report', body: 'Smart bins transmit fill and odour data. Citizens report incidents from the mobile interface.' },
            { step: '02', title: 'Collect & Sort',   body: 'Collectors receive optimised routes. Materials are sorted at source — recyclables and organic separated.' },
            { step: '03', title: 'Recover & Trade',  body: 'Recyclables enter the marketplace. Organic waste flows to the compost loop for Lagos farmers.' },
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="shrink-0">
                <span className="text-[28px] font-bold font-mono" style={{ color: 'var(--wire-strong)' }}>{s.step}</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>{s.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sub)' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────── */}
      <section className="mx-6 mb-16 rounded-xl border p-10 text-center"
        style={{ background: 'var(--brand-tint)', borderColor: 'var(--brand)', borderOpacity: 0.4 }}>
        <h2 className="text-[24px] font-bold mb-3" style={{ color: 'var(--ink)' }}>Ready to explore the platform?</h2>
        <p className="text-[14px] mb-6" style={{ color: 'var(--sub)' }}>Select your workspace and see the full EKO-GUARD dashboard.</p>
        <button
          onClick={() => navigate('/select')}
          className="inline-flex items-center gap-2 px-8 py-3 rounded text-[14px] font-semibold transition-all"
          style={{ background: 'var(--brand)', color: 'white' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-lite)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
        >
          Enter Platform <ArrowRight size={15} />
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t px-8 py-8" style={{ borderColor: 'var(--wire)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'var(--brand)' }}>
              <Shield size={11} color="white" />
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'var(--sub)' }}>EKO-GUARD by EarthLies</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--dim)' }}>
            <CheckCircle size={11} style={{ color: 'var(--brand)' }} />
            Lagos Waste Management Platform · Beta
          </div>
        </div>
      </footer>

    </div>
  );
}
