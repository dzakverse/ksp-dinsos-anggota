import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  UserX, 
  PlusCircle, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Wallet,
  Building,
  ShieldAlert
} from 'lucide-react';

export default function PengurusAnggota() {
  // State Filter Pengurus
  const [pengurusFilter, setPengurusFilter] = useState('Semua');
  const [searchPengurus, setSearchPengurus] = useState('');
  const [searchAnggota, setSearchAnggota] = useState('');

  // Modals State
  const [selectedPengurus, setSelectedPengurus] = useState(null);
  const [modalPengurusType, setModalPengurusType] = useState(null); // 'detail' | 'deactivate' | null

  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [modalAnggotaType, setModalAnggotaType] = useState(null); // 'detail' | 'add_savings' | null

  // State Form Tambah Simpanan Manual
  const [jenisSimpanan, setJenisSimpanan] = useState('Sukarela');
  const [nominalSimpanan, setNominalSimpanan] = useState('');
  const [catatanSimpanan, setCatatanSimpanan] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Mock Data Pengurus
  const [listPengurus, setListPengurus] = useState([
    { id: '1', nip: '198203042005011002', nama: 'Budi Santoso', peran: 'BENDAHARA UTAMA', badgeBg: 'bg-amber-400 text-slate-900', lastActive: '10 menit yang lalu', status: 'Aktif' },
    { id: '2', nip: '199002152012012005', nama: 'Ani Larasati', peran: 'IT ADMIN', badgeBg: 'bg-slate-900 text-white', lastActive: '2 jam yang lalu', status: 'Aktif' },
    { id: '3', nip: '197805122002011003', nama: 'Dedi Priyadi', peran: 'PENGAWAS LUAR', badgeBg: 'bg-blue-100 text-blue-900', lastActive: 'Kemarin, 14:20', status: 'Cuti' },
  ]);

  // Mock Data Anggota
  const [listAnggota] = useState([
    { id: '1', nip: '19850612 201001 1 004', nama: 'Budi Santoso, S.Sos', unit: 'Sekretariat', pokok: 500000, wajib: 2400000, sukarela: 1250000, total: 4150000 },
    { id: '2', nip: '19900325 201503 2 001', nama: 'Siti Aminah, M.Si', unit: 'Rehabilitasi Sosial', pokok: 500000, wajib: 1800000, sukarela: 8400000, total: 10700000 },
    { id: '3', nip: '19781102 200501 1 002', nama: 'Dr. Ahmad Hidayat', unit: 'Pemberdayaan Sosial', pokok: 500000, wajib: 3600000, sukarela: 15200000, total: 19300000 },
    { id: '4', nip: '19950718 201903 2 010', nama: 'Rina Wijaya, A.Md', unit: 'Linjamsos', pokok: 500000, wajib: 600000, sukarela: 250000, total: 1350000 },
    { id: '5', nip: '19821230 200801 1 005', nama: 'Eko Prasetyo', unit: 'Sekretariat', pokok: 500000, wajib: 2800000, sukarela: 4500000, total: 7800000 },
  ]);

  // Toast Helper
  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler Nonaktifkan Pengurus
  const handleDeactivatePengurus = () => {
    setListPengurus(listPengurus.map(p => p.id === selectedPengurus.id ? { ...p, status: 'Nonaktif' } : p));
    setModalPengurusType(null);
    showToast(`Pengurus ${selectedPengurus.nama} berhasil dinonaktifkan.`);
  };

  // Handler Submit Simpanan Manual
  const handleSubmitSimpanan = (e) => {
    e.preventDefault();
    setModalAnggotaType(null);
    setNominalSimpanan('');
    setCatatanSimpanan('');
    showToast(`Berhasil menambah simpanan ${jenisSimpanan} Rp ${parseInt(nominalSimpanan || 0).toLocaleString('id-ID')} untuk ${selectedAnggota.nama}.`);
  };

  return (
    <div className="space-y-8 max-w-7xl pb-16 font-sans">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-amber-400 shrink-0" />
          <div className="text-xs font-bold">{toastMessage}</div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">TOTAL STAF AKTIF</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">24</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">📈 +2 bln ini</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">TOTAL ANGGOTA AKTIF</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">245</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">📈 +2 bln ini</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEKSI 1: MANAJEMEN PENGURUS ================= */}
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Pengurus</h1>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Header Filter & Search Pengurus */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['Semua', 'Bendahara', 'Administrator'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPengurusFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pengurusFilter === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari nama atau NIP..."
                  value={searchPengurus}
                  onChange={(e) => setSearchPengurus(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <button title="Filter Lanjutan" className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Tabel Pengurus */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/50 text-slate-700 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">PENGURUS</th>
                  <th className="p-4">PERAN UTAMA</th>
                  <th className="p-4">TERAKHIR AKTIF</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 pr-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {listPengurus.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                        {p.nama.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{p.nama}</div>
                        <div className="text-[10px] text-slate-400">NIP: {p.nip}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.badgeBg}`}>
                        {p.peran}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{p.lastActive}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        p.status === 'Aktif' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${p.status === 'Aktif' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {p.status}
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

      {/* ================= SEKSI 2: MANAJEMEN ANGGOTA ================= */}
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Anggota</h1>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Search Anggota Header */}
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
              Menampilkan 1 - 5 dari 1,248 Anggota
            </div>
          </div>

          {/* Tabel Anggota */}
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
                {listAnggota.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6">
                      <div className="font-extrabold text-slate-900">{a.nama}</div>
                      <div className="text-[10px] text-slate-400">{a.nip}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{a.unit}</td>
                    <td className="p-4 text-slate-700">Rp {a.pokok.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-slate-700">Rp {a.wajib.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-slate-700">Rp {a.sukarela.toLocaleString('id-ID')}</td>
                    <td className="p-4 font-black text-slate-900">Rp {a.total.toLocaleString('id-ID')}</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => { setSelectedAnggota(a); setModalAnggotaType('add_savings'); }}
                          title="Tambah Simpanan Manual (Otoritas Bendahara/Ketua)"
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

{/* GANTI SELURUH MODAL DETAIL PENGURUS DENGAN KODE INI */}
{modalPengurusType === 'detail' && selectedPengurus && (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
      
      {/* Header Modal */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
            {selectedPengurus.nama.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{selectedPengurus.nama}</h3>
            <p className="text-[11px] text-slate-400 font-medium">NIP: {selectedPengurus.nip}</p>
          </div>
        </div>
        <button 
          onClick={() => setModalPengurusType(null)} 
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* Informasi Detail Pengurus */}
      <div className="py-5 space-y-3.5 text-xs">
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-medium">Peran Utama:</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedPengurus.badgeBg}`}>
            {selectedPengurus.peran}
          </span>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-slate-400 font-medium">Aktivitas Terakhir:</span>
          <span className="font-semibold text-slate-700">{selectedPengurus.lastActive}</span>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-slate-400 font-medium">Status Akun:</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
            selectedPengurus.status === 'Aktif' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${selectedPengurus.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {selectedPengurus.status}
          </span>
        </div>

        {/* Box Peringatan / Keterangan Akses */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-[11px] text-slate-600 leading-relaxed mt-2">
          {selectedPengurus.status === 'Aktif' 
            ? 'Pengurus ini memiliki akses penuh sesuai dengan peran otorisasi yang diberikan.' 
            : 'Akun ini sedang dalam status Nonaktif dan tidak dapat mengakses fitur internal.'}
        </div>
      </div>

      {/* Action Buttons (Toggle Aktif / Nonaktifkan) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
        <button 
          onClick={() => setModalPengurusType(null)} 
          className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          Tutup
        </button>

        {selectedPengurus.status === 'Aktif' ? (
          <button 
            type="button"
            onClick={() => {
              // Pindah ke konfirmasi nonaktifkan atau langsung eksekusi
              setModalPengurusType('deactivate');
            }}
            className="w-2/3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <UserX size={16} />
            <span>Nonaktifkan Pengurus</span>
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => {
              // Fungsi Aktifkan Kembali
              setListPengurus(listPengurus.map(p => p.id === selectedPengurus.id ? { ...p, status: 'Aktif' } : p));
              setModalPengurusType(null);
              showToast(`Pengurus ${selectedPengurus.nama} berhasil diaktifkan kembali!`);
            }}
            className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <CheckCircle2 size={16} />
            <span>Aktifkan Pengurus</span>
          </button>
        )}
      </div>

    </div>
  </div>
)}
      {/* ================= MODAL NONAKTIFKAN PENGURUS ================= */}
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
              <button onClick={() => setModalPengurusType(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Batal</button>
              <button onClick={handleDeactivatePengurus} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Nonaktifkan Sekarang</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH SIMPANAN MANUAL (SEPERTI BENDAHARA) ================= */}
      {modalAnggotaType === 'add_savings' && selectedAnggota && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
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
                <div className="text-[10px] text-slate-400">NIP: {selectedAnggota.nip} | Unit: {selectedAnggota.unit}</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Jenis Simpanan</label>
                <select 
                  value={jenisSimpanan}
                  onChange={(e) => setJenisSimpanan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                >
                  <option value="Sukarela">Simpanan Sukarela</option>
                  <option value="Wajib">Simpanan Wajib</option>
                  <option value="Pokok">Simpanan Pokok</option>
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
                <label className="font-bold text-slate-700 block mb-1.5">Catatan / Bukti Transaksi (Opsional)</label>
                <textarea 
                  rows={2}
                  placeholder="Contoh: Setoran tunai langsung melalui kantor KSP..."
                  value={catatanSimpanan}
                  onChange={(e) => setCatatanSimpanan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setModalAnggotaType(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Transaksi</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}