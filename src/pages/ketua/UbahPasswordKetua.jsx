import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function UbahPassword() {
  const navigate = useNavigate();

  // State Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show/Hide Password States
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    setToastMessage(true);
    setTimeout(() => {
      setToastMessage(false);
      navigate('/ketua/profile'); // Kembali ke halaman profil
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-16 font-sans">
      
      {/* TOAST SUCCESS */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-emerald-400" />
          <div className="text-xs font-bold">Password berhasil diperbarui! Mengalihkan ke profil...</div>
        </div>
      )}

      {/* BUTTON KEMBALI */}
      <button 
        type="button"
        onClick={() => navigate('/ketua/profile')}
        className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Profil</span>
      </button>

      {/* CARD FORM UBAH PASSWORD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Ubah Kata Sandi</h1>
            <p className="text-xs text-slate-500">Amankan akun Anda dengan menggunakan password kombinasi yang kuat.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Password Lama */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">Password Saat Ini</label>
            <div className="relative">
              <input 
                type={showOld ? "text" : "password"}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="w-full p-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white"
              />
              <button 
                type="button" 
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Password Baru */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">Password Baru</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full p-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white"
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">Konfirmasi Password Baru</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full p-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Kriteria Keamanan Password */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-amber-500" />
              <span>Syarat Password yang Aman:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
              <li>Minimal 8 karakter</li>
              <li>Mengandung kombinasi huruf kapital, angka, dan simbol</li>
              <li>Tidak sama dengan password lama</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => navigate('/ketua/profile')}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-[#081028] hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Simpan Password Baru
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}