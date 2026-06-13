import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, CardHeader, Badge, Btn, Modal } from '../../components/UI';
import { CheckCircle, AlertTriangle, RotateCcw, Bell, MapPin } from 'lucide-react';

// ── Demo constants ─────────────────────────────────────────
const DEMO_ITEMS = [
  { id: 1, type: 'PET Bottle',    category: 'Recyclable', comp: 'recyclable', confidence: 94, points: 15, delta: { recyclable: 8  } },
  { id: 2, type: 'Banana Peel',   category: 'Organic',    comp: 'organic',    confidence: 89, points: 12, delta: { organic: 10    } },
  { id: 3, type: 'Cardboard Box', category: 'Recyclable', comp: 'recyclable', confidence: 97, points: 15, delta: { recyclable: 7  } },
  { id: 4, type: 'Food Scrap',    category: 'Organic',    comp: 'organic',    confidence: 82, points: 12, delta: { organic: 9     } },
  { id: 5, type: 'Metal Can',     category: 'Recyclable', comp: 'recyclable', confidence: 91, points: 15, delta: { recyclable: 7  } },
  { id: 6, type: 'Plastic Bag',   category: 'General',    comp: 'general',    confidence: 76, points: 8,  delta: { general: 12    } },
  { id: 7, type: 'Glass Bottle',  category: 'Recyclable', comp: 'recyclable', confidence: 96, points: 15, delta: { recyclable: 8  } },
];

const INIT_FILLS = { recyclable: 70, organic: 62, general: 58 };

const COMP_META = {
  recyclable: { label: 'Recyclable', color: '#1E88E5', bg: 'rgba(30,136,229,0.12)'  },
  organic:    { label: 'Organic',    color: '#1A7F4E', bg: 'rgba(26,127,78,0.12)'   },
  general:    { label: 'General',    color: '#D4A017', bg: 'rgba(212,160,23,0.12)'  },
};

const categories = ['Overflow', 'Illegal Dumping', 'Odor', 'Bin Damage', 'Air Quality', 'Other'];
const zones       = ['Lekki', 'Victoria Is.', 'Ikoyi', 'Surulere', 'Yaba', 'Ikeja', 'Gbagada', 'Mushin', 'Agege'];

// ── Corner brackets ────────────────────────────────────────
function Brackets({ color }) {
  const c = color || 'rgba(26,127,78,0.8)';
  return (
    <>
      {[['t','l'],['t','r'],['b','l'],['b','r']].map(([v, h]) => (
        <div key={v+h} style={{
          position: 'absolute',
          [v === 't' ? 'top' : 'bottom']: 12,
          [h === 'l' ? 'left' : 'right']: 12,
          width: 22, height: 22,
          [v === 't' ? 'borderTop' : 'borderBottom']: `2px solid ${c}`,
          [h === 'l' ? 'borderLeft' : 'borderRight']: `2px solid ${c}`,
        }} />
      ))}
    </>
  );
}

// ── Phase badge ────────────────────────────────────────────
function PhaseBadge({ phase, isAlert }) {
  const styles = {
    idle:       { bg: 'rgba(10,13,15,0.75)',      color: 'var(--dim)',  border: 'var(--wire)',            text: 'STANDBY' },
    detecting:  { bg: 'rgba(212,160,23,0.2)',     color: '#D4A017',    border: 'rgba(212,160,23,0.45)',  text: 'OBJECT DETECTED' },
    analyzing:  { bg: 'rgba(26,127,78,0.2)',      color: '#4ADE80',    border: 'rgba(26,127,78,0.4)',    text: 'ANALYZING...' },
    classified: { bg: 'rgba(26,127,78,0.2)',      color: '#4ADE80',    border: 'rgba(26,127,78,0.5)',    text: 'CLASSIFIED' },
    alert:      { bg: 'rgba(229,57,53,0.2)',      color: '#F87171',    border: 'rgba(229,57,53,0.45)',   text: 'BIN FULL — ALERT' },
  };
  const s = styles[isAlert ? 'alert' : phase] || styles.idle;
  return (
    <span className="text-[10px] font-bold px-2 py-1 rounded tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.text}
    </span>
  );
}

export default function ScanWaste() {
  const { addToast } = useApp();
  const [mode, setMode] = useState('scan');

  // ── Report state ─────────────────────────────────────────
  const [form, setForm]           = useState({ category: '', zone: '', description: '', urgency: 'Medium' });
  const [submitted, setSubmitted] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.zone) { addToast('Please fill all required fields.', 'error'); return; }
    setConfirmModal(true);
  };
  const confirmSubmit = () => {
    setConfirmModal(false);
    setSubmitted(true);
    addToast('Report submitted. Ref: INC-' + Math.floor(Math.random() * 900 + 100), 'success');
  };

  // ── Demo state ───────────────────────────────────────────
  const [phase,    setPhase]    = useState('idle');
  const [itemIdx,  setItemIdx]  = useState(0);
  const [logs,     setLogs]     = useState([]);
  const [fills,    setFills]    = useState(INIT_FILLS);
  const [liveConf, setLiveConf] = useState(0);
  const [totalPts, setTotalPts] = useState(0);
  const [started,  setStarted]  = useState(false);

  // ── AI classifier probability bars ───────────────────────
  const [probs, setProbs] = useState({ recyclable: 33, organic: 33, general: 34 });

  useEffect(() => {
    if (phase !== 'analyzing') {
      setProbs({ recyclable: 33, organic: 33, general: 34 });
      return;
    }
    const item = DEMO_ITEMS[itemIdx];
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;
      const progress = Math.min(1, elapsed / 2200);
      const targetMain = Math.max(30, Math.floor(progress * item.confidence));
      const noise = () => Math.floor((Math.random() - 0.5) * 14 * (1 - progress * 0.7));
      const other = Math.floor((100 - targetMain) / 2);
      const base = { recyclable: other, organic: other, general: other };
      base[item.comp] = targetMain;
      setProbs({
        recyclable: Math.max(2, Math.min(96, base.recyclable + noise())),
        organic:    Math.max(2, Math.min(96, base.organic    + noise())),
        general:    Math.max(2, Math.min(96, base.general    + noise())),
      });
    }, 100);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, itemIdx]);

  // ── Streaming data readout ───────────────────────────────
  const [dataLine, setDataLine] = useState('');

  useEffect(() => {
    if (phase !== 'analyzing' && phase !== 'detecting') { setDataLine(''); return; }
    const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
    const interval = setInterval(() => {
      const t = new Date().toLocaleTimeString('en-GB', { hour12: false });
      setDataLine(`SYS:OK  ${hex()} ${hex()} ${hex()} ${hex()}  NIR:850nm  TEMP:${(22 + Math.random() * 2).toFixed(1)}°C  ${t}`);
    }, 130);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Scan orchestrator ────────────────────────────────────
  const runItem = (idx) => {
    if (idx >= DEMO_ITEMS.length) return;
    const item = DEMO_ITEMS[idx];
    setItemIdx(idx);
    setLiveConf(0);
    setPhase('detecting');

    setTimeout(() => {
      setPhase('analyzing');
      let conf = 0;
      const tick = setInterval(() => {
        conf += 2;
        if (conf >= item.confidence) { conf = item.confidence; clearInterval(tick); }
        setLiveConf(conf);
      }, 30);

      setTimeout(() => {
        clearInterval(tick);
        setLiveConf(item.confidence);
        setLogs(prev => [...prev, item]);
        setFills(prev => {
          const next = { ...prev };
          Object.entries(item.delta).forEach(([k, v]) => { next[k] = Math.min(100, prev[k] + v); });
          return next;
        });
        setTotalPts(p => p + item.points);
        setPhase('classified');

        setTimeout(() => {
          if (idx + 1 >= DEMO_ITEMS.length) {
            setPhase('alert');
            addToast('ALERT: Recyclable compartment full — collection team notified', 'error');
          } else {
            runItem(idx + 1);
          }
        }, 1400);
      }, 2200);
    }, 750);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode !== 'scan' || started || phase !== 'idle') return;
    setStarted(true);
    const t = setTimeout(() => runItem(0), 1500);
    return () => clearTimeout(t);
  }, [mode, started, phase]);

  const resetDemo = () => {
    setPhase('idle');
    setItemIdx(0);
    setLogs([]);
    setFills(INIT_FILLS);
    setLiveConf(0);
    setTotalPts(0);
    setStarted(false);
    setProbs({ recyclable: 33, organic: 33, general: 34 });
  };

  const currentItem = DEMO_ITEMS[itemIdx];
  const isAlert     = phase === 'alert';
  const bracketClr  = isAlert ? 'rgba(229,57,53,0.8)' : 'rgba(26,127,78,0.8)';

  // Derived label for AI Scan Status phase row
  const phaseLabel = isAlert ? 'Alert Triggered'
    : phase === 'idle'       ? 'Standby — Monitoring'
    : phase === 'detecting'  ? 'Object Detected'
    : phase === 'analyzing'  ? 'AI Analyzing'
    : phase === 'classified' ? 'Classified'
    : phase;

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Smart Bin Scanner" subtitle="Live AI waste classification — Bin #BIN-004, Lekki Phase 1" />

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-md w-fit" style={{ background: 'var(--active)' }}>
        {[['scan', 'Live Demo'], ['report', 'Report Issue']].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k)}
            className="px-4 py-1.5 rounded text-[13px] font-medium transition-all"
            style={mode === k
              ? { background: 'var(--card)', color: 'var(--ink)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }
              : { color: 'var(--sub)' }
            }>{label}</button>
        ))}
      </div>

      {/* ══ DEMO MODE ══════════════════════════════════════════ */}
      {mode === 'scan' && (
        <div className="space-y-4">

          {/* Alert banner */}
          {isAlert && (
            <div className="flex items-start gap-3 p-4 rounded-lg border anim-fade-up"
              style={{ background: 'rgba(229,57,53,0.08)', borderColor: '#E53935' }}>
              <AlertTriangle size={18} style={{ color: '#E53935', flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1">
                <p className="text-[14px] font-bold mb-0.5" style={{ color: '#E53935' }}>COMPARTMENT FULL — RECYCLABLE</p>
                <p className="text-[12px]" style={{ color: 'var(--sub)' }}>
                  Recyclable compartment reached 100% after Glass Bottle deposit.
                  Collection team notified automatically via SMS and dashboard alert.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded shrink-0"
                style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935' }}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold tracking-wider"
                style={{ background: 'rgba(229,57,53,0.08)', borderColor: 'rgba(229,57,53,0.3)', color: '#F87171' }}>
                <span className="w-1.5 h-1.5 rounded-full anim-pulse-dot" style={{ background: '#E53935' }} />
                LIVE DEMO
              </div>
              <span className="text-[12px]" style={{ color: 'var(--sub)' }}>Smart Waste Station v2 · EKO-GUARD Network</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-mono" style={{ color: 'var(--sub)' }}>{logs.length}/{DEMO_ITEMS.length} items</span>
              <Btn variant="outline" size="sm" onClick={resetDemo}><RotateCcw size={12} />Replay</Btn>
            </div>
          </div>

          {/* ── Main grid ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* ── Camera feed ─────────────────────────────── */}
            <Card pad={false} className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '16/10' }}>
                <img src="/Sorted_Waste.png" alt="Bin camera feed" className="w-full h-full object-cover" />

                {/* Phase tint */}
                <div className="absolute inset-0 transition-colors duration-500" style={{
                  background: isAlert
                    ? 'rgba(229,57,53,0.14)'
                    : phase === 'analyzing'
                      ? 'rgba(10,13,15,0.28)'
                      : 'rgba(10,13,15,0.44)',
                }} />

                {/* Scan grid — always on, intensity varies by phase */}
                <div className="absolute inset-0 transition-opacity duration-500" style={{
                  backgroundImage:
                    'linear-gradient(rgba(26,127,78,0.07) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(26,127,78,0.07) 1px, transparent 1px)',
                  backgroundSize: '26px 26px',
                  opacity: phase === 'analyzing' ? 1 : phase === 'detecting' ? 0.7 : 0.35,
                }} />

                {/* ── Three bouncing scan beams — always animating ── */}
                {!isAlert && (
                  <>
                    {/* Primary beam — 4px thick, always fully visible */}
                    <div className="scan-line-a" style={{
                      height: 4,
                      background: 'linear-gradient(to right, transparent 2%, #1A7F4E 10%, #4ADE80 50%, #1A7F4E 90%, transparent 98%)',
                      boxShadow: '0 0 14px 3px rgba(26,127,78,0.9), 0 0 4px rgba(74,222,128,0.8)',
                      opacity: phase === 'analyzing' ? 1 : phase === 'detecting' ? 0.85 : 0.7,
                    }} />
                    {/* Echo 1 — 2px */}
                    <div className="scan-line-b" style={{
                      height: 2,
                      background: 'linear-gradient(to right, transparent 5%, rgba(26,127,78,0.9) 15%, rgba(74,222,128,0.9) 50%, rgba(26,127,78,0.9) 85%, transparent 95%)',
                      boxShadow: '0 0 8px 2px rgba(26,127,78,0.6)',
                      opacity: phase === 'analyzing' ? 0.85 : phase === 'detecting' ? 0.65 : 0.5,
                    }} />
                    {/* Echo 2 — 2px */}
                    <div className="scan-line-c" style={{
                      height: 2,
                      background: 'linear-gradient(to right, transparent 5%, rgba(26,127,78,0.7) 15%, rgba(26,127,78,0.7) 85%, transparent 95%)',
                      boxShadow: '0 0 5px rgba(26,127,78,0.4)',
                      opacity: phase === 'analyzing' ? 0.7 : phase === 'detecting' ? 0.5 : 0.35,
                    }} />
                  </>
                )}

                {/* Corner brackets */}
                <Brackets color={bracketClr} />

                {/* Detecting bounding box */}
                {phase === 'detecting' && (
                  <div className="scan-box absolute" style={{
                    top: '22%', left: '22%', right: '22%', bottom: '18%',
                    border: '1.5px dashed rgba(212,160,23,0.85)',
                    borderRadius: 4,
                  }} />
                )}

                {/* Phase badge — top left */}
                <div className="absolute top-3 left-3">
                  <PhaseBadge phase={phase} isAlert={isAlert} />
                </div>

                {/* ── AI Classifier panel — top right (analyzing only) ── */}
                {phase === 'analyzing' && (
                  <div className="absolute top-3 right-3 rounded-lg border anim-fade-up"
                    style={{ background: 'rgba(10,13,15,0.88)', borderColor: 'rgba(26,127,78,0.3)', backdropFilter: 'blur(6px)', minWidth: 148 }}>
                    {/* Header row: label + live confidence */}
                    <div className="flex items-center justify-between px-2.5 pt-2.5 pb-2 border-b"
                      style={{ borderColor: 'rgba(26,127,78,0.2)' }}>
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--dim)' }}>
                        AI Classifier
                      </span>
                      <span className="text-[20px] font-bold font-mono leading-none"
                        style={{ color: '#4ADE80', textShadow: '0 0 10px rgba(26,127,78,0.8)' }}>
                        {liveConf}%
                      </span>
                    </div>

                    {/* Probability bars */}
                    <div className="px-2.5 py-2 space-y-2">
                      {[
                        { label: 'Recyclable', key: 'recyclable', color: '#1E88E5' },
                        { label: 'Organic',    key: 'organic',    color: '#22A867' },
                        { label: 'General',    key: 'general',    color: '#D4A017' },
                      ].map(({ label, key, color }) => (
                        <div key={key}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[10px]" style={{ color: 'var(--sub)' }}>{label}</span>
                            <span className="text-[10px] font-mono font-semibold" style={{ color }}>{probs[key]}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <div className="h-full rounded-full transition-all duration-100"
                              style={{ width: `${probs[key]}%`, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classified result overlay — bottom */}
                {phase === 'classified' && (
                  <div className="absolute bottom-8 left-3 right-3 rounded-lg p-3 border anim-fade-up"
                    style={{ background: 'rgba(10,13,15,0.9)', borderColor: 'rgba(26,127,78,0.5)', backdropFilter: 'blur(6px)' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} style={{ color: '#4ADE80' }} />
                        <span className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{currentItem?.type}</span>
                      </div>
                      <span className="text-[12px] font-semibold" style={{ color: '#D4A017' }}>+{currentItem?.points} pts</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[11px]" style={{ color: 'var(--sub)' }}>
                        Route → <span style={{ color: COMP_META[currentItem?.comp]?.color }}>{COMP_META[currentItem?.comp]?.label}</span>
                      </span>
                      <span className="text-[11px] font-mono" style={{ color: '#4ADE80' }}>{currentItem?.confidence}% conf.</span>
                    </div>
                  </div>
                )}

                {/* Alert overlay — bottom */}
                {isAlert && (
                  <div className="absolute bottom-8 left-3 right-3 rounded-lg p-3 border anim-fade-up"
                    style={{ background: 'rgba(10,13,15,0.9)', borderColor: 'rgba(229,57,53,0.5)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={13} style={{ color: '#E53935' }} />
                      <span className="text-[13px] font-bold" style={{ color: '#F87171' }}>RECYCLABLE COMPARTMENT FULL</span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--sub)' }}>Automated alert dispatched · Collection team en route</p>
                  </div>
                )}

                {/* Streaming data readout strip — bottom */}
                {(phase === 'analyzing' || phase === 'detecting') && dataLine && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 font-mono text-[9px] truncate"
                    style={{
                      background: 'rgba(10,13,15,0.8)',
                      color: 'rgba(26,127,78,0.65)',
                      borderTop: '1px solid rgba(26,127,78,0.12)',
                    }}>
                    {dataLine}
                  </div>
                )}

                {/* Camera meta */}
                {phase === 'idle' && (
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.28)' }}>
                      CAM-01 · {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* ── Status panels ────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Compartment Levels */}
              <Card pad={false}>
                <div className="p-4 pb-3 border-b" style={{ borderColor: 'var(--wire)' }}>
                  <CardHeader title="Compartment Levels" subtitle="Real-time bin fill capacity" />
                </div>
                <div className="p-4 space-y-4">
                  {Object.entries(fills).map(([key, pct]) => {
                    const meta = COMP_META[key];
                    const full = pct >= 100;
                    const col  = full ? '#E53935' : meta.color;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0 transition-colors duration-700"
                              style={{ background: col }} />
                            <span className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>{meta.label}</span>
                          </div>
                          <span className="text-[12px] font-mono font-semibold transition-colors duration-500"
                            style={{ color: full ? '#E53935' : 'var(--ink)' }}>
                            {pct}%{full ? ' — FULL' : ''}
                          </span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--active)' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: full
                                ? 'linear-gradient(to right, #E53935, #F87171)'
                                : col,
                              boxShadow: full ? `0 0 8px ${col}` : 'none',
                            }} />
                        </div>
                        {full && (
                          <p className="text-[10px] mt-1 font-medium anim-fade-up" style={{ color: '#E53935' }}>
                            Collection required — team notified
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* AI Scan Status */}
              <Card pad={false}>
                <div className="p-4 pb-3 border-b" style={{ borderColor: 'var(--wire)' }}>
                  <CardHeader title="AI Scan Status" subtitle="Current detection pipeline" />
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    ['Phase',
                      phase === 'idle' ? 'Standby — Monitoring' : phaseLabel,
                      isAlert ? '#E53935' : phase === 'analyzing' ? '#4ADE80' : phase === 'detecting' ? '#D4A017' : 'var(--ink)'],
                    ['Item',
                      phase === 'idle' ? 'Bin Almost Filled' : currentItem?.type,
                      phase === 'idle' ? 'var(--ink)' : 'var(--ink)'],
                    ['Category',
                      phase === 'idle' ? 'Unclassified' : currentItem?.category,
                      phase === 'idle' ? 'var(--sub)' : COMP_META[currentItem?.comp]?.color],
                    ['Confidence',
                      phase === 'idle' ? '93.30%'
                        : phase === 'analyzing' ? `${liveConf}.00%`
                        : (phase === 'classified' || isAlert) ? `${currentItem?.confidence}.00%`
                        : '93.30%',
                      phase === 'idle' ? '#4ADE80' : '#4ADE80'],
                    ['Compartment',
                      phase === 'idle' ? 'None Assigned' : COMP_META[currentItem?.comp]?.label,
                      phase === 'idle' ? 'var(--sub)' : COMP_META[currentItem?.comp]?.color],
                  ].map(([label, val, color]) => (
                    <div key={label} className="flex items-center justify-between text-[12px]">
                      <span style={{ color: 'var(--sub)' }}>{label}</span>
                      <span className="font-medium transition-all duration-300" style={{ color }}>{val}</span>
                    </div>
                  ))}

                  <div className="border-t pt-3 mt-1 space-y-2.5" style={{ borderColor: 'var(--wire)' }}>
                    <div className="flex justify-between text-[12px]">
                      <span style={{ color: 'var(--sub)' }}>Items Scanned</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--ink)' }}>
                        {logs.length} / 7
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span style={{ color: 'var(--sub)' }}>Points Earned</span>
                      <span className="font-semibold transition-all duration-500" style={{ color: '#D4A017' }}>
                        +{totalPts} pts
                      </span>
                    </div>

                    {/* Overall progress bar */}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--active)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(logs.length / 7) * 100}%`, background: 'var(--brand)' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Classification log grid ──────────────────────── */}
          {logs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--sub)' }}>
                Classification Log — {logs.length} item{logs.length !== 1 ? 's' : ''} recorded
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {logs.map((item, i) => (
                  <div key={`${item.id}-${i}`} className="p-3 rounded-lg border anim-fade-up"
                    style={{ background: 'var(--card)', borderColor: 'var(--wire)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono" style={{ color: 'var(--dim)' }}>
                        #{String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: '#D4A017' }}>
                        +{item.points} pts
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>{item.type}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: COMP_META[item.comp]?.bg, color: COMP_META[item.comp]?.color }}>
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--sub)' }}>
                        {item.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ REPORT MODE ════════════════════════════════════════ */}
      {mode === 'report' && (
        <Card>
          <CardHeader title="File an Incident Report" subtitle="Document a waste management issue in your area" />
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(26,127,78,0.15)' }}>
                <CheckCircle size={24} style={{ color: 'var(--brand)' }} />
              </div>
              <p className="text-[16px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>Report Submitted</p>
              <p className="text-[13px] mb-6" style={{ color: 'var(--sub)' }}>Our team will review and take action.</p>
              <Btn onClick={() => { setSubmitted(false); setForm({ category: '', zone: '', description: '', urgency: 'Medium' }); }}>
                File Another Report
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Category *</label>
                  <select value={form.category} onChange={e => setF('category', e.target.value)}
                    className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
                    style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Zone *</label>
                  <select value={form.zone} onChange={e => setF('zone', e.target.value)}
                    className="w-full h-9 px-3 rounded border text-[13px] focus:outline-none"
                    style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }}>
                    <option value="">Select zone</option>
                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Urgency</label>
                <div className="flex gap-2 flex-wrap">
                  {['Low', 'Medium', 'High', 'Critical'].map(u => (
                    <button type="button" key={u} onClick={() => setF('urgency', u)}
                      className="px-3 py-1.5 rounded text-[12px] font-medium border transition-all"
                      style={form.urgency === u
                        ? { background: 'var(--brand)', color: 'white', borderColor: 'var(--brand)' }
                        : { background: 'var(--active)', color: 'var(--sub)', borderColor: 'var(--wire)' }
                      }>{u}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--sub)' }}>Description</label>
                <textarea value={form.description} onChange={e => setF('description', e.target.value)}
                  rows={3} placeholder="Describe the issue in detail..."
                  className="w-full px-3 py-2 rounded border text-[13px] resize-none focus:outline-none"
                  style={{ background: 'var(--active)', borderColor: 'var(--wire)', color: 'var(--ink)' }} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--sub)' }}>
                  <MapPin size={13} style={{ color: 'var(--dim)' }} />
                  Location attached automatically
                </div>
                <Btn type="submit">Submit Report</Btn>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Confirm modal */}
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
          <p className="text-[13px]" style={{ color: 'var(--sub)' }}>Confirm the details of your report:</p>
          <div className="p-3 rounded-md border space-y-2" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
            {[['Category', form.category], ['Zone', form.zone], ['Urgency', form.urgency]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[13px]">
                <span style={{ color: 'var(--sub)' }}>{k}</span>
                <span style={{ color: 'var(--ink)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
