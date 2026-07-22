import React, { useState } from 'react';
import { 
  Wallet, 
  Percent, 
  PiggyBank, 
  Info, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Clock
} from 'lucide-react';

export default function KendaliKebijakan() {
  // State Parameter Kebijakan
  const [maxLoan, setMaxLoan] = useState('50000000');
  const [interestRate, setInterestRate] = useState('2.5');
  const [mandatorySavings, setMandatorySavings] = useState('250000');

  // State Modal Konfirmasi
  const [activeModal, setActiveModal] = useState(null); // 'loan' | 'interest' | 'savings' | null
  const [notes, setNotes] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  // Data Nilai Lama (Current Values)
  const currentValues = {
    loan: { val: 'Rp 45,000,000', updated: 'Chairman on Oct 12, 2023' },
    interest: { pending: '2.8% on Jan 1st, 2024' },
    savings: { val: 'Rp 200,000', updated: 'Chairman on Aug 05, 2023' }
  };

  // Helper Format Rupiah Input
  const formatRupiah = (val) => {
    if (!val) return '';
    return parseInt(val.replace(/\D/g, ''), 10).toLocaleString('id-ID');
  };

  // Handle Eksekusi Update Kebijakan
  const handleConfirmUpdate = () => {
    // Logika simpan perubahan ke database / state di sini
    setActiveModal(null);
    setNotes('');
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      
      {/* TOAST SUCCESS NOTIFICATION */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-amber-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Kebijakan Finansial Berhasil Diperbarui!</p>
            <p className="text-slate-400 text-[11px]">Parameter sistem telah disesuaikan.</p>
          </div>
        </div>
      )}

      {/* HEADER & BREADCRUMB */}
      <div>
        <nav className="text-[11px] font-bold text-slate-400 tracking-wide mb-1">
          Dashboard &gt; Financial System &gt; <span className="text-slate-800">Policy Parameters</span>
        </nav>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengatur Kebijakan Finansial
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          Update global financial parameters for the Cooperative system.
        </p>
      </div>

      {/* ================= CARD 1: MAXIMUM LOAN LIMIT ================= */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Maximum Loan Limit</h2>
              <p className="text-xs text-slate-500">Defines the ceiling for individual member borrowing.</p>
            </div>
          </div>
          <button title="Informasi Batas Pinjaman" className="text-slate-400 hover:text-slate-600">
            <Info size={18} />
          </button>
        </div>

        {/* INPUT & BUTTON ROW */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">New Limit Amount (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-900">Rp</span>
              <input 
                type="text"
                value={formatRupiah(maxLoan)}
                onChange={(e) => setMaxLoan(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="md:col-span-4 md:self-end">
            <button 
              type="button"
              onClick={() => setActiveModal('loan')}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={16} />
              <span>Update Now</span>
            </button>
          </div>
        </div>

        {/* FOOTER KETERANGAN */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Current value: <strong className="text-slate-800">{currentValues.loan.val}</strong> updated by {currentValues.loan.updated}.</span>
        </div>

      </div>

      {/* ================= CARD 2: INTEREST RATE (%) ================= */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <Percent size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Interest Rate (%)</h2>
              <p className="text-xs text-slate-500">Annual percentage rate applied to all active loans.</p>
            </div>
          </div>
          <button title="Informasi Bunga Pinjaman" className="text-slate-400 hover:text-slate-600">
            <Info size={18} />
          </button>
        </div>

        {/* INPUT & BUTTON ROW */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Target Interest Rate (%)</label>
            <div className="relative">
              <input 
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-700">%</span>
            </div>
          </div>

          <div className="md:col-span-4 md:self-end">
            <button 
              type="button"
              onClick={() => setActiveModal('interest')}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={16} />
              <span>Update Now</span>
            </button>
          </div>
        </div>

        {/* FOOTER KETERANGAN */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-amber-700">
          <Clock size={16} className="text-amber-500 shrink-0" />
          <span>Pending scheduled change to <strong className="font-bold">{currentValues.interest.pending}</strong>.</span>
        </div>

      </div>

      {/* ================= CARD 3: MANDATORY SAVINGS AMOUNT ================= */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <PiggyBank size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Mandatory Savings Amount</h2>
              <p className="text-xs text-slate-500">Monthly required deposit for every cooperative member.</p>
            </div>
          </div>
          <button title="Informasi Simpanan Wajib" className="text-slate-400 hover:text-slate-600">
            <Info size={18} />
          </button>
        </div>

        {/* INPUT & BUTTON ROW */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">New Monthly Amount (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-900">Rp</span>
              <input 
                type="text"
                value={formatRupiah(mandatorySavings)}
                onChange={(e) => setMandatorySavings(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="md:col-span-4 md:self-end">
            <button 
              type="button"
              onClick={() => setActiveModal('savings')}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={16} />
              <span>Update Now</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODAL KONFIRMASI UPDATE ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konfirmasi Pembaruan Kebijakan</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Perubahan ini akan langsung berdampak pada seluruh sistem.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Keterangan Ringkasan */}
            <div className="py-5 space-y-4">
              
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Parameter yang diubah:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {activeModal === 'loan' && 'Maximum Loan Limit'}
                    {activeModal === 'interest' && 'Interest Rate (%)'}
                    {activeModal === 'savings' && 'Mandatory Savings Amount'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Nilai Sebelumnya:</span>
                  <span className="font-semibold text-rose-600 line-through">
                    {activeModal === 'loan' && currentValues.loan.val}
                    {activeModal === 'interest' && '2.0%'}
                    {activeModal === 'savings' && currentValues.savings.val}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nilai Baru Kebijakan:</span>
                  <span className="font-black text-emerald-600 text-sm">
                    {activeModal === 'loan' && `Rp ${formatRupiah(maxLoan)}`}
                    {activeModal === 'interest' && `${interestRate}%`}
                    {activeModal === 'savings' && `Rp ${formatRupiah(mandatorySavings)}`}
                  </span>
                </div>
              </div>

              {/* Catatan / Alasan Perubahan */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Catatan Perubahan / Alasan (Opsional)
                </label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Penyesuaian kebijakan berdasarkan hasil Rapat Anggota Tahunan (RAT) 2026..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white resize-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
                <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Perubahan ini akan dicatat secara otomatis ke dalam <strong>Audit Log Tracker</strong> beserta timestamp dan profil Ketua.
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button 
                type="button"
                onClick={handleConfirmUpdate}
                className="px-5 py-2.5 rounded-xl bg-[#081028] hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 size={16} />
                <span>Konfirmasi & Terapkan</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}