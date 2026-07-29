import { useEffect, useState } from 'react';
import {
  Building2,
  Wallet,
  HandCoins,
  PiggyBank,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah } from '../../utils/format';

export default function DashboardBendahara() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userName = localStorage.getItem('userName') || 'Bendahara';

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

  // Gunakan fallback default value ({}) agar tidak crash jika data null/undefined
  const { 
    total_kas = 0, 
    total_simpanan_anggota = 0, 
    total_pinjaman_aktif = 0, 
    sub_saldo = {}, 
    aktivitas_terbaru = [] 
  } = data || {};

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* HEADER SALAM */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Selamat Datang, {userName}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Berikut adalah ringkasan performa keuangan KSP Sejahtera hari ini.
        </p>
      </div>

      {/* 3 CARD RINGKASAN UTAMA (TOP ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-[#FABD00]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Building2 size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kas Koperasi</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {formatRupiah(total_kas)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Simpanan Anggota</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {formatRupiah(total_simpanan_anggota)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-rose-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <HandCoins size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pinjaman Aktif</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {formatRupiah(total_pinjaman_aktif)}
          </div>
        </div>

      </div>

      {/* 3 CARD BREAKDOWN SIMPANAN (MIDDLE ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simpanan Pokok</span>
              <Building2 size={18} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              {formatRupiah(sub_saldo?.pokok || 0)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Dibayarkan saat awal keanggotaan</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simpanan Wajib</span>
              <PiggyBank size={18} className="text-amber-600" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              {formatRupiah(sub_saldo?.wajib || 0)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Total iuran bulanan rutin</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simpanan Sukarela</span>
              <Coins size={18} className="text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              {formatRupiah(sub_saldo?.sukarela || 0)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Saldo tersedia untuk ditarik</p>
        </div>

      </div>

      {/* TABEL AKTIVITAS TERBARU */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Transaksi</th>
                <th className="py-4 px-6">Anggota</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Waktu</th>
                <th className="py-4 px-6">Jumlah</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {(!aktivitas_terbaru || aktivitas_terbaru.length === 0) && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400">Belum ada aktivitas.</td></tr>
              )}
              {aktivitas_terbaru?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.tipe === 'in'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.tipe === 'out'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {item.tipe === 'in' && <ArrowDownLeft size={16} />}
                        {item.tipe === 'out' && <ArrowUpRight size={16} />}
                        {item.tipe === 'pending' && <Clock size={16} />}
                      </div>
                      <span className="font-bold text-slate-800">{item.jenis}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-slate-800">{item.anggota}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.nip}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md tracking-wider">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">{item.waktu}</td>
                  <td className={`py-4 px-6 font-bold ${
                    item.tipe === 'in' ? 'text-emerald-600' : item.tipe === 'out' ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {formatRupiah(item.jumlah)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'Berhasil' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Berhasil' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                      {item.status}
                    </span>
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