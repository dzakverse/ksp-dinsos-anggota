import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, AlertCircle, ArrowRightLeft, Lock } from 'lucide-react';
import api from '../services/api';

export default function Ajukan() {
  const navigate = useNavigate();

  const [kebijakan, setKebijakan] = useState(null);
  const [pinjamanAktif, setPinjamanAktif] = useState(null);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [nominal, setNominal] = useState(5000000);
  const [tenor, setTenor] = useState(12);
  const [keperluan, setKeperluan] = useState('Biaya Pendidikan');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/kebijakan'),
      api.get('/pinjaman'),
    ])
      .then(([kebijakanRes, pinjamanRes]) => {
        setKebijakan(kebijakanRes.data);
        setPinjamanAktif(pinjamanRes.data?.pinjaman_aktif || null);
      })
      .catch((err) => {
        console.error("Gagal memuat data awal:", err);
        setErrorMessage("Gagal memuat kebijakan atau data pinjaman.");
      })
      .finally(() => setLoadingAwal(false));
  }, []);

  // Perhitungan dinamis dengan fallback nilai aman
  const limitMaksimal = kebijakan ? Number(kebijakan.plafon_maksimal || 0) : 0;
  const sukuBungaPersen = kebijakan ? Number(kebijakan.suku_bunga_persen || 1) : 1;
  const bungaRate = sukuBungaPersen / 100;
  const biayaAdminRate = 0.01;

  const nominalNum = Number(nominal) || 0;

  // ==== MODE TOP-UP: jika anggota masih punya pinjaman aktif ====
  const isTopupMode = !!pinjamanAktif;
  const sisaPinjamanLama = pinjamanAktif ? Number(pinjamanAktif.sisa_pinjaman || 0) : 0;
  const progressPersen = pinjamanAktif && pinjamanAktif.tenor_bulan > 0
    ? Math.round(((pinjamanAktif.cicilan_lunas || 0) / pinjamanAktif.tenor_bulan) * 100)
    : 0;
  const minimalProgress = kebijakan ? Number(kebijakan.minimal_progress_topup_persen || 30) : 30;
  const progressBelumCukup = isTopupMode && progressPersen < minimalProgress;
  const nominalKurangDariSisa = isTopupMode && nominalNum <= sisaPinjamanLama;
  const pencairanBersihTopup = nominalNum - sisaPinjamanLama;

  const biayaAdmin = nominalNum * biayaAdminRate;
  const uangDiterima = isTopupMode ? pencairanBersihTopup - biayaAdmin : nominalNum - biayaAdmin;
  const angsuranPokok = tenor > 0 ? nominalNum / tenor : 0;
  const jasaKoperasi = nominalNum * bungaRate;
  const totalCicilanBulanan = angsuranPokok + jasaKoperasi;

  const melebihiLimit = !loadingAwal && limitMaksimal > 0 && nominalNum > limitMaksimal;
  const tidakBisaAjukan = isTopupMode && (progressBelumCukup || nominalKurangDariSisa);

  const formatRupiah = (num) => 'Rp ' + Math.round(num || 0).toLocaleString('id-ID');

  const handleNominalChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setNominal(value === '' ? '' : Number(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (melebihiLimit) {
      setErrorMessage(`Nominal pengajuan melebihi limit maksimal (${formatRupiah(limitMaksimal)}).`);
      return;
    }
    if (nominalNum < 100000) {
      setErrorMessage('Nominal pengajuan minimal Rp 100.000.');
      return;
    }
    if (tidakBisaAjukan) {
      setErrorMessage('Pengajuan Top-Up belum memenuhi syarat. Lihat keterangan di atas.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/pinjaman', {
        jumlah: nominalNum,
        tenor_bulan: tenor,
        alasan: `${keperluan}${keterangan ? ' - ' + keterangan : ''}`,
      });

      alert(isTopupMode
        ? 'Pengajuan Top-Up berhasil dikirim! Sisa pinjaman lama akan otomatis dilunasi setelah disetujui.'
        : 'Pengajuan pinjaman berhasil dikirim! Silakan tunggu proses verifikasi.');
      navigate('/pinjaman');
    } catch (err) {
      // Penanganan error yang lebih komprehensif dari respon server Laravel
      const detailPesan = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Gagal mengirim pengajuan. Silakan periksa jaringan atau coba beberapa saat lagi.';
      setErrorMessage(detailPesan);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAwal) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">

      {/* BANNER TOP-UP (kalau masih ada pinjaman aktif) */}
      {isTopupMode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
            <ArrowRightLeft size={20} />
          </div>
          <div className="text-sm">
            <h3 className="font-bold text-amber-900">Anda Masih Memiliki Pinjaman Aktif</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Kode <strong>#{pinjamanAktif?.kode}</strong> dengan sisa <strong>{formatRupiah(sisaPinjamanLama)}</strong> ({progressPersen}% tenor sudah lunas).
              Pengajuan baru di bawah ini akan diproses sebagai <strong>Top-Up</strong>: sisa pinjaman lama otomatis dilunasi dari plafon baru, dan Anda hanya akan punya <strong>1 cicilan bulanan tunggal</strong> ke depannya.
            </p>
            {progressBelumCukup && (
              <div className="mt-3 bg-rose-100 border border-rose-300 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                <Lock size={15} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">
                  Belum bisa mengajukan Top-Up: minimal {minimalProgress}% tenor pinjaman lama harus lunas dulu (saat ini baru {progressPersen}%).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. BANNER LIMIT PINJAMAN */}
      <div className="bg-[#000D21] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <div className="p-1 bg-white/10 rounded-full">
              <Star size={14} className="fill-white text-white" />
            </div>
            <span>Limit Pinjaman</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
            {formatRupiah(limitMaksimal)}
          </h2>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold text-white">
          Bunga {sukuBungaPersen}% / bulan
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">

          <div className="text-xs font-semibold text-slate-400 mb-1">
            Pinjaman &rsaquo; <span className="text-slate-600">{isTopupMode ? 'Pengajuan Top-Up' : 'Pengajuan Pinjaman'}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {isTopupMode ? 'Detail Pengajuan Top-Up' : 'Detail Pengajuan Pinjaman'}
          </h3>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Nominal Pinjaman {isTopupMode && '(Plafon Baru)'}
              </label>
              <input
                type="text"
                value={nominal}
                onChange={handleNominalChange}
                placeholder="Masukkan nominal pinjaman"
                className={`w-full px-4 py-3 rounded-xl border text-slate-800 font-semibold focus:outline-none focus:ring-2 transition-all ${
                  melebihiLimit || nominalKurangDariSisa ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-600'
                }`}
              />
              <p className={`text-[11px] mt-1 font-medium ${melebihiLimit || nominalKurangDariSisa ? 'text-rose-600' : 'text-slate-400'}`}>
                Minimal: Rp 100.000 &bull; Maksimal: {formatRupiah(limitMaksimal)}
                {melebihiLimit && ' — melebihi limit!'}
                {nominalKurangDariSisa && ` — harus lebih besar dari sisa pinjaman lama (${formatRupiah(sisaPinjamanLama)})`}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Tenor / Jangka Waktu
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[3, 6, 12, 24].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                      tenor === t
                        ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t} Bulan
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Keperluan Pinjaman
              </label>
              <select
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Biaya Pendidikan">Biaya Pendidikan</option>
                <option value="Renovasi Rumah">Renovasi Rumah</option>
                <option value="Modal Usaha">Modal Usaha</option>
                <option value="Pengobatan / Kesehatan">Pengobatan / Kesehatan</option>
                <option value="Pembelian Kendaraan">Pembelian Kendaraan</option>
                <option value="Kebutuhan Mendesak / Lainnya">Kebutuhan Mendesak / Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Alasan / Keterangan Tambahan
              </label>
              <textarea
                rows={4}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Biaya pendaftaran masuk sekolah anak"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || melebihiLimit || tidakBisaAjukan}
              className="w-full py-3.5 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>{submitting ? 'Mengirim...' : isTopupMode ? 'Kirim Pengajuan Top-Up' : 'Kirim Pengajuan'}</span>
            </button>
          </form>

        </div>

        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-base font-bold text-slate-800">Ringkasan Pinjaman</h4>
            <p className="text-xs text-slate-400 mt-0.5">Simulasi angsuran bulanan</p>

            <div className="mt-6 space-y-4">
              {isTopupMode && (
                <>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Potongan Pelunasan Pinjaman Lama</p>
                    <p className="text-sm font-bold text-rose-600 mt-0.5">- {formatRupiah(sisaPinjamanLama)}</p>
                  </div>
                  <div className="border-t border-dashed border-slate-200"></div>
                </>
              )}

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {isTopupMode ? 'Pencairan Bersih Diterima' : 'Uang yang Diterima'}
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{formatRupiah(uangDiterima)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Angsuran Pokok / Bulan</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{formatRupiah(angsuranPokok)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Jasa Koperasi ({sukuBungaPersen}%)
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{formatRupiah(jasaKoperasi)}</p>
              </div>
            </div>

            <div className="mt-6 bg-[#FABD00] text-white p-4 rounded-xl shadow-sm">
              <p className="text-[10px] uppercase font-bold tracking-wider text-white/80">
                Total Cicilan Bulanan {isTopupMode && '(Tunggal)'}
              </p>
              <p className="text-2xl font-extrabold tracking-tight mt-1">
                {formatRupiah(totalCicilanBulanan)}
              </p>
            </div>

            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-medium leading-relaxed">
              Biaya administrasi 1% ({formatRupiah(biayaAdmin)}) akan dipotong langsung dari nominal pinjaman.
            </div>
          </div>

          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Detail Pinjaman
            </h5>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">{isTopupMode ? 'Plafon Baru' : 'Nominal'}</span>
              <span className="font-bold text-slate-800">{formatRupiah(nominalNum)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Tenor</span>
              <span className="font-bold text-slate-800">{tenor} Bulan</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Keperluan</span>
              <span className="font-bold text-slate-800">{keperluan}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}