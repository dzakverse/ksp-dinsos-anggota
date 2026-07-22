import React from 'react';
import { Link } from 'react-router-dom';

import { 
  ShieldCheck, 
  BarChart3, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Pinjaman() {
  // Data dummy riwayat pengajuan pinjaman
  const riwayatPinjaman = [
    {
      id: 1,
      tanggal: "28 Jun 2026",
      nominal: "Rp 5.000.000",
      tenor: "12 Bulan",
      status: "Aktif",
      badgeType: "success",
    },
    {
      id: 2,
      tanggal: "15 Mar 2026",
      nominal: "Rp 3.000.000",
      tenor: "6 Bulan",
      status: "Menunggu Verifikasi",
      badgeType: "warning",
    },
    {
      id: 3,
      tanggal: "02 Jan 2026",
      nominal: "Rp 10.000.000",
      tenor: "24 Bulan",
      status: "Menunggu Persetujuan",
      badgeType: "info",
    },
    {
      id: 4,
      tanggal: "18 Okt 2025",
      nominal: "Rp 2.000.000",
      tenor: "6 Bulan",
      status: "Ditolak",
      badgeType: "danger",
    },
  ];

  // Helper function untuk merender badge status dengan warna spesifik
  const renderStatusBadge = (status, badgeType) => {
    switch (badgeType) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={13} className="fill-emerald-600 text-white" />
            {status}
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            <Clock size={13} />
            {status}
          </span>
        );
      case "info":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            <Clock size={13} />
            {status}
          </span>
        );
      case "danger":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <XCircle size={13} />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SECTION BARIS ATAS (CARD STATUS & TOMBOL AJUKAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card Pinjaman Aktif (2 Kolom di Layar Besar) */}
        <div className="lg:col-span-2 bg-[#000D21] rounded-3xl p-7 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          {/* Hiasan background abstrak */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Pinjaman Aktif</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight my-3">
              Rp 5.000.000
            </h2>
          </div>

          {/* Rincian Tenor, Angsuran, & Sisa Pinjaman */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-4 mt-4 text-left">
            <div>
              <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Tenor</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">12 Bulan</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Angsuran / Bulan</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">Rp 458.333</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">Sisa Pinjaman</p>
              <p className="text-sm sm:text-base font-bold mt-0.5">Rp 4.125.000</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Total Pinjaman & Tombol Ajukan (1 Kolom) */}
        <div className="flex flex-col gap-4">
          {/* Card Total Pinjaman */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Pinjaman
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">
                4 Pengajuan
              </h3>
            </div>
          </div>

          {/* Tombol Ajukan Pinjaman */}
          <Link
            to="/ajukan" className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
            <PlusCircle size={20} />
            <span>Ajukan Pinjaman</span> 
          </Link>
        </div>

      </div>

      {/* 2. SECTION TABEL RIWAYAT PINJAMAN */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Pinjaman</h3>
          <p className="text-xs text-slate-400 mt-1">Seluruh riwayat pengajuan pinjaman Anda</p>
        </div>

        {/* Pembungkus Tabel */}
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
              {riwayatPinjaman.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Tanggal */}
                  <td className="p-4 pl-6 text-sm text-slate-600 font-medium whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  {/* Nominal */}
                  <td className="p-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                    {item.nominal}
                  </td>
                  {/* Tenor */}
                  <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                    {item.tenor}
                  </td>
                  {/* Status Badge */}
                  <td className="p-4 pr-6 whitespace-nowrap">
                    {renderStatusBadge(item.status, item.badgeType)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-400 font-medium">
            Menampilkan 1-4 dari 4 pinjaman
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