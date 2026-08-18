import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, getUserRole } from './services/api';

// 1. IMPORT LAYOUTS
import Layout from './components/layout';               // Layout untuk User/Anggota
import AdminLayout from './components/AdminLayout';       // Layout untuk Admin/Bendahara
import KetuaLayout from './components/KetuaLayout';   // Layout untuk ketua

// 2. IMPORT HALAMAN - USER / ANGGOTA
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Simpananku from './pages/simpananku';
import Pinjaman from './pages/pinjaman';
import Profil from './pages/profil';
import Ajukan from './pages/ajukan';
import Edit from './pages/edit';
import Sandi from './pages/sandi';

// 3. IMPORT HALAMAN - ADMIN / BENDAHARA
import DashboardBendahara from './pages/admin/DashboardBendahara';
import VerifikasiPinjaman from './pages/admin/VerifikasiPinjaman';
import DataAnggota from './pages/admin/DataAnggota';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import UbahPassword from './pages/admin/UbahPassword';
import DetailAnggota from './pages/admin/DetailAnggota';
import VerifikasiDetail from './pages/admin/VerifikasiDetail';
import KasKoperasi from './pages/admin/KasKoperasi';

// IMPORT HALAMAN - KETUA
import DashboardKetua from './pages/ketua/DashboardKetua';
import KendaliKebijakan from './pages/ketua/KendaliKebijakan';
import PersetujuanPinjaman from './pages/ketua/PersetujuanPinjaman';
import EmergencyBypass from './pages/ketua/EmergencyBypass';
import PengurusAnggota from './pages/ketua/PengurusAnggota';
import ProfileKetua from './pages/ketua/ProfileKetua';
import UbahPasswordKetua from './pages/ketua/UbahPasswordKetua';

// 4. PROTECTED ROUTE HELPERS (Pengaman Akses)
// PENTING: pakai getToken()/getUserRole() dari services/api.js (cek localStorage
// MAUPUN sessionStorage), JANGAN akses localStorage langsung di sini. Kalau akses
// langsung, user yang login TANPA centang "Ingat Saya" (token disimpan di
// sessionStorage) akan selalu dianggap belum login oleh guard ini begitu pindah
// halaman/refresh, walau API call lain tetap jalan normal (karena axios
// interceptor di api.js sudah benar ceknya).
const ProtectedUserRoute = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) return <Navigate to="/login" replace />;
  // Hanya BENDAHARA dan KETUA yang boleh masuk
  if (role !== 'BENDAHARA' && role !== 'KETUA') return <Navigate to="/dashboard" replace />;

  return children;
};

const ProtectedKetuaRoute = ({ children }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) return <Navigate to="/login" replace />;
  // Hanya KETUA yang boleh masuk (Bendahara tidak boleh akses fitur eksekutif Ketua)
  if (role !== 'KETUA') return <Navigate to="/dashboard" replace />;

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= 1. PUBLIC ROUTE ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= 2. ROUTES USER / ANGGOTA ================= */}
        {/* Semua halaman di bawah ini otomatis dibungkus <Layout> milik User */}
        <Route
          element={
            <ProtectedUserRoute>
              <Layout />
            </ProtectedUserRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simpananku" element={<Simpananku />} />
          <Route path="/pinjaman" element={<Pinjaman />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/ajukan" element={<Ajukan />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/sandi" element={<Sandi />} />
        </Route>

        {/* ================= 3. ROUTES ADMIN / BENDAHARA ================= */}
        {/* Semua halaman di bawah ini otomatis dibungkus <AdminLayout> */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          {/* Mengarahkan /admin langsung ke /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardBendahara />} />
          
          {/* Placeholder Halaman Admin Lainnya */}
          <Route path="verifikasi" element={<VerifikasiPinjaman/>} />
          <Route path="verifikasi/:id" element={<VerifikasiDetail />} />
          <Route path="anggota" element={<DataAnggota/>} />
          <Route path="anggota/:id" element={<DetailAnggota />} />
          <Route path="kas" element={<KasKoperasi />} />
          <Route path="profile" element={<ProfileAdmin/>} />
          <Route path="profile/ubah-password" element={<UbahPassword />} />
        </Route>

        {/* ================= 4. REDIRECTS ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* ROUTE KETUA */}
        <Route
          path="/ketua"
          element={
            <ProtectedKetuaRoute>
              <KetuaLayout />
            </ProtectedKetuaRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardKetua />} />
          <Route path="kebijakan" element={<KendaliKebijakan/>} />
          <Route path="persetujuan" element={<PersetujuanPinjaman/>} />
          <Route path="persetujuan/bypass" element={<EmergencyBypass/>} />
          <Route path="pengurus" element={<PengurusAnggota/>} />
          <Route path="kas" element={<KasKoperasi />} />
          <Route path="profile" element={<ProfileKetua />} />
          <Route path="profile/ubah-password" element={<UbahPasswordKetua />} />
        </Route>


      </Routes>
    </Router>
  );
}