import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  User, 
  LogOut, 
  HelpCircle,
  Building2,
  X 
} from 'lucide-react';

export default function SidebarAdmin({ onHoverChange, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    // Hanya aktifkan hover di layar desktop (width >= 768px)
    if (window.innerWidth >= 768) {
      setIsHovered(true);
      if (onHoverChange) onHoverChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsHovered(false);
      if (onHoverChange) onHoverChange(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Beranda', icon: LayoutDashboard },
    { path: '/admin/verifikasi', label: 'Verifikasi Pinjaman', icon: FileCheck },
    { path: '/admin/anggota', label: 'Data & Anggota', icon: Users },
    { path: '/admin/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Overlay Gelap untuk Mobile saat Sidebar Terbuka */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bg-[#0A1128] text-white flex flex-col justify-between p-4 fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shadow-xl
          ${/* Aturan Mobile (Slide In / Out) */ ''}
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${/* Aturan Desktop (Mekar dari w-20 ke w-64 saat Hover) */ ''}
          ${isHovered ? 'md:w-64' : 'md:w-20'}
        `}
      >
        <div>
          {/* Header Logo & Tombol Close Mobile */}
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-[#FABD00] rounded-xl flex items-center justify-center font-bold text-slate-900 shadow-md shrink-0">
                <Building2 size={22} />
              </div>
              
              <div className={`overflow-hidden whitespace-nowrap transition-all ${
                isHovered || isMobileOpen ? 'block' : 'hidden md:hidden'
              }`}>
                <h2 className="font-bold text-sm tracking-tight leading-none text-white">
                  KSP Sejahtera
                </h2>
                <span className="text-[10px] text-amber-400 font-medium">Portal Admin</span>
              </div>
            </div>

            {/* Tombol Tutup Khusus Layar HP */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)} // Tutup sidebar pas menu diklik di HP
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all group relative whitespace-nowrap ${
                      !isHovered && !isMobileOpen ? 'md:justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-slate-800/80 text-[#FABD00] font-bold border-l-4 border-[#FABD00]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                    }`
                  }
                >
                  <Icon size={20} className="shrink-0" />
                  
                  <span className={`${isHovered || isMobileOpen ? 'inline' : 'hidden md:hidden'} truncate`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="space-y-2 pt-4 border-t border-slate-800/80">
          <button 
            className={`w-full py-2.5 bg-[#FABD00] hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              !isHovered && !isMobileOpen ? 'px-0' : 'px-4'
            }`}
          >
            <HelpCircle size={18} className="shrink-0" />
            <span className={isHovered || isMobileOpen ? 'inline' : 'hidden md:hidden'}>
              Butuh Bantuan?
            </span>
          </button>

          <button
            onClick={handleLogout}
            className={`w-full py-2 text-rose-400 hover:bg-rose-950/20 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              !isHovered && !isMobileOpen ? 'px-0' : 'px-4'
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={isHovered || isMobileOpen ? 'inline' : 'hidden md:hidden'}>
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}