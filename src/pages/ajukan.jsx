import React, { useState } from 'react';
import { Star, Send, Info } from 'lucide-react';

export default function Ajukan() {
  // State Form
  const [nominal, setNominal] = useState(5000000);
  const [tenor, setTenor] = useState(12);
  const [keperluan, setKeperluan] = useState('Biaya Pendidikan');
  const [keterangan, setKeterangan] = useState('');

  // Konstanta Perhitungan
  const limitMaksimal = 15000000;
  const bungaRate = 0.01; // 1%
  const biayaAdminRate = 0.01; // 1%

  // Kalkulasi Otomatis
  const nominalNum = Number(nominal) || 0;
  const biayaAdmin = nominalNum * biayaAdminRate;
  const uangDiterima = nominalNum - biayaAdmin;
  const angsuranPokok = tenor > 0 ? nominalNum / tenor : 0;
  const jasaKoperasi = nominalNum * bungaRate;
  const totalCicilanBulanan = angsuranPokok + jasaKoperasi;

  // Format Rupiah
  const formatRupiah = (num) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  const handleNominalChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Hanya angka
    if (value === '') {
      setNominal('');
    } else {
      setNominal(Number(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pengajuan berhasil dikirim!\nNominal: ${formatRupiah(nominalNum)}\nTenor: ${tenor} Bulan\nKeperluan: ${keperluan}`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. BANNER LIMIT PINJAMAN */}
      <div className="bg-[#000D21] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Accent Blur */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <div className="p-1 bg-white/10 rounded-full">
              <Star size={14} className="fill-white text-white" />
            </div>
            <span>Limit Pinjaman</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
            {formatRupiah(limitMaksimal)}
          </h2>
        </div>

        {/* Badge Bunga */}
        <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold text-white">
          Bunga 1% / bulan
        </div>
      </div>

      {/* 2. GRID KONTEN FORM (KIRI) & RINGKASAN (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM DETAIL PENGAJUAN PINJAMAN (2 KOLOM) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          
          {/* Breadcrumb Mini */}
          <div className="text-xs font-semibold text-slate-400 mb-1">
            Pinjaman &rsaquo; <span className="text-slate-600">Pengajuan Pinjaman</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Detail Pengajuan Pinjaman
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nominal Pinjaman */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Nominal Pinjaman
              </label>
              <input
                type="text"
                value={nominal}
                onChange={handleNominalChange}
                placeholder="Masukkan nominal pinjaman"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Minimal: Rp 500.000 &bull; Maksimal: {formatRupiah(limitMaksimal)}
              </p>
            </div>

            {/* Opsi Tenor / Jangka Waktu */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Tenor / Jangka Waktu
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[3, 6, 12, 24, 36].slice(0, 4).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                      tenor === t
                        ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Keperluan Pinjaman (REVISI: DROPDOWN PILIHAN UMUM) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Keperluan Pinjaman
              </label>
              <select
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Biaya Pendidikan">Biaya Pendidikan</option>
                <option value="Renovasi Rumah">Renovasi Rumah</option>
                <option value="Modal Usaha">Modal Usaha</option>
                <option value="Pengobatan / Kesehatan">Pengobatan / Kesehatan</option>
                <option value="Pembelian Kendaraan">Pembelian Kendaraan</option>
                <option value="Kebutuhan Mendesak / Lainnya">Kebutuhan Mendesak / Lainnya</option>
              </select>
            </div>

            {/* Input Alasan / Keterangan Tambahan */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Alasan / Keterangan Tambahan
              </label>
              <textarea
                rows={4}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Biaya pendaftaran masuk sekolah anak"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            {/* Tombol Kirim Pengajuan */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Send size={16} />
              <span>Kirim Pengajuan</span>
            </button>
          </form>

        </div>

        {/* KOLOM KANAN: RINGKASAN & DETAIL PINJAMAN */}
        <div className="space-y-6">
          
          {/* Card Ringkasan Pinjaman */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-base font-bold text-slate-800">Ringkasan Pinjaman</h4>
            <p className="text-xs text-slate-400 mt-0.5">Simulasi angsuran bulanan</p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Uang yang Diterima</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {formatRupiah(uangDiterima)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Angsuran Pokok / Bulan</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {formatRupiah(angsuranPokok)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Jasa Koperasi (1%)</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {formatRupiah(jasaKoperasi)}
                </p>
              </div>
            </div>

            {/* Card Highlight Total Cicilan Bulanan */}
            <div className="mt-6 bg-[#FABD00] text-white p-4 rounded-xl shadow-sm">
              <p className="text-[10px] uppercase font-bold tracking-wider text-white-200">
                Total Cicilan Bulanan
              </p>
              <p className="text-2xl font-extrabold tracking-tight mt-1">
                {formatRupiah(totalCicilanBulanan)}
              </p>
            </div>

            {/* Catatan Biaya Administrasi */}
            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-medium leading-relaxed">
              Biaya administrasi 1% ({formatRupiah(biayaAdmin)}) akan dipotong langsung dari nominal pinjaman.
            </div>
          </div>

          {/* Card Detail Pinjaman (Rangkuman Bawah) */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Detail Pinjaman
            </h5>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Nominal</span>
              <span className="font-bold text-slate-800">{formatRupiah(nominalNum)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Tenor</span>
              <span className="font-bold text-slate-800">{tenor} Bulan</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Keperluan</span>
              <span className="font-bold text-slate-800">{keperluan}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}