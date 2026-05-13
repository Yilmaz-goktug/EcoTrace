import React, { useState } from 'react';
import { LeafIcon, CarIcon, ZapIcon, PlusIcon, CheckIcon } from './Icons.jsx';

export const AddActivityModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [calcMethod, setCalcMethod] = useState('static'); // 'static' (/api/emissions/calculate) or 'dynamic' (/api/emissions/add)
  
  // Form States
  const [category, setCategory] = useState('transport'); // default static category
  const [source, setSource] = useState('car_km');
  const [amount, setAmount] = useState('');
  const [scope, setScope] = useState('scope_1');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Options mapped to backend support
  const staticCategories = [
    { id: 'transport', label: 'Ulaşım (Statik)', icon: <CarIcon size={18} /> },
    { id: 'energy', label: 'Enerji (Statik)', icon: <ZapIcon size={18} /> },
    { id: 'food', label: 'Gıda (Statik)', icon: <LeafIcon size={18} /> },
  ];

  const staticSources = {
    transport: [
      { id: 'car_km', label: 'Otomobil (km)', unit: 'km', scope: 'scope_1' },
      { id: 'bus_km', label: 'Otobüs (km)', unit: 'km', scope: 'scope_1' },
      { id: 'train_km', label: 'Tren (km)', unit: 'km', scope: 'scope_1' },
      { id: 'flight_h', label: 'Uçuş (saat)', unit: 'saat', scope: 'scope_3' },
    ],
    energy: [
      { id: 'electricity_kwh', label: 'Elektrik (kWh)', unit: 'kWh', scope: 'scope_2' },
      { id: 'natural_gas_m3', label: 'Doğalgaz (m3)', unit: 'm3', scope: 'scope_1' },
      { id: 'heating_oil_l', label: 'Kalorifer Yakıtı (Litre)', unit: 'Litre', scope: 'scope_1' },
    ],
    food: [
      { id: 'beef_kg', label: 'Sığır Eti (kg)', unit: 'kg', scope: 'scope_3' },
      { id: 'chicken_kg', label: 'Tavuk Eti (kg)', unit: 'kg', scope: 'scope_3' },
      { id: 'vegetables_kg', label: 'Sebze (kg)', unit: 'kg', scope: 'scope_3' },
    ],
  };

  // Dynamic Options matching seed.py database records
  const dynamicCategories = [
    { id: 'Ulaşım', label: 'Ulaşım (Veritabanı)', icon: <CarIcon size={18} /> },
    { id: 'Enerji', label: 'Enerji (Veritabanı)', icon: <ZapIcon size={18} /> },
  ];

  const dynamicSources = {
    'Ulaşım': [
      { id: 'Benzinli Araç', label: 'Benzinli Araç (Litre)', unit: 'Litre' },
      { id: 'Dizel Araç', label: 'Dizel Araç (Litre)', unit: 'Litre' },
    ],
    'Enerji': [
      { id: 'Elektrik', label: 'Elektrik (kWh)', unit: 'kWh' },
      { id: 'Doğalgaz', label: 'Doğalgaz (m3)', unit: 'm3' },
    ],
  };

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    if (calcMethod === 'static') {
      const firstSource = staticSources[catId]?.[0];
      if (firstSource) {
        setSource(firstSource.id);
        setScope(firstSource.scope);
      }
    } else {
      const firstSource = dynamicSources[catId]?.[0];
      if (firstSource) {
        setSource(firstSource.id);
      }
    }
  };

  const handleMethodSwitch = (method) => {
    setCalcMethod(method);
    setSuccessData(null);
    setErrorMsg('');
    if (method === 'static') {
      setCategory('transport');
      setSource('car_km');
      setScope('scope_1');
    } else {
      setCategory('Ulaşım');
      setSource('Benzinli Araç');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setErrorMsg('Lütfen geçerli pozitif bir miktar girin.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessData(null);

    // Use simulated anonymous ID 1 if userId is not present
    const activeUserId = userId || 1;

    try {
      let currentUnit = 'birim';
      if (calcMethod === 'static') {
        const found = staticSources[category]?.find(s => s.id === source);
        if (found) currentUnit = found.unit;
      } else {
        const found = dynamicSources[category]?.find(s => s.id === source);
        if (found) currentUnit = found.unit;
      }

      // Step 1: Save Activity Record to populate history list
      let activityId = null;
      try {
        const actRes = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: activeUserId,
            category: category,
            source: source,
            amount: parseFloat(amount),
            unit: currentUnit,
          })
        });
        if (actRes.ok) {
          const actData = await actRes.json();
          activityId = actData.id;
        }
      } catch (err) {
        console.warn('Activity save skipped/failed:', err);
      }

      // Step 2: Record Emission
      let endpoint = calcMethod === 'static' ? '/api/emissions/calculate' : '/api/emissions/add';
      let payload = {};

      if (calcMethod === 'static') {
        payload = {
          user_id: activeUserId,
          activity_id: activityId,
          category: category,
          source: source,
          amount: parseFloat(amount),
          scope: scope,
        };
      } else {
        payload = {
          user_id: activeUserId,
          category: category,
          source: source,
          amount: parseFloat(amount),
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Emisyon kaydedilirken bir hata oluştu.');
      }

      const calculatedCo2 = data.co2_kg !== undefined ? data.co2_kg : data.calculated_co2;
      
      setSuccessData({
        co2: calculatedCo2,
        method: calcMethod === 'static' ? 'Statik Katsayı' : 'Veritabanı Faktörü'
      });

      // Clear input
      setAmount('');
      if (onSuccess) onSuccess();

    } catch (err) {
      setErrorMsg(err.message || 'Sunucu ile iletişim kurulamadı. Proxy ayarlarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const currentSourcesList = calcMethod === 'static' ? staticSources[category] : dynamicSources[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="glass-card bg-white w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-100 flex flex-col my-auto max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <PlusIcon size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base m-0 text-left">Yeni Emisyon Kaydı</h3>
              <p className="text-emerald-200/80 text-xs m-0 text-left">Aktivitenizin ekolojik etkisini ekleyin</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center border-none cursor-pointer text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Backend Endpoint Selector Tabs */}
        <div className="grid grid-cols-2 bg-slate-50 p-1.5 border-b border-slate-100">
          <button
            type="button"
            onClick={() => handleMethodSwitch('static')}
            className={`py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              calcMethod === 'static' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-500 bg-transparent hover:text-slate-800'
            }`}
          >
            Statik Hesaplama (services.py)
          </button>
          <button
            type="button"
            onClick={() => handleMethodSwitch('dynamic')}
            className={`py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              calcMethod === 'dynamic' 
                ? 'bg-white text-teal-800 shadow-xs' 
                : 'text-slate-500 bg-transparent hover:text-slate-800'
            }`}
          >
            Dinamik DB Faktörü (seed.py)
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto text-left">
          
          {/* Success Banner */}
          {successData && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold block">Başarıyla Kaydedildi!</span>
                  <span className="text-slate-500">Yöntem: {successData.method}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-emerald-700">+{successData.co2.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 ml-1">kg CO2</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Kategori Seçin</label>
            <div className="grid grid-cols-3 gap-2">
              {(calcMethod === 'static' ? staticCategories : dynamicCategories).map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all border-none cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-800 font-bold shadow-xs' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <span className={isSelected ? 'text-emerald-600' : 'text-slate-400'}>
                      {cat.icon}
                    </span>
                    <span className="text-[11px] text-center leading-tight">
                      {cat.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Aktivite Kaynağı</label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                if (calcMethod === 'static') {
                  const found = currentSourcesList?.find(s => s.id === e.target.value);
                  if (found) setScope(found.scope);
                }
              }}
              className="input-nature py-2.5 font-medium text-xs bg-slate-50"
            >
              {currentSourcesList?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scope Indicator (Static Only) */}
          {calcMethod === 'static' && (
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Atanan Kapsam (Scope):</span>
              <span className="text-xs font-bold text-emerald-700 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                {scope.replace('_', ' ')}
              </span>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-600 uppercase">
                Tüketim Miktarı
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Birim: {currentSourcesList?.find(s => s.id === source)?.unit || 'Birim'}
              </span>
            </div>
            <input
              type="number"
              step="any"
              placeholder="Örn: 50, 12.5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-nature font-bold text-sm"
              autoFocus
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex gap-3 pt-3 border-t border-slate-100 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-nature-outline text-xs py-2 px-4 border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Kapat
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-nature text-xs py-2 px-6 flex items-center gap-1.5"
            >
              {loading ? (
                <span>Hesaplanıyor...</span>
              ) : (
                <>
                  <CheckIcon size={14} />
                  <span>Hesapla ve Kaydet</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
