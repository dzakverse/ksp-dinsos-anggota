import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { formatRupiah } from '../../utils/format';

export default function DataAnggota() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get('/admin/anggota', {
          params: { search: searchInput, per_page: rowsPerPage, page },
        })
        .then((res) => {
          setData(res.data);
          setError('');
        })
        .catch((err) => {
          console.error('Error fetching data anggota:', err);
          const errMsg =
            err.response?.data?.message ||
            err.response?.data?.debug ||
            'Gagal memuat data anggota. Coba muat ulang halaman.';
          setError(errMsg);
        })
        .finally(() => setLoading(false));
    }, 300); // Debounce pencarian

    return () => clearTimeout(timeout);
  }, [searchInput, rowsPerPage, page]);

  // Menggunakan safe navigation/optional chaining & fallback nilai 0
  const totalKeseluruhan =
    data?.data?.reduce((sum, a) => sum + (a?.saldo?.total || 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Simpanan & Transaksi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manajemen data simpanan anggota dan riwayat transaksi koperasi Dinas Sosial.
        </p>
      </div>

      {/* RINGKASAN CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            TOTAL SALDO (HALAMAN INI)
          </span>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-3">
            {formatRupiah(totalKeseluruhan)}
          </div>
        </div>

        <div className="bg-[#0A1128] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              TOTAL ANGGOTA
            </span>
            <div className="text-2xl font-black text-white tracking-tight mt-1">
              {data?.total ?? '0'} Pegawai
            </div>
          </div>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        {/* SEARCH & INFO COUNTER */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
          <div className="relative max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari Nama atau NIP..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
            />
          </div>
          {data && !error && (
            <div className="text-[11px] font-medium text-slate-400">
              Menampilkan{' '}
              <span className="font-bold text-slate-700">
                {data.from ?? 0} - {data.to ?? 0}
              </span>{' '}
              dari <span className="font-bold text-slate-700">{data.total ?? 0}</span>{' '}
              Anggota
            </div>
          )}
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 bg-slate-50/50">
                <th className="py-3.5 px-6">Nama Pegawai / NIP</th>
                <th className="py-3.5 px-6">Unit Kerja</th>
                <th className="py-3.5 px-6">Simp. Pokok</th>
                <th className="py-3.5 px-6">Simp. Wajib</th>
                <th className="py-3.5 px-6">Simp. Sukarela</th>
                <th className="py-3.5 px-6 font-extrabold text-slate-800">
                  Total Saldo
                </th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-rose-500 font-medium">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && (!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada anggota ditemukan.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                data?.data?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 leading-snug">
                        {item.nama || item.name || '-'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.nip || item.no_anggota || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {item.unit_kerja || '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {formatRupiah(item?.saldo?.pokok || 0)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {formatRupiah(item?.saldo?.wajib || 0)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {formatRupiah(item?.saldo?.sukarela || 0)}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">
                      {formatRupiah(item?.saldo?.total || 0)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => navigate(`/admin/anggota/${item.id}`)}
                        className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Lihat Detail Simpanan"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none bg-transparent font-bold text-slate-800 pr-5 cursor-pointer outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data || page <= 1}
              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-slate-700">
              Halaman {data?.current_page ?? 1} dari {data?.last_page ?? 1}
            </span>
            <button
              onClick={() =>
                setPage((p) => (data && p < data.last_page ? p + 1 : p))
              }
              disabled={!data || page >= (data?.last_page ?? 1)}
              className="p-1 text-slate-700 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}