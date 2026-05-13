import React, { useState } from 'react';
import { LeafIcon, SparklesIcon } from './Icons.jsx';

export const AuthView = ({ onLoginSuccess, onSkipAsGuest }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Kimlik doğrulama başarısız oldu.');
      }

      if (isLogin) {
        // Save token or pass user info
        onLoginSuccess(data.user, data.access_token);
      } else {
        setSuccessMsg('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsLogin(true);
        setPassword('');
      }

    } catch (err) {
      setErrorMsg(err.message || 'Sunucuya bağlanılamadı. Proxy ayarlarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-8 px-4 flex flex-col items-center justify-center animate-fade-in">
      
      {/* Brand Header */}
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-3 animate-float">
          <LeafIcon size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight m-0">
          EcoTrace
        </h2>
        <p className="text-xs text-slate-500 font-medium tracking-wide mt-1 uppercase">
          Karbon Ayak İzi Yönetim Platformu
        </p>
      </div>

      {/* The Glassmorphic Auth Card */}
      <div className="glass-card w-full p-6 sm:p-8 bg-white/90 border-emerald-100/80 shadow-2xl relative text-left">
        
        <h3 className="text-lg font-bold text-slate-800 m-0 mb-1">
          {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          {isLogin 
            ? 'Ekolojik verilerinize ulaşmak için e-posta ve şifrenizi girin.' 
            : 'Gezegeni koruma yolculuğuna katılmak için formu doldurun.'}
        </p>

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 mb-4 font-semibold">
            ✓ {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                placeholder="Örn: evren_dostu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-nature"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              placeholder="isim@ornek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-nature"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-nature"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-nature w-full mt-2 py-3 font-extrabold text-sm"
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>

        </form>

        {/* View Switcher Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 m-0">
            {isLogin ? 'Henüz hesabınız yok mu?' : 'Zaten bir hesabınız var mı?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-emerald-600 font-bold ml-1 bg-transparent border-none cursor-pointer hover:underline"
            >
              {isLogin ? 'Hemen Kayıt Olun' : 'Giriş Yapın'}
            </button>
          </p>
        </div>

      </div>

      {/* Guest bypass helper option */}
      <div className="mt-4">
        <button
          onClick={onSkipAsGuest}
          className="text-xs font-semibold text-slate-500 hover:text-emerald-700 bg-white/60 px-4 py-2 rounded-full border border-slate-200 shadow-xs cursor-pointer transition-all hover:bg-white"
        >
          Misafir Olarak Devam Et (Demoyu İncele) →
        </button>
      </div>

    </div>
  );
};
