import { Calendar, User, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const transaksi = [
    { tgl: '12 Jul 2026', desc: 'Simpanan Wajib Bulan Juli', cat: 'WAJIB', amt: '+Rp 200.000', stat: 'Berhasil', type: 'in' },
    { tgl: '11 Jul 2026', desc: 'Simpanan Pokok', cat: 'POKOK', amt: '+Rp 500.000', stat: 'Berhasil', type: 'in' },
    { tgl: '05 Jul 2026', desc: 'Top Up Simpanan Sukarela', cat: 'SUKARELA', amt: '+Rp 1.000.000', stat: 'Berhasil', type: 'in' },
    { tgl: '02 Jul 2026', desc: 'Penarikan Simpanan Sukarela', cat: 'PENARIKAN', amt: '-Rp 500.000', stat: 'Berhasil', type: 'out' },
    { tgl: '28 Jun 2026', desc: 'Pengajuan Pinjaman #LN-2026-001', cat: 'PINJAMAN', amt: 'Rp 5.000.000', stat: 'Menunggu Verifikasi', type: 'pending' },
    { tgl: '25 Jun 2026', desc: 'Cicilan Pinjaman #P-002', cat: 'CICILAN', amt: '+Rp 500.000', stat: 'Berhasil', type: 'in' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. CARD GRAND TOTAL GRADASI */}
      <div className="bg-[#002347] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
        <p className="text-sm text-blue-100 font-medium">Total Simpanan Anda</p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight my-4">Rp 12.500.000</h2>
        <div className="flex flex-wrap gap-6 text-xs text-blue-100 border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2"><Calendar size={14} /> Bergabung: Jan 2021</div>
          <div className="flex items-center gap-2"><User size={14} /> ID Anggota: ANG-2024-001</div>
        </div>
      </div>

      {/* 2. SUB-SALDO GRID 3 KOLOM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pokok */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">🏛️</div>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md">POKOK</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Pokok</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">Rp 500.000</h4>
          </div>
        </div>
        {/* Wajib */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">🐷</div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md">WAJIB</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Wajib</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">Rp 2.000.000</h4>
          </div>
        </div>
        {/* Sukarela */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">💎</div>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md">SUKARELA</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400">Simpanan Sukarela</p>
            <h4 className="text-lg font-bold text-slate-800 mt-1">Rp 10.000.000</h4>
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
          <button className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium px-4 py-2 rounded-xl transition-colors">
            Lihat Semua
          </button>
        </div>

        {/* Wrapper Tabel agar Responsif di HP */}
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
              {transaksi.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-xs text-slate-400 whitespace-nowrap">{item.tgl}</td>
                  <td className="py-4 font-medium text-slate-800 max-w-xs">{item.desc}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.cat}
                    </span>
                  </td>
                  <td className={`py-4 font-semibold whitespace-nowrap ${
                    item.type === 'in' ? 'text-emerald-600' : item.type === 'out' ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    {item.amt}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {item.type === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                        <Clock size={12} /> {item.stat}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <CheckCircle size={12} /> {item.stat}
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