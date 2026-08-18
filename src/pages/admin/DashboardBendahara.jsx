import { useEffect, useState } from 'react';
import {
  Building2,
  Wallet,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  Send,
} from 'lucide-react';
import api, { getUserName } from '../../services/api';
import { formatRupiah, formatTanggal, formatWaktuAktivitas } from '../../utils/format';

export default function DashboardBendahara() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userName = getUserName() || 'Bendahara';

  // ---- Konfirmasi Penarikan Simpanan Sukarela (request dari Anggota, status PENDING) ----
  const [pendingTarik, setPendingTarik] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [errorPending, setErrorPending] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null); // { item, actionType }
  const [catatan, setCatatan] = useState('');
  const [catatanError, setCatatanError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadDashboard = () => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data dashboard. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  };

  const loadPendingTarik = () => {
    setLoadingPending(true);
    api.get('/admin/simpanan/pending')
      .then((res) => setPendingTarik(res.data))
      .catch(() => setErrorPending('Gagal memuat daftar permintaan penarikan.'))
      .finally(() => setLoadingPending(false));
  };

  useEffect(() => {
    loadDashboard();
    loadPendingTarik();
  }, []);

  const handleOpenAction = (item, actionType) => {
    setSelectedRequest({ item, actionType });
    setCatatan('');
    setCatatanError('');
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    const { item, actionType } = selectedRequest;

    if (actionType === 'GAGAL' && !catatan.trim()) {
      setCatatanError('Alasan penolakan wajib diisi.');
      return;
    }

    setProcessing(true);
    try {
      await api.post(`/admin/simpanan/${item.id}/konfirmasi`, {
        status: actionType,
        catatan: catatan.trim() || null,
      });

      setPendingTarik((prev) => prev.filter((p) => p.id !== item.id));
      setSelectedRequest(null);
      setCatatan('');
      setToastMessage(
        actionType === 'BERHASIL'
          ? `Penarikan Rp ${Number(item.jumlah).toLocaleString('id-ID')} milik ${item.user?.nama} disetujui & saldo terpotong.`
          : `Penarikan milik ${item.user?.nama} ditolak.`
      );
      loadDashboard(); // refresh total saldo/kas karena bisa berubah
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses permintaan. Coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  const { total_kas, total_simpanan_anggota, total_pinjaman_aktif, sub_saldo, jumlah_anggota_aktif, aktivitas_terbaru } = data;

  return (
    <div className="space-y-6 animate-fade-in">

      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 max-w-sm">
          <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold text-slate-100">{toastMessage}</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang, {userName}</h1>
        <p className="text-xs text-slate-500 mt-1">Ringkasan kondisi keuangan koperasi hari ini.</p>
      </div>

      {/* CARD TOTAL KAS */}
      <div className="bg-[#081028] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
        <p className="text-sm text-blue-100 font-medium">Total Kas Koperasi</p>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight my-4">{formatRupiah(total_kas)}</h2>
        <div className="flex flex-wrap gap-6 text-xs text-blue-100 border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2"><Wallet size={14} /> Simpanan Anggota: {formatRupiah(total_simpanan_anggota)}</div>
          <div className="flex items-center gap-2"><HandCoins size={14} /> Pinjaman Aktif: {formatRupiah(total_pinjaman_aktif)}</div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} /> Anggota Aktif: {jumlah_anggota_aktif}</div>
        </div>
      </div>

      {/* SUB SALDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit"><Building2 size={20} /></div>
          <p className="text-xs text-slate-400 mt-4">Simpanan Pokok</p>
          <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.pokok)}</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit"><Wallet size={20} /></div>
          <p className="text-xs text-slate-400 mt-4">Simpanan Wajib</p>
          <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.wajib)}</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit"><HandCoins size={20} /></div>
          <p className="text-xs text-slate-400 mt-4">Simpanan Sukarela</p>
          <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.sukarela)}</h4>
        </div>
      </div>

      {/* KONFIRMASI PENARIKAN SIMPANAN SUKARELA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-800">Konfirmasi Penarikan Sukarela</h3>
          {pendingTarik.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {pendingTarik.length} MENUNGGU
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-6">Request tarik Simpanan Sukarela mandiri dari Anggota, menunggu persetujuan Bendahara.</p>

        {loadingPending && <div className="py-6 text-center text-slate-400 text-xs">Memuat data...</div>}
        {errorPending && <div className="py-6 text-center text-rose-500 text-xs">{errorPending}</div>}

        {!loadingPending && !errorPending && pendingTarik.length === 0 && (
          <div className="py-6 text-center text-slate-400 text-xs">Tidak ada permintaan penarikan yang menunggu.</div>
        )}

        {!loadingPending && !errorPending && pendingTarik.length > 0 && (
          <div className="divide-y divide-slate-100">
            {pendingTarik.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm truncate">{item.user?.nama}</span>
                    <span className="text-[11px] text-slate-400">NIP: {item.user?.nip}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Tarik Simpanan Sukarela &bull; <span className="font-bold text-slate-700">{formatRupiah(item.jumlah)}</span> &bull; {formatTanggal(item.tanggal)}
                  </div>
                  {item.keterangan && (
                    <p className="text-[11px] text-slate-400 italic mt-1 truncate">"{item.keterangan}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenAction(item, 'GAGAL')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Tolak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAction(item, 'BERHASIL')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Setujui</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AKTIVITAS TERBARU */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-1">Aktivitas Terbaru</h3>
        <p className="text-xs text-slate-400 mb-6">Transaksi lintas-anggota terkini</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">
                <th className="pb-3 font-semibold">ANGGOTA</th>
                <th className="pb-3 font-semibold">TRANSAKSI</th>
                <th className="pb-3 font-semibold">WAKTU</th>
                <th className="pb-3 font-semibold">JUMLAH</th>
                <th className="pb-3 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {aktivitas_terbaru.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400 text-xs">Belum ada aktivitas.</td></tr>
              )}
              {aktivitas_terbaru.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-semibold text-slate-800">{item.anggota}</div>
                    <div className="text-[11px] text-slate-400">{item.nip}</div>
                  </td>
                  <td className="py-4 font-medium">{item.jenis}</td>
                  <td className="py-4 text-xs text-slate-400 whitespace-nowrap">{formatWaktuAktivitas(item.waktu)}</td>
                  <td className={`py-4 font-semibold whitespace-nowrap ${
                    item.tipe === 'in' ? 'text-emerald-600' : item.tipe === 'out' ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    <span className="inline-flex items-center gap-1">
                      {item.tipe === 'in' ? <ArrowDownLeft size={14} /> : item.tipe === 'out' ? <ArrowUpRight size={14} /> : null}
                      {formatRupiah(item.jumlah)}
                    </span>
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {item.status === 'Menunggu' ? (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                        <Clock size={12} /> Menunggu
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <ShieldCheck size={12} /> {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KONFIRMASI SETUJUI/TOLAK PENARIKAN */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 pb-4 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedRequest.actionType === 'BERHASIL' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {selectedRequest.actionType === 'BERHASIL' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedRequest.actionType === 'BERHASIL' ? 'Setujui Penarikan' : 'Tolak Penarikan'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedRequest.item.user?.nama} &bull; {formatRupiah(selectedRequest.item.jumlah)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-2 space-y-3">
              {selectedRequest.actionType === 'BERHASIL' ? (
                <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                  Saldo Simpanan Sukarela anggota akan langsung terpotong sebesar {formatRupiah(selectedRequest.item.jumlah)} setelah disetujui.
                </p>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/60 border border-rose-100 rounded-xl p-3">
                  Permintaan ini akan ditandai gagal dan saldo anggota tidak akan terpotong.
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan {selectedRequest.actionType === 'GAGAL' ? '(Wajib diisi)' : '(Opsional)'}
                </label>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => { setCatatan(e.target.value); setCatatanError(''); }}
                  placeholder={selectedRequest.actionType === 'GAGAL' ? 'Contoh: Saldo tidak mencukupi setelah pengecekan ulang' : 'Contoh: Dicairkan tunai di kantor KSP'}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none focus:border-amber-400 font-medium resize-none"
                />
                {catatanError && <p className="text-[11px] text-rose-500 mt-1">{catatanError}</p>}
              </div>
            </div>

            <div className="p-6 pt-4 flex items-center gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-2xl border-2 border-slate-200 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processing}
                className={`flex-1 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
                  selectedRequest.actionType === 'BERHASIL'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <Send size={14} />
                <span>{processing ? 'Memproses...' : selectedRequest.actionType === 'BERHASIL' ? 'Ya, Setujui' : 'Ya, Tolak'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}