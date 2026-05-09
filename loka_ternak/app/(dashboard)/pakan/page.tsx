"use client";

import React, { useState, useMemo } from "react";
import { usePakan } from "@/hooks/usePakan";
import { Plus, Edit2, Trash2, AlertTriangle, Package, DollarSign, Activity, FileText } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { Pakan } from "@/lib/types/pakan";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function ManajemenPakan() {
  const { 
    pakanList, 
    penggunaanList, 
    isLoading, 
    error, 
    addPakan, 
    updatePakan, 
    deletePakan, 
    catatPenggunaan 
  } = usePakan();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPenggunaanOpen, setIsPenggunaanOpen] = useState(false);
  const [selectedPakan, setSelectedPakan] = useState<Pakan | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Pakan>>({
    nama: "", kategori: "Hijauan", stokKg: 0, batasKritisKg: 0, hargaPerKg: 0
  });
  const [penggunaanData, setPenggunaanData] = useState({
    idPakan: "", tanggal: new Date().toISOString().split('T')[0], jumlahKg: 0, keterangan: ""
  });
  const [formError, setFormError] = useState("");

  // Derived Insights
  const totalStok = pakanList.reduce((acc, p) => acc + p.stokKg, 0);
  const pakanKritisCount = pakanList.filter(p => p.stokKg <= p.batasKritisKg).length;
  const totalNilaiStok = pakanList.reduce((acc, p) => acc + (p.stokKg * p.hargaPerKg), 0);

  // Prepare chart data (Usage over last 7 days)
  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = new Date();
    // Initialize last 7 days with 0
    for(let i=6; i>=0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      data[d.toISOString().split('T')[0]] = 0;
    }
    
    penggunaanList.forEach(usage => {
      if (data[usage.tanggal] !== undefined) {
        data[usage.tanggal] += usage.jumlahKg;
      }
    });

    return Object.keys(data).map(date => ({
      tanggal: date,
      totalPenggunaan: parseFloat(data[date].toFixed(2))
    }));
  }, [penggunaanList]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedPakan(null);
    setFormData({ nama: "", kategori: "Hijauan", stokKg: 0, batasKritisKg: 0, hargaPerKg: 0 });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pakan: Pakan) => {
    setSelectedPakan(pakan);
    setFormData(pakan);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (pakan: Pakan) => {
    setSelectedPakan(pakan);
    setIsDeleteOpen(true);
  };

  const handleOpenPenggunaan = () => {
    setFormError("");
    setPenggunaanData({ idPakan: pakanList[0]?.id || "", tanggal: new Date().toISOString().split('T')[0], jumlahKg: 0, keterangan: "" });
    setIsPenggunaanOpen(true);
  };

  const handleSavePakan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPakan) {
        await updatePakan({ ...formData, id: selectedPakan.id } as Pakan);
      } else {
        await addPakan(formData as Omit<Pakan, "id">);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePakan = async () => {
    if (selectedPakan) {
      await deletePakan(selectedPakan.id);
      setIsDeleteOpen(false);
      setSelectedPakan(null);
    }
  };

  const handleSavePenggunaan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await catatPenggunaan({
        ...penggunaanData,
        jumlahKg: parseFloat(penggunaanData.jumlahKg.toString())
      });
      setIsPenggunaanOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data pakan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pakan</h1>
          <p className="text-gray-500 mt-1">Pantau stok, catat penggunaan, dan optimalkan biaya pakan.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenPenggunaan}
            className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Catat Penggunaan
          </button>
          <button 
            onClick={handleOpenCreate}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pakan
          </button>
        </div>
      </header>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Stok Tersedia" 
          value={`${totalStok.toLocaleString('id-ID')} kg`} 
          icon={<Package className="w-6 h-6 text-emerald-600" />} 
        />
        <DashboardCard 
          title="Pakan Kritis (Stok Tipis)" 
          value={pakanKritisCount} 
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} 
          className={pakanKritisCount > 0 ? "border-amber-200 bg-amber-50/30" : ""}
          trend={pakanKritisCount > 0 ? { value: pakanKritisCount, isPositive: false, text: "perlu segera dibeli" } : undefined}
        />
        <DashboardCard 
          title="Estimasi Nilai Stok" 
          value={formatCurrency(totalNilaiStok)} 
          icon={<DollarSign className="w-6 h-6 text-blue-600" />} 
        />
      </div>

      {/* Visualizations & Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Tren Penggunaan 7 Hari Terakhir
          </h3>
          <div className="h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(val) => val.slice(5)} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="totalPenggunaan" name="Penggunaan (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Inventaris Pakan</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Pakan</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Stok (kg)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Harga/kg</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pakanList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Belum ada data pakan.
                    </td>
                  </tr>
                ) : (
                  pakanList.map((item) => {
                    const isKritis = item.stokKg <= item.batasKritisKg;
                    const stockPercentage = Math.min(100, (item.stokKg / (item.batasKritisKg * 3)) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{item.stokKg}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              isKritis ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                            )}></span>
                            <span className={cn("text-xs font-medium", isKritis ? "text-red-600" : "text-emerald-600")}>
                              {isKritis ? "Kritis" : "Aman"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{formatCurrency(item.hargaPerKg)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleOpenDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal CRUD Pakan */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedPakan ? "Edit Pakan" : "Tambah Pakan Baru"}>
        <form onSubmit={handleSavePakan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pakan</label>
            <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Contoh: Rumput Odot" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="Hijauan">Hijauan</option>
                <option value="Konsentrat">Konsentrat</option>
                <option value="Vitamin/Obat">Vitamin/Obat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Per Kg (Rp)</label>
              <input required type="number" min="0" value={formData.hargaPerKg || ""} onChange={e => setFormData({...formData, hargaPerKg: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal (kg)</label>
              <input required type="number" step="0.1" min="0" value={formData.stokKg || ""} onChange={e => setFormData({...formData, stokKg: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Kritis (kg)</label>
              <input required type="number" step="0.1" min="0" value={formData.batasKritisKg || ""} onChange={e => setFormData({...formData, batasKritisKg: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Modal Catat Penggunaan */}
      <Modal isOpen={isPenggunaanOpen} onClose={() => setIsPenggunaanOpen(false)} title="Catat Penggunaan Pakan Harian">
        <form onSubmit={handleSavePenggunaan} className="space-y-4">
          {formError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{formError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pakan</label>
            <select required value={penggunaanData.idPakan} onChange={e => setPenggunaanData({...penggunaanData, idPakan: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="" disabled>-- Pilih Pakan --</option>
              {pakanList.map(p => (
                <option key={p.id} value={p.id}>{p.nama} (Stok: {p.stokKg}kg)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input required type="date" value={penggunaanData.tanggal} onChange={e => setPenggunaanData({...penggunaanData, tanggal: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (kg)</label>
              <input required type="number" step="0.1" min="0.1" value={penggunaanData.jumlahKg || ""} onChange={e => setPenggunaanData({...penggunaanData, jumlahKg: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
            <textarea value={penggunaanData.keterangan} onChange={e => setPenggunaanData({...penggunaanData, keterangan: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" rows={2} placeholder="Contoh: Pemberian pagi kandang A"></textarea>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
            <button type="button" onClick={() => setIsPenggunaanOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Catat Penggunaan</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Hapus Data Pakan">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
            Apakah Anda yakin ingin menghapus <strong>{selectedPakan?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
            <button onClick={handleDeletePakan} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm">Ya, Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
