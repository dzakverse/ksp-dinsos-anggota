export function formatRupiah(value) {
  const num = Number(value) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

// Format waktu aktivitas: "X menit lalu" / "X jam lalu" jika masih dalam 24 jam
// terakhir, tapi begitu lewat 23 jam 59 menit -> tampilkan tanggal aslinya.
export function formatWaktuAktivitas(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const diffMs = Date.now() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;

  return formatTanggal(dateStr);
}