import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  HeartHandshake,
  Send,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  X,
  Info,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah } from '../../utils/format';

export default function DetailAnggota() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [anggota, setAnggota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Form Tambah Simpanan Manual
  const [jenisSimpanan, setJenisSimpanan] = useState('WAJIB');
  const [nominalSetoran, setNominalSetoran] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const fetchAnggota = () => {
    setLoading(true);
    api.get(`/admin/anggota/${id}`)
      .then((res) => setAnggota(res.data))
      .catch(() => setError('Gagal memuat data anggota.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnggota(); }, [id]);

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!nominalSetoran) {
      alert('Masukkan nominal setoran terlebih dahulu!');
      return;
    }
    setShowModal(true);
  };

  const handleProsesSekarang = async () => {
    setSubmitting(true);
    try {
      await api.post(`/admin/anggota/${id}/simpanan`, {
        jenis: jenisSimpanan,
        jumlah: Number(nominalSetoran),
        keterangan,
      });
      setShowModal(false);
      setNominalSetoran('');
      setKeterangan('');
      fetchAnggota(); // refresh saldo
    } catch {
      alert('Gagal menyimpan transaksi. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!anggota) return;
    const statusBaru = anggota.status_keanggotaan === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
    setTogglingStatus(true);
    try {
      await api.patch(`/admin/anggota/${id}/status`, { status_keanggotaan: statusBaru });
      setAnggota({ ...anggota, status_keanggotaan: statusBaru });
    } catch {
      alert('Gagal mengubah status anggota.');
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error || !anggota) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error || 'Anggota tidak ditemukan.'}</div>;
  }

  const isAktif = anggota.status_keanggotaan === 'AKTIF';

  return (
    <div className="space-y-6 max-w-6xl relative">

      <div>
        <button
          onClick={() => navigate('/admin/anggota')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Daftar Anggota</span>
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{anggota.nama}</h1>
          <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border flex items-center gap-1 ${
            isAktif ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {isAktif ? 'Aktif' : 'Non-Aktif'}
          </span>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">NIP: {anggota.nip}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">SIMPANAN POKOK</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
              <Building2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">Saldo Saat Ini</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{formatRupiah(anggota.saldo.pokok)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">SIMPANAN WAJIB</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
              <CalendarDays size={16} />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">Saldo Saat Ini</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{formatRupiah(anggota.saldo.wajib)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">SIMPANAN SUKARELA</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
              <HeartHandshake size={16} />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium mb-0.5">Saldo Saat Ini</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{formatRupiah(anggota.saldo.sukarela)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center gap-2">
            <Send size={16} className="text-slate-800" />
            <h2 className="text-sm font-bold text-slate-800">Tambah Simpanan Manual</h2>
          </div>

          <form onSubmit={handleOpenModal} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Jenis Simpanan</label>
                <select
                  value={jenisSimpanan}
                  onChange={(e) => setJenisSimpanan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium"
                >
                  <option value="POKOK">Simpanan Pokok</option>
                  <option value="WAJIB">Simpanan Wajib</option>
                  <option value="SUKARELA">Simpanan Sukarela</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nominal Setoran (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 100000"
                  value={nominalSetoran}
                  onChange={(e) => setNominalSetoran(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Keterangan / Catatan</label>
              <textarea
                rows="4"
                placeholder="Tuliskan alasan penambahan atau referensi setoran..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Send size={14} />
                <span>Proses Tambah Saldo</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck size={18} className="text-slate-800" />
            <h2 className="text-sm font-bold text-slate-800">Manajemen Keaktifan</h2>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">STATUS SAAT INI</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {isAktif ? 'Anggota Aktif' : 'Anggota Non-Aktif'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={togglingStatus}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer relative disabled:opacity-50 ${
                  isAktif ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  isAktif ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
              <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-bold">
                Peringatan Penting: <span className="font-medium">Anggota yang dinonaktifkan tidak dapat mengajukan pinjaman baru atau melakukan penarikan saldo simpanan hingga statusnya diaktifkan kembali oleh bendahara.</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-t-4 border-amber-400 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            <div className="p-6 pb-4 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Wallet size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Konfirmasi Tambah Saldo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tinjau kembali detail setoran sebelum diproses.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-2 space-y-4">
              <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 text-xs">
                  <span className="text-slate-500 font-medium">Nama Anggota</span>
                  <span className="font-extrabold text-slate-900">{anggota.nama}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 text-xs">
                  <span className="text-slate-500 font-medium">Jenis Simpanan</span>
                  <span className="bg-amber-100/80 text-amber-900 font-bold px-3 py-1 rounded-full text-[11px]">
                    {jenisSimpanan}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 text-xs">
                  <span className="text-slate-500 font-medium">Nominal Setoran</span>
                  <span className="text-xl font-black text-slate-900">{formatRupiah(nominalSetoran)}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="text-slate-500 font-medium block">Keterangan</span>
                  <span className="font-medium text-slate-800 block">{keterangan || '-'}</span>
                </div>
              </div>

              <div className="bg-blue-50/70 border-l-4 border-slate-900 rounded-r-2xl p-4 flex items-start gap-3">
                <Info size={18} className="text-slate-900 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Apakah Anda yakin data di atas sudah benar? Transaksi ini akan tercatat secara permanen di riwayat simpanan anggota.
                </p>
              </div>
            </div>

            <div className="p-6 pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleProsesSekarang}
                disabled={submitting}
                className="w-full sm:flex-1 bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                <span>{submitting ? 'Memproses...' : 'Ya, Proses Sekarang'}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3.5 px-4 rounded-2xl border-2 border-slate-900 transition-all cursor-pointer text-center"
              >
                Periksa Kembali
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
