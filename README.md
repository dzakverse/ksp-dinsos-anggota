# KSP Dinsos Anggota — Frontend (React + Vite)

Frontend aplikasi koperasi simpan pinjam untuk pegawai Dinsos. React 19 + Vite + Tailwind v4,
konsumsi REST API dari backend Laravel (`ksp-backend`). Autentikasi berbasis token via
Laravel Sanctum (lihat `src/services/api.js`).

## 1. Instalasi

```bash
npm install
```

## 2. Setup environment

Buat/edit file `.env` di root project:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Sesuaikan URL kalau backend Laravel jalan di host/port lain. Pastikan juga backend sudah
mengaktifkan CORS untuk origin dev server ini (default Vite: `http://localhost:5173`) —
lihat README backend bagian "Aktifkan CORS".

## 3. Jalankan dev server

```bash
npm run dev
# -> http://localhost:5173
```

Build production: `npm run build` (output ke `dist/`). Preview build: `npm run preview`.

## Struktur halaman

| Path | Untuk role | Isi |
|---|---|---|
| `pages/login.jsx` | public | Login (NIP + password) |
| `pages/dashboard.jsx` | ANGGOTA | Beranda / ringkasan simpanan & pinjaman aktif |
| `pages/simpananku.jsx` | ANGGOTA | Riwayat simpanan, ajukan tarik simpanan |
| `pages/pinjaman.jsx` | ANGGOTA | Riwayat & status pinjaman |
| `pages/ajukan.jsx` | ANGGOTA | Form ajukan pinjaman baru / top-up |
| `pages/profil.jsx`, `edit.jsx`, `sandi.jsx` | ANGGOTA | Profil & ubah password |
| `pages/admin/DashboardBendahara.jsx` | BENDAHARA/KETUA | Ringkasan operasional |
| `pages/admin/DataAnggota.jsx`, `DetailAnggota.jsx` | BENDAHARA/KETUA | Kelola data & simpanan anggota |
| `pages/admin/VerifikasiPinjaman.jsx`, `VerifikasiDetail.jsx` | BENDAHARA/KETUA | Verifikasi pengajuan pinjaman |
| `pages/admin/KasKoperasi.jsx` | BENDAHARA/KETUA | Riwayat & tarik kas koperasi |
| `pages/admin/ProfileAdmin.jsx`, `UbahPassword.jsx` | BENDAHARA/KETUA | Profil & ubah password |
| `pages/ketua/DashboardKetua.jsx` | KETUA | Ringkasan + audit log |
| `pages/ketua/PersetujuanPinjaman.jsx` | KETUA | Persetujuan final pinjaman |
| `pages/ketua/EmergencyBypass.jsx` | KETUA | Bypass approval darurat |
| `pages/ketua/KendaliKebijakan.jsx` | KETUA | Atur plafon, suku bunga, minimal progress top-up |
| `pages/ketua/PengurusAnggota.jsx` | KETUA | Kelola akun Bendahara/Ketua |
| `pages/shared/ProfilPengurus.jsx`, `UbahPasswordPengurus.jsx` | BENDAHARA/KETUA | Komponen profil/password bersama |

`src/services/api.js` berisi instance axios terpusat (base URL dari `VITE_API_URL`, header
Authorization otomatis) — semua pemanggilan API di halaman-halaman di atas lewat sini.

## Catatan integrasi backend

- Panel **Super Admin** (audit & operasional darurat) berada di sisi backend Laravel/Filament
  (`/admin`), **bukan** bagian dari aplikasi React ini — lihat README backend.
- Daftar lengkap endpoint API dan halaman FE mana yang memakainya ada di README backend,
  bagian "Endpoint API".