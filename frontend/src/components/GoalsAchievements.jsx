import React, { useState } from 'react';
import { AwardIcon, SparklesIcon, LeafIcon, ClockIcon, CheckIcon } from './Icons.jsx';

export const GoalsAchievements = () => {
  // Pre-seeded / mock visual milestones supporting backend architecture
  const [goals, setGoals] = useState([
    { id: 1, name: 'Haftalık Araç Kullanımını %20 Azalt', targetReduction: 15.0, progress: 8.5, deadline: '2026-06-01', status: 'active' },
    { id: 2, name: 'Evde Enerji Tasarrufu (LED Optimizasyonu)', targetReduction: 25.0, progress: 25.0, deadline: '2026-05-10', status: 'completed' },
    { id: 3, name: 'Kırmızı Et Tüketimini Yarıya İndir', targetReduction: 40.0, progress: 12.0, deadline: '2026-07-15', status: 'active' },
  ]);

  const [achievements] = useState([
    { id: 101, title: 'İlk Karbon İzi Kaydı', desc: 'Sürdürülebilirlik yolculuğuna ilk adımı attınız.', points: 50, unlocked: true, icon: '🌱' },
    { id: 102, title: 'Toplu Taşıma Elçisi', desc: 'Arka arkaya 3 kez otobüs veya tren emisyonu kaydettiniz.', points: 120, unlocked: true, icon: '🚆' },
    { id: 103, title: 'Yeşil Ev Rozeti', desc: 'Elektrik faturasında statik katsayı hedefini aştınız.', points: 200, unlocked: false, icon: '💡' },
    { id: 104, title: 'Gezegen Koruyucusu', desc: 'Toplamda 100 kg CO2 azaltımı eşiğini geçtiniz.', points: 500, unlocked: false, icon: '🌍' },
  ]);

  const calculatePercentage = (prog, target) => {
    return Math.min(Math.round((prog / target) * 100), 100);
  };

  return (
    <div className="w-full py-4 flex flex-col gap-8 text-left">
      
      {/* Intro section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 m-0">Kişisel Ekolojik Hedefler</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Karbon salınımını planlı olarak düşürmek için kendinize meydan okuyun
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const percent = calculatePercentage(goal.progress, goal.targetReduction);
          const isDone = goal.status === 'completed' || percent >= 100;

          return (
            <div 
              key={goal.id} 
              className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between transition-all ${
                isDone ? 'border-emerald-400 bg-gradient-to-br from-white to-emerald-50/40' : ''
              }`}
            >
              {isDone && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <CheckIcon size={10} /> TAMAMLANDI
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Hedef Tarih: {goal.deadline}
                </span>
                <h4 className={`text-sm font-bold m-0 ${isDone ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {goal.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs font-semibold text-slate-500">
                    İlerleme: <strong className="text-slate-800">{goal.progress}</strong> / {goal.targetReduction} kg
                  </span>
                  <span className={`text-xs font-extrabold ${isDone ? 'text-emerald-600' : 'text-teal-600'}`}>
                    %{percent}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    style={{ width: `${percent}%` }} 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements Showcase Section */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded bg-amber-100 text-amber-700">
            <SparklesIcon size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 m-0">Kazanılan Rozetler & Başarılar</h3>
            <p className="text-xs text-slate-500 m-0">
              Uygulama içi gamification ödülleri ve topluluk unvanları
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between text-left ${
                ach.unlocked 
                  ? 'bg-white border-amber-200 shadow-sm hover:shadow-md' 
                  : 'bg-slate-50/60 border-slate-200/60 opacity-60 grayscale'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-xs block">
                    {ach.icon}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    ach.unlocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {ach.points} Puan
                  </span>
                </div>

                <h5 className="text-xs font-bold text-slate-800 m-0">
                  {ach.title}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  {ach.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-right">
                {ach.unlocked ? (
                  <span className="text-emerald-600">✓ KİLİDİ AÇILDI</span>
                ) : (
                  <span className="text-slate-400">🔒 KİLİTLİ</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
