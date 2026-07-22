import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar Wrapper */}
      <div 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className="z-30"
      >
        <Sidebar isHovered={isSidebarHovered} />
      </div>

      {/* Konten Utama & Header */}
      {/* transition-all pl-xx kita taruh di pembungkus paling luar dari area kanan ini */}
      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${
        isSidebarHovered ? 'pl-64' : 'pl-20'
      }`}>
        
        {/* Header sekarang sudah sticky dan aman */}
        <Header isSidebarHovered={isSidebarHovered} />

        {/* Hapus `pt-24`, ganti dengan `pt-6` saja karena Header sudah tidak melayang lagi */}
        <main className="pt-6 p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}