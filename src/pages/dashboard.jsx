import { useEffect, useState } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { formatRupiah, formatTanggal } from '../utils/format';

const statusTone = (status) => {
  const s = (status || '').toUpperCase();
  if (s.includes('MENUNGGU') || s === 'PENDING') return 'pending';
  if (s.includes('TOLAK') || s === 'GAGAL') return 'gagal';
  return 'sukses';
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data dashboard. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  const { profil, total_simpanan, sub_saldo, aktivitas_terakhir } = data;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* 1. CARD GRAND TOTAL GRADASI */}
      <div className="bg-[#002347] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
        <p className="text-sm text-blue-100 font-medium">Total Simpanan Anda</p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight my-4">{formatRupiah(total_simpanan)}</h2>
        <div className="flex flex-wrap gap-6 text-xs text-blue-100 border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2"><Calendar size={14} /> Bergabung: {formatTanggal(profil.tanggal_bergabung)}</div>
          <div className="flex items-center gap-2"><User size={14} /> ID Anggota: {profil.id_anggota}</div>
        </div>
      </div>

      {/* 2. SUB-SALDO GRID 3 KOLOM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">🏛️</div>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md">POKOK</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Pokok</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.pokok)}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">🐷</div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md">WAJIB</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Wajib</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.wajib)}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">💎</div>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md">SUKARELA</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Sukarela</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(sub_saldo.sukarela)}</h4>
          </div>
        </div>
      </div>

      {/* 3. TABEL AKTIVITAS TERAKHIR */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Aktivitas Terakhir</h3>
            <p className="text-xs text-slate-400 mt-0.5">Semua jenis transaksi terbaru Anda</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">
                <th className="pb-3 font-semibold">TANGGAL</th>
                <th className="pb-3 font-semibold">TRANSAKSI</th>
                <th className="pb-3 font-semibold">KATEGORI</th>
                <th className="pb-3 font-semibold">JUMLAH</th>
                <th className="pb-3 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {aktivitas_terakhir.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400 text-xs">Belum ada aktivitas.</td></tr>
              )}
              {aktivitas_terakhir.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-xs text-slate-400 whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                  <td className="py-4 font-medium text-slate-800 max-w-xs">{item.deskripsi}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.kategori}
                    </span>
                  </td>
                  <td className={`py-4 font-semibold whitespace-nowrap ${
                    item.arah === 'in' ? 'text-emerald-600' : item.arah === 'out' ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    {item.arah === 'in' ? '+' : item.arah === 'out' ? '-' : ''}{formatRupiah(item.jumlah)}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {statusTone(item.status) === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                        <Clock size={12} /> {item.status}
                      </span>
                    ) : statusTone(item.status) === 'gagal' ? (
                      <span className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full w-fit">
                        <XCircle size={12} /> {item.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <CheckCircle size={12} /> {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}