import { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  UserX,
  PlusCircle,
  X,
  CheckCircle2,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

export default function PengurusAnggota() {
  const [searchPengurus, setSearchPengurus] = useState('');
  const [searchAnggota, setSearchAnggota] = useState('');

  const [listPengurus, setListPengurus] = useState([]);
  const [anggotaData, setAnggotaData] = useState({ data: [], total: 0 });
  const [loadingPengurus, setLoadingPengurus] = useState(true);
  const [loadingAnggota, setLoadingAnggota] = useState(true);

  const [selectedPengurus, setSelectedPengurus] = useState(null);
  const [modalPengurusType, setModalPengurusType] = useState(null); // 'detail' | 'deactivate' | 'create' | null

  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [modalAnggotaType, setModalAnggotaType] = useState(null); // 'add_savings' | null

  const [jenisSimpanan, setJenisSimpanan] = useState('SUKARELA');
  const [nominalSimpanan, setNominalSimpanan] = useState('');
  const [catatanSimpanan, setCatatanSimpanan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newPengurus, setNewPengurus] = useState({ nama: '', nip: '', password: '' });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadPengurus = () => {
    setLoadingPengurus(true);
    api.get('/ketua/pengurus', { params: { search: searchPengurus || undefined } })
      .then((res) => setListPengurus(res.data))
      .finally(() => setLoadingPengurus(false));
  };

  const loadAnggota = () => {
    setLoadingAnggota(true);
    api.get('/admin/anggota', { params: { search: searchAnggota || undefined, per_page: 10 } })
      .then((res) => setAnggotaData(res.data))
      .finally(() => setLoadingAnggota(false));
  };

  useEffect(() => { loadPengurus(); }, [searchPengurus]);
  useEffect(() => { loadAnggota(); }, [searchAnggota]);

  const handleCreatePengurus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/ketua/pengurus', newPengurus);
      setModalPengurusType(null);
      setNewPengurus({ nama: '', nip: '', password: '' });
      showToast(`Akun Bendahara ${newPengurus.nama} berhasil dibuat.`);
      loadPengurus();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuat akun pengurus.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (pengurus, statusBaru) => {
    setSubmitting(true);
    try {
      await api.patch(`/ketua/pengurus/${pengurus.id}/status`, { status_keanggotaan: statusBaru });
      setModalPengurusType(null);
      showToast(`Pengurus ${pengurus.nama} berhasil ${statusBaru === 'AKTIF' ? 'diaktifkan' : 'dinonaktifkan'}.`);
      loadPengurus();
    } catch {
      alert('Gagal mengubah status pengurus.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSimpanan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/admin/anggota/${selectedAnggota.id}/simpanan`, {
        jenis: jenisSimpanan,
        jumlah: Number(nominalSimpanan),
        keterangan: catatanSimpanan || undefined,
      });
      setModalAnggotaType(null);
      showToast(`Berhasil menambah simpanan ${jenisSimpanan} ${formatRupiah(nominalSimpanan)} untuk ${selectedAnggota.nama}.`);
      setNominalSimpanan('');
      setCatatanSimpanan('');
      loadAnggota();
    } catch {
      alert('Gagal menyimpan transaksi.');
    } finally {
      setSubmitting(false);
    }
  };

  const jumlahPengurusAktif = listPengurus.filter((p) => p.status_keanggotaan === 'AKTIF').length;

  return (
    <div className="space-y-8 max-w-7xl pb-16 font-sans">

      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-amber-400 shrink-0" />
          <div className="text-xs font-bold">{toastMessage}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">TOTAL PENGURUS AKTIF</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{jumlahPengurusAktif}</div>
        </div>
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">TOTAL ANGGOTA TERDAFTAR</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{anggotaData.total ?? 0}</div>
        </div>
      </div>

      {/* SEKSI 1: MANAJEMEN PENGURUS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Pengurus</h1>
          <button
            onClick={() => setModalPengurusType('create')}
            className="bg-[#081028] hover:bg-slate-800 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <PlusCircle size={16} />
            <span>Tambah Pengurus</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-end">
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau NIP..."
                value={searchPengurus}
                onChange={(e) => setSearchPengurus(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/50 text-slate-700 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">PENGURUS</th>
                  <th className="p-4">TERDAFTAR SEJAK</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 pr-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {loadingPengurus && (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400">Memuat data...</td></tr>
                )}
                {!loadingPengurus && listPengurus.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400">Belum ada akun Bendahara.</td></tr>
                )}
                {!loadingPengurus && listPengurus.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                        {p.nama.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{p.nama}</div>
                        <div className="text-[10px] text-slate-400">NIP: {p.nip}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{formatTanggal(p.created_at)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        p.status_keanggotaan === 'AKTIF' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${p.status_keanggotaan === 'AKTIF' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {p.status_keanggotaan === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => { setSelectedPengurus(p); setModalPengurusType('detail'); }}
                          title="Lihat Detail & Kelola Status"
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEKSI 2: MANAJEMEN ANGGOTA */}
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Anggota</h1>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Nama atau NIP..."
                value={searchAnggota}
                onChange={(e) => setSearchAnggota(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-2">
              Menampilkan {anggotaData.data?.length ?? 0} dari {anggotaData.total ?? 0} Anggota
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/50 text-slate-700 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Nama Pegawai / NIP</th>
                  <th className="p-4">Unit Kerja</th>
                  <th className="p-4">Simp. Pokok</th>
                  <th className="p-4">Simp. Wajib</th>
                  <th className="p-4">Simp. Sukarela</th>
                  <th className="p-4">Total Saldo</th>
                  <th className="p-4 pr-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {loadingAnggota && (
                  <tr><td colSpan={7} className="p-6 text-center text-slate-400">Memuat data...</td></tr>
                )}
                {!loadingAnggota && anggotaData.data?.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-slate-400">Tidak ada anggota ditemukan.</td></tr>
                )}
                {!loadingAnggota && anggotaData.data?.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6">
                      <div className="font-extrabold text-slate-900">{a.nama}</div>
                      <div className="text-[10px] text-slate-400">{a.nip}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{a.unit_kerja}</td>
                    <td className="p-4 text-slate-700">{formatRupiah(a.saldo.pokok)}</td>
                    <td className="p-4 text-slate-700">{formatRupiah(a.saldo.wajib)}</td>
                    <td className="p-4 text-slate-700">{formatRupiah(a.saldo.sukarela)}</td>
                    <td className="p-4 font-black text-slate-900">{formatRupiah(a.saldo.total)}</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedAnggota(a); setModalAnggotaType('add_savings'); }}
                          title="Tambah Simpanan Manual"
                          className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH PENGURUS */}
      {modalPengurusType === 'create' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tambah Pengurus (Bendahara) Baru</h3>
              <button onClick={() => setModalPengurusType(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreatePengurus} className="py-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
                <input
                  type="text" required value={newPengurus.nama}
                  onChange={(e) => setNewPengurus({ ...newPengurus, nama: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">NIP (untuk login)</label>
                <input
                  type="text" required value={newPengurus.nip}
                  onChange={(e) => setNewPengurus({ ...newPengurus, nip: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Password Awal</label>
                <input
                  type="text" required minLength={8} value={newPengurus.password}
                  onChange={(e) => setNewPengurus({ ...newPengurus, password: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setModalPengurusType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">Batal</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#081028] text-amber-400 font-bold text-xs cursor-pointer disabled:opacity-60">
                  {submitting ? 'Menyimpan...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PENGURUS */}
      {modalPengurusType === 'detail' && selectedPengurus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                  {selectedPengurus.nama.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedPengurus.nama}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">NIP: {selectedPengurus.nip}</p>
                </div>
              </div>
              <button onClick={() => setModalPengurusType(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="py-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-center px-1">
                <span className="text-slate-400 font-medium">Peran:</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900">BENDAHARA</span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-slate-400 font-medium">Terdaftar Sejak:</span>
                <span className="font-semibold text-slate-700">{formatTanggal(selectedPengurus.created_at)}</span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-slate-400 font-medium">Status Akun:</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  selectedPengurus.status_keanggotaan === 'AKTIF' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${selectedPengurus.status_keanggotaan === 'AKTIF' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {selectedPengurus.status_keanggotaan === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-[11px] text-slate-600 leading-relaxed mt-2">
                {selectedPengurus.status_keanggotaan === 'AKTIF'
                  ? 'Pengurus ini dapat login dan mengakses seluruh fitur Bendahara.'
                  : 'Akun ini dinonaktifkan dan tidak dapat login ke sistem.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <button onClick={() => setModalPengurusType(null)} className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer">
                Tutup
              </button>

              {selectedPengurus.status_keanggotaan === 'AKTIF' ? (
                <button
                  type="button"
                  onClick={() => setModalPengurusType('deactivate')}
                  className="w-2/3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <UserX size={16} />
                  <span>Nonaktifkan Pengurus</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedPengurus, 'AKTIF')}
                  disabled={submitting}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  <span>Aktifkan Pengurus</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI NONAKTIFKAN */}
      {modalPengurusType === 'deactivate' && selectedPengurus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Nonaktifkan Pengurus</h3>
                <p className="text-[11px] text-slate-400">Pencabutan hak akses sistem</p>
              </div>
            </div>
            <p className="py-4 text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin mencabut hak akses pengurus atas nama <strong>{selectedPengurus.nama}</strong>? Pengurus ini tidak akan bisa login ke dashboard hingga diaktifkan kembali.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalPengurusType('detail')} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">Batal</button>
              <button
                onClick={() => handleToggleStatus(selectedPengurus, 'NONAKTIF')}
                disabled={submitting}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Memproses...' : 'Nonaktifkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH SIMPANAN MANUAL */}
      {modalAnggotaType === 'add_savings' && selectedAnggota && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tambah Simpanan Manual</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Setoran tunai / transfer langsung ke anggota</p>
                </div>
              </div>
              <button onClick={() => setModalAnggotaType(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmitSimpanan} className="py-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">{selectedAnggota.nama}</div>
                <div className="text-[10px] text-slate-400">NIP: {selectedAnggota.nip} | Unit: {selectedAnggota.unit_kerja}</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Jenis Simpanan</label>
                <select
                  value={jenisSimpanan}
                  onChange={(e) => setJenisSimpanan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                >
                  <option value="SUKARELA">Simpanan Sukarela</option>
                  <option value="WAJIB">Simpanan Wajib</option>
                  <option value="POKOK">Simpanan Pokok</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nominal Setoran (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 500000"
                  value={nominalSimpanan}
                  onChange={(e) => setNominalSimpanan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Catatan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Setoran tunai langsung melalui kantor KSP..."
                  value={catatanSimpanan}
                  onChange={(e) => setCatatanSimpanan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setModalAnggotaType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Transaksi'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
