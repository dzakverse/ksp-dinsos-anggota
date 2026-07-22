import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  CheckSquare, 
  Users, 
  User, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

export default function KetuaLayout() {
  const navigate = useNavigate();
  
  // State Hover untuk Sidebar
  const [isHovered, setIsHovered] = useState(false);

  const currentUser = {
    name: 'Drs. H. Ahmad',
    role: 'KETUA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
  };

  const navItems = [
    { label: 'Beranda', path: '/ketua/dashboard', icon: LayoutDashboard },
    { label: 'Kendali Kebijakan', path: '/ketua/kebijakan', icon: SlidersHorizontal },
    { label: 'Persetujuan', path: '/ketua/persetujuan', icon: CheckSquare },
    { label: 'Pengurus & Anggota', path: '/ketua/pengurus', icon: Users },
    { label: 'Profile', path: '/ketua/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* ================= SIDEBAR HOVER MODE ================= */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}  // Saat kursor masuk -> Melebar
        onMouseLeave={() => setIsHovered(false)} // Saat kursor keluar -> Menciut
        className={`
          bg-[#081028] text-white flex flex-col justify-between shrink-0 relative
          transition-all duration-300 ease-in-out z-30
          ${isHovered ? 'w-64' : 'w-20'}
        `}
      >
        <div>
          {/* Header / Logo */}
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

          {/* Menu Navigasi */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={!isHovered ? item.label : ''} // Tooltip muncul saat sidebar dalam mode ringkas
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

        {/* Bottom Actions */}
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
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/login')}
                className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-[#0F1935] rounded-xl cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ================= AREA UTAMA ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Profil */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-end shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">{currentUser.role}</div>
            </div>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}