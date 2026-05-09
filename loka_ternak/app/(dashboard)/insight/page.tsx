"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  PieChart, 
  Activity, 
  Wallet,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InsightPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insight Bisnis & Data</h1>
          <p className="text-gray-500 mt-1">Analisis mendalam tentang performa peternakan Anda.</p>
        </div>
      </header>

      {/* Business Insights Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          Insight Bisnis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-red-200">
                Perhatian
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Pengeluaran Naik 20%</h3>
            <p className="text-sm text-gray-600 mb-4">Dibandingkan bulan lalu. Kenaikan terbesar pada biaya pakan dan perawatan medis.</p>
            <button className="text-sm font-semibold text-red-600 flex items-center gap-1 hover:text-red-700">
              Lihat Rincian <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <PieChart className="w-6 h-6" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                Positif
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">ROI Stabil 15%</h3>
            <p className="text-sm text-gray-600 mb-4">Return on Investment bulan ini menunjukkan stabilitas yang baik di peternakan utama.</p>
            <button className="text-sm font-semibold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
              Lihat Rincian <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Data / Performance Insights Section */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Insight Data & Performa Ternak
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <TrendingDown className="w-6 h-6" />
              </div>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                Evaluasi
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Pertumbuhan Ras Kacang Lambat</h3>
            <p className="text-sm text-gray-600 mb-4">Dalam 3 bulan terakhir, rata-rata penambahan berat ras Kacang berada 10% di bawah target ideal.</p>
            <button className="text-sm font-semibold text-amber-600 flex items-center gap-1 hover:text-amber-700">
              Cek Manajemen Pakan <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                Info
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Aktivitas Harian Optimal</h3>
            <p className="text-sm text-gray-600 mb-4">Waktu di area pelepasan untuk ras Etawa cukup baik, berkorelasi dengan kesehatan yang prima.</p>
            <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700">
              Lihat Laporan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
