import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, FileText, Clock, ChevronLeft, ChevronRight, ArrowRightLeft } from 'lucide-react';
import api from '../../services/api';
import { formatRupiah, formatTanggal } from '../../utils/format';

export default function VerifikasiPinjaman() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('');
  const [urutan, setUrutan] = useState('terbaru');
  const [page, setPage] = useState(1);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/pinjaman', { params: { status: filterStatus || undefined, sort: urutan, page } })
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data pengajuan. Coba muat ulang halaman.'))
      .finally(() => setLoading(false));
  }, [filterStatus, urutan, page]);

  const handleResetFilter = () => {
    setFilterStatus('');
    setUrutan('terbaru');
    setPage(1);
  };

  const antrean = data?.antrean;
  const riwayat = data?.riwayat ?? [];

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verifikasi Pinjaman</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola dan tinjau antrean pengajuan pinjaman anggota koperasi hari ini.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-6 min-w-[280px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ANTREAN SAAT INI</span>
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{data?.antrean_count ?? '...'}</span>
              <span className="text-xs font-bold text-amber-600">Pengajuan<br/><span className="font-normal text-[10px] text-slate-400">Menunggu Verifikasi</span></span>
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
            <Clock size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-end gap-4">

        {/* Filter Status: sebelumnya state `filterStatus` sudah dikirim ke backend
            (backend sudah support query ?status=) tapi tidak ada dropdown untuk
            men-set-nya di UI -> state ini selama ini nganggur, selalu kosong. */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-medium"
          >
            <option value="">Semua Status</option>
            <option value="MENUNGGU">Menunggu Verifikasi</option>
            <option value="DISETUJUI_BENDAHARA">Diteruskan ke Ketua</option>
            <option value="DISETUJUI">Disetujui</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutkan Berdasarkan</label>
          <select
            value={urutan}
            onChange={(e) => { setUrutan(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-medium"
          >
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
            <option value="nominal">Nominal Tertinggi</option>
          </select>
        </div>

        <button
          onClick={handleResetFilter}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset Filter</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">DAFTAR ANTREAN PENGAJUAN</h2>
          {antrean && (
            <span className="text-[11px] text-slate-400 font-medium">
              Menampilkan {antrean.data?.length ?? 0} dari {antrean.total ?? 0} pengajuan
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3 px-6">NAMA ANGGOTA</th>
                <th className="py-3 px-6">NIP</th>
                <th className="py-3 px-6">NOMINAL</th>
                <th className="py-3 px-6">TENOR</th>
                <th className="py-3 px-6">KEPERLUAN</th>
                <th className="py-3 px-6">TGL PENGAJUAN</th>
                <th className="py-3 px-6">STATUS</th>
                <th className="py-3 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading && (
                <tr><td colSpan={8} className="py-6 text-center text-slate-400">Memuat data...</td></tr>
              )}
              {error && (
                <tr><td colSpan={8} className="py-6 text-center text-rose-500">{error}</td></tr>
              )}
              {!loading && !error && antrean?.data?.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-slate-400">Tidak ada pengajuan menunggu verifikasi.</td></tr>
              )}
              {!loading && !error && antrean?.data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{item.user.nama}</span>
                      {item.is_topup && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                          <ArrowRightLeft size={9} /> Top-Up
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{item.user.nip}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{formatRupiah(item.jumlah)}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{item.tenor_bulan} bln</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{item.alasan || '-'}</td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{formatTanggal(item.created_at)}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Antre
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/verifikasi/${item.id}`)}
                      className="text-slate-800 hover:text-blue-600 font-bold text-xs hover:underline cursor-pointer">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {antrean && antrean.last_page > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={antrean.current_page <= 1}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft size={16} />
              <span>Sebelumnya</span>
            </button>
            <span className="font-semibold text-slate-700">Halaman {antrean.current_page} dari {antrean.last_page}</span>
            <button
              onClick={() => setPage((p) => (antrean && p < antrean.last_page ? p + 1 : p))}
              disabled={antrean.current_page >= antrean.last_page}
              className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <span>Berikutnya</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-slate-700" />
          <h2 className="text-base font-bold text-slate-800">Riwayat</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-blue-50/40">
                  <th className="py-3 px-6">NAMA ANGGOTA</th>
                  <th className="py-3 px-6">JUMLAH</th>
                  <th className="py-3 px-6">TANGGAL PROSES</th>
                  <th className="py-3 px-6">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {riwayat.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-400">Belum ada riwayat.</td></tr>
                )}
                {riwayat.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">{item.user.nama}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{formatRupiah(item.jumlah)}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{formatTanggal(item.updated_at)}</td>
                    <td className="py-4 px-6">
                      {item.status === 'DITOLAK' ? (
                        <span className="inline-block text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider bg-rose-600 text-white">DITOLAK</span>
                      ) : (
                        <span className="inline-block text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider bg-emerald-600 text-white">
                          {item.status === 'DISETUJUI_BENDAHARA' ? 'DITERUSKAN KE KETUA' : 'DISETUJUI'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 shrink-0 shadow-xs">
          <FileText size={20} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-800">Prosedur Verifikasi</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pastikan formulir Pengajuan telah sesuai dengan data yang diinputkan oleh anggota sebelum memberikan persetujuan.
          </p>
        </div>
      </div>

    </div>
  );
}
