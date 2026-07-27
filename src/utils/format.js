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
