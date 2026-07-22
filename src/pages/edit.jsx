import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Save, ShieldAlert } from 'lucide-react';

export default function EditProfil() {
  const navigate = useNavigate();

  // State Form Editable
  const [alamat, setAlamat] = useState('Jl. Gatot Subroto No. 124, Lengkong, Bandung');
  const [whatsapp, setWhatsapp] = useState('81234567890');
  const [email, setEmail] = useState('budi.santoso@email.com');
  const [fotoPreview, setFotoPreview] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );

  // Data Terkunci (Read-only)
  const dataTerkunci = {
    nik: '3273012903910004',
    nip: '19910329-001-KSP',
    ttl: 'Bandung, 29 Maret 1991',
    jenisKelamin: 'Laki-Laki',
    tanggalBergabung: '15 Januari 2021',
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    alert('Perubahan profil berhasil disimpan!');
    navigate('/profil');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Breadcrumb Navigation Mini */}
      <div className="text-xs font-semibold text-slate-400">
        Profil &rsaquo; <span className="text-slate-600">Edit Profil Anggota</span>
      </div>

      {/* GRID UTAMA (KIRI FORM, KANAN FOTO & WARNING) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KOLOM KIRI (2 KOLOM): INFORMASI UTAMA & FORM EDIT */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CARD 1: INFORMASI UTAMA (DISABLED / READ ONLY) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Informasi Utama</h3>
                <p className="text-xs text-slate-400">Hubungi Admin untuk perubahan data utama</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* NIK */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  NIK (KTP)
                </label>
                <input
                  type="text"
                  disabled
                  value={dataTerkunci.nik}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* NIP */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  NIP
                </label>
                <input
                  type="text"
                  disabled
                  value={dataTerkunci.nip}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* TTL */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tempat / Tanggal Lahir
                </label>
                <input
                  type="text"
                  disabled
                  value={dataTerkunci.ttl}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Jenis Kelamin
                </label>
                <input
                  type="text"
                  disabled
                  value={dataTerkunci.jenisKelamin}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* Tanggal Bergabung */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tanggal Bergabung
                </label>
                <input
                  type="text"
                  disabled
                  value={dataTerkunci.tanggalBergabung}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: INFORMASI KONTAK & DOMISILI (EDITABLE) */}
          <form onSubmit={handleSimpan} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21]">
            <h3 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100 mb-6">
              Informasi Kontak & Domisili
            </h3>

            <div className="space-y-5">
              {/* Alamat Domisili */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Alamat Domisili
                </label>
                <textarea
                  rows={3}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nomor WhatsApp
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                  <span className="bg-slate-100 px-4 py-3 text-slate-600 text-sm font-bold flex items-center border-r border-slate-200">
                    +62
                  </span>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Aktif */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Aktif
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Tombol Action (Batal & Simpan) */}
            <div className="pt-8 mt-6 flex items-center justify-start gap-3">
              <Link
                to="/profil"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>

        </div>

        {/* KOLOM KANAN (1 KOLOM): FOTO PROFIL & ALERT WARNING */}
        <div className="space-y-6">
          
          {/* Card Foto Profil Anggota */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 border-t-4 border-t-[#000D21] text-center flex flex-col items-center">
            <h4 className="text-base font-bold text-slate-800 mb-6">
              Foto Profil Anggota
            </h4>

            {/* Frame Circle Photo */}
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-inner overflow-hidden mb-6">
              <img
                src={fotoPreview}
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tombol Pilih Foto */}
            <label className="w-full py-3 bg-amber-500 hover:bg-amber-650 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer block">
              Pilih Foto Baru
              <input type="file" className="hidden" accept="image/*" />
            </label>

            <p className="text-[11px] text-white-400 font-medium mt-3">
              Format JPG, PNG. Ukuran maks. 2MB.
            </p>
          </div>

          {/* Card Alert Warning Data Terkunci */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3 text-amber-900">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Data yang terkunci hanya dapat diubah melalui Admin KSP Sejahtera. Hubungi kantor untuk informasi lebih lanjut.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}