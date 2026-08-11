import { useEffect, useState } from 'react';
import {
  Wallet,
  Percent,
  PiggyBank,
  Info,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRightLeft,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

export default function KendaliKebijakan() {
  const [kebijakan, setKebijakan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [maxLoan, setMaxLoan] = useState('0');
  const [interestRate, setInterestRate] = useState('0');
  const [mandatorySavings, setMandatorySavings] = useState('0');
  const [minimalTopup, setMinimalTopup] = useState('30');

  const [activeModal, setActiveModal] = useState(null); // 'loan' | 'interest' | 'savings' | 'topup' | null
  const [notes, setNotes] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const loadKebijakan = () => {
    setLoading(true);
    api.get('/ketua/kebijakan')
      .then((res) => {
        setKebijakan(res.data);
        setMaxLoan(String(Math.round(res.data.plafon_maksimal)));
        setInterestRate(String(res.data.suku_bunga_persen));
        setMandatorySavings(String(Math.round(res.data.simpanan_wajib_nominal)));
        setMinimalTopup(String(res.data.minimal_progress_topup_persen));
      })
      .catch(() => setError('Gagal memuat kebijakan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadKebijakan(); }, []);

  const formatRupiahInput = (val) => {
    if (!val) return '';
    return parseInt(val.replace(/\D/g, ''), 10).toLocaleString('id-ID');
  };

  const handleConfirmUpdate = async () => {
    setSaving(true);
    try {
      const payload = { catatan_terakhir: notes || undefined };
      if (activeModal === 'loan') payload.plafon_maksimal = Number(maxLoan);
      if (activeModal === 'interest') payload.suku_bunga_persen = Number(interestRate);
      if (activeModal === 'savings') payload.simpanan_wajib_nominal = Number(mandatorySavings);
      if (activeModal === 'topup') payload.minimal_progress_topup_persen = Number(minimalTopup);

      const { data } = await api.put('/ketua/kebijakan', payload);
      setKebijakan(data);
      setActiveModal(null);
      setNotes('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch {
      alert('Gagal memperbarui kebijakan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  const lastUpdatedLabel = kebijakan.updated_by
    ? `${kebijakan.updated_by.nama} pada ${formatTanggal(kebijakan.updated_at)}`
    : 'Belum pernah diubah';

  return (
    <div className="space-y-6 max-w-5xl pb-12">

      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-amber-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Kebijakan Finansial Berhasil Diperbarui!</p>
            <p className="text-slate-400 text-[11px]">Parameter sistem telah disesuaikan.</p>
          </div>
        </div>
      )}

      <div>
        <nav className="text-[11px] font-bold text-slate-400 tracking-wide mb-1">
          Dashboard &gt; Financial System &gt; <span className="text-slate-800">Policy Parameters</span>
        </nav>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengatur Kebijakan Finansial
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          Parameter global yang berlaku untuk seluruh sistem koperasi.
        </p>
      </div>

      {/* CARD 1: MAX LOAN LIMIT */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Plafon Maksimal Pinjaman</h2>
              <p className="text-xs text-slate-500">Batas atas pengajuan pinjaman per anggota.</p>
            </div>
          </div>
          <Info size={18} className="text-slate-400" />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Nilai Plafon Baru (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-900">Rp</span>
              <input
                type="text"
                value={formatRupiahInput(maxLoan)}
                onChange={(e) => setMaxLoan(e.target.value.replace(/\D/g, '') || '0')}
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
              <span>Update Sekarang</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Nilai saat ini: <strong className="text-slate-800">{formatRupiah(kebijakan.plafon_maksimal)}</strong> — terakhir diubah oleh {lastUpdatedLabel}.</span>
        </div>
      </div>

      {/* CARD 2: INTEREST RATE */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <Percent size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Suku Bunga Pinjaman (%)</h2>
              <p className="text-xs text-slate-500">Persentase bunga flat/bulan untuk seluruh pinjaman aktif.</p>
            </div>
          </div>
          <Info size={18} className="text-slate-400" />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Suku Bunga Baru (%)</label>
            <div className="relative">
              <input
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ''))}
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
              <span>Update Sekarang</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Nilai saat ini: <strong className="text-slate-800">{kebijakan.suku_bunga_persen}%</strong> — dipakai langsung sebagai acuan simulasi cicilan Bendahara & Ketua.</span>
        </div>
      </div>

      {/* CARD 3: MANDATORY SAVINGS */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <PiggyBank size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Nominal Simpanan Wajib</h2>
              <p className="text-xs text-slate-500">Setoran wajib bulanan untuk setiap anggota koperasi.</p>
            </div>
          </div>
          <Info size={18} className="text-slate-400" />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Nominal Baru per Bulan (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-900">Rp</span>
              <input
                type="text"
                value={formatRupiahInput(mandatorySavings)}
                onChange={(e) => setMandatorySavings(e.target.value.replace(/\D/g, '') || '0')}
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
              <span>Update Sekarang</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Nilai saat ini: <strong className="text-slate-800">{formatRupiah(kebijakan.simpanan_wajib_nominal)}</strong> per bulan.</span>
        </div>
      </div>

      {/* CARD 4: MINIMAL PROGRESS TOP-UP */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-slate-900 flex items-center justify-center border border-blue-100/80">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Syarat Minimal Top-Up Pinjaman</h2>
              <p className="text-xs text-slate-500">Minimal persentase tenor yang harus lunas sebelum anggota boleh mengajukan Top-Up.</p>
            </div>
          </div>
          <Info size={18} className="text-slate-400" />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Minimal Progress Baru (%)</label>
            <div className="relative">
              <input
                type="text"
                value={minimalTopup}
                onChange={(e) => setMinimalTopup(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-700">%</span>
            </div>
          </div>
          <div className="md:col-span-4 md:self-end">
            <button
              type="button"
              onClick={() => setActiveModal('topup')}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={16} />
              <span>Update Sekarang</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Nilai saat ini: <strong className="text-slate-800">{kebijakan.minimal_progress_topup_persen}%</strong> — anggota baru bisa Top-Up setelah minimal segini dari tenor pinjaman lamanya lunas.</span>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100">

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
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="py-5 space-y-4">

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Parameter yang diubah:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {activeModal === 'loan' && 'Plafon Maksimal Pinjaman'}
                    {activeModal === 'interest' && 'Suku Bunga Pinjaman (%)'}
                    {activeModal === 'savings' && 'Nominal Simpanan Wajib'}
                    {activeModal === 'topup' && 'Syarat Minimal Top-Up (%)'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Nilai Sebelumnya:</span>
                  <span className="font-semibold text-rose-600 line-through">
                    {activeModal === 'loan' && formatRupiah(kebijakan.plafon_maksimal)}
                    {activeModal === 'interest' && `${kebijakan.suku_bunga_persen}%`}
                    {activeModal === 'savings' && formatRupiah(kebijakan.simpanan_wajib_nominal)}
                    {activeModal === 'topup' && `${kebijakan.minimal_progress_topup_persen}%`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nilai Baru Kebijakan:</span>
                  <span className="font-black text-emerald-600 text-sm">
                    {activeModal === 'loan' && `Rp ${formatRupiahInput(maxLoan)}`}
                    {activeModal === 'interest' && `${interestRate}%`}
                    {activeModal === 'savings' && `Rp ${formatRupiahInput(mandatorySavings)}`}
                    {activeModal === 'topup' && `${minimalTopup}%`}
                  </span>
                </div>
              </div>

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

            </div>

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
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#081028] hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                <span>{saving ? 'Menyimpan...' : 'Konfirmasi & Terapkan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
