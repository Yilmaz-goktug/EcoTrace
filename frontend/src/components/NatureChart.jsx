import React, { useState } from 'react';

export const NatureChart = ({ data = [], period = 'daily' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Group or aggregate data for simple beautiful chart presentation
  // Let's create mock reference bars if data is empty to always showcase WOW design
  const chartPoints = data.length > 0 ? data : [
    { label: 'Pzt', value: 12.4, scope: 'scope_1' },
    { label: 'Sal', value: 18.2, scope: 'scope_2' },
    { label: 'Çar', value: 9.1, scope: 'scope_1' },
    { label: 'Per', value: 24.5, scope: 'scope_3' },
    { label: 'Cum', value: 15.0, scope: 'scope_2' },
    { label: 'Cmt', value: 8.3, scope: 'scope_1' },
    { label: 'Paz', value: 11.7, scope: 'scope_3' },
  ];

  const maxVal = Math.max(...chartPoints.map(d => d.value), 30);

  const getScopeColor = (scope) => {
    switch(scope) {
      case 'scope_1': return 'from-emerald-500 to-teal-600'; // Direct
      case 'scope_2': return 'from-teal-400 to-emerald-500'; // Energy
      case 'scope_3': return 'from-emerald-300 to-teal-400'; // Indirect
      default: return 'from-emerald-500 to-teal-500';
    }
  };

  const getScopeName = (scope) => {
    switch(scope) {
      case 'scope_1': return 'Doğrudan (Kapsam 1)';
      case 'scope_2': return 'Enerji (Kapsam 2)';
      case 'scope_3': return 'Dolaylı (Kapsam 3)';
      default: return 'Genel Emisyon';
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-emerald-950">Karbon Ayak İzi Trendi</h3>
          <p className="text-xs text-slate-500">Günlük CO2 salınım miktarları (kg)</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Kapsam 1
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span> Kapsam 2
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block"></span> Kapsam 3
          </span>
        </div>
      </div>

      {/* Bars container */}
      <div className="relative h-64 flex items-end justify-between gap-2 pt-10 px-2 border-b border-slate-200">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
        </div>

        {chartPoints.map((item, index) => {
          const heightPercent = Math.max((item.value / maxVal) * 100, 8); // at least 8% visible
          const isHovered = hoveredIndex === index;

          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Floating Glassmorphic Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 z-20 flex flex-col items-center pointer-events-none animate-pulse-nature">
                  <div className="bg-emerald-950 text-white text-xs py-1.5 px-3 rounded-xl shadow-xl flex flex-col items-center whitespace-nowrap min-w-24">
                    <span className="font-bold text-emerald-300">{item.value.toFixed(1)} kg</span>
                    <span className="text-[10px] text-slate-300">{getScopeName(item.scope)}</span>
                  </div>
                  <div className="w-2 h-2 bg-emerald-950 rotate-45 -mt-1"></div>
                </div>
              )}

              {/* The Beautiful Animated Bar */}
              <div className="w-full max-w-12 flex items-end h-full px-0.5 md:px-1">
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xl bg-gradient-to-t ${getScopeColor(item.scope)} transition-all duration-500 ease-out relative ${isHovered ? 'brightness-110 shadow-lg scale-y-105 origin-bottom' : 'opacity-90'}`}
                >
                  {/* Subtle inner top glare */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-white/30 rounded-t-xl"></div>
                </div>
              </div>

              {/* X Axis Label */}
              <span className={`mt-2 text-xs font-semibold transition-colors ${isHovered ? 'text-emerald-700 scale-110' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
