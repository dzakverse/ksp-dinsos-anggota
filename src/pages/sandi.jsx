import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, ShieldAlert, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Sandi() {
  const navigate = useNavigate();

  const [sandiLama, setSandiLama] = useState('');
  const [sandiBaru, setSandiBaru] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');

  const [showSandiLama, setShowSandiLama] = useState(false);
  const [showSandiBaru, setShowSandiBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (sandiBaru.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter!');
      return;
    }
    if (sandiBaru !== konfirmasiSandi) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/change-password', {
        password_lama: sandiLama,
        password_baru: sandiBaru,
      });

      alert('Kata sandi berhasil diperbarui! Demi keamanan, silakan login kembali dengan kata sandi baru Anda.');
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengubah kata sandi. Periksa kata sandi lama Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">

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

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21]">

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

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

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

          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3 text-amber-900 mt-6">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Setelah berhasil mengubah kata sandi, Anda akan <strong>otomatis keluar (logout)</strong> dan diminta untuk login kembali dengan kata sandi baru.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/profil"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#FABD00] hover:bg-[#FABE00] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <Save size={15} />
              <span>{submitting ? 'Menyimpan...' : 'Simpan Kata Sandi'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}