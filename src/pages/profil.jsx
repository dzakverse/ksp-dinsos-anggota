import React from 'react';
import { Link } from 'react-router-dom';

import { 
  ShieldCheck, 
  Pencil, 
  Lock, 
  MessageSquare, 
  Mail, 
  Award, 
  Contact 
} from 'lucide-react';

export default function Profil() {
  const dataAnggota = {
    nama: "Budi Santoso",
    idAnggota: "ANG-2024-001",
    status: "Anggota Aktif",
    nik: "3273012903910004",
    nip: "19910329-001-KSP",
    ttl: "Bandung, 29 Maret 1991",
    jenisKelamin: "Laki-Laki",
    alamat: "Jl. Gatot Subroto No. 124, Lengkong, Bandung",
    whatsapp: "+62 812-3456-7890",
    email: "budi.santoso@email.com",
    terdaftarSejak: "15 Januari 2021",
    idKeanggotaan: "KSP-2024-0891",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. CARD PROFIL UTAMA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-t-4 border-t-[#000D21] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Kolom Kanan / Foto Profil & Action */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <img 
                src={dataAnggota.foto} 
                alt={dataAnggota.nama} 
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-slate-100 shadow-inner"
              />
            </div>
            
            {/* Badge Status */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
              <ShieldCheck size={14} />
              {dataAnggota.status}
            </span>
          </div>

          {/* Kolom Kiri / Detail Informasi Anggota */}
          <div className="flex-1 w-full">
            {/* Header Nama & Tombol Edit Profil */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  {dataAnggota.nama}
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wider uppercase">
                  {dataAnggota.idAnggota}
                </p>
              </div>

              <Link to="/edit" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0">
                <Pencil size={14} />
                Edit Profil
              </Link>
            </div>

            {/* Grid Detail Data Diri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 pt-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Nomor Induk Kependudukan
                </p>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {dataAnggota.nik}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Nomor Induk Pegawai
                </p>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {dataAnggota.nip}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tempat, Tanggal Lahir
                </p>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {dataAnggota.ttl}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Jenis Kelamin
                </p>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {dataAnggota.jenisKelamin}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Alamat Domisili
                </p>
                <p className="text-base font-bold text-slate-800 mt-1 leading-relaxed">
                  {dataAnggota.alamat}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. SECTION BARIS BAWAH (KONTAK & KEANGGOTAAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card Kontak & Rekening (2 Kolom) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21] flex flex-col justify-between">
          <div>
            {/* Judul Card */}
            <div className="flex items-center gap-2 pb-6">
              <Contact size={20} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Kontak & Rekening
              </h3>
            </div>

            {/* Item Whatsapp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-2.5 bg-emerald-100/70 text-emerald-600 rounded-lg">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Whatsapp
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {dataAnggota.whatsapp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-2.5 bg-blue-100/70 text-blue-600 rounded-lg">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {dataAnggota.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Ubah Kata Sandi */}
          <div className="mt-8 flex justify-center">
            <Link to="/sandi" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
              <Lock size={14} />
              Ubah Kata Sandi
            </Link>
          </div>
        </div>

        {/* Card Keanggotaan (Biru Gradasi) */}
        <div className="bg-[#000D21] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          {/* Accent Lingkaran Background */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 text-blue-100 text-xs font-bold uppercase tracking-wider mb-6">
              <Award size={18} />
              <span>Keanggotaan</span>
            </div>

            <div>
              <p className="text-xs text-blue-200 font-medium">Terdaftar Sejak</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">
                {dataAnggota.terdaftarSejak}
              </h3>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-xs text-blue-200 font-medium">ID Keanggotaan</p>
            <p className="text-base font-bold tracking-wider mt-0.5">
              {dataAnggota.idKeanggotaan}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}