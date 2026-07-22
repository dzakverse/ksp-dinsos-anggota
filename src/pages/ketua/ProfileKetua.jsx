import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  Pencil,
  Lock
} from 'lucide-react';

export default function ProfileKetua() {
  const navigate = useNavigate();

  // Data Profil Ketua
  const profileData = {
    nama: 'Budi Santoso', // Sesuaikan nama
    role: 'Chairman / Ketua',
    nip: '19850101XXXXXXXX',
    privileges: [
      'Persetujuan Pinjaman Final',
      'Manajemen Kebijakan',
      'Hak Veto',
      'Akses Audit'
    ]
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16 font-sans">
      
      {/* HEADER PAGE */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Informasi Profil
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi pribadi dan pengaturan keamanan akun Anda.
        </p>
      </div>

      {/* MAIN GRID CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: AVATAR & IDENTITAS ================= */}
        <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xs space-y-6">
          
          {/* Avatar Box with Edit Badge */}
          <div className="relative w-32 h-32 mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" 
              alt="Foto Profil" 
              className="w-full h-full object-cover rounded-full ring-4 ring-slate-100 shadow-md"
            />
            <button 
              type="button"
              title="Ubah Foto Profil"
              className="absolute bottom-1 right-1 w-8 h-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border-2 border-white"
            >
              <Pencil size={14} />
            </button>
          </div>

          {/* Nama & Role Badge */}
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">{profileData.nama}</h2>
            <span className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              {profileData.role}
            </span>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              NOMOR INDUK PEGAWAI
            </div>
            <div className="text-sm font-black text-slate-800 tracking-wider">
              {profileData.nip}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: SECURITY & PRIVILEGES ================= */}
        <div className="md:col-span-7 space-y-8">
          
          {/* BAGIAN 1: PENGATURAN KEAMANAN */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm pb-3 border-b border-slate-100">
              <Lock size={18} className="text-slate-800" />
              <span>Pengaturan Keamanan</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-900">Kata Sandi Akun</h3>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Terakhir diubah 3 bulan yang lalu. Disarankan untuk mengubah kata sandi secara berkala demi keamanan data keuangan.
                </p>
              </div>

              {/* NAVIGASI KE HALAMAN TERPISAH UBAH PASSWORD */}
              <button
                type="button"
                onClick={() => navigate('/ketua/profile/ubah-password')}
                className="bg-[#081028] hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                <KeyRound size={15} />
                <span>Ubah Password</span>
              </button>
            </div>
          </div>

          {/* BAGIAN 2: ROLE & AKSES SISTEM */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm pb-3 border-b border-slate-100">
              <ShieldCheck size={18} className="text-slate-800" />
              <span>Role & Akses Sistem</span>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                PRIVILESE SAAT INI
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {profileData.privileges.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 fill-emerald-50" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER NOTE */}
      <div className="pt-8 border-t border-slate-200/60 text-center text-[11px] font-medium text-slate-400">
        © 2026 Dinas Sosial Financial Management System. Seluruh akses sistem dicatat untuk audit internal.
      </div>

    </div>
  );
}