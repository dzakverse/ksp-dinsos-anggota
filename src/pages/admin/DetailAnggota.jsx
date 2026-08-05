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
  MinusCircle,
  PlusCircle,
  FileText,
  Clock,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

const STATUS_PINJAMAN = {
  MENUNGGU: { label: 'Menunggu Verifikasi', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  DISETUJUI_BENDAHARA: { label: 'Menunggu Persetujuan Ketua', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  DISETUJUI: { label: 'Aktif / Berjalan', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  DITOLAK: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
};

export default function DetailAnggota() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [anggota, setAnggota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form Setor/Tarik Simpanan
  const [tipeTransaksi, setTipeTransaksi] = useState('SETOR'); // 'SETOR' | 'TARIK'
  const [jenisSimpanan, setJenisSimpanan] = useState('WAJIB');
  const [nominalSetoran, setNominalSetoran] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Modal Detail Cicilan Pinjaman
  const [selectedPinjaman, setSelectedPinjaman] = useState(null);
  const [payingCicilan, setPayingCicilan] = useState(null);
  const [catatanBayar, setCatatanBayar] = useState('');
  const [payingSubmitting, setPayingSubmitting] = useState(false);

  const fetchAnggota = () => {
    setLoading(true);
    api.get(`/admin/anggota/${id}`)
      .then((res) => setAnggota(res.data))
      .catch(() => setError('Gagal memuat data anggota.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnggota(); }, [id]);

  const saldoJenisSaatIni = anggota ? (anggota.saldo[jenisSimpanan.toLowerCase()] ?? 0) : 0;

  const handleOpenModal = (e) => {
    e.preventDefault();
    setFormError('');
    if (!nominalSetoran || Number(nominalSetoran) <= 0) {
      setFormError('Masukkan nominal yang valid terlebih dahulu!');
      return;
    }
    if (tipeTransaksi === 'TARIK' && Number(nominalSetoran) > saldoJenisSaatIni) {
      setFormError(`Saldo ${jenisSimpanan} anggota ini tidak mencukupi (tersedia ${formatRupiah(saldoJenisSaatIni)}).`);
      return;
    }
    setShowModal(true);
  };

  const handleProsesSekarang = async () => {
    setSubmitting(true);
    try {
      const endpoint = tipeTransaksi === 'SETOR'
        ? `/admin/anggota/${id}/simpanan`
        : `/admin/anggota/${id}/simpanan/tarik`;

      await api.post(endpoint, {
        jenis: jenisSimpanan,
        jumlah: Number(nominalSetoran),
        keterangan,
      });
      setShowModal(false);
      setNominalSetoran('');
      setKeterangan('');
      fetchAnggota();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi. Coba lagi.');
      setShowModal(false);
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

  const handleBayarCicilan = async () => {
    if (!catatanBayar.trim()) {
      alert('Catatan wajib diisi sebelum konfirmasi pembayaran.');
      return;
    }
    setPayingSubmitting(true);
    try {
      const { data: updatedCicilan } = await api.post(`/admin/cicilan/${payingCicilan.id}/bayar`, {
        catatan: catatanBayar,
      });

      // Update state lokal biar UI langsung refresh tanpa perlu reload manual
      setSelectedPinjaman((prev) => ({
        ...prev,
        cicilan: prev.cicilan.map((c) => (c.id === updatedCicilan.id ? updatedCicilan : c)),
      }));
      setAnggota((prev) => ({
        ...prev,
        daftar_pinjaman: prev.daftar_pinjaman.map((p) =>
          p.id === selectedPinjaman.id
            ? { ...p, cicilan: p.cicilan.map((c) => (c.id === updatedCicilan.id ? updatedCicilan : c)) }
            : p
        ),
      }));

      setPayingCicilan(null);
      setCatatanBayar('');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mencatat pembayaran.');
    } finally {
      setPayingSubmitting(false);
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
    <div className="space-y-6 max-w-6xl relative pb-12">

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
          <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Send size={16} className="text-slate-800" />
              <h2 className="text-sm font-bold text-slate-800">Kelola Simpanan Manual</h2>
            </div>

            {/* TOGGLE SETOR / TARIK */}
            <div className="flex bg-white rounded-xl border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => { setTipeTransaksi('SETOR'); setFormError(''); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  tipeTransaksi === 'SETOR' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                }`}
              >
                <PlusCircle size={13} /> Setor
              </button>
              <button
                type="button"
                onClick={() => { setTipeTransaksi('TARIK'); setFormError(''); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  tipeTransaksi === 'TARIK' ? 'bg-rose-600 text-white' : 'text-slate-500'
                }`}
              >
                <MinusCircle size={13} /> Tarik
              </button>
            </div>
          </div>

          <form onSubmit={handleOpenModal} className="p-5 sm:p-6 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
                {formError}
              </div>
            )}

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
                {tipeTransaksi === 'TARIK' && (
                  <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                    Saldo tersedia: {formatRupiah(saldoJenisSaatIni)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nominal {tipeTransaksi === 'SETOR' ? 'Setoran' : 'Penarikan'} (Rp)
                </label>
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
                placeholder="Tuliskan alasan transaksi atau referensi..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs text-white ${
                  tipeTransaksi === 'SETOR' ? 'bg-[#0A1128] hover:bg-slate-800' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Send size={14} />
                <span>Proses {tipeTransaksi === 'SETOR' ? 'Tambah' : 'Tarik'} Saldo</span>
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

      {/* SECTION: PENCATATAN PINJAMAN */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center gap-2">
          <FileText size={16} className="text-slate-800" />
          <h2 className="text-sm font-bold text-slate-800">Pencatatan Pinjaman</h2>
        </div>

        <div className="p-5 sm:p-6">
          {(!anggota.daftar_pinjaman || anggota.daftar_pinjaman.length === 0) ? (
            <p className="text-xs text-slate-400 text-center py-6">Anggota ini belum pernah mengajukan pinjaman.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {anggota.daftar_pinjaman.map((p) => {
                const badge = STATUS_PINJAMAN[p.status];
                const lunasCount = p.cicilan.filter((c) => c.status === 'LUNAS').length;
                return (
                  <div key={p.id} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400">#{p.kode}</p>
                        <p className="text-lg font-black text-slate-900">{formatRupiah(p.jumlah)}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Tenor {p.tenor_bulan} bulan</span>
                      {p.status === 'DISETUJUI' && (
                        <span className="font-bold text-slate-700">{lunasCount}/{p.cicilan.length} lunas</span>
                      )}
                    </div>

                    {p.status === 'DISETUJUI' && p.cicilan.length > 0 && (
                      <button
                        onClick={() => setSelectedPinjaman(p)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Detail & Konfirmasi Cicilan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI SETOR/TARIK SIMPANAN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-t-4 border-amber-400 overflow-hidden">

            <div className="p-6 pb-4 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  tipeTransaksi === 'SETOR' ? 'bg-slate-900 text-amber-400' : 'bg-rose-600 text-white'
                }`}>
                  <Wallet size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Konfirmasi {tipeTransaksi === 'SETOR' ? 'Tambah' : 'Tarik'} Saldo
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tinjau kembali detail transaksi sebelum diproses.</p>
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
                  <span className="text-slate-500 font-medium">Nominal {tipeTransaksi === 'SETOR' ? 'Setoran' : 'Penarikan'}</span>
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

      {/* MODAL DETAIL & KONFIRMASI CICILAN */}
      {selectedPinjaman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            <div className="p-6 border-b border-slate-100 flex items-start justify-between shrink-0">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Detail Angsuran #{selectedPinjaman.kode}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatRupiah(selectedPinjaman.jumlah)} &bull; Tenor {selectedPinjaman.tenor_bulan} bulan
                </p>
              </div>
              <button onClick={() => setSelectedPinjaman(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedPinjaman.cicilan.map((c) => {
                const lunas = c.status === 'LUNAS';
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-4 space-y-2 ${lunas ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Bulan ke-{c.cicilan_ke}</span>
                      {lunas ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Clock size={16} className="text-slate-400" />}
                    </div>
                    <p className="text-base font-black text-slate-900">{formatRupiah(c.jumlah)}</p>

                    {lunas ? (
                      <div className="text-[10px] text-emerald-700 space-y-0.5">
                        <p className="flex items-center gap-1"><Calendar size={10} /> Dibayar {formatTanggal(c.tanggal_bayar)}</p>
                        {c.catatan && <p className="italic">"{c.catatan}"</p>}
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> Jatuh tempo {formatTanggal(c.jatuh_tempo)}
                        </p>
                        <button
                          onClick={() => { setPayingCicilan(c); setCatatanBayar(''); }}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Bayar
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI BAYAR 1 CICILAN */}
      {payingCicilan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Pembayaran Angsuran</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bulan ke-{payingCicilan.cicilan_ke} sebesar <strong>{formatRupiah(payingCicilan.jumlah)}</strong>
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan (Wajib)</label>
              <textarea
                rows={3}
                value={catatanBayar}
                onChange={(e) => setCatatanBayar(e.target.value)}
                placeholder="Contoh: Dibayar tunai di kantor KSP tanggal 4 Agustus 2026"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-5">
              <button
                onClick={() => setPayingCicilan(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleBayarCicilan}
                disabled={payingSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                <span>{payingSubmitting ? 'Menyimpan...' : 'Konfirmasi Lunas'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
