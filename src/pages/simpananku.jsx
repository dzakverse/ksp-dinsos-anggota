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
        <Clock size={13} /> Pending
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

  useEffect(() => {
    api.get('/simpanan')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data simpanan. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  }, []);

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
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${meta.bg} ${meta.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-sm font-semibold text-slate-500 tracking-wide">{meta.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(amount)}</h3>
              </div>
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
    </div>
  );
}
