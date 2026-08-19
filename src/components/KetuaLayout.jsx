import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  CheckSquare, 
  Users, 
  User, 
  HelpCircle, 
  LogOut,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import api, { getUserName } from '../services/api';

export default function KetuaLayout() {
  const navigate = useNavigate();
  
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profil, setProfil] = useState({
    nama: getUserName() || 'Ketua',
    foto_url: '',
  });

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        setProfil({
          nama: res.data.nama || getUserName() || 'Ketua',
          foto_url: res.data.foto_url || '',
        });
      })
      .catch(() => {
      });
  }, []);

  const currentUser = {
    name: profil.nama,
    role: 'KETUA',
  };

  const processLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Beranda', path: '/ketua/dashboard', icon: LayoutDashboard },
    { label: 'Kendali Kebijakan', path: '/ketua/kebijakan', icon: SlidersHorizontal },
    { label: 'Persetujuan', path: '/ketua/persetujuan', icon: CheckSquare },
    { label: 'Pengurus & Anggota', path: '/ketua/pengurus', icon: Users },
    { label: 'Kas Koperasi', path: '/ketua/kas', icon: Building2 },
    { label: 'Profile', path: '/ketua/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden relative">
      
      <aside 
        onMouseEnter={() => setIsHovered(true)}  
        onMouseLeave={() => setIsHovered(false)} 
        className={`
          bg-[#081028] text-white flex flex-col justify-between shrink-0 relative
          transition-all duration-300 ease-in-out z-30
          ${isHovered ? 'w-64' : 'w-20'}
        `}
      >
        <div>
          <div className="p-6 flex items-center justify-between overflow-hidden">
            {isHovered ? (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                  KSP Sejahtera
                </h1>
                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Dinas Sosial</p>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <span className="font-black text-amber-400 text-xl">KSP</span>
              </div>
            )}
          </div>

          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={!isHovered ? item.label : ''} 
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#121E3D] text-amber-400 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F1935]'
                    } ${!isHovered ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon size={20} className="shrink-0" />
                  {isHovered && (
                    <span className="whitespace-nowrap animate-in fade-in duration-150">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-3">
          {isHovered ? (
            <div className="space-y-2 animate-in fade-in duration-200">
              <button 
                type="button"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle size={16} />
                <span>Butuh Bantuan?</span>
              </button>

              <button 
                type="button"
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-[#0F1935] rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <button 
                title="Butuh Bantuan?"
                className="p-2.5 bg-amber-400 text-slate-900 rounded-xl hover:bg-amber-500 cursor-pointer"
              >
                <HelpCircle size={18} />
              </button>
              <button 
                title="Keluar"
                onClick={() => setShowConfirm(true)}
                className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-[#0F1935] rounded-xl cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-end shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">{currentUser.role}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#081028] border-2 border-amber-400 flex items-center justify-center text-amber-400 font-bold text-sm overflow-hidden">
              {profil.foto_url ? (
                <img src={profil.foto_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-800">Konfirmasi Keluar</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin keluar dari portal KSP Sejahtera?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={processLogout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}