import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Save, ShieldAlert, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { formatTanggal } from '../utils/format';
import Avatar from '../components/Avatar';

export default function EditProfil() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [alamat, setAlamat] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoError, setFotoError] = useState('');
  const [hapusingFoto, setHapusingFoto] = useState(false);

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        setProfile(res.data);
        setAlamat(res.data.alamat || '');
        setWhatsapp(res.data.whatsapp || '');
        setEmail(res.data.email || '');
      })
      .catch(() => setErrorMessage('Gagal memuat data profil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSimpan = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
      await api.put('/profile', { alamat, whatsapp, email });
      alert('Perubahan profil berhasil disimpan!');
      navigate('/profil');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Upload foto langsung begitu file dipilih (terpisah dari form "Simpan
  // Perubahan" di atas, karena foto disimpan lewat endpoint khusus multipart
  // /profile/foto, bukan lewat body JSON PUT /profile).
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoError('');

    // Validasi ringan di sisi client biar user cepat dapat feedback -
    // validasi yang menentukan tetap di backend (lihat ProfileController::updateFoto).
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

  // Hapus foto profil -> balik ke avatar inisial (lihat components/Avatar.jsx).
  // Dipisah dari handleFotoChange karena ini aksi destruktif tersendiri, bukan
  // bagian dari alur ganti/upload foto.
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

  const ttl = profile.tempat_lahir && profile.tanggal_lahir
    ? `${profile.tempat_lahir}, ${formatTanggal(profile.tanggal_lahir)}`
    : '-';
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">

      <div className="text-xs font-semibold text-slate-400">
        Profil &rsaquo; <span className="text-slate-600">Edit Profil Anggota</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">

          {/* CARD 1: INFORMASI UTAMA (READ ONLY - hanya bisa diubah oleh Bendahara/Ketua/Super Admin) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Informasi Utama</h3>
                <p className="text-xs text-slate-400">Hubungi Admin untuk perubahan data utama</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">NIK (KTP)</label>
                <input type="text" disabled value={profile.nik || '-'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">NIP</label>
                <input type="text" disabled value={profile.nip || '-'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tempat / Tanggal Lahir</label>
                <input type="text" disabled value={ttl} className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Kelamin</label>
                <input type="text" disabled value={profile.jenis_kelamin || '-'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Bergabung</label>
                <input type="text" disabled value={formatTanggal(profile.tanggal_bergabung)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* CARD 2: INFORMASI KONTAK & DOMISILI (EDITABLE) */}
          <form onSubmit={handleSimpan} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21]">
            <h3 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100 mb-6">
              Informasi Kontak & Domisili
            </h3>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Domisili</label>
                <textarea
                  rows={3}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Aktif</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-8 mt-6 flex items-center justify-start gap-3">
              <Link to="/profil" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors">
                Batal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <Save size={15} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </form>

        </div>

        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21] text-center flex flex-col items-center">
            <h4 className="text-base font-bold text-slate-800 mb-6">Foto Profil Anggota</h4>

            <Avatar
              nama={profile.nama}
              fotoUrl={profile.foto_url}
              className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-inner mb-6"
              textClassName="text-3xl"
            />

            <label
              className={`w-full py-3 font-bold rounded-xl text-xs block text-center transition-colors ${
                uploadingFoto
                  ? 'bg-slate-200 text-slate-400 cursor-wait'
                  : 'bg-[#0A1128] hover:bg-slate-800 text-white cursor-pointer'
              }`}
            >
              {uploadingFoto ? 'Mengupload...' : 'Pilih Foto Baru'}
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleFotoChange}
                disabled={uploadingFoto}
              />
            </label>

            {profile.foto_url && (
              <button
                type="button"
                onClick={handleHapusFoto}
                disabled={hapusingFoto || uploadingFoto}
                className="w-full py-3 mt-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Trash2 size={14} />
                <span>{hapusingFoto ? 'Menghapus...' : 'Hapus Foto'}</span>
              </button>
            )}

            {fotoError && (
              <p className="text-[11px] text-rose-600 font-semibold mt-3">{fotoError}</p>
            )}

            <p className="text-[11px] text-slate-400 font-medium mt-3">
              Format JPG, PNG. Ukuran maks. 2MB.
            </p>
          </div>

          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3 text-amber-900">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Data yang terkunci hanya dapat diubah melalui Admin KSP Sejahtera. Hubungi kantor untuk informasi lebih lanjut.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}