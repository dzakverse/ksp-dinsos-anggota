import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Pencil, CheckCircle2 } from 'lucide-react';

export default function ProfileAdmin() {
    const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Budi Santoso';
  const userRole = localStorage.getItem('userRole') || 'Bendahara';
  const nipNumber = '19850101XXXXXXXXX';

  const privileges = [
    'Persetujuan Pinjaman (Approval)',
    'Manajemen Saldo Kas',
    'Ekspor Laporan Keuangan Bulanan',
    'Input Transaksi Manual',
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* ================= HEADER PAGE ================= */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Informasi Profil
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi pribadi dan pengaturan keamanan akun Anda.
        </p>
      </div>

      {/* ================= KONTEN UTAMA PROFIL ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* SISI KIRI: FOTO PROFIL & IDENTITAS (4 Kolom) */}
          <div className="md:col-span-4 flex flex-col items-center text-center pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
            
            {/* Wrapper Foto Profil + Edit Button */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" 
                  alt="Foto Profil" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className="absolute bottom-1 right-1 w-8 h-8 bg-[#0A1128] hover:bg-slate-800 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all cursor-pointer"
                title="Ubah Foto Profil"
              >
                <Pencil size={13} />
              </button>
            </div>

            {/* Nama & Role Badge */}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {userName}
            </h2>
            <div className="mt-1.5 inline-block bg-amber-50 text-amber-700 font-bold text-[11px] px-3 py-1 rounded-full border border-amber-200/60">
              {userRole}
            </div>

            {/* Separator Tipis */}
            <div className="w-full border-t border-slate-100 my-6"></div>

            {/* NIP */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                NOMOR INDUK PEGAWAI
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-mono tracking-wider">
                {nipNumber}
              </span>
            </div>

          </div>

          {/* SISI KANAN: PENGATURAN KEAMANAN & AKSES (8 Kolom) */}
          <div className="md:col-span-8 space-y-8 pl-0 md:pl-4">
            
            {/* SECTION 1: PENGATURAN KEAMANAN */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <ShieldCheck size={20} className="text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">
                  Pengaturan Keamanan
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1 max-w-md">
                  <h4 className="font-bold text-xs text-slate-800">
                    Kata Sandi Akun
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Terakhir diubah 3 bulan yang lalu. Disarankan untuk mengubah kata sandi secara berkala demi keamanan data keuangan.
                  </p>
                </div>

                <button 
                    onClick={() => navigate('/admin/profile/ubah-password')}
                    className="bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm">
                  <Lock size={14} />
                  <span>Ubah Password</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: ROLE & AKSES SISTEM */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Lock size={18} className="text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">
                  Role & Akses Sistem
                </h3>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  PRIVILESE SAAT INI
                </span>

                <div className="space-y-2.5">
                  {privileges.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ================= FOOTER COPYRIGHT ================= */}
      <div className="border-t border-slate-200/60 pt-6 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          © 2024 Dinas Sosial Financial Management System. Seluruh akses sistem dicatat untuk audit internal.
        </p>
      </div>

    </div>
  );
}