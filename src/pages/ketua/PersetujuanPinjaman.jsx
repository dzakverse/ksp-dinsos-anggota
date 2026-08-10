import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calculator,
  X,
  Zap,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';
import EmergencyBypass from './EmergencyBypass';

export default function PersetujuanPinjaman() {
  const [activeTab, setActiveTab] = useState('regular');

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'acc' | 'reject' | null
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [pendingList, setPendingList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  const [sukuBunga, setSukuBunga] = useState(2.5); // default, akan ditimpa oleh Kendali Kebijakan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/pinjaman', { params: { status: 'DISETUJUI_BENDAHARA' } }),
      api.get('/ketua/kebijakan').catch(() => null),
    ])
      .then(([pinjamanRes, kebijakanRes]) => {
        setPendingList(pinjamanRes.data.antrean?.data ?? []);
        setRiwayatList(pinjamanRes.data.riwayat ?? []);
        if (kebijakanRes) setSukuBunga(Number(kebijakanRes.data.suku_bunga_persen));
      })
      .catch(() => setError('Gagal memuat data persetujuan pinjaman.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Simulasi Cicilan berdasarkan suku bunga yang berlaku (Kendali Kebijakan)
  const calculateCicilan = (jumlah, tenor) => {
    const pokok = jumlah / tenor;
    const bunga = jumlah * (sukuBunga / 100);
    const totalBulan = pokok + bunga;
    return {
      pokok: Math.round(pokok),
      bunga: Math.round(bunga),
      totalPerBulan: Math.round(totalBulan),
    };
  };

  const handleOpenModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setRejectReason('');
  };

  const handleConfirmAcc = async () => {
    setProcessing(true);
    try {
      await api.post(`/ketua/pinjaman/${selectedItem.id}/persetujuan`, { status: 'DISETUJUI' });
      setModalType(null);
      showToast(`Pinjaman atas nama ${selectedItem.user.nama} berhasil di-ACC!`, 'success');
      loadData();
    } catch {
      showToast('Gagal memproses persetujuan. Coba lagi.', 'danger');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Mohon isi alasan penolakan!');
      return;
    }
    setProcessing(true);
    try {
      await api.post(`/ketua/pinjaman/${selectedItem.id}/persetujuan`, {
        status: 'DITOLAK',
        catatan_verifikasi: rejectReason,
      });
      setModalType(null);
      showToast(`Pengajuan ${selectedItem.user.nama} ditolak.`, 'danger');
      loadData();
    } catch {
      showToast('Gagal memproses penolakan. Coba lagi.', 'danger');
    } finally {
      setProcessing(false);
    }
  };

  const showToast = (msg, type) => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12 font-sans">

      {toastMessage && (
        <div className={`fixed top-20 right-8 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 ${
          toastMessage.type === 'success' ? 'bg-slate-900 border border-emerald-400' : 'bg-rose-950 border border-rose-500'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={20} /> : <XCircle className="text-rose-400" size={20} />}
          <div className="text-xs font-bold">{toastMessage.text}</div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Financial Approval Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola persetujuan pinjaman akhir dan intervensi darurat (Bypass) melalui satu pintu kendali eksekutif.
          </p>
        </div>

        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 px-4 flex items-center gap-3 self-start md:self-auto">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">OTORITAS</div>
            <div className="text-xs font-black text-slate-900">Chairman Verified</div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 flex gap-8">
        <button
          onClick={() => setActiveTab('regular')}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'regular' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Persetujuan Akhir
          {activeTab === 'regular' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab('bypass')}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bypass' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Zap size={14} className={activeTab === 'bypass' ? 'fill-amber-500 text-amber-500' : ''} />
          <span>Emergency Bypass</span>
          {activeTab === 'bypass' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />}
        </button>
      </div>

      {activeTab === 'regular' ? (
        <div className="space-y-8">

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="bg-blue-50/50 p-4 px-6 border-b border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                STATUS: MENUNGGU ACC KETUA
              </span>
              <span className="bg-slate-900 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                {pendingList.length} PENDING
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-blue-50/20 text-slate-700 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6">Nama Anggota</th>
                    <th className="p-4">Jumlah</th>
                    <th className="p-4">Tenor</th>
                    <th className="p-4">Keperluan</th>
                    <th className="p-4 pr-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {loading && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
                  )}
                  {error && (
                    <tr><td colSpan={5} className="p-8 text-center text-rose-500">{error}</td></tr>
                  )}
                  {!loading && !error && pendingList.length > 0 ? (
                    pendingList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-extrabold text-slate-900">{item.user.nama}</div>
                          <div className="text-[10px] text-slate-400 font-medium">#{item.kode}</div>
                        </td>
                        <td className="p-4 font-black text-slate-900">{formatRupiah(item.jumlah)}</td>
                        <td className="p-4 font-semibold text-slate-700">{item.tenor_bulan} Bulan</td>
                        <td className="p-4 font-medium text-slate-600">{item.alasan || '-'}</td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(item, 'acc')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-[11px] transition-all cursor-pointer shadow-xs"
                            >
                              Setujui / ACC
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenModal(item, 'reject')}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2 rounded-xl text-[11px] transition-all cursor-pointer shadow-xs"
                            >
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (!loading && !error && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        Tidak ada antrean pinjaman yang menunggu ACC.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} />
              <span>Riwayat</span>
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-blue-50/40 text-slate-700 font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-4 pl-6">Nama Anggota</th>
                      <th className="p-4">Jumlah</th>
                      <th className="p-4">Tanggal Proses</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {riwayatList.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">Belum ada riwayat.</td></tr>
                    )}
                    {riwayatList.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50">
                        <td className="p-4 pl-6">
                          <div className="font-extrabold text-slate-900">{row.user.nama}</div>
                          <div className="text-[10px] text-slate-400">#{row.kode}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{formatRupiah(row.jumlah)}</td>
                        <td className="p-4 text-slate-500 font-medium">{formatTanggal(row.updated_at)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                            row.is_bypassed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {row.is_bypassed ? 'Bypass' : 'Regular'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 font-extrabold">
                          {row.status === 'DISETUJUI' ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">DISETUJUI</span>
                          ) : (
                            <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">DITOLAK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <EmergencyBypass />
      )}

      {modalType === 'acc' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Konfirmasi ACC Pinjaman</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Periksa rincian & simulasi cicilan pemohon.</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="py-5 space-y-5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Nama Anggota:</span>
                  <span className="font-extrabold text-slate-900">{selectedItem.user.nama} (#{selectedItem.kode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Nominal Pengajuan:</span>
                  <span className="font-black text-slate-900 text-sm">{formatRupiah(selectedItem.jumlah)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Tenor & Keperluan:</span>
                  <span className="font-bold text-slate-800">{selectedItem.tenor_bulan} Bulan — {selectedItem.alasan || '-'}</span>
                </div>
              </div>

              {(() => {
                const sim = calculateCicilan(selectedItem.jumlah, selectedItem.tenor_bulan);
                return (
                  <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <Calculator size={16} />
                      <span>Simulasi Skedul Cicilan (Bunga {sukuBunga}% Flat)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-blue-100">
                      <div>
                        <div className="text-[10px] text-slate-400">Pokok per Bulan</div>
                        <div className="font-bold text-slate-800">{formatRupiah(sim.pokok)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Bunga per Bulan</div>
                        <div className="font-bold text-slate-800">{formatRupiah(sim.bunga)}</div>
                      </div>
                      <div className="col-span-2 bg-white p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                        <span className="font-bold text-slate-700">Total Angsuran / Bulan:</span>
                        <span className="font-black text-emerald-600 text-base">{formatRupiah(sim.totalPerBulan)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAcc}
                disabled={processing}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                <span>{processing ? 'Memproses...' : 'ACC & Izinkan Pencairan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {modalType === 'reject' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tolak Pengajuan Pinjaman</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Beri alasan resmi penolakan pengajuan.</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Anda akan menolak pinjaman sebesar <strong>{formatRupiah(selectedItem.jumlah)}</strong> atas nama <strong>{selectedItem.user.nama}</strong>.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Alasan Penolakan (Wajib)</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Rasio angsuran melebihi kapasitas gaji bulanan anggota..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-400 focus:bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={processing}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <XCircle size={16} />
                <span>{processing ? 'Memproses...' : 'Konfirmasi Penolakan'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
