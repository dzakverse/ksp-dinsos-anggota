import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Info, 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  BadgeCheck, 
  Clock 
} from 'lucide-react';

export default function VerifikasiDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Handlers Aksi
  const handleApprove = () => {
    if (window.confirm('Apakah Anda yakin ingin memverifikasi dan meneruskan pengajuan ini ke Ketua?')) {
      alert('Pengajuan berhasil diverifikasi dan diteruskan ke Ketua!');
      navigate('/admin/verifikasi');
    }
  };

  const handleReject = () => {
    const alasan = prompt('Masukkan alasan penolakan pengajuan:');
    if (alasan) {
      alert(`Pengajuan telah ditolak dengan alasan: "${alasan}"`);
      navigate('/admin/verifikasi');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      
      {/* ================= NAVIGASI KEMBALI ================= */}
      <div>
        <button 
          onClick={() => navigate('/admin/verifikasi')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Antrean</span>
        </button>
      </div>

      {/* ================= HEADER PROFIL PEMOHON ================= */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          {/* Avatar Pemohon */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
              alt="Agus Setiawan" 
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
            />
            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 rounded-full p-1 border-2 border-white">
              <BadgeCheck size={12} />
            </div>
          </div>

          {/* Detail Pemohon */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agus Setiawan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              NIP: 198503122010011005 <span className="mx-1.5">•</span> Anggota Sejak 2012
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[11px] font-semibold">
              <Clock size={12} className="text-amber-600" />
              <span>Menunggu Verifikasi</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MAIN CONTENT (GRID) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI: INFORMASI PINJAMAN & SIMULASI (8 KOLOM) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD INFORMASI PINJAMAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            
            <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                INFORMASI PINJAMAN
              </h2>
              <Info size={16} className="text-slate-700" />
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              
              {/* Row Nominal & Tenor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    Nominal Pengajuan
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    Rp 25.000.000
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    Tenor
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    24 Bulan
                  </span>
                </div>
              </div>

              {/* Keperluan */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Keperluan
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Renovasi Rumah
                </span>
              </div>

              {/* Tanggal & ID Pengajuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    Tanggal Pengajuan
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    22 Oktober 2023
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    ID Pengajuan
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    #LP-2023-1022-88
                  </span>
                </div>
              </div>

              {/* Quote / Alasan Tambahan */}
              <div className="bg-blue-50/50 border-l-4 border-amber-400 rounded-r-2xl p-4 text-xs font-medium text-slate-700 italic">
                <span className="not-italic text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alasan Tambahan
                </span>
                "Ingin memperbaiki atap rumah yang bocor sebelum musim hujan."
              </div>

            </div>

          </div>

          {/* CARD SIMULASI CICILAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            
            <div className="p-4 sm:p-5 bg-blue-50/40 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                SIMULASI CICILAN
              </h2>
              <Calculator size={16} className="text-slate-700" />
            </div>

            <div className="p-5 sm:p-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/60 text-slate-400">
                    <th className="pb-3 font-semibold">Komponen</th>
                    <th className="pb-3 font-semibold text-right">Nilai (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-3 font-medium">Pokok Bulanan</td>
                    <td className="py-3 text-right font-bold">1.041.667</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-2 font-medium">Bunga (1%)</td>
                    <td className="py-3 px-2 text-right font-bold">250.000</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Biaya Administrasi</td>
                    <td className="py-3 text-right font-bold">15.000</td>
                  </tr>
                  <tr className="bg-slate-50/80 text-sm">
                    <td className="py-3.5 px-2 font-extrabold text-slate-900">Total Cicilan per Bulan</td>
                    <td className="py-3.5 px-2 text-right font-black text-slate-900 text-base">
                      1.306.667
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* KOLOM KANAN: ACTION BOX VERIFIKASI (4 KOLOM) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Header Panel Akses Yellow Bar */}
          <div className="bg-amber-400 px-5 py-3.5 flex items-center justify-between text-slate-900">
            <span className="text-xs font-black uppercase tracking-wider">VERIFIKASI</span>
            <CheckCircle2 size={18} />
          </div>

          <div className="p-5 space-y-3">
            
            {/* Tombol Setuju & Teruskan */}
            <button 
              onClick={handleApprove}
              className="w-full bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 size={16} />
              <span>Verifikasi & Teruskan ke Ketua</span>
            </button>

            {/* Tombol Tolak */}
            <button 
              onClick={handleReject}
              className="w-full bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs py-3.5 px-4 rounded-xl border border-rose-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <XCircle size={16} />
              <span>Tolak Pengajuan</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}