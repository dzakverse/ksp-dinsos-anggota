import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  // Memetakan Judul & Subtitle berdasarkan path URL
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Beranda', subtitle: 'Selamat datang kembali, Budi Santoso!' };
      case '/simpananku':
        return { title: 'Simpananku', subtitle: 'Kelola simpanan dan riwayat transaksi Anda' };
      case '/pinjaman':
        return { title: 'Pinjaman', subtitle: 'Pengajuan dan status pinjaman Anda' };
      case '/profil':
        return { title: 'Profil Saya', subtitle: 'Kelola informasi akun Anda' };
      default:
        return { title: 'KSP Sejahtera', subtitle: 'Portal Anggota' };
    }
  };

  const { title, subtitle } = getHeaderTitle();

  return (
    <header className="sticky top-0 bg-white h-20 border-b border-slate-100 flex items-center justify-between px-8 z-10 w-full">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full relative transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
            className="w-9 h-9 rounded-full object-cover border" 
            alt="Avatar"
          />
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-semibold text-slate-800">Budi Santoso</h4>
            <span className="text-[10px] text-slate-400 tracking-wider block">ID: ANG-2024-001</span>
          </div>
        </div>
      </div>
    </header>
  );
}