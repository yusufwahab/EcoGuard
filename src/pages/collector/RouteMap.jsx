import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function RouteMap() {
  const { bins, addToast } = useApp();
  const [optimising, setOptimising] = useState(false);
  const [optimised, setOptimised] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoveredBin, setHoveredBin] = useState(null);

  // Map bin positions to SVG coordinates (600x400 canvas)
  const binPositions = [
    { id: 'BIN-001', x: 420, y: 280, bin: bins[0] },
    { id: 'BIN-002', x: 380, y: 220, bin: bins[1] },
    { id: 'BIN-003', x: 440, y: 180, bin: bins[2] },
    { id: 'BIN-004', x: 200, y: 200, bin: bins[3] },
    { id: 'BIN-005', x: 220, y: 150, bin: bins[4] },
    { id: 'BIN-006', x: 160, y: 80, bin: bins[5] },
    { id: 'BIN-007', x: 500, y: 320, bin: bins[6] },
    { id: 'BIN-008', x: 240, y: 100, bin: bins[7] },
  ];

  const optimisedOrder = [5, 7, 4, 3, 1, 0, 2, 6]; // indices

  const handleOptimise = () => {
    setOptimising(true);
    setTimeout(() => {
      setOptimising(false);
      setOptimised(true);
      addToast('Route optimised — 3.2km saved 🗺️', 'success');
    }, 1500);
  };

  const getMarkerColor = (bin) => {
    const max = Math.max(...Object.values(bin.fillLevels));
    if (max >= 90) return '#EF4444';
    if (max >= 70) return '#F59E0B';
    return '#22C55E';
  };

  const routePath = optimised
    ? optimisedOrder.map(i => `${binPositions[i].x},${binPositions[i].y}`).join(' ')
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">🗺️ Route Map</h1>

      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-purple-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /><span className="text-purple-300 text-xs">Full</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /><span className="text-purple-300 text-xs">Near Full</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /><span className="text-purple-300 text-xs">Normal</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="w-8 h-8 bg-purple-800 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all">+</button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))} className="w-8 h-8 bg-purple-800 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all">−</button>
            <button onClick={handleOptimise} disabled={optimising}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-70 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              {optimising ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Optimising...</> : '⚡ Optimise Route'}
            </button>
          </div>
        </div>

        <div className="overflow-hidden" style={{ height: 400 }}>
          <svg width="100%" height="400" viewBox="0 0 600 400" style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }}>
            {/* Background */}
            <rect width="600" height="400" fill="#0f0520" />
            {/* Street grid */}
            {[80, 160, 240, 320, 400, 480].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="#2D0A4E" strokeWidth="1" />)}
            {[80, 160, 240, 320].map(y => <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#2D0A4E" strokeWidth="1" />)}
            {/* Main roads */}
            <line x1="0" y1="200" x2="600" y2="200" stroke="#3D1A5E" strokeWidth="3" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="#3D1A5E" strokeWidth="3" />
            <line x1="0" y1="120" x2="600" y2="280" stroke="#3D1A5E" strokeWidth="2" />

            {/* Optimised route */}
            {optimised && routePath && (
              <polyline points={routePath} fill="none" stroke="#22C55E" strokeWidth="2.5"
                strokeDasharray="8 4" strokeLinecap="round" strokeLinejoin="round"
                style={{ animation: 'dash 1s linear forwards' }} />
            )}

            {/* Bin markers */}
            {binPositions.map((bp, i) => {
              const color = getMarkerColor(bp.bin);
              return (
                <g key={bp.id} onMouseEnter={() => setHoveredBin(bp)} onMouseLeave={() => setHoveredBin(null)}
                  style={{ cursor: 'pointer' }}>
                  <circle cx={bp.x} cy={bp.y} r="14" fill={color} opacity="0.2" />
                  <circle cx={bp.x} cy={bp.y} r="9" fill={color} />
                  <text x={bp.x} y={bp.y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{i + 1}</text>
                </g>
              );
            })}

            {/* Tooltip */}
            {hoveredBin && (
              <g>
                <rect x={Math.min(hoveredBin.x + 12, 460)} y={hoveredBin.y - 60} width="130" height="70" rx="8" fill="#1a0a2e" stroke="#7C3AED" strokeWidth="1" />
                <text x={Math.min(hoveredBin.x + 20, 468)} y={hoveredBin.y - 42} fill="white" fontSize="9" fontWeight="bold">{hoveredBin.id}</text>
                <text x={Math.min(hoveredBin.x + 20, 468)} y={hoveredBin.y - 28} fill="#A78BFA" fontSize="8">{hoveredBin.bin.location.slice(0, 20)}</text>
                <text x={Math.min(hoveredBin.x + 20, 468)} y={hoveredBin.y - 14} fill="#22C55E" fontSize="8">
                  R:{hoveredBin.bin.fillLevels.recyclable}% O:{hoveredBin.bin.fillLevels.organic}% G:{hoveredBin.bin.fillLevels.general}%
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bin list */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-3">Bin Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {binPositions.map((bp, i) => {
            const color = getMarkerColor(bp.bin);
            return (
              <div key={bp.id} className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: color }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{bp.bin.location}</p>
                  <p className="text-purple-500 text-[10px]">{bp.id}</p>
                </div>
                <div className="flex gap-1">
                  {[bp.bin.fillLevels.recyclable, bp.bin.fillLevels.organic, bp.bin.fillLevels.general].map((v, j) => (
                    <div key={j} className="w-1.5 h-8 bg-purple-900 rounded-full overflow-hidden">
                      <div className="w-full rounded-full transition-all duration-1000" style={{ height: `${v}%`, backgroundColor: ['#3B82F6', '#22C55E', '#EF4444'][j], marginTop: `${100 - v}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
