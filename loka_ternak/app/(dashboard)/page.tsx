import React from "react";
import DashboardCard from "@/components/DashboardCard";
import WeightChart from "@/components/WeightChart";
import { Users, SearchCheck, DollarSign, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan peternakan Anda.</p>
        </div>
        
        {/* Date / Action Area */}
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Unduh Laporan
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
            + Tambah Ternak
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Ternak"
          value={124}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true, text: "dari bulan lalu" }}
        />
        <DashboardCard
          title="Ternak Siap Jual"
          value={32}
          icon={<SearchCheck className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true, text: "dari minggu lalu" }}
        />
        <DashboardCard
          title="Pengeluaran Bulan Ini"
          value="Rp 4.5M"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 2.1, isPositive: false, text: "dari bulan lalu" }}
        />
        <DashboardCard
          title="Notifikasi Aktif"
          value={3}
          icon={<Bell className="w-5 h-5" />}
          className="ring-1 ring-amber-100 bg-gradient-to-br from-white to-amber-50/30"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <WeightChart />
        </div>

        {/* Notifications list */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Notifikasi Terbaru</h3>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Lihat Semua</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Jadwal Vaksinasi</p>
                <p className="text-xs text-gray-500 mt-1">15 Kambing di Kandang A perlu divaksin hari ini.</p>
                <p className="text-xs text-gray-400 mt-2">2 jam yang lalu</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Stok Pakan Menipis</p>
                <p className="text-xs text-gray-500 mt-1">Konsentrat tersisa untuk 3 hari ke depan.</p>
                <p className="text-xs text-gray-400 mt-2">Kemarin</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ternak Lahir</p>
                <p className="text-xs text-gray-500 mt-1">2 anak kambing lahir sehat di Kandang B.</p>
                <p className="text-xs text-gray-400 mt-2">Kemarin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
