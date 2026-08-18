import { useEffect, useState } from 'react';
import {
  Building2,
  Wallet,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import api, { getUserName } from '../../services/api';
import { formatRupiah, formatWaktuAktivitas } from '../../utils/format';

export default function DashboardKetua() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userName = getUserName() || 'Ketua';

  useEffect(() => {
    api.get('/admin/dashboard')
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

  const { total_kas, total_simpanan_anggota, total_pinjaman_aktif, sub_saldo, jumlah_anggota_aktif, aktivitas_terbaru } = data;

  return (
    <div className="space-y-6 animate-fade-in">

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

      <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl p-5 text-xs text-slate-500">
        Audit Log Tracker (pencatatan detail siapa-mengubah-apa) akan menyusul di iterasi berikutnya.
      </div>

    </div>
  );
}