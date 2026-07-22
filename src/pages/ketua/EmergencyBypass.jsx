import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function EmergencyBypass() {
  // State Modal Konfirmasi Bypass
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);

  // Data Mock Emergency Queue
  const urgentData = {
    id: '#99023412',
    nama: 'Ahmad Sulaiman',
    memberSince: '2018',
    nominal: 45000000,
    tenor: 12,
    kategori: 'Kesehatan',
    tanggal: '24 Okt 2023',
    alasan: 'Pasien membutuhkan tindakan operasi jantung segera di ICU. Dana diperlukan untuk deposit rumah sakit dan biaya obat-obatan kritis yang tidak tercover asuransi dasar.',
    simulasi: {
      pokok: 3750000,
      bunga: 0,
      totalPerBulan: 3750000
    }
  };

  const handleExecuteBypass = () => {
    if (!isConfirmed) return;
    setShowBypassModal(false);
    setToastMessage(true);
    setIsConfirmed(false);

    setTimeout(() => {
      setToastMessage(false);
    }, 4500);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12 font-sans">
      
      {/* TOAST SUCCESS EXECUTION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <Zap size={22} className="text-amber-400 shrink-0 fill-amber-400" />
          <div className="text-xs">
            <p className="font-extrabold text-amber-400">EMERGENCY BYPASS BERHASIL DIEKSEKUSI!</p>
            <p className="text-slate-300 text-[11px] mt-0.5">Dana otomatis diteruskan ke antrean pencairan prioritas tinggi.</p>
          </div>
        </div>
      )}

      {/* CRITICAL OPERATIONS BANNER */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs tracking-wider uppercase">
          <AlertTriangle size={16} />
          <span>Critical Operations</span>
        </div>
        <h2 className="text-lg font-black text-slate-900">Emergency Override Command</h2>
        <p className="text-xs text-slate-500">
          Executive bypass of standard verification protocols for humanitarian contingencies.
        </p>
      </div>

      {/* GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: EMERGENCY QUEUE CARD ================= */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Header Card */}
          <div className="bg-blue-50/50 p-4 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-xs">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>Emergency Bypass Queue</span>
            </div>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              4 URGENT PENDING
            </span>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Applicant Profile */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#081028] text-white flex items-center justify-center font-bold">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{urgentData.nama}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Member since {urgentData.memberSince}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID PENGAJUAN</div>
                <div className="text-xs font-black text-slate-900">{urgentData.id}</div>
              </div>
            </div>

            {/* Details & Simulation Table */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Detail Info Left */}
              <div className="md:col-span-6 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Nominal</span>
                  <span className="font-black text-slate-900 text-sm">
                    Rp {urgentData.nominal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Tenor</span>
                  <span className="font-bold text-slate-900">{urgentData.tenor} Bulan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Kategori Keperluan</span>
                  <span className="font-bold text-slate-900">{urgentData.kategori}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Tanggal Pengajuan</span>
                  <span className="font-bold text-slate-900">{urgentData.tanggal}</span>
                </div>
              </div>

              {/* Simulation Box Right */}
              <div className="md:col-span-6 bg-blue-50/40 border border-blue-100 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                  SIMULASI CICILAN
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pokok Bulanan</span>
                  <span className="font-bold text-slate-800">
                    Rp {urgentData.simulasi.pokok.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bunga (0%)</span>
                  <span className="font-bold text-slate-800">Rp 0</span>
                </div>
                <div className="pt-2 border-t border-blue-100 flex justify-between items-center font-black">
                  <span className="text-slate-900">Total Per Bulan</span>
                  <span className="text-slate-900 text-sm">
                    Rp {urgentData.simulasi.totalPerBulan.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>

            {/* Alasan Mendetail */}
            <div className="bg-rose-50/40 border border-rose-200/60 rounded-2xl p-4 space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                ALASAN MENDETAIL
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {urgentData.alasan}
              </p>
            </div>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowBypassModal(true)}
                className="w-auto bg-[#081028] hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-xs"
              >
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                <span>Execute Immediate Bypass</span>
              </button>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: SYSTEM OVERRIDE MODE ================= */}
        <div className="lg:col-span-4 bg-[#050C1E] text-white rounded-2xl p-6 shadow-md space-y-6 relative overflow-hidden">
          
          <div className="space-y-4">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              SYSTEM OVERRIDE MODE
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse mt-1.5 shrink-0" />
              <div>
                <h3 className="text-base font-black tracking-tight text-white">Active & Authoritative</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              All bypasses are logged directly to the Strategic Oversight Board. Immediate funds disbursement is triggered upon authentication.
            </p>
          </div>

          <button 
            type="button"
            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>View Policy Guidelines</span>
            <ArrowRight size={16} />
          </button>

          {/* Watermark Icon */}
          <Lock className="absolute -bottom-6 -right-6 text-slate-800/40 w-32 h-32 pointer-events-none" />
        </div>

      </div>

      {/* ================= MODAL KONFIRMASI EMERGENCY BYPASS ================= */}
      {showBypassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Header Modal Override */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black">
                  <Zap size={22} className="fill-slate-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Konfirmasi Intervensi Bypass</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Otorisasi Eksekutif Darurat (Tingkat Tinggi)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBypassModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-4 text-xs">
              
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Pemohon:</span>
                  <strong className="text-white">{urgentData.nama} ({urgentData.id})</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Nominal Pencairan:</span>
                  <strong className="text-amber-400 text-sm">Rp {urgentData.nominal.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Kategori:</span>
                  <span className="bg-slate-800 px-2.5 py-0.5 rounded text-[10px] font-bold text-slate-200">
                    {urgentData.kategori} (Emergency)
                  </span>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 space-y-2 text-rose-900">
                <div className="flex items-center gap-2 font-black text-rose-800 text-xs">
                  <ShieldAlert size={16} />
                  <span>PERINGATAN OTORITAS KETUA</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tindakan ini melewati (bypass) seluruh tahap verifikasi bendahara dan persetujuan bertingkat standar. Dana akan langsung masuk antrean prioritas pencairan instan.
                </p>
              </div>

              {/* Checkbox Konfirmasi Tanggung Jawab */}
              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  Saya secara sadar mengonfirmasi bahwa pengajuan darurat ini telah diverifikasi validitas kemanusiaannya dan bertanggung jawab penuh atas keputusan bypass ini.
                </span>
              </label>

            </div>

            {/* Footer Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setShowBypassModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>

              <button 
                type="button"
                disabled={!isConfirmed}
                onClick={handleExecuteBypass}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isConfirmed 
                    ? 'bg-[#081028] hover:bg-slate-800 text-amber-400 shadow-md' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap size={16} className={isConfirmed ? 'fill-amber-400' : ''} />
                <span>Otorisasi & Cairkan Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}