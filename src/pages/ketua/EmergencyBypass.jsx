import { useEffect, useState } from 'react';
import {
  Zap,
  AlertTriangle,
  X,
  ShieldAlert,
  UserCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

export default function EmergencyBypass() {
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Sekarang menyimpan SELURUH antrean, bukan cuma 1 item paling urgent
  const [antrean, setAntrean] = useState([]);
  const [totalMenunggu, setTotalMenunggu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Item yang sedang dipilih untuk dieksekusi bypass-nya
  const [selectedItem, setSelectedItem] = useState(null);

  const loadQueue = () => {
    setLoading(true);
    api.get('/ketua/pinjaman/bypass-queue')
      .then((res) => {
        // Dukung format response lama (res.data.urgent = 1 objek) maupun
        // format baru (res.data.antrean = array seluruh antrean).
        const list = res.data.antrean ?? (res.data.urgent ? [res.data.urgent] : []);
        setAntrean(list);
        setTotalMenunggu(res.data.total_menunggu ?? list.length);
      })
      .catch(() => setError('Gagal memuat antrean bypass.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQueue(); }, []);

  const handleOpenBypassModal = (item) => {
    setSelectedItem(item);
    setIsConfirmed(false);
    setShowBypassModal(true);
  };

  const handleExecuteBypass = async () => {
    if (!isConfirmed || !selectedItem) return;
    setProcessing(true);
    try {
      await api.post(`/ketua/pinjaman/${selectedItem.id}/bypass`);
      setShowBypassModal(false);
      setIsConfirmed(false);
      setToastMessage(`Bypass untuk ${selectedItem.user.nama} (#${selectedItem.kode}) berhasil dieksekusi!`);
      setSelectedItem(null);
      loadQueue();
      setTimeout(() => setToastMessage(null), 4500);
    } catch {
      alert('Gagal mengeksekusi bypass. Coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  // Simulasi cicilan untuk bypass darurat: 0% bunga (kebijakan kemanusiaan, tanpa bunga)
  const getSimulasi = (item) => ({
    pokok: Math.round(item.jumlah / item.tenor_bulan),
    totalPerBulan: Math.round(item.jumlah / item.tenor_bulan),
  });

  return (
    <div className="space-y-6 max-w-6xl pb-12 font-sans">

      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3">
          <Zap size={22} className="text-amber-400 shrink-0 fill-amber-400" />
          <div className="text-xs">
            <p className="font-extrabold text-amber-400">EMERGENCY BYPASS BERHASIL DIEKSEKUSI!</p>
            <p className="text-slate-300 text-[11px] mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs tracking-wider uppercase">
          <AlertTriangle size={16} />
          <span>Critical Operations</span>
        </div>
        <h2 className="text-lg font-black text-slate-900">Emergency Override Command</h2>
        <p className="text-xs text-slate-500">
          Bypass eksekutif atas protokol verifikasi standar untuk kondisi darurat/kemanusiaan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">

          <div className="bg-blue-50/50 p-4 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-xs">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>Emergency Bypass Queue</span>
            </div>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {totalMenunggu} MENUNGGU
            </span>
          </div>

          {loading && <div className="p-8 text-center text-slate-400 text-xs">Memuat data...</div>}
          {error && <div className="p-8 text-center text-rose-500 text-xs">{error}</div>}

          {!loading && !error && antrean.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada pengajuan pinjaman yang menunggu. Antrean kosong.
            </div>
          )}

          {!loading && !error && antrean.length > 0 && (
            <div className="divide-y divide-slate-100">
              {antrean.map((item, idx) => {
                const simulasi = getSimulasi(item);
                return (
                  <div key={item.id} className="p-6 space-y-5">

                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#081028] text-white flex items-center justify-center font-bold shrink-0">
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400">#{idx + 1}</span>
                            <h3 className="text-sm font-extrabold text-slate-900">{item.user.nama}</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">NIP: {item.user.nip}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KODE PENGAJUAN</div>
                        <div className="text-xs font-black text-slate-900">#{item.kode}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                      <div className="md:col-span-6 space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Nominal</span>
                          <span className="font-black text-slate-900 text-sm">{formatRupiah(item.jumlah)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Tenor</span>
                          <span className="font-bold text-slate-900">{item.tenor_bulan} Bulan</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Tanggal Pengajuan</span>
                          <span className="font-bold text-slate-900">{formatTanggal(item.created_at)}</span>
                        </div>
                      </div>

                      <div className="md:col-span-6 bg-blue-50/40 border border-blue-100 rounded-2xl p-4 text-xs space-y-2.5">
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                          SIMULASI CICILAN
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Pokok Bulanan</span>
                          <span className="font-bold text-slate-800">{formatRupiah(simulasi.pokok)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Bunga (0% - Bypass Kemanusiaan)</span>
                          <span className="font-bold text-slate-800">Rp 0</span>
                        </div>
                        <div className="pt-2 border-t border-blue-100 flex justify-between items-center font-black">
                          <span className="text-slate-900">Total Per Bulan</span>
                          <span className="text-slate-900 text-sm">{formatRupiah(simulasi.totalPerBulan)}</span>
                        </div>
                      </div>

                    </div>

                    <div className="bg-rose-50/40 border border-rose-200/60 rounded-2xl p-4 space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                        ALASAN PENGAJUAN
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {item.alasan || 'Tidak ada keterangan tambahan dari pemohon.'}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleOpenBypassModal(item)}
                        className="w-auto bg-[#081028] hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Zap size={16} className="text-amber-400 fill-amber-400" />
                        <span>Execute Immediate Bypass</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        <div className="lg:col-span-4 bg-[#050C1E] text-white rounded-2xl p-6 shadow-md space-y-6 relative overflow-hidden">

          <div className="space-y-4">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              SYSTEM OVERRIDE MODE
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse mt-1.5 shrink-0" />
              <div>
                <h3 className="text-base font-black tracking-tight text-white">Active & Authoritative</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Setiap bypass langsung mengubah status pinjaman menjadi DISETUJUI dan tercatat sebagai transaksi ber-flag "bypass" di riwayat.
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>View Policy Guidelines</span>
            <ArrowRight size={16} />
          </button>

          <Lock className="absolute -bottom-6 -right-6 text-slate-800/40 w-32 h-32 pointer-events-none" />
        </div>

      </div>

      {showBypassModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black">
                  <Zap size={22} className="fill-slate-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Konfirmasi Intervensi Bypass</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Otorisasi Eksekutif Darurat (Tingkat Tinggi)</p>
                </div>
              </div>
              <button onClick={() => setShowBypassModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">

              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Pemohon:</span>
                  <strong className="text-white">{selectedItem.user.nama} (#{selectedItem.kode})</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Nominal Pencairan:</span>
                  <strong className="text-amber-400 text-sm">{formatRupiah(selectedItem.jumlah)}</strong>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 space-y-2 text-rose-900">
                <div className="flex items-center gap-2 font-black text-rose-800 text-xs">
                  <ShieldAlert size={16} />
                  <span>PERINGATAN OTORITAS KETUA</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tindakan ini melewati (bypass) seluruh tahap verifikasi bendahara dan persetujuan bertingkat standar. Status pinjaman akan langsung menjadi DISETUJUI.
                </p>
              </div>

              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  Saya secara sadar mengonfirmasi bahwa pengajuan darurat ini telah diverifikasi validitas kemanusiaannya dan bertanggung jawab penuh atas keputusan bypass ini.
                </span>
              </label>

            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBypassModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!isConfirmed || processing}
                onClick={handleExecuteBypass}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isConfirmed && !processing
                    ? 'bg-[#081028] hover:bg-slate-800 text-amber-400 shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap size={16} className={isConfirmed ? 'fill-amber-400' : ''} />
                <span>{processing ? 'Memproses...' : 'Otorisasi & Cairkan Sekarang'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
