# Product Requirement Document (PRD)
## Modul: Dashboard Anggota (KSP Sejahtera Dinas Sosial)

---

### 1. System Overview (Ringkasan Sistem)
Modul ini ditujukan bagi pegawai Dinas Sosial selaku anggota koperasi untuk memantau saldo simpanan secara transparan, melihat riwayat mutasi keuangan, serta mengajukan pinjaman baru dengan kalkulasi cicilan yang presisi secara mandiri.

---

### 2. Authentication (Alur Autentikasi)
* **Tujuan:** Membatasi akses masuk sistem hanya untuk anggota resmi Dinas Sosial yang datanya telah didaftarkan oleh Admin.
* **Persyaratan Teknis (Filament Implementation):**
  * Menggunakan kustomisasi otentikasi default Filament.
  * **Input Fields:** `NIP atau Username` dan `Password` (dilengkapi fitur *show/hide* `👁️`).
* **Aturan Bisnis (Business Logic):** Tidak ada halaman registrasi mandiri. Akun anggota bersifat *pre-created* oleh Admin.

---

### 3. Feature & Page Specifications (Spesifikasi Fitur & Halaman)

#### A. Halaman Beranda (Dashboard Overview)
Halaman utama setelah anggota berhasil masuk ke sistem. Fokus pada ringkasan informasi cepat.
* **Komponen UI (Filament Widgets):**
  * **Widget 1 (Stats Overview):** Kartu besar menampilkan **Total Simpanan Keseluruhan** (Penjumlahan otomatis Pokok + Wajib + Sukarela).
  * **Widget 2 (Sub-Saldo Grid):** Tiga kartu metrik di bawah saldo utama:
    * *Simpanan Pokok* (Saldo statis sesuai aturan awal masuk).
    * *Simpanan Wajib* (Akumulasi iuran bulanan).
    * *Simpanan Sukarela* (Saldo fleksibel yang bisa ditarik kapan saja).
  * **Widget 3 (Aktivitas Terakhir):** Tabel mini yang menampilkan 5 baris log aktivitas terbaru secara *real-time*.
    * *Cakupan Data:* Menampilkan aktivitas setoran (Pokok, Wajib, Sukarela), penarikan dana, serta riwayat pinjaman berjalan.
    * *Aksi Tambahan:* Di bagian bawah widget terdapat tombol **[Lihat Semua Aktivitas]** yang akan mengarahkan pengguna langsung ke halaman penuh "Simpananku" / tabel riwayat transaksi lengkap.

#### B. Halaman "Simpananku" (Savings & Transactions)
Halaman khusus untuk melihat performa tabungan secara mendalam dan seluruh riwayat mutasi dana.
* **Komponen UI:**
  * **Informasi Saldo:** Visualisasi detail pembagian 3 jenis simpanan (menggunakan komponen `View` kustom di Filament).
  * **Tabel Riwayat Transaksi (Filament Table Builder):**
    * *Kolom Tabel:* `Tanggal` | `Jenis Simpanan (Pokok / Wajib / Sukarela)` | `Tipe (Setor / Tarik)` | `Nominal` | `Status`.
    * *Fitur Tabel:* Dilengkapi dengan *filter* berdasarkan jenis simpanan dan fitur pencarian (*searchable*).

#### C. Halaman "Pinjaman" (Loan Management)
Halaman pusat untuk memantau status utang berjalan dan mengajukan bantuan dana baru.
* **Komponen UI:**
  * **Metrik Pemantauan (Top Cards):** Menampilkan detail pinjaman berjalan yang terdiri dari:
    * *Pinjaman Aktif* (Jumlah total pinjaman awal yang sedang berjalan).
    * *Tenor* (Periode waktu/sisa masa angsuran).
    * *Angsuran* (Nominal yang harus dibayarkan per bulan).
    * *Sisa Pinjaman* (Total sisa utang yang wajib dilunasi).
  * **Tabel Riwayat Pengajuan:** 
    * *Kolom Tabel:* `Tanggal Pengajuan` | `Nominal Pinjaman` | `Tenor` | `Status Persetujuan` (`Menunggu Bendahara` / `Menunggu Ketua` / `Aktif` / `Ditolak`).
  * **Aksi Utama:** Tombol **[Ajukan Pinjaman]** yang mengarahkan ke formulir sub-halaman.

##### Sub-Halaman: Formulir Ajukan Pinjaman Baru
* **Komponen UI (Filament Form Builder):**
  * **Informasi Paling Atas:** Menampilkan **Card Limit Pinjaman** (Sisa plafon kredit maksimal yang bisa diajukan anggota berdasarkan kebijakan koperasi).
  * `TextInput::make('nominal')` -> Input angka nominal pinjaman (divalidasi tidak boleh melebihi sisa limit kredit).
  * `Select::make('tenor')` -> Dropdown pilihan jangka waktu angsuran (misal: 3, 6, 12, 24 bulan).
  * `Select::make('keperluan')` -> Dropdown pilihan kategori tujuan meminjam (Pendidikan, Kesehatan, Renovasi, Darurat).
  * `Textarea::make('alasan')` -> Kolom teks bebas untuk penjelasan/keterangan tambahan.
  * **Kalkulator Simulasi (Live Reactive Form):** Kotak info ringkasan otomatis menggunakan fungsi `reactive()` Filament. Begitu nominal dan tenor diisi, sistem langsung memunculkan *Uang yang Diterima*, *Angsuran Pokok*, *Jasa Koperasi (Bunga)*, dan **Total Cicilan Bulanan** secara *real-time*.
  * **Tombol Aksi:** **[Kirim Pengajuan]** dan **[Batal]**.

#### D. Halaman Profil (User Profile)
Tempat anggota memantau dan memperbarui informasi identitas pribadi mereka.
* **Komponen UI:**
  * **Data Terkunci (Read-Only/Disabled):** Nama Lengkap, NIP, dan NIK (Tidak dapat diedit oleh pengguna untuk menjaga validitas data kepegawaian).
  * **Data Dapat Diedit (Editable Fields):** Nomor WhatsApp, Email, dan Foto Profil. Anggota bisa memperbarui data ini secara mandiri dengan menekan tombol simpan.
  * **Fitur Keamanan Utama:** Tombol **[Ubah Password]** yang memicu *modal pop-up* berisi kolom: *Password Lama, Password Baru,* dan *Konfirmasi Password Baru* demi keamanan berkala.

---

### 4. Flow Success Indicators (Indikator Keberhasilan Alur)
1. **Pengajuan Pinjaman:** Saat Anggota menekan tombol **[Kirim Pengajuan]**, status pada tabel riwayat pinjaman harus langsung memunculkan baris baru dengan label kuning: 🟡 `Menunggu Verifikasi Bendahara`.
2. **Batasan Validasi Form:** Form profil akan mengembalikan pesan error/red border jika format email atau nomor WhatsApp tidak sesuai standar masukan data atau kosong saat disimpan.