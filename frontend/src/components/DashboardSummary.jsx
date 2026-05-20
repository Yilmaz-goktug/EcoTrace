import React from 'react';
import { LeafIcon, ZapIcon, CarIcon, TrendingUpIcon, AwardIcon } from './Icons.jsx';

export const DashboardSummary = ({ totalCo2 = 0, summaryByScope = {}, period = 'all_time', setPeriod, onOpenAddModal }) => {
  const periods = [
    { id: 'daily', label: 'Bugün' },
    { id: 'monthly', label: 'Bu Ay' },
    { id: 'yearly', label: 'Bu Yıl' },
    { id: 'all_time', label: 'Tüm Zamanlar' },
  ];

  // Prepare safe defaults/mock data if summary is zero to show beautiful layout
  const scope1 = summaryByScope.scope_1 !== undefined ? summaryByScope.scope_1 : (totalCo2 ? 0 : 45.2);
  const scope2 = summaryByScope.scope_2 !== undefined ? summaryByScope.scope_2 : (totalCo2 ? 0 : 32.8);
  const scope3 = summaryByScope.scope_3 !== undefined ? summaryByScope.scope_3 : (totalCo2 ? 0 : 18.0);
  
  const activeTotal = totalCo2 || (scope1 + scope2 + scope3);

  const getPercentage = (val) => {
    if (!activeTotal) return 0;
    return Math.round((val / activeTotal) * 100);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Banner / Welcome & Quick Action */}
      <div className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl shadow-xl">
        {/* Absolute Nature Decorations */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 translate-y-12 w-48 h-48 rounded-full bg-teal-400/10 blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/20 w-fit mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sürdürülebilir Gelecek
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white m-0 leading-tight">
              Karbon Ayak İzini <br className="hidden md:inline"/>İzlemeye ve Azaltmaya Başla!
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base mt-2 font-light">
              Ulaşım, elektrik ve gıda tüketimlerinin ekolojik faturasını şeffafça hesapla. Gerçek katsayılarla emisyonları kaydet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenAddModal}
              className="px-6 py-3.5 bg-white text-emerald-900 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer w-full sm:w-auto"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs">+</span>
              Aktivite & Emisyon Ekle
            </button>
          </div>
        </div>
      </div>

      {/* KPI Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800 m-0">Ekolojik Rapor Özeti</h2>
          <p className="text-xs text-slate-500">Seçilen döneme ait emisyon verileri ve Kapsam oranları</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs w-full sm:w-auto justify-between">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex-1 sm:flex-none text-center ${
                period === p.id 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-emerald-700 bg-transparent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Emission Big Stats Card */}
        <div className="glass-card p-5 border-l-4 border-l-emerald-600 flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Toplam Emisyon</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUpIcon size={18} />
            </div>
          </div>
          <div className="my-3 text-left">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTotal.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500 ml-1">kg CO2</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-full rounded-full animate-pulse-nature"></div>
          </div>
          <span className="text-[10px] text-slate-400 text-left mt-2 block">
            {totalCo2 === 0 ? 'Örnek Veri Gösteriliyor' : 'Güncel Hesaplama'}
          </span>
        </div>

        {/* Scope 1 Stats Card */}
        <div className="glass-card p-5 flex flex-col justify-between hover:border-emerald-300">
          <div className="flex justify-between items-start">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-700">Kapsam 1</span>
              <span className="text-[10px] text-slate-400">Doğrudan (Yakıt/Ulaşım)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CarIcon size={16} />
            </div>
          </div>
          <div className="my-2 text-left flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-slate-800">{scope1.toFixed(1)}</span>
              <span className="text-xs text-slate-400 ml-1">kg</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              %{getPercentage(scope1)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1">
            <div style={{ width: `${getPercentage(scope1)}%` }} className="bg-emerald-600 h-full rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Scope 2 Stats Card */}
        <div className="glass-card p-5 flex flex-col justify-between hover:border-teal-300">
          <div className="flex justify-between items-start">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-700">Kapsam 2</span>
              <span className="text-[10px] text-slate-400">Dolaylı (Elektrik/Enerji)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <ZapIcon size={16} />
            </div>
          </div>
          <div className="my-2 text-left flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-slate-800">{scope2.toFixed(1)}</span>
              <span className="text-xs text-slate-400 ml-1">kg</span>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              %{getPercentage(scope2)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1">
            <div style={{ width: `${getPercentage(scope2)}%` }} className="bg-teal-500 h-full rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Scope 3 Stats Card */}
        <div className="glass-card p-5 flex flex-col justify-between hover:border-emerald-200">
          <div className="flex justify-between items-start">
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-700">Kapsam 3</span>
              <span className="text-[10px] text-slate-400">Diğer Dolaylı (Gıda vb.)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-400">
              <LeafIcon size={16} />
            </div>
          </div>
          <div className="my-2 text-left flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-slate-800">{scope3.toFixed(1)}</span>
              <span className="text-xs text-slate-400 ml-1">kg</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              %{getPercentage(scope3)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1">
            <div style={{ width: `${getPercentage(scope3)}%` }} className="bg-emerald-300 h-full rounded-full transition-all duration-500"></div>
          </div>
        </div>

      </div>

    </div>
  );
};
