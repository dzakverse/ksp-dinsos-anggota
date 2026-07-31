import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Pencil, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const PRIVILEGES = [
  'Persetujuan Pinjaman Final',
  'Manajemen Kebijakan',
  'Emergency Bypass',
  'Kelola Pengurus & Anggota',
];

export default function ProfileKetua() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile')
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl pb-16 font-sans">

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Informasi Profil
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi pribadi dan pengaturan keamanan akun Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <div className="md:col-span-4 flex flex-col items-center text-center pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-[#081028] flex items-center justify-center text-amber-400 font-black text-4xl border-4 border-amber-400/60 shadow-inner">
                {profile?.nama?.charAt(0) || 'K'}
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-900 tracking-tight">{profile?.nama}</h2>
            <div className="mt-1.5 inline-block bg-amber-50 text-amber-700 font-bold text-[11px] px-3 py-1 rounded-full border border-amber-200/60">
              Chairman / Ketua
            </div>

            <div className="w-full border-t border-slate-100 my-6"></div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                NOMOR INDUK PEGAWAI
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-mono tracking-wider">
                {profile?.nip || '-'}
              </span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8 pl-0 md:pl-4">

            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <ShieldCheck size={20} className="text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">Pengaturan Keamanan</h3>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1 max-w-md">
                  <h4 className="font-bold text-xs text-slate-800">Kata Sandi Akun</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Disarankan untuk mengubah kata sandi secara berkala demi keamanan data keuangan.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/ketua/profile/ubah-password')}
                  className="bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm">
                  <Lock size={14} />
                  <span>Ubah Password</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Lock size={18} className="text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">Hak Akses Eksekutif</h3>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  PRIVILESE SAAT INI
                </span>

                <div className="space-y-2.5">
                  {PRIVILEGES.map((item, index) => (
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

      <div className="border-t border-slate-200/60 pt-6 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          © 2026 Dinas Sosial Financial Management System. Seluruh akses sistem dicatat untuk audit internal.
        </p>
      </div>

    </div>
  );
}
