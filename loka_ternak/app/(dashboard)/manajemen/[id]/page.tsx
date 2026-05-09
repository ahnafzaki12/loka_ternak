"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { getTernakById, Ternak } from "@/lib/mockData";
import { ArrowLeft, Edit2, Calendar, Scale, Ruler, HeartPulse, Clock, Activity, Bone, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface DetailTernakProps {
  params: Promise<{ id: string }>;
}

export default function DetailTernak({ params }: DetailTernakProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const ternak = getTernakById(resolvedParams.id);

  if (!ternak) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Ternak Tidak Ditemukan</h2>
        <button
          onClick={() => router.push("/manajemen")}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Manajemen
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => router.push("/manajemen")}
          className="text-gray-500 hover:text-emerald-600 font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
          <Edit2 className="w-4 h-4" />
          Edit Profil
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-md">
          <span className="text-4xl font-bold text-emerald-600">{ternak.tag.split('-')[1]}</span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ternak.tag}</h1>
              <p className="text-lg text-gray-500">{ternak.jenis} • {ternak.kelamin}</p>
            </div>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold inline-block",
              ternak.status === "Sehat" && "bg-emerald-100 text-emerald-700",
              ternak.status === "Sakit" && "bg-red-100 text-red-700",
              ternak.status === "Pemulihan" && "bg-amber-100 text-amber-700"
            )}>
              {ternak.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-sm">Berat</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{ternak.berat} <span className="text-sm font-normal text-gray-500">kg</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">Tinggi</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{ternak.tinggi} <span className="text-sm font-normal text-gray-500">cm</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Umur</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{ternak.umurBulan} <span className="text-sm font-normal text-gray-500">Bulan</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Lahir</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{new Date(ternak.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Growth Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Grafik Pertumbuhan Berat & Tinggi
              </h3>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ternak.riwayatPertumbuhan} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#10b981', fontSize: 12 }} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#3b82f6', fontSize: 12 }} dx={10} domain={['dataMin - 2', 'dataMax + 2']} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="berat" name="Berat (kg)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                  <Line yAxisId="right" type="monotone" dataKey="tinggi" name="Tinggi (cm)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Aktivitas Terkini
            </h3>
            {ternak.aktivitas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada catatan aktivitas.</p>
            ) : (
              <div className="space-y-4">
                {ternak.aktivitas.map((akt, index) => (
                  <div key={akt.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-emerald-200 rounded-full border-2 border-white ring-2 ring-emerald-50 mt-1"></div>
                      {index !== ternak.aktivitas.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-semibold text-gray-900">{akt.waktu} <span className="text-gray-400 font-normal ml-2">{new Date(akt.tanggal).toLocaleDateString('id-ID')}</span></p>
                      <p className="text-gray-600 mt-1">{akt.aktivitas}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Health & Feeding */}
        <div className="space-y-6">
          {/* Health History */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              Riwayat Kesehatan
            </h3>
            {ternak.riwayatKesehatan.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada catatan medis.</p>
            ) : (
              <div className="space-y-4">
                {ternak.riwayatKesehatan.map(kes => (
                  <div key={kes.id} className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{kes.kondisi}</h4>
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">{new Date(kes.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{kes.tindakan}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feeding History */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bone className="w-5 h-5 text-amber-500" />
              Jadwal & Riwayat Pakan
            </h3>
            {ternak.riwayatPakan.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada catatan pakan.</p>
            ) : (
              <div className="space-y-3">
                {ternak.riwayatPakan.map(pak => (
                  <div key={pak.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-700 p-2 rounded-lg text-xs font-bold w-12 text-center">
                        {pak.waktu}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{pak.jenisPakan}</p>
                        <p className="text-xs text-gray-500">{new Date(pak.tanggal).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{pak.jumlah}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
