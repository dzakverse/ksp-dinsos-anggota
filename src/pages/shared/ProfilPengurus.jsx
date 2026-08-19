import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Pencil, CheckCircle2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import Avatar from '../../components/Avatar';

const PRIVILEGES = {
  BENDAHARA: [
    'Verifikasi Pengajuan Pinjaman',
    'Manajemen Saldo & Simpanan Anggota',
    'Input Transaksi Manual',
    'Lihat Data Seluruh Anggota',
  ],
  KETUA: [
    'Persetujuan Pinjaman Final',
    'Manajemen Kebijakan',
    'Emergency Bypass',
    'Kelola Pengurus & Anggota',
  ],
};

export default function ProfilPengurus({ variant }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoError, setFotoError] = useState('');
  const [hapusingFoto, setHapusingFoto] = useState(false);

  const isKetua = variant === 'KETUA';
  const basePath = isKetua ? '/ketua' : '/admin';
  const privileges = PRIVILEGES[isKetua ? 'KETUA' : 'BENDAHARA'];
  const roleLabel = isKetua ? 'Chairman / Ketua' : 'Bendahara';
  const hakAksesLabel = isKetua ? 'Hak Akses Eksekutif' : 'Role & Akses Sistem';

  useEffect(() => {
    api.get('/profile')
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handlePilihFoto = () => fileInputRef.current?.click();

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoError('');

    const tipeValid = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    if (!tipeValid) {
      setFotoError('Format file harus JPG atau PNG.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFotoError('Ukuran file maksimal 2MB.');
      e.target.value = '';
      return;
    }

    setUploadingFoto(true);
    const formData = new FormData();
    formData.append('foto', file);

    try {
      const { data } = await api.post('/profile/foto', formData);
      setProfile((prev) => ({ ...prev, foto_url: data.foto_url }));
    } catch (err) {
      setFotoError(err.response?.data?.message || 'Gagal upload foto. Coba lagi.');
    } finally {
      setUploadingFoto(false);
      e.target.value = '';
    }
  };

  const handleHapusFoto = async () => {
    if (!window.confirm('Hapus foto profil? Setelah dihapus, avatar Anda akan menampilkan inisial nama.')) {
      return;
    }
    setFotoError('');
    setHapusingFoto(true);
    try {
      await api.delete('/profile/foto');
      setProfile((prev) => ({ ...prev, foto_url: null }));
    } catch (err) {
      setFotoError(err.response?.data?.message || 'Gagal menghapus foto. Coba lagi.');
    } finally {
      setHapusingFoto(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Informasi Profil</h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi pribadi dan pengaturan keamanan akun Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <div className="md:col-span-4 flex flex-col items-center text-center pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
            <div className="relative mb-4">
              <Avatar
                nama={profile?.nama}
                fotoUrl={profile?.foto_url}
                className={`w-28 h-28 rounded-full border-4 shadow-inner ${
                  isKetua ? 'border-amber-400/60' : 'border-slate-100'
                }`}
                textClassName="text-2xl"
                fallbackClassName={isKetua ? 'bg-[#081028] text-amber-400' : undefined}
              />
              <button
                type="button"
                onClick={handlePilihFoto}
                disabled={uploadingFoto}
                className="absolute bottom-1 right-1 w-8 h-8 bg-[#0A1128] hover:bg-slate-800 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all cursor-pointer disabled:opacity-60"
                title="Ubah Foto Profil"
              >
                <Pencil size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFotoChange}
                disabled={uploadingFoto}
              />
            </div>

            {profile?.foto_url && (
              <button
                type="button"
                onClick={handleHapusFoto}
                disabled={hapusingFoto || uploadingFoto}
                className="mb-3 text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Trash2 size={12} />
                {hapusingFoto ? 'Menghapus...' : 'Hapus Foto'}
              </button>
            )}

            {fotoError && (
              <p className="text-[11px] text-rose-600 font-semibold mb-2 max-w-[200px]">{fotoError}</p>
            )}

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profile?.nama}</h2>
            <div className="mt-1.5 inline-block bg-amber-50 text-amber-700 font-bold text-[11px] px-3 py-1 rounded-full border border-amber-200/60">
              {roleLabel}
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
                  onClick={() => navigate(`${basePath}/profile/ubah-password`)}
                  className="bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm">
                  <Lock size={14} />
                  <span>Ubah Password</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Lock size={18} className="text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">{hakAksesLabel}</h3>
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

      <div className="border-t border-slate-200/60 pt-6 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          © 2026 Dinas Sosial Financial Management System. Seluruh akses sistem dicatat untuk audit internal.
        </p>
      </div>

    </div>
  );
}