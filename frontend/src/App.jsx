import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { DashboardSummary } from './components/DashboardSummary.jsx';
import { NatureChart } from './components/NatureChart.jsx';
import { ActivityHistory } from './components/ActivityHistory.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { GoalsAchievements } from './components/GoalsAchievements.jsx';
import { AddActivityModal } from './components/AddActivityModal.jsx';
import { AuthView } from './components/AuthView.jsx';

function App() {
  // Authentication & View States
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ecotrace_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecotrace_token') || null);
  
  // If no user is authenticated, we show AuthView by default unless skipped as guest
  const [isGuest, setIsGuest] = useState(false);

  // App Navigation Tabs
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Dashboard Summary & Chart Controls
  const [period, setPeriod] = useState('all_time');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Fetched Backend Data
  const [totalCo2, setTotalCo2] = useState(0);
  const [summaryByScope, setSummaryByScope] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Active User ID for fetching
  const activeUserId = user ? user.id : 1;

  // Fetch Summary & Chart Trend Data from Backend
  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      // 1. Fetch Scope Summary for the selected period
      const sumRes = await fetch(`/api/emissions/summary/${activeUserId}?period=${period}`);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setTotalCo2(sumData.total_co2 || 0);
        setSummaryByScope(sumData.summary_by_scope || {});
      }

      // 2. Fetch list of emissions to format into beautiful day-by-day Chart array
      const emRes = await fetch(`/api/emissions?user_id=${activeUserId}`);
      if (emRes.ok) {
        const list = await emRes.json();
        
        // Group by day of week or create a simple distribution if empty
        if (list && list.length > 0) {
          const daysMap = { 'Pzt': 0, 'Sal': 0, 'Çar': 0, 'Per': 0, 'Cum': 0, 'Cmt': 0, 'Paz': 0 };
          const scopeMap = { 'Pzt': 'scope_1', 'Sal': 'scope_1', 'Çar': 'scope_1', 'Per': 'scope_1', 'Cum': 'scope_1', 'Cmt': 'scope_1', 'Paz': 'scope_1' };
          
          const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
          
          list.forEach(item => {
            const date = new Date(item.created_at);
            const dLabel = dayNames[date.getDay()];
            if (daysMap[dLabel] !== undefined) {
              daysMap[dLabel] += item.co2_kg;
              scopeMap[dLabel] = item.scope || 'scope_1';
            }
          });

          const formattedChart = Object.keys(daysMap).map(label => ({
            label,
            value: Number(daysMap[label].toFixed(2)),
            scope: scopeMap[label]
          }));

          setChartData(formattedChart);
        } else {
          // Empty state handled elegantly inside NatureChart with WOW premium fallbacks
          setChartData([]);
        }
      }
    } catch (err) {
      console.warn('Dashboard verisi çekilirken hata / Mock veriler devrede:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    // Only fetch if logged in or skipped as guest
    if (user || isGuest) {
      fetchDashboardData();
    }
  }, [activeUserId, period, user, isGuest]);

  // Auth Handlers
  const handleLoginSuccess = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('ecotrace_user', JSON.stringify(userData));
    localStorage.setItem('ecotrace_token', accessToken);
    setIsGuest(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecotrace_user');
    localStorage.removeItem('ecotrace_token');
    setIsGuest(false);
  };

  const handleSkipGuest = () => {
    setIsGuest(true);
    // Setup a pre-filled awesome demo guest profile
    setUser({ id: 1, username: 'DoğaDostu_Öğrenci', email: 'okul@proje.edu.tr' });
  };

  // Trigger re-fetch when new emission is added via modal
  const handleEmissionAdded = () => {
    fetchDashboardData();
    setIsAddOpen(false);
  };

  // Render Auth screen if not authenticated and not guest
  if (!user && !isGuest) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#eef7f0] to-[#f8fcf9]">
        <AuthView 
          onLoginSuccess={handleLoginSuccess} 
          onSkipAsGuest={handleSkipGuest} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#f4fbf6]">
      
      {/* Sticky Custom Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 animate-fade-in">
        
        {/* VIEW 1: Dashboard Overview */}
        {currentTab === 'dashboard' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <DashboardSummary 
              totalCo2={totalCo2} 
              summaryByScope={summaryByScope} 
              period={period} 
              setPeriod={setPeriod} 
              onOpenAddModal={() => setIsAddOpen(true)} 
            />

            <div className="glass-card p-6 mt-2">
              <NatureChart 
                data={chartData} 
                period={period} 
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Activity & Emission History */}
        {currentTab === 'history' && (
          <div className="animate-fade-in">
            <ActivityHistory userId={activeUserId} />
          </div>
        )}

        {/* VIEW 3: Community Leaderboard */}
        {currentTab === 'leaderboard' && (
          <div className="animate-fade-in">
            <Leaderboard />
          </div>
        )}

        {/* VIEW 4: Gamified Goals & Achievements */}
        {currentTab === 'goals' && (
          <div className="animate-fade-in">
            <GoalsAchievements />
          </div>
        )}

      </main>

      {/* Reusable Activity & Emission Add Modal */}
      <AddActivityModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        userId={activeUserId} 
        onSuccess={handleEmissionAdded} 
      />

      {/* Premium Minimal Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-emerald-100/60 mt-12 bg-white/40">
        <p className="m-0">
          🌱 <strong>EcoTrace</strong> — Sürdürülebilir Karbon Ayak İzi Yönetim Sistemi. Okul Projesi için özenle tasarlanmıştır.
        </p>
      </footer>

    </div>
  );
}

export default App;
