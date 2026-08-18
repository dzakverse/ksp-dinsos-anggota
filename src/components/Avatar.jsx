// Sebelumnya tiap halaman (header.jsx, ProfilPengurus.jsx, edit.jsx,
// VerifikasiDetail.jsx) punya fallback foto sendiri-sendiri kalau
// foto_url kosong - kebanyakan malah hardcode foto stok dari Unsplash
// (bukan inisial), dan profil.jsx (Anggota) bahkan tidak punya fallback
// sama sekali (broken image kalau belum pernah upload foto). Disatukan
// di sini jadi 1 komponen supaya perilakunya konsisten di seluruh
// aplikasi & dipakai bareng oleh Anggota, Bendahara, maupun Ketua:
// - foto_url ada -> tampilkan foto.
// - foto_url kosong (belum pernah upload ATAU baru saja dihapus lewat
//   tombol "Hapus Foto") -> tampilkan lingkaran berisi inisial dari nama.

// Palet warna latar buat avatar inisial - dipilih pakai hash sederhana dari
// nama supaya konsisten (nama yang sama selalu dapat warna yang sama) tapi
// bervariasi antar anggota, bukan abu-abu polos semua.
const WARNA_LATAR = [
  'bg-[#0A1128] text-amber-400',
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-rose-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-500 text-slate-900',
  'bg-teal-600 text-white',
];

function ambilInisial(nama) {
  if (!nama || !nama.trim()) return '?';
  const kata = nama.trim().split(/\s+/);
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}

function ambilWarna(nama) {
  if (!nama) return WARNA_LATAR[0];
  let hash = 0;
  for (let i = 0; i < nama.length; i++) {
    hash = nama.charCodeAt(i) + ((hash << 5) - hash);
  }
  return WARNA_LATAR[Math.abs(hash) % WARNA_LATAR.length];
}

/**
 * Avatar dengan fallback inisial otomatis.
 *
 * Props:
 * - nama: nama pemilik avatar, dipakai untuk generate inisial & warna, serta
 *   sebagai alt text foto.
 * - fotoUrl: URL foto profil (boleh null/undefined/'').
 * - className: ukuran + bentuk (WAJIB sertakan rounded-full / rounded-2xl
 *   dsb di sini, contoh default "w-10 h-10 rounded-full") supaya foto dan
 *   fallback inisial sama persis bentuknya.
 * - textClassName: ukuran font inisial, menyesuaikan ukuran avatar (default "text-sm").
 * - fallbackClassName: override warna latar+teks inisial (kalau butuh cocok
 *   dengan tema warna spesifik, mis. avatar Ketua yang navy+amber). Kalau
 *   tidak diisi, warna diambil otomatis dari nama.
 */
export default function Avatar({
  nama,
  fotoUrl,
  className = 'w-10 h-10 rounded-full',
  textClassName = 'text-sm',
  fallbackClassName,
}) {
  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nama ? `Foto Profil ${nama}` : 'Foto Profil'}
        className={`${className} object-cover shrink-0`}
      />
    );
  }

  const warna = fallbackClassName || ambilWarna(nama);

  return (
    <div
      className={`${className} ${warna} flex items-center justify-center font-black shrink-0 ${textClassName}`}
      title={nama || undefined}
    >
      {ambilInisial(nama)}
    </div>
  );
}
