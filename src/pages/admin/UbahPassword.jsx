import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Eye, EyeOff, Info, ArrowLeft, AlertCircle } from 'lucide-react';

export default function UbahPassword() {
  const navigate = useNavigate();

  // State Form
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  // State Visibility Password (Lihat / Sembunyi)
  const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  // State Error & Interaksi
  const [touchedBaru, setTouchedBaru] = useState(false);
  const [touchedKonfirmasi, setTouchedKonfirmasi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Logika Validasi Password Baru (Minimal 8 karakter, kombinasi huruf & angka)
  const isPasswordBaruValid = (pwd) => {
    const hasMinLength = pwd.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    return hasMinLength && hasLetter && hasNumber;
  };

  // Status error per field
  const showPasswordBaruError = touchedBaru && passwordBaru.length > 0 && !isPasswordBaruValid(passwordBaru);
  const showKonfirmasiError = touchedKonfirmasi && konfirmasiPassword.length > 0 && passwordBaru !== konfirmasiPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi akhir sebelum submit
    if (!isPasswordBaruValid(passwordBaru)) {
      setErrorMessage('Password baru tidak memenuhi kriteria keamanan.');
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    // 1. Alert Sukses
    alert('Password berhasil diperbarui! Sesi Anda telah berakhir, silakan login kembali.');

    // 2. Hapus Session / LocalStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    // 3. Redireksi ke halaman Login
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Tombol Kembali & Header Page */}
      <div>
        <button 
          onClick={() => navigate('/admin/profile')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Profil</span>
        </button>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Keamanan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
        </p>
      </div>

      {/* Card Form Ubah Password */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Header Card */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100/70 text-amber-800 rounded-full flex items-center justify-center shrink-0">
            <RotateCcw size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Ubah Password Keamanan
          </h2>
        </div>

        {/* Banner Alert Global Error */}
        {errorMessage && (
          <div className="mx-6 mt-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            {/* Field 1: Password Saat Ini */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showLama ? 'text' : 'password'}
                  placeholder="Masukkan password lama"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-400 transition-all pr-10 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLama(!showLama)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showLama ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Field 2: Password Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showBaru ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
                  value={passwordBaru}
                  onChange={(e) => {
                    setPasswordBaru(e.target.value);
                    if (!touchedBaru) setTouchedBaru(true);
                  }}
                  onBlur={() => setTouchedBaru(true)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all pr-10 font-medium ${
                    showPasswordBaruError 
                      ? 'border-rose-400 focus:border-rose-500' 
                      : 'border-slate-200 focus:border-amber-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowBaru(!showBaru)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showBaru ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Info Box Default / Peringatan Error Interaktif */}
              {showPasswordBaruError ? (
                <div className="mt-2 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 text-rose-700">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-semibold">
                    Password minimal harus terdiri dari 8 karakter, kombinasi huruf dan angka.
                  </p>
                </div>
              ) : (
                <div className="mt-2 bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-blue-900">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    Password minimal harus terdiri dari 8 karakter, kombinasi huruf dan angka.
                  </p>
                </div>
              )}
            </div>

            {/* Field 3: Konfirmasi Password Baru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showKonfirmasi ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  value={konfirmasiPassword}
                  onChange={(e) => {
                    setKonfirmasiPassword(e.target.value);
                    if (!touchedKonfirmasi) setTouchedKonfirmasi(true);
                  }}
                  onBlur={() => setTouchedKonfirmasi(true)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all pr-10 font-medium ${
                    showKonfirmasiError 
                      ? 'border-rose-400 focus:border-rose-500' 
                      : 'border-slate-200 focus:border-amber-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showKonfirmasi ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error Konfirmasi Tidak Cocok */}
              {showKonfirmasiError && (
                <div className="mt-2 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 text-rose-700">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-semibold">
                    Konfirmasi password tidak cocok dengan password baru.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Footer Card Action */}
          <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={showPasswordBaruError || showKonfirmasiError}
              className={`font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                showPasswordBaruError || showKonfirmasiError
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0A1128] hover:bg-slate-800 text-white'
              }`}
            >
              Perbarui Password
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}