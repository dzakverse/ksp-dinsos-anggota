import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../services/api';

const FOTO_DEFAULT = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60';

export default function Header() {
  const location = useLocation();
  const [profil, setProfil] = useState({
    nama: localStorage.getItem('userName') || 'Anggota',
    id_anggota: '',
    foto_url: '',
  });

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        setProfil({
          nama: res.data.nama || localStorage.getItem('userName') || 'Anggota',
          id_anggota: res.data.id_anggota || '',
          foto_url: res.data.foto_url || '',
        });
      })
      .catch(() => {
        // Biarkan fallback dari localStorage jika request gagal
      });
  }, []);

  // Memetakan Judul & Subtitle berdasarkan path URL
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Beranda', subtitle: `Selamat datang kembali, ${profil.nama}!` };
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
            src={profil.foto_url || FOTO_DEFAULT} 
            className="w-9 h-9 rounded-full object-cover border" 
            alt="Avatar"
          />
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-semibold text-slate-800">{profil.nama}</h4>
            <span className="text-[10px] text-slate-400 tracking-wider block">
              {profil.id_anggota ? `ID: ${profil.id_anggota}` : ''}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}