import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  HandCoins, 
  UserCircle, 
  LogOut, 
  AlertTriangle 
} from 'lucide-react';

export default function Sidebar({ isHovered }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. State untuk kontrol buka/tutup modal konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);

  // 2. Fungsi eksekusi logout
  const processLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Beranda', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Simpananku', icon: <Wallet size={20} />, path: '/simpananku' },
    { name: 'Pinjaman', icon: <HandCoins size={20} />, path: '/pinjaman' },
    { name: 'Profil', icon: <UserCircle size={20} />, path: '/profil' },
  ];

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 h-screen bg-[#000D21] text-white p-4 pt-6 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl z-40 ${
          isHovered ? 'w-64' : 'w-20'
        }`}
      >
        <div>
          <div className="flex flex-col mb-8 pl-2 overflow-hidden whitespace-nowrap">
            <h1 className={`font-bold transition-all duration-200 text-white ${
              isHovered ? 'text-lg text-left' : 'text-xl text-center'
            }`}>
              {isHovered ? 'KSP Sejahtera' : 'KSP'}
            </h1>
            <span className={`text-xs text-slate-400 transition-all duration-200 ${!isHovered && 'scale-0 hidden'}`}>
              Portal Anggota
            </span>
          </div>

          {/* Navigasi Menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative whitespace-nowrap text-sm
                    ${isActive 
                      ? 'bg-slate-800/80 text-[#FABD00] font-medium border-l-4 border-[#FABD00]' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                    }`}
                >
                  <div className={`shrink-0 ${!isHovered && 'mx-auto'}`}>{item.icon}</div>
                  <span className={`transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {item.name}
                  </span>
                  
                  {/* Tooltip pas sidebar ciut */}
                  {!isHovered && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-slate-950 text-white text-xs invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-md pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tombol Logout Bawah */}
        <div className="border-t border-slate-800 pt-4">
          <button 
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-950/20 rounded-xl transition-colors text-sm whitespace-nowrap cursor-pointer"
          >
            <div className={!isHovered ? 'mx-auto' : ''}><LogOut size={20} /></div>
            <span className={isHovered ? 'opacity-100' : 'opacity-0 hidden'}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MODAL CONFIRMATION */}
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
    </>
  );
}