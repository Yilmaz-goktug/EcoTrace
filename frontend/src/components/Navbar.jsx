import React from 'react';
import { LeafIcon, GlobeIcon, UserIcon, LogOutIcon } from './Icons.jsx';

export const Navbar = ({ currentTab, setCurrentTab, user, onLogout }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'Geçmiş Aktiviteler' },
    { id: 'leaderboard', label: 'Liderlik Tablosu' },
    { id: 'goals', label: 'Hedefler & Rozetler' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full py-4 px-4 md:px-8 bg-white/70 backdrop-blur-md border-b border-emerald-100/60 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Glowing Brand Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <LeafIcon size={22} className="animate-float" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
              EcoTrace
            </span>
            <span className="text-[10px] font-medium text-emerald-600 tracking-wider -mt-1 uppercase">
              Karbon Takip
            </span>
          </div>
        </div>

        {/* Dynamic Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-100 shadow-inner">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-none outline-none ${
                  isActive 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-slate-600 hover:text-emerald-600 bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">{user.username}</span>
                <span className="text-[10px] text-slate-500">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm">
                {user.username ? user.username[0].toUpperCase() : <UserIcon size={18} />}
              </div>
              <button 
                onClick={onLogout}
                title="Çıkış Yap"
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors border-none cursor-pointer"
              >
                <LogOutIcon size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <GlobeIcon size={14} className="animate-spin-slow" />
                Misafir Modu
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav Tabs Overflow */}
      <div className="flex md:hidden items-center justify-center gap-1 mt-3 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border-none ${
              currentTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
