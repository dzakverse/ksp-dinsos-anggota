import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function DataAnggota() {
    const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data Anggota Dummy sesuai UI
  const anggotaData = [
    {
      id: 1,
      nama: 'Budi Santoso, S.Sos',
      nip: '19850612 201001 1 004',
      unitKerja: 'Sekretariat',
      simpPokok: 'Rp 500.000',
      simpWajib: 'Rp 2.400.000',
      simpSukarela: 'Rp 1.250.000',
      totalSaldo: 'Rp 4.150.000',
    },
    {
      id: 2,
      nama: 'Siti Aminah, M.Si',
      nip: '19900325 201503 2 001',
      unitKerja: 'Rehabilitasi Sosial',
      simpPokok: 'Rp 500.000',
      simpWajib: 'Rp 1.800.000',
      simpSukarela: 'Rp 8.400.000',
      totalSaldo: 'Rp 10.700.000',
    },
    {
      id: 3,
      nama: 'Dr. Ahmad Hidayat',
      nip: '19781102 200501 1 002',
      unitKerja: 'Pemberdayaan Sosial',
      simpPokok: 'Rp 500.000',
      simpWajib: 'Rp 3.600.000',
      simpSukarela: 'Rp 15.200.000',
      totalSaldo: 'Rp 19.300.000',
    },
    {
      id: 4,
      nama: 'Rina Wijaya, A.Md',
      nip: '19950718 201903 2 010',
      unitKerja: 'Linjamsos',
      simpPokok: 'Rp 500.000',
      simpWajib: 'Rp 600.000',
      simpSukarela: 'Rp 250.000',
      totalSaldo: 'Rp 1.350.000',
    },
    {
      id: 5,
      nama: 'Eko Prasetyo',
      nip: '19821230 200801 1 005',
      unitKerja: 'Sekretariat',
      simpPokok: 'Rp 500.000',
      simpWajib: 'Rp 2.800.000',
      simpSukarela: 'Rp 4.500.000',
      totalSaldo: 'Rp 7.800.000',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER PAGE ================= */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Simpanan & Transaksi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manajemen data simpanan anggota dan riwayat transaksi koperasi Dinas Sosial.
        </p>
      </div>

      {/* ================= CARDS STATISTIK ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Total Saldo (2 kolom di desktop) */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            TOTAL SALDO TERKUMPUL
          </span>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Rp4.250.800.000
          </div>
        </div>

        {/* Card Anggota Aktif */}
        <div className="bg-[#0A1128] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ANGGOTA AKTIF
            </span>
            <div className="text-2xl font-black text-white tracking-tight mt-1">
              1,248 Pegawai
            </div>
          </div>

          {/* Avatar Stack */}
          <div className="flex items-center gap-2 mt-4 pt-2">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0A1128] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Avatar" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0A1128] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Avatar" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0A1128] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Avatar" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">+1.2k</span>
          </div>
        </div>

      </div>

      {/* ================= SEARCH & CONTENT CONTAINER ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        
        {/* Search Bar Baris Atas */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari Nama atau NIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
            />
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            Menampilkan <span className="font-bold text-slate-700">1 - 10</span> dari <span className="font-bold text-slate-700">1,248</span> Anggota
          </div>
        </div>

        {/* Tabel Data Anggota */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 bg-slate-50/50">
                <th className="py-3.5 px-6">Nama Pegawai / NIP</th>
                <th className="py-3.5 px-6">Unit Kerja</th>
                <th className="py-3.5 px-6">Simp. Pokok</th>
                <th className="py-3.5 px-6">Simp. Wajib</th>
                <th className="py-3.5 px-6">Simp. Sukarela</th>
                <th className="py-3.5 px-6 font-extrabold text-slate-800">Total Saldo</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {anggotaData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Nama & NIP */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 leading-snug">{item.nama}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.nip}</div>
                  </td>
                  
                  {/* Unit Kerja */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.unitKerja}
                  </td>
                  
                  {/* Simpanan Pokok */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.simpPokok}
                  </td>

                  {/* Simpanan Wajib */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.simpWajib}
                  </td>

                  {/* Simpanan Sukarela */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.simpSukarela}
                  </td>

                  {/* Total Saldo */}
                  <td className="py-4 px-6 font-black text-slate-900">
                    {item.totalSaldo}
                  </td>

                  {/* Aksi (Tombol Detail) */}
                  <td className="py-4 px-6 text-center">
                    <button 
                        onClick={() => navigate(`/admin/anggota/${item.id}`)}
                        className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Lihat Detail Simpanan"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/30">
          
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="relative">
              <select 
                value={rowsPerPage} 
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="appearance-none bg-transparent font-bold text-slate-800 pr-5 cursor-pointer outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            <button className="p-1 text-slate-400 hover:text-slate-700 cursor-not-allowed" disabled>
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1 font-semibold">
              <button className="w-7 h-7 bg-[#0A1128] text-white rounded-lg flex items-center justify-center text-xs">1</button>
              <button className="w-7 h-7 hover:bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-600">2</button>
              <button className="w-7 h-7 hover:bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-600">3</button>
              <span className="px-1 text-slate-300">...</span>
              <button className="w-7 h-7 hover:bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-600">125</button>
            </div>

            <button className="p-1 text-slate-700 hover:text-blue-600 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}