import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BarChart3,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  ArrowRightLeft,
} from 'lucide-react';
import api from '../services/api';
import { formatRupiah, formatTanggal } from '../utils/format';

const STATUS_BADGE = {
  MENUNGGU: { label: 'Menunggu Verifikasi', cls: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  DISETUJUI_BENDAHARA: { label: 'Menunggu Persetujuan', cls: 'bg-blue-50 text-blue-600 border-blue-100', icon: Clock },
  DISETUJUI: { label: 'Disetujui / Aktif', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  DITOLAK: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
  LUNAS: { label: 'Lunas', cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCircle2 },
};

export default function Pinjaman() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/pinjaman')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data pinjaman. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  const { pinjaman_aktif, total_pengajuan, riwayat } = data;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 1. SECTION BARIS ATAS (CARD STATUS & TOMBOL AJUKAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-[#000D21] rounded-3xl p-7 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>

          {pinjaman_aktif ? (
            <>
              <div>
                <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span>Pinjaman Aktif</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight my-3">{formatRupiah(pinjaman_aktif.jumlah)}</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-4 mt-4 text-left">
                <div>
                  <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Tenor</p>
                  <p className="text-sm sm:text-base font-bold mt-0.5">{pinjaman_aktif.tenor_bulan} Bulan</p>
                </div>
                <div>
                  <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Angsuran / Bulan</p>
                  <p className="text-sm sm:text-base font-bold mt-0.5">{formatRupiah(pinjaman_aktif.angsuran_per_bulan)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Sisa Pinjaman</p>
                  <p className="text-sm sm:text-base font-bold mt-0.5">{formatRupiah(pinjaman_aktif.sisa_pinjaman)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start justify-center h-full py-6">
              <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                <ShieldCheck size={18} />
                <span>Belum Ada Pinjaman Aktif</span>
              </div>
              <p className="text-xs text-blue-200 mt-2 max-w-sm">Ajukan pinjaman baru lewat tombol di samping untuk memulai.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pinjaman</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">{total_pengajuan} Pengajuan</h3>
            </div>
          </div>

          <Link to="/ajukan" className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
            <PlusCircle size={20} />
            <span>Ajukan Pinjaman</span>
          </Link>
        </div>

      </div>

      {/* 1.5 TRACKING CICILAN PINJAMAN AKTIF */}
      {pinjaman_aktif && pinjaman_aktif.cicilan && pinjaman_aktif.cicilan.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-slate-800">Progress Cicilan</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {pinjaman_aktif.cicilan_lunas} / {pinjaman_aktif.cicilan.length} bulan lunas
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Kode Pinjaman: #{pinjaman_aktif.kode}</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(pinjaman_aktif.cicilan_lunas / pinjaman_aktif.cicilan.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pinjaman_aktif.cicilan.map((c) => {
              const lunas = c.status === 'LUNAS';
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border p-3.5 ${
                    lunas ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Bulan {c.cicilan_ke}</span>
                    {lunas ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : (
                      <Clock size={16} className="text-slate-400" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{formatRupiah(c.jumlah)}</p>
                  {lunas ? (
                    <p className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                      <Calendar size={10} /> Dibayar {formatTanggal(c.tanggal_bayar)}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                      <Calendar size={10} /> Jatuh tempo {formatTanggal(c.jatuh_tempo)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Pinjaman</h3>
          <p className="text-xs text-slate-400 mt-1">Seluruh riwayat pengajuan pinjaman Anda</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Tanggal Pengajuan</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Nominal Pinjaman</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Tenor</th>
                <th className="p-4 pr-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riwayat.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-slate-400 text-xs">Belum ada pengajuan pinjaman.</td></tr>
              )}
              {riwayat.map((item) => {
                // Fallback kalau backend suatu saat kirim status yang belum
                // terdaftar di STATUS_BADGE -> sebelumnya `badge` bisa undefined
                // dan `badge.icon` di bawah bikin halaman crash. Pola fallback ini
                // dicontek dari DetailAnggota.jsx (Bendahara) yang sudah benar.
                const badge = STATUS_BADGE[item.status] || {
                  label: item.status || 'Diproses',
                  cls: 'bg-slate-100 text-slate-600 border-slate-200',
                  icon: Clock,
                };
                const Icon = badge.icon;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 text-sm text-slate-600 font-medium whitespace-nowrap">{formatTanggal(item.created_at)}</td>
                    <td className="p-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{formatRupiah(item.jumlah)}</span>
                        {item.is_topup && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            <ArrowRightLeft size={9} /> Top-Up
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">{item.tenor_bulan} Bulan</td>
                    <td className="p-4 pr-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}>
                        <Icon size={13} /> {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-400 font-medium">Menampilkan {riwayat.length} dari {riwayat.length} pinjaman</span>
        </div>
      </div>

    </div>
  );
}