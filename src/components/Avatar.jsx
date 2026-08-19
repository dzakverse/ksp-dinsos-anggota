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
