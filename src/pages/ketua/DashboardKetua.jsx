import React from 'react';
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  Shield, 
  CalendarDays, 
  HeartHandshake 
} from 'lucide-react';

export default function DashboardKetua() {
  const auditLogs = [
    {
      timestamp: '24 Oct 2023, 09:42',
      staff: 'Irfan Hakim (Manager)',
      category: 'LOAN DISBURSEMENT',
      details: 'ID-LOAN-9842 (Rp 250M)',
      status: 'Success',
      statusType: 'success'
    },
    {
      timestamp: '24 Oct 2023, 08:15',
      staff: 'Siti Aminah (Audit)',
      category: 'SYSTEM CONFIG',
      details: 'Interest Rate Revision Q4',
      status: 'Pending Boss',
      statusType: 'pending'
    },
    {
      timestamp: '23 Oct 2023, 17:30',
      staff: 'Budi Santoso (Admin)',
      category: 'DATA EXPORT',
      details: 'Member Contact Database',
      status: 'Success',
      statusType: 'success'
    },
    {
      timestamp: '23 Oct 2023, 15:20',
      staff: 'Unknown (System)',
      category: 'SECURITY ALERT',
      details: 'Failed Login Attempt x5',
      status: 'Investigating',
      statusType: 'danger'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* TITLE & WELCOME */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard Utama
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Selamat pagi, Ketua. Berikut adalah ringkasan kesehatan finansial KSP Sejahtera hari ini.
        </p>
      </div>

      {/* 3 CARD KEUANGAN UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Kas Koperasi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 size={16} />
            </div>
            <span>TOTAL KAS KOPERASI</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rp 4.280.550.000
          </div>
        </div>

        {/* Total Simpanan Anggota */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900"></div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <span>TOTAL SIMPANAN ANGGOTA</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rp 2.150.320.000
          </div>
        </div>

        {/* Total Pinjaman Aktif */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <span>TOTAL PINJAMAN AKTIF</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rp 1.845.900.000
          </div>
        </div>

      </div>

      {/* PEMBAGIAN SIMPANAN ANGGOTA */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Pembagian Simpanan Anggota
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Simpanan Pokok */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                SIMPANAN POKOK
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                Rp 500.000
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Dibayar sekali saat mendaftar keanggotaan koperasi.
            </p>
          </div>

          {/* Simpanan Wajib */}
          <div className="bg-white border-2 border-amber-400/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                SIMPANAN WAJIB
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                Rp 2.000.000
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Dibayar setiap bulan sebagai komitmen aktif anggota.
            </p>
          </div>

          {/* Simpanan Sukarela */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartHandshake size={20} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                SIMPANAN SUKARELA
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                Rp 10.000.000
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Bisa ditarik kapan saja tanpa syarat waktu tertentu.
            </p>
          </div>

        </div>
      </div>

      {/* AUDIT LOG TRACKER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Audit Log Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoring recent high-level staff actions
            </p>
          </div>
          <button className="text-xs font-bold text-slate-800 hover:underline cursor-pointer">
            View Full History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/40 border-b border-slate-200/60 text-slate-600 font-bold">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Action Category</th>
                <th className="p-4">Item Details</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="p-4 pl-6 font-medium text-slate-500">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-900">{log.staff}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${
                      log.category === 'LOAN DISBURSEMENT' ? 'bg-blue-100 text-blue-700' :
                      log.category === 'SYSTEM CONFIG' ? 'bg-amber-100 text-amber-800' :
                      log.category === 'DATA EXPORT' ? 'bg-purple-100 text-purple-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{log.details}</td>
                  <td className="p-4 pr-6 font-bold">
                    {log.statusType === 'success' && (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span>✓</span> {log.status}
                      </span>
                    )}
                    {log.statusType === 'pending' && (
                      <span className="text-amber-600 flex items-center gap-1">
                        <span>⏳</span> {log.status}
                      </span>
                    )}
                    {log.statusType === 'danger' && (
                      <span className="text-rose-600 flex items-center gap-1">
                        <span>⚠</span> {log.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}