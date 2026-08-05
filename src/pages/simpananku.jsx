import { useEffect, useState } from 'react';
import {
  Building2,
  Wallet,
  HandCoins,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  MinusCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { formatRupiah, formatTanggal } from '../utils/format';

const JENIS_ICON = {
  POKOK: { icon: Building2, bg: 'bg-indigo-50', color: 'text-indigo-600', label: 'Simpanan Pokok' },
  WAJIB: { icon: Wallet, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Simpanan Wajib' },
  SUKARELA: { icon: HandCoins, bg: 'bg-blue-50', color: 'text-blue-600', label: 'Simpanan Sukarela' },
};

const statusBadge = (status) => {
  if (status === 'BERHASIL') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle2 size={13} className="fill-emerald-600 text-white" /> Berhasil
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
        <Clock size={13} /> Menunggu Konfirmasi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
      <XCircle size={13} /> Gagal
    </span>
  );
};

export default function Simpananku() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showTarikModal, setShowTarikModal] = useState(false);
  const [nominalTarik, setNominalTarik] = useState('');
  const [keteranganTarik, setKeteranganTarik] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tarikError, setTarikError] = useState('');

  const loadData = () => {
    setLoading(true);
    api.get('/simpanan')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data simpanan. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmitTarik = async (e) => {
    e.preventDefault();
    setTarikError('');

    const jumlah = Number(nominalTarik);
    if (!jumlah || jumlah <= 0) {
      setTarikError('Masukkan nominal yang valid.');
      return;
    }
    if (jumlah > data.total_sukarela) {
      setTarikError(`Saldo Sukarela Anda tidak mencukupi (tersedia ${formatRupiah(data.total_sukarela)}).`);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/simpanan/tarik', { jumlah, keterangan: keteranganTarik || undefined });
      setShowTarikModal(false);
      setNominalTarik('');
      setKeteranganTarik('');
      alert('Request tarik Simpanan Sukarela berhasil dikirim. Menunggu konfirmasi Bendahara.');
      loadData();
    } catch (err) {
      setTarikError(err.response?.data?.message || 'Gagal mengirim request. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  const ringkasan = [
    { key: 'POKOK', amount: data.total_pokok },
    { key: 'WAJIB', amount: data.total_wajib },
    { key: 'SUKARELA', amount: data.total_sukarela },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Baris Card Ringkasan Simpanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ringkasan.map(({ key, amount }) => {
          const meta = JENIS_ICON[key];
          const Icon = meta.icon;
          return (
            <div key={key} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${meta.bg} ${meta.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-semibold text-slate-500 tracking-wide">{meta.label}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(amount)}</h3>
              </div>

              {key === 'SUKARELA' && (
                <button
                  onClick={() => setShowTarikModal(true)}
                  className="mt-4 w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MinusCircle size={15} />
                  <span>Tarik Simpanan Sukarela</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Section Tabel Riwayat Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
          <p className="text-xs text-slate-400 mt-1">Setoran dan penarikan simpanan Anda</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Tanggal</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Jenis Simpanan</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Tipe</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Nominal</th>
                <th className="p-4 pr-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.riwayat.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 text-xs">Belum ada transaksi.</td></tr>
              )}
              {data.riwayat.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 text-sm text-slate-600 font-medium whitespace-nowrap">{formatTanggal(trx.tanggal)}</td>
                  <td className="p-4 text-sm text-slate-700 font-semibold">{JENIS_ICON[trx.jenis]?.label ?? trx.jenis}</td>
                  <td className="p-4 whitespace-nowrap">
                    {trx.tipe === 'SETOR' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600">
                        <ArrowDownLeft size={12} strokeWidth={3} /> SETORAN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider bg-rose-50 text-rose-600">
                        <ArrowUpRight size={12} strokeWidth={3} /> PENARIKAN
                      </span>
                    )}
                  </td>
                  <td className={`p-4 text-sm font-bold ${trx.tipe === 'SETOR' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trx.tipe === 'SETOR' ? '+' : '-'}{formatRupiah(trx.jumlah)}
                  </td>
                  <td className="p-4 pr-6 whitespace-nowrap">{statusBadge(trx.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-400 font-medium">Menampilkan {data.riwayat.length} dari {data.riwayat.length} transaksi</span>
        </div>
      </div>

      {/* MODAL TARIK SIMPANAN SUKARELA */}
      {showTarikModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <MinusCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Tarik Simpanan Sukarela</h3>
                <p className="text-[11px] text-slate-400">Saldo tersedia: {formatRupiah(data.total_sukarela)}</p>
              </div>
            </div>

            {tarikError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{tarikError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTarik} className="py-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={nominalTarik}
                  onChange={(e) => setNominalTarik(e.target.value)}
                  placeholder="Contoh: 200000"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Keterangan (Opsional)</label>
                <textarea
                  rows={2}
                  value={keteranganTarik}
                  onChange={(e) => setKeteranganTarik(e.target.value)}
                  placeholder="Contoh: Untuk kebutuhan mendesak..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                Request ini akan menunggu konfirmasi dari Bendahara. Saldo baru akan berkurang setelah dikonfirmasi.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowTarikModal(false); setTarikError(''); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}