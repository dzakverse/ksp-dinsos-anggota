import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import { Menu } from 'lucide-react';
import api, { getUserName, getUserRole } from '../services/api';

export default function AdminLayout() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userRole = getUserRole();

  const [profil, setProfil] = useState({
    nama: getUserName(),
    foto_url: '',
  });

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        setProfil({
          nama: res.data.nama || getUserName(),
          foto_url: res.data.foto_url || '',
        });
      })
      .catch(() => {
      });
  }, []);

  const userName = profil.nama;

  return (
    <div className="flex min-h-screen bg-[#FBFBFD] font-sans">
      
      <SidebarAdmin 
        onHoverChange={(hovered) => setIsSidebarHovered(hovered)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div 
        className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${
        ''
        } ${isSidebarHovered ? 'md:ml-64' : 'md:ml-20'} ml-0`}
      >
        
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-sm font-bold text-slate-700 md:hidden">Portal Bendahara</h1>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">{userName}</div>
              <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                {userRole}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0 overflow-hidden">
              {profil.foto_url ? (
                <img src={profil.foto_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0)
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}