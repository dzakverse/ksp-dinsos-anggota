import React from 'react';
import { 
  Building2, 
  Wallet, 
  HandCoins, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Simpananku() {
  // Data dummy untuk 3 jenis simpanan
  const ringkasanSimpanan = [
    {
      id: 1,
      title: "Simpanan Pokok",
      amount: "Rp 500.000",
      description: "Setoran awal keanggotaan",
      icon: Building2,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      id: 2,
      title: "Simpanan Wajib",
      amount: "Rp 2.000.000",
      description: "10 bulan × Rp 200.000",
      icon: Wallet,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Simpanan Sukarela",
      amount: "Rp 10.000.000",
      description: "Dapat ditarik kapan saja",
      icon: HandCoins,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  // Data dummy untuk tabel riwayat transaksi
  const riwayatTransaksi = [
    {
      id: 1,
      tanggal: "12 Jul 2026",
      jenis: "Simpanan Wajib",
      tipe: "SETORAN",
      nominal: "+Rp 200.000",
      nominalColor: "text-emerald-600",
      status: "Berhasil",
    },
    {
      id: 2,
      tanggal: "11 Jul 2026",
      jenis: "Simpanan Sukarela",
      tipe: "SETORAN",
      nominal: "+Rp 1.000.000",
      nominalColor: "text-emerald-600",
      status: "Berhasil",
    },
    {
      id: 3,
      tanggal: "02 Jul 2026",
      jenis: "Simpanan Sukarela",
      tipe: "PENARIKAN",
      nominal: "-Rp 500.000",
      nominalColor: "text-rose-600",
      status: "Berhasil",
    },
    {
      id: 4,
      tanggal: "01 Jul 2026",
      jenis: "Simpanan Wajib",
      tipe: "SETORAN",
      nominal: "+Rp 200.000",
      nominalColor: "text-emerald-600",
      status: "Berhasil",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Baris Card Ringkasan Simpanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ringkasanSimpanan.map((item) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Bagian Atas Card (Icon + Judul) */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${item.iconBg} ${item.iconColor}`}>
                    <IconComponent size={22} />
                  </div>
                  <span className="text-sm font-semibold text-slate-500 tracking-wide">
                    {item.title}
                  </span>
                </div>
                {/* Nominal Besar */}
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {item.amount}
                </h3>
              </div>
              {/* Keterangan Bawah */}
              <p className="text-xs text-slate-400 mt-4 font-medium">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. Section Tabel Riwayat Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
          <p className="text-xs text-slate-400 mt-1">Setoran dan penarikan simpanan Anda</p>
        </div>

        {/* Pembungkus Tabel Responsif */}
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
              {riwayatTransaksi.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Kolom Tanggal */}
                  <td className="p-4 pl-6 text-sm text-slate-600 font-medium whitespace-nowrap">
                    {trx.tanggal}
                  </td>
                  {/* Kolom Jenis Simpanan */}
                  <td className="p-4 text-sm text-slate-700 font-semibold">
                    {trx.jenis}
                  </td>
                  {/* Kolom Tipe (Badge Setoran/Penarikan) */}
                  <td className="p-4 whitespace-nowrap">
                    {trx.tipe === "SETORAN" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600">
                        <ArrowDownLeft size={12} strokeWidth={3} />
                        SETORAN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider bg-rose-50 text-rose-600">
                        <ArrowUpRight size={12} strokeWidth={3} />
                        PENARIKAN
                      </span>
                    )}
                  </td>
                  {/* Kolom Nominal */}
                  <td className={`p-4 text-sm font-bold ${trx.nominalColor}`}>
                    {trx.nominal}
                  </td>
                  {/* Kolom Status */}
                  <td className="p-4 pr-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 size={13} className="fill-emerald-600 text-white" />
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Bagian Pagination Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-400 font-medium">
            Menampilkan 1-4 dari 4 transaksi
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold shadow-sm shadow-blue-200">
              1
            </button>
            <button className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}