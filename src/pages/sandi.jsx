import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Sandi() {
  const navigate = useNavigate();

  // State Form
  const [sandiLama, setSandiLama] = useState('');
  const [sandiBaru, setSandiBaru] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');

  // State Toggle Tampil/Sembunyikan Sandi
  const [showSandiLama, setShowSandiLama] = useState(false);
  const [showSandiBaru, setShowSandiBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi Sederhana
    if (sandiBaru.length < 8) {
      alert('Kata sandi baru minimal harus 8 karakter!');
      return;
    }

    if (sandiBaru !== konfirmasiSandi) {
      alert('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    // 1. Notifikasi Sukses
    alert('Kata sandi berhasil diperbarui! Demi keamanan, silakan login kembali dengan kata sandi baru Anda.');

    // 2. Hapus Session/Token Login
    localStorage.removeItem('token');
    sessionStorage.clear();

    // 3. Direct / Lempar ke Halaman Login
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      
      {/* Breadcrumb & Tombol Kembali */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-400">
          Profil &rsaquo; <span className="text-slate-600">Ubah Kata Sandi</span>
        </div>
        <Link
          to="/profil"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Profil
        </Link>
      </div>

      {/* CARD UTAMA FORM UBAH KATA SANDI */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21]">
        
        {/* Header Form */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Ubah Kata Sandi Akun</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola keamanan akun Anda dengan mengganti kata sandi secara berkala
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. KATA SANDI SAAT INI */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={showSandiLama ? 'text' : 'password'}
                required
                value={sandiLama}
                onChange={(e) => setSandiLama(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSandiLama(!showSandiLama)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showSandiLama ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 2. KATA SANDI BARU */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showSandiBaru ? 'text' : 'password'}
                required
                value={sandiBaru}
                onChange={(e) => setSandiBaru(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSandiBaru(!showSandiBaru)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showSandiBaru ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 3. KONFIRMASI KATA SANDI BARU */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showKonfirmasi ? 'text' : 'password'}
                required
                value={konfirmasiSandi}
                onChange={(e) => setKonfirmasiSandi(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showKonfirmasi ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Info Peringatan Logout */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3 text-amber-900 mt-6">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Setelah berhasil mengubah kata sandi, Anda akan <strong>otomatis keluar (logout)</strong> dan diminta untuk login kembali dengan kata sandi baru.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/profil"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-[#FABD00] hover:bg-[#FABE00] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>Simpan Kata Sandi</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}