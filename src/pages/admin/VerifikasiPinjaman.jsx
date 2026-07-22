import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  RotateCcw, 
  FileText, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function VerifikasiPinjaman() {
  const navigate = useNavigate();
  // State Filter
  const [filterStatus, setFilterStatus] = useState('Menunggu Verifikasi');
  const [rentangTanggal, setRentangTanggal] = useState('');
  const [urutan, setUrutan] = useState('Terbaru');

  // Dummy Data Daftar Antrean Pengajuan
  const antreanData = [
    {
      id: 1,
      nama: 'Agus Setiawan',
      nip: '198501012010011005',
      nominal: 'Rp 25.000.000',
      tenor: '24 bln',
      keperluan: 'Renovasi Rumah',
      tglPengajuan: '22 Okt 2023',
      status: 'Antre',
    },
    {
      id: 2,
      nama: 'Budi Mansyur',
      nip: '197805122005011002',
      nominal: 'Rp 10.000.000',
      tenor: '12 bln',
      keperluan: 'Biaya Pendidikan',
      tglPengajuan: '23 Okt 2023',
      status: 'Antre',
    },
    {
      id: 3,
      nama: 'Dewi Ratnasari',
      nip: '199203152018012001',
      nominal: 'Rp 50.000.000',
      tenor: '48 bln',
      keperluan: 'Kendaraan Pribadi',
      tglPengajuan: '23 Okt 2023',
      status: 'Antre',
    },
    {
      id: 4,
      nama: 'Hendra Adi',
      nip: '198911042012031002',
      nominal: 'Rp 5.000.000',
      tenor: '6 bln',
      keperluan: 'Kebutuhan Mendesak',
      tglPengajuan: '24 Okt 2023',
      status: 'Antre',
    },
  ];

  // Dummy Data Riwayat
  const riwayatData = [
    {
      id: 'DS-4412',
      nama: 'Siti Aminah',
      jumlah: 'Rp 15.000.000',
      tglProses: '14 Juli 2026',
      tipe: 'Bypass',
      status: 'DISETUJUI',
    },
    {
      id: 'DS-3321',
      nama: 'Ahmad Subarjo',
      jumlah: 'Rp 8.000.000',
      tglProses: '12 Juli 2026',
      tipe: 'Regular',
      status: 'DITOLAK',
    },
    {
      id: 'DS-1109',
      nama: 'Dewi Lestari',
      jumlah: 'Rp 5.000.000',
      tglProses: '10 Juli 2026',
      tipe: 'Regular',
      status: 'DISETUJUI',
    },
  ];

  const handleResetFilter = () => {
    setFilterStatus('Menunggu Verifikasi');
    setRentangTanggal('');
    setUrutan('Terbaru');
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER & CARD LIVE ANTREAN ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verifikasi Pinjaman</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola dan tinjau antrean pengajuan pinjaman anggota koperasi hari ini.
          </p>
        </div>

        {/* Card Antrean Saat Ini */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-6 min-w-[280px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ANTREAN SAAT INI</span>
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">12</span>
              <span className="text-xs font-bold text-amber-600">Pengajuan<br/><span className="font-normal text-[10px] text-slate-400">Menunggu Verifikasi</span></span>
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* ================= FILTER SECTION ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-end gap-4">
        
        {/* Filter Status */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Filter Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-medium"
          >
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        {/* Rentang Tanggal */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Rentang Tanggal</label>
          <input 
            type="date" 
            value={rentangTanggal}
            onChange={(e) => setRentangTanggal(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-medium"
          />
        </div>

        {/* Urutkan Berdasarkan */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutkan Berdasarkan</label>
          <select 
            value={urutan}
            onChange={(e) => setUrutan(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-medium"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
            <option value="Nominal Tertinggi">Nominal Tertinggi</option>
          </select>
        </div>

        {/* Tombol Reset */}
        <button 
          onClick={handleResetFilter}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* ================= DAFTAR ANTREAN PENGAJUAN ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">DAFTAR ANTREAN PENGAJUAN</h2>
          <span className="text-[11px] text-slate-400 font-medium">Menampilkan 12 dari 45 pengajuan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3 px-6">NAMA ANGGOTA</th>
                <th className="py-3 px-6">NIP</th>
                <th className="py-3 px-6">NOMINAL</th>
                <th className="py-3 px-6">TENOR</th>
                <th className="py-3 px-6">KEPERLUAN</th>
                <th className="py-3 px-6">TGL PENGAJUAN</th>
                <th className="py-3 px-6">STATUS</th>
                <th className="py-3 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {antreanData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* NAMA ANGGOTA (Sederhana tanpa avatar) */}
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {item.nama}
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{item.nip}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{item.nominal}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{item.tenor}</td>
                  
                  {/* KEPERLUAN (Hanya teks biasa tanpa background) */}
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {item.keperluan}
                  </td>

                  <td className="py-4 px-6 text-slate-500 font-medium">{item.tglPengajuan}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {item.status}
                    </span>
                  </td>``
                  <td className="py-4 px-6 text-center">
                    <button 
                        type='button'
                        onClick={() => navigate(`/admin/verifikasi/${item.id}`)}
                        className="text-slate-800 hover:text-blue-600 font-bold text-xs hover:underline cursor-pointer">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
          <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium cursor-not-allowed" disabled>
            <ChevronLeft size={16} />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1 font-semibold">
            <button className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center">1</button>
            <button className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center">2</button>
            <button className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center">3</button>
            <span className="px-1 text-slate-300">...</span>
            <button className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center">8</button>
          </div>

          <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-bold cursor-pointer">
            <span>Berikutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ================= RIWAYAT SECTION ================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-slate-700" />
          <h2 className="text-base font-bold text-slate-800">Riwayat</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-blue-50/40">
                  <th className="py-3 px-6">NAMA ANGGOTA</th>
                  <th className="py-3 px-6">JUMLAH</th>
                  <th className="py-3 px-6">TANGGAL PROSES</th>
                  <th className="py-3 px-6">TIPE</th>
                  <th className="py-3 px-6 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {riwayatData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* NAMA ANGGOTA RIWAYAT (Sederhana tanpa ID/NIP) */}
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {item.nama}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{item.jumlah}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{item.tglProses}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                        item.tipe === 'Bypass' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.tipe}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider ${
                        item.status === 'DISETUJUI' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-rose-600 text-white'
                      }`}>
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

      {/* ================= FOOTER INFO (PROSEDUR & KAPASITAS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Card Prosedur Verifikasi */}
        <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 shrink-0 shadow-xs">
            <FileText size={20} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-800">Prosedur Verifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pastikan formulir Pengajuan telah sesuai dengan data yang diinputkan oleh anggota sebelum memberikan persetujuan.
            </p>
            <a 
              href="#download" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 underline pt-1 transition-colors"
            >
              <span>Unduh SOP Verifikasi (PDF)</span>
            </a>
          </div>
        </div>

        {/* Card Kapasitas Pencairan */}
        <div className="bg-[#0A1128] text-white rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="space-y-1">
            <h3 className="font-bold text-base tracking-tight">Kapasitas Pencairan</h3>
            <p className="text-xs text-slate-400">
              Saldo koperasi saat ini mencukupi untuk memenuhi seluruh antrean pengajuan.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '75%' }}></div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-1">
              <span>Digunakan: Rp 450M</span>
              <span className="text-slate-300 font-semibold">Tersedia: Rp 600M</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}