"use client";

import React, { useState, useMemo } from "react";
import { useKeuangan } from "@/hooks/useKeuangan";
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Wallet, PieChart, BarChart3, Filter } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { Transaksi, JenisTransaksi, KategoriPemasukan, KategoriPengeluaran } from "@/lib/types/keuangan";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function KeuanganPage() {
  const {
    transaksi,
    rawTransaksi,
    metrics,
    isLoading,
    error,
    filterBulan,
    setFilterBulan,
    filterJenis,
    setFilterJenis,
    addTransaksi,
    deleteTransaksi
  } = useKeuangan();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaksi>>({
    tanggal: new Date().toISOString().split('T')[0],
    jenis: "Pemasukan",
    kategori: "Penjualan Ternak",
    nominal: 0,
    keterangan: ""
  });

  // Extract unique months for filter from rawTransaksi
  const months = useMemo(() => {
    const m = new Set<string>();
    rawTransaksi.forEach(t => m.add(t.tanggal.substring(0, 7)));
    return Array.from(m).sort().reverse(); // newest first
  }, [rawTransaksi]);

  // Prepare Data for Charts
  const cashFlowData = useMemo(() => {
    const dailyMap: Record<string, { tanggal: string, Pemasukan: number, Pengeluaran: number }> = {};
    
    // Reverse so chart goes left-to-right chronologically
    [...transaksi].reverse().forEach(t => {
      const date = t.tanggal.substring(5); // MM-DD
      if (!dailyMap[date]) dailyMap[date] = { tanggal: date, Pemasukan: 0, Pengeluaran: 0 };
      if (t.jenis === "Pemasukan") dailyMap[date].Pemasukan += t.nominal;
      else dailyMap[date].Pengeluaran += t.nominal;
    });

    // Take last 14 unique dates if too many to prevent crowding
    return Object.values(dailyMap).slice(-14);
  }, [transaksi]);

  const expenseBreakdownData = useMemo(() => {
    const catMap: Record<string, number> = {};
    transaksi.forEach(t => {
      if (t.jenis === "Pengeluaran") {
        catMap[t.kategori] = (catMap[t.kategori] || 0) + t.nominal;
      }
    });
    return Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    })).sort((a, b) => b.value - a.value);
  }, [transaksi]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaksi(formData as Omit<Transaksi, "id">);
      setIsFormOpen(false);
      // Reset
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        jenis: "Pemasukan",
        kategori: "Penjualan Ternak",
        nominal: 0,
        keterangan: ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data keuangan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keuangan Peternakan</h1>
          <p className="text-gray-500 mt-1">Pantau arus kas, laba bersih, dan analisis pengeluaran.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </button>
      </header>

      {/* Strategic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Pemasukan" 
          value={formatCurrency(metrics.totalPemasukan)} 
          icon={<ArrowUpCircle className="w-6 h-6 text-emerald-600" />} 
          className="border-emerald-100"
        />
        <DashboardCard 
          title="Total Pengeluaran" 
          value={formatCurrency(metrics.totalPengeluaran)} 
          icon={<ArrowDownCircle className="w-6 h-6 text-red-600" />} 
          className="border-red-100"
        />
        <DashboardCard 
          title="Laba Bersih (Net Profit)" 
          value={formatCurrency(metrics.labaBersih)} 
          icon={<Wallet className="w-6 h-6 text-blue-600" />} 
          className={metrics.labaBersih >= 0 ? "border-blue-100 bg-blue-50/30" : "border-red-200 bg-red-50/50"}
          trend={{ value: metrics.labaBersih >= 0 ? 100 : 0, isPositive: metrics.labaBersih >= 0, text: metrics.labaBersih >= 0 ? "Profit Positif" : "Rugi (Defisit)" }}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter Data:</span>
        </div>
        <div className="flex gap-4 flex-1 md:flex-none">
          <select 
            value={filterBulan} 
            onChange={(e) => setFilterBulan(e.target.value)}
            className="flex-1 md:w-48 bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="Semua">Semua Waktu</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select 
            value={filterJenis} 
            onChange={(e) => setFilterJenis(e.target.value as any)}
            className="flex-1 md:w-48 bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="Semua">Semua Jenis</option>
            <option value="Pemasukan">Pemasukan Saja</option>
            <option value="Pengeluaran">Pengeluaran Saja</option>
          </select>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Tren Arus Kas Harian
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(val) => `Rp ${val / 1000000}M`} />
                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => formatCurrency(value)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            Distribusi Pengeluaran
          </h3>
          {expenseBreakdownData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">Tidak ada data pengeluaran</div>
          ) : (
            <>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={expenseBreakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {expenseBreakdownData.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{((item.value / metrics.totalPengeluaran) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Pemasukan</th>
                <th className="px-6 py-4 text-right">Pengeluaran</th>
                <th className="px-6 py-4 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada transaksi pada periode ini.
                  </td>
                </tr>
              ) : (
                transaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 text-gray-600">{new Date(t.tanggal).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {t.jenis === "Pemasukan" ? <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> : <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                        {t.kategori}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.keterangan}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">{t.jenis === "Pemasukan" ? formatCurrency(t.nominal) : "-"}</td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">{t.jenis === "Pengeluaran" ? formatCurrency(t.nominal) : "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteTransaksi(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Tambah Transaksi Baru">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
              <select value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value as any, kategori: e.target.value === "Pemasukan" ? "Penjualan Ternak" : "Pakan"})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20">
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20">
                {formData.jenis === "Pemasukan" ? (
                  <>
                    <option value="Penjualan Ternak">Penjualan Ternak</option>
                    <option value="Penjualan Susu">Penjualan Susu</option>
                    <option value="Penjualan Pupuk">Penjualan Pupuk</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="Pakan">Pakan</option>
                    <option value="Gaji Karyawan">Gaji Karyawan</option>
                    <option value="Obat & Vitamin">Obat & Vitamin</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
              <input required type="number" min="1" value={formData.nominal || ""} onChange={e => setFormData({...formData, nominal: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20" placeholder="Contoh: 150000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea required value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20" rows={2} placeholder="Detail transaksi..."></textarea>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Simpan Transaksi</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
