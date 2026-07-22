import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, HelpCircle, ShieldCheck } from 'lucide-react';
import bgGedung from "../assets/dinsos-jateng.png";
import { usersData } from "../data/user";

export default function Login() {
  const navigate = useNavigate();
  
  // State Input & Error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. STATE YANG SEBELUMNYA HILANG (FIXED)
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Cari akun yang cocok di data lokal
    const foundUser = usersData.find(
      (user) => user.username === username && user.password === password
    );

    // Jika akun ditemukan
    if (foundUser) {
      localStorage.setItem('token', 'dummy-token-12345');
      localStorage.setItem('userRole', foundUser.role);
      localStorage.setItem('userName', foundUser.nama);

      // Redirect otomatis sesuai Role
      if (foundUser.role === 'ANGGOTA') {
        navigate('/dashboard');
      } else if (foundUser.role === 'BENDAHARA') {
        navigate('/admin/verifikasi'); // Atau /admin/dashboard
      } else if (foundUser.role === 'KETUA') {
        navigate('/ketua/dashboard'); // <-- SEKARANG KETUA PUNYA RUMAH SENDIRI! 🚀
      }
    } else {
      setErrorMsg('Username atau kata sandi salah!');
    }
  };
  
  return (
    <div className="min-h-screen flex font-sans bg-[#FBFBFD]">
      
      {/* BAGIAN KIRI: BRANDING & VISUAL */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative p-16 flex-col justify-between text-white after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/75 after:to-black/35"
        style={{ backgroundImage: `url(${bgGedung})` }} 
      >
        <div className="z-10 max-w-lg mt-auto mb-12 p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-4xl font-bold leading-tight mb-4 text-white drop-shadow-sm">
            Kesejahteraan Anggota Adalah Prioritas Kami
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed font-light">
            KSP Sejahtera hadir sebagai pilar finansial bagi seluruh pegawai di lingkungan Dinas Sosial, mendukung kemandirian ekonomi melalui transparansi dan integritas tinggi.
          </p>
        </div>

        <div className="z-10 flex gap-6 border-t border-white/20 pt-6 drop-shadow-md">
          <div>
            <div className="text-2xl font-bold text-yellow-400">10k+</div>
            <div className="text-xs text-gray-300 tracking-wider font-light mt-0.5">ANGGOTA AKTIF</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">Rp 50M+</div>
            <div className="text-xs text-gray-300 tracking-wider font-light mt-0.5">DANA TERKELOLA</div>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: FORMULIR LOGIN */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-16 lg:p-24 bg-white">
        
        <div className="hidden sm:block"></div>

        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0A1128] tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed font-light">
              Silakan masuk ke akun koperasi Anda untuk mengelola simpanan dan pinjaman.
            </p>
          </div>

          {/* 2. DIBUAT SAMA SESUAI STATE (errorMsg) */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Input Username / NIP */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0A1128]">
                NIP (Nomor Induk Pegawai)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <User size={18} className="stroke-[1.5]" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: 19850101XXXXXXXXXX"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-[#0A1128] transition-all bg-[#FBFBFD]"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0A1128]">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock size={18} className="stroke-[1.5]" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-[#0A1128] transition-all bg-[#FBFBFD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} className="stroke-[1.5]" /> : <Eye size={18} className="stroke-[1.5]" />}
                </button>
              </div>
            </div>

            {/* Checkbox Ingat Saya */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#0A1128] focus:ring-[#0A1128] border-gray-300 rounded accent-[#0A1128]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 font-light select-none cursor-pointer">
                Ingat Saya
              </label>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              className="w-full bg-[#0A1128] hover:bg-[#111c3e] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors shadow-sm mt-2 cursor-pointer"
            >
              Masuk
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="text-center space-y-3 pt-8">
          <div className="flex justify-center gap-6 text-[11px] text-gray-500 font-medium">
            <a href="#bantuan" className="flex items-center gap-1 hover:text-[#0A1128]">
              <HelpCircle size={13} /> Bantuan
            </a>
            <a href="#privasi" className="flex items-center gap-1 hover:text-[#0A1128]">
              <ShieldCheck size={13} /> Kebijakan Privasi
            </a>
          </div>
          <p className="text-[10px] text-gray-400 font-light">
            &copy; 2026 KSP Sejahtera Dinas Sosial
          </p>
        </div>

      </div>
    </div>
  );
}