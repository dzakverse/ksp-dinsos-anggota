import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api, { getUserName } from '../services/api';
import Avatar from './Avatar';

export default function Header() {
  const location = useLocation();
  const [profil, setProfil] = useState({
    nama: getUserName() || 'Anggota',
    id_anggota: '',
    foto_url: '',
  });

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        setProfil({
          nama: res.data.nama || getUserName() || 'Anggota',
          id_anggota: res.data.id_anggota || '',
          foto_url: res.data.foto_url || '',
        });
      })
      .catch(() => {
      });
  }, []);

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Beranda', subtitle: `Selamat datang kembali, ${profil.nama}!` };
      case '/simpananku':
        return { title: 'Simpananku', subtitle: 'Kelola simpanan dan riwayat transaksi Anda' };
      case '/pinjaman':
        return { title: 'Pinjaman', subtitle: 'Pengajuan dan status pinjaman Anda' };
      case '/ajukan':
        return { title: 'Ajukan Pinjaman', subtitle: 'Isi formulir pengajuan pinjaman baru' };
      case '/profil':
        return { title: 'Profil Saya', subtitle: 'Kelola informasi akun Anda' };
      case '/edit':
        return { title: 'Edit Profil', subtitle: 'Perbarui informasi kontak Anda' };
      case '/sandi':
        return { title: 'Ubah Kata Sandi', subtitle: 'Kelola keamanan akun Anda' };
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
        <button
          type="button"
          title="Fitur notifikasi akan segera hadir"
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full relative transition-colors cursor-not-allowed"
        >
          <Bell size={18} className="text-slate-600" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar
            nama={profil.nama}
            fotoUrl={profil.foto_url}
            className="w-9 h-9 rounded-full border"
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