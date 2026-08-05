import { useEffect, useState } from 'react';
import { Building2, MinusCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

export default function KasKoperasi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = () => {
    setLoading(true);
    api.get('/admin/kas')
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data kas koperasi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!jumlah || Number(jumlah) <= 0) {
      setFormError('Masukkan nominal yang valid.');
      return;
    }
    if (!catatan.trim()) {
      setFormError('Catatan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/admin/kas/tarik', { jumlah: Number(jumlah), catatan });
      setShowModal(false);
      setJumlah('');
      setCatatan('');
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan transaksi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kas Koperasi</h1>
          <p className="text-xs text-slate-500 mt-1">Pantau saldo kas dan catat pengeluaran operasional.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <MinusCircle size={16} />
          <span>Tarik Kas</span>
        </button>
      </div>

      <div className="bg-[#081028] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 text-blue-100 text-xs font-bold uppercase tracking-wider">
          <Building2 size={16} />
          <span>Saldo Kas Saat Ini</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3">{formatRupiah(data.saldo_kas)}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Riwayat Transaksi Kas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6 font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider">Tipe</th>
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider">Jumlah</th>
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider">Catatan</th>
                <th className="p-4 pr-6 font-bold text-slate-400 uppercase tracking-wider">Dicatat Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.riwayat.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">Belum ada transaksi kas.</td></tr>
              )}
              {data.riwayat.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50">
                  <td className="p-4 pl-6 text-slate-600 font-medium whitespace-nowrap">{formatTanggal(trx.tanggal)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      trx.tipe === 'KELUAR' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {trx.tipe === 'KELUAR' ? 'KAS KELUAR' : 'KAS MASUK'}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${trx.tipe === 'KELUAR' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {trx.tipe === 'KELUAR' ? '-' : '+'}{formatRupiah(trx.jumlah)}
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs">{trx.catatan}</td>
                  <td className="p-4 pr-6 text-slate-500">{trx.dicatat_oleh?.nama || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tarik Kas Koperasi</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="py-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Contoh: 500000"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Catatan (Wajib)</label>
                <textarea
                  rows={3}
                  required
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Pembelian ATK kantor untuk kebutuhan administrasi..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  <span>{submitting ? 'Menyimpan...' : 'Konfirmasi Tarik'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
