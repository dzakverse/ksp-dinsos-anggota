# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Backend Starter — KSP Sejahtera (Laravel + MySQL)

File-file di sini adalah **kode siap-pakai**, bukan project Laravel penuh (composer
tidak bisa dijalankan di sandbox ini). Ikuti langkah di bawah untuk memasangnya.

## 1. Buat project Laravel baru

```bash
composer create-project laravel/laravel ksp-backend
cd ksp-backend
composer require laravel/sanctum
```

## 2. Salin file dari folder ini ke project Laravel

| Dari folder ini                          | Ke project Laravel                              |
|-------------------------------------------|--------------------------------------------------|
| `database/migrations/*.php`               | `database/migrations/`                            |
| `app/Models/*.php`                        | `app/Models/`                                     |
| `app/Http/Controllers/Api/*.php`          | `app/Http/Controllers/Api/`                       |
| `app/Http/Middleware/CheckRole.php`       | `app/Http/Middleware/`                            |
| `routes/api.php`                          | `routes/api.php` (replace/merge)                  |

## 3. Daftarkan middleware `role`

Di `bootstrap/app.php` (Laravel 11+), tambahkan di dalam `->withMiddleware()`:

```php
$middleware->alias([
    'role' => \App\Http\Middleware\CheckRole::class,
]);
```

## 4. Setup .env & database

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ksp_sejahtera
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173
```

Buat database `ksp_sejahtera` di MySQL, lalu:

```bash
php artisan migrate
```

## 5. Aktifkan CORS (WAJIB biar FE bisa akses)

Publish config CORS bawaan Laravel lalu edit `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // ganti sesuai URL FE
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## 6. Seeder akun demo (opsional, biar sama kayak data/user.js lama)

```bash
php artisan tinker
```
```php
\App\Models\User::create(['nip' => 'anggota', 'password' => bcrypt('123'), 'nama' => 'Budi Santoso', 'role' => 'ANGGOTA', 'id_anggota' => 'ANG-2024-001']);
\App\Models\User::create(['nip' => 'bendahara', 'password' => bcrypt('123'), 'nama' => 'Siti Aminah', 'role' => 'BENDAHARA']);
\App\Models\User::create(['nip' => 'ketua', 'password' => bcrypt('123'), 'nama' => 'Drs. H. Ahmad', 'role' => 'KETUA']);
```

## 7. Jalankan server

```bash
php artisan serve
# -> http://127.0.0.1:8000
```

API sekarang bisa diakses di `http://127.0.0.1:8000/api/...` — lihat `routes/api.php`
untuk daftar lengkap endpoint dan halaman FE mana yang memakainya.

## Endpoint yang sudah dibuatkan

| Method | Endpoint                              | Dipakai di FE                          | Role         |
|--------|-----------------------------------------|-----------------------------------------|--------------|
| POST   | /api/login                              | pages/login.jsx                         | public       |
| GET    | /api/me                                 | validasi token saat reload              | semua login  |
| POST   | /api/logout                             | tombol logout                           | semua login  |
| GET    | /api/simpanan                           | pages/dashboard.jsx, simpananku.jsx     | ANGGOTA      |
| GET    | /api/pinjaman                           | pages/pinjaman.jsx                      | ANGGOTA      |
| POST   | /api/pinjaman                           | pages/ajukan.jsx                        | ANGGOTA      |
| GET    | /api/admin/pinjaman                     | pages/admin/VerifikasiPinjaman.jsx      | BENDAHARA/KETUA |
| POST   | /api/admin/pinjaman/{id}/verifikasi     | pages/admin/VerifikasiDetail.jsx        | BENDAHARA/KETUA |
| POST   | /api/ketua/pinjaman/{id}/persetujuan    | pages/ketua/PersetujuanPinjaman.jsx     | KETUA        |

Halaman lain (DataAnggota, KendaliKebijakan, EmergencyBypass, PengurusAnggota, dll)
belum dibuatkan endpoint-nya — pola controller di atas bisa langsung dicontek/di-copy
untuk bikin yang baru sesuai kebutuhan.
