import React from 'react';
import { 
  Building2, 
  Wallet, 
  HandCoins, 
  PiggyBank, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

export default function DashboardBendahara() {
  // Mock data transaksi terbaru
  const transaksiTerbaru = [
    {
      id: 1,
      jenis: 'Setoran Simpanan',
      anggota: 'Agus Wijaya',
      nip: 'DINSOS-042',
      kategori: 'POKOK',
      waktu: '10:45 AM',
      jumlah: 'Rp 500.000',
      status: 'Berhasil',
      tipe: 'in', // Masuk
    },
    {
      id: 2,
      jenis: 'Pencairan Pinjaman',
      anggota: 'Siti Aminah',
      nip: 'DINSOS-158',
      kategori: 'MULTIGUNA',
      waktu: '09:12 AM',
      jumlah: 'Rp 15.000.000',
      status: 'Berhasil',
      tipe: 'out', // Keluar
    },
    {
      id: 3,
      jenis: 'Pengajuan Pinjaman',
      anggota: 'Eko Prasetyo',
      nip: 'DINSOS-089',
      kategori: 'DARURAT',
      waktu: '08:05 AM',
      jumlah: 'Rp 2.500.000',
      status: 'Menunggu',
      tipe: 'pending', // Menunggu
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* HEADER SALAM */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Selamat Pagi, Budi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Berikut adalah ringkasan performa keuangan KSP Sejahtera hari ini.
        </p>
      </div>

      {/* 3 CARD RINGKASAN UTAMA (TOP ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Kas Koperasi */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-[#FABD00]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Building2 size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Kas Koperasi
            </span>
          </div>
          {/* Nominal disamakan font & inline dengan "Rp" */}
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Rp 4.280.550.000
          </div>
        </div>

        {/* Total Simpanan Anggota */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Simpanan Anggota
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Rp 2.150.320.000
          </div>
        </div>

        {/* Total Pinjaman Aktif */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden border-t-4 border-t-rose-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <HandCoins size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pinjaman Aktif
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Rp 1.845.900.000
          </div>
        </div>

      </div>

      {/* 3 CARD BREAKDOWN SIMPANAN (MIDDLE ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Simpanan Pokok */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Simpanan Pokok
              </span>
              <Building2 size={18} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              Rp 5.000.000
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Dibayarkan saat awal keanggotaan
          </p>
        </div>

        {/* Simpanan Wajib */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Simpanan Wajib
              </span>
              <PiggyBank size={18} className="text-amber-600" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              Rp 12.450.000
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total iuran bulanan rutin
          </p>
        </div>

        {/* Simpanan Sukarela */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Simpanan Sukarela
              </span>
              <Coins size={18} className="text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">
              Rp 45.782.300
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Saldo tersedia untuk ditarik
          </p>
        </div>

      </div>

      {/* TABEL AKTIVITAS TERBARU */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Header Tabel */}
        <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h3>
          <button className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer">
            <span>Lihat Semua</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Body Tabel */}
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
              {transaksiTerbaru.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Transaksi & Icon */}
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

                  {/* Anggota */}
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-slate-800">{item.anggota}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.nip}</div>
                    </div>
                  </td>

                  {/* Kategori Badge */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md tracking-wider">
                      {item.kategori}
                    </span>
                  </td>

                  {/* Waktu */}
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {item.waktu}
                  </td>

                  {/* Jumlah */}
                  <td className={`py-4 px-6 font-bold ${
                    item.tipe === 'in' 
                      ? 'text-emerald-600' 
                      : item.tipe === 'out' 
                      ? 'text-rose-600' 
                      : 'text-slate-800'
                  }`}>
                    {item.jumlah}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'Berhasil' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-amber-50 text-amber-600'
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