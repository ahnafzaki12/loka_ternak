"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Package, AlertCircle, ArrowUpRight, ArrowDownRight, Archive, CheckCircle2, Box, RefreshCw } from "lucide-react";
import Modal from "@/components/Modal";
import DashboardCard from "@/components/DashboardCard";
import { cn } from "@/lib/utils";

export type InventoryItem = {
  id: string;
  nama: string;
  kategori: "Pakan" | "Obat" | "Peralatan" | "Lainnya";
  stok: number;
  minStok: number;
  satuan: string;
  terakhirUpdate: string;
};

const initialInventory: InventoryItem[] = [
  { id: "inv1", nama: "Rumput Gajah", kategori: "Pakan", stok: 150, minStok: 50, satuan: "kg", terakhirUpdate: "2026-05-06" },
  { id: "inv2", nama: "Konsentrat Premium", kategori: "Pakan", stok: 25, minStok: 30, satuan: "kg", terakhirUpdate: "2026-05-05" },
  { id: "inv3", nama: "Vaksin PMK", kategori: "Obat", stok: 10, minStok: 15, satuan: "dosis", terakhirUpdate: "2026-05-01" },
  { id: "inv4", nama: "Vitamin B Kompleks", kategori: "Obat", stok: 50, minStok: 20, satuan: "botol", terakhirUpdate: "2026-04-20" },
  { id: "inv5", nama: "Gunting Kuku", kategori: "Peralatan", stok: 5, minStok: 2, satuan: "pcs", terakhirUpdate: "2026-01-15" },
  { id: "inv6", nama: "Rumput Odot", kategori: "Pakan", stok: 80, minStok: 40, satuan: "kg", terakhirUpdate: "2026-05-06" },
];

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStockUpdateOpen, setIsStockUpdateOpen] = useState(false);
  
  // Form States
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    nama: "",
    kategori: "Pakan",
    stok: 0,
    minStok: 0,
    satuan: "kg"
  });

  // Stock Update Form States
  const [stockUpdateType, setStockUpdateType] = useState<"Masuk" | "Keluar">("Masuk");
  const [stockUpdateAmount, setStockUpdateAmount] = useState<number>(0);

  // Derived state
  const filteredData = data.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.nama.localeCompare(b.nama));

  const stats = useMemo(() => {
    const totalItems = data.length;
    const lowStockItems = data.filter(item => item.stok <= item.minStok).length;
    
    // Most common category
    const categoryCounts = data.reduce((acc, item) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { totalItems, lowStockItems, topCategory };
  }, [data]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ nama: "", kategori: "Pakan", stok: 0, minStok: 0, satuan: "kg" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDeleteOpen(true);
  };

  const handleOpenStockUpdate = (item: InventoryItem) => {
    setEditingItem(item);
    setStockUpdateAmount(0);
    setStockUpdateType("Masuk");
    setIsStockUpdateOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { 
        ...item, 
        ...formData, 
        terakhirUpdate: new Date().toISOString().split('T')[0] 
      } as InventoryItem : item));
    } else {
      setData([...data, {
        ...formData as InventoryItem,
        id: Math.random().toString(36).substr(2, 9),
        terakhirUpdate: new Date().toISOString().split('T')[0]
      }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (editingItem) {
      setData(data.filter(item => item.id !== editingItem.id));
      setIsDeleteOpen(false);
    }
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && stockUpdateAmount > 0) {
      setData(data.map(item => {
        if (item.id === editingItem.id) {
          const newStock = stockUpdateType === "Masuk" 
            ? item.stok + stockUpdateAmount 
            : Math.max(0, item.stok - stockUpdateAmount);
          return { ...item, stok: newStock, terakhirUpdate: new Date().toISOString().split('T')[0] };
        }
        return item;
      }));
    }
    setIsStockUpdateOpen(false);
  };

  // UI Helpers
  const getCategoryBadge = (kategori: string) => {
    switch (kategori) {
      case "Pakan": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Obat": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Peralatan": return "bg-purple-50 text-purple-700 border-purple-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStockStatus = (stok: number, minStok: number) => {
    if (stok === 0) return { label: "Habis", style: "text-red-700 bg-red-50 border-red-200", icon: <AlertCircle className="w-3.5 h-3.5" />, progress: "bg-red-500 w-0" };
    if (stok <= minStok) return { label: "Menipis", style: "text-amber-700 bg-amber-50 border-amber-200", icon: <AlertCircle className="w-3.5 h-3.5" />, progress: "bg-amber-400 w-1/4" };
    return { label: "Aman", style: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" />, progress: "bg-emerald-500 w-3/4" };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Inventory</h1>
          <p className="text-gray-500 mt-1">Kelola stok pakan, obat-obatan, dan perlengkapan peternakan.</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Barang Baru
        </button>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Macam Barang" 
          value={stats.totalItems} 
          icon={<Archive className="w-6 h-6 text-emerald-600" />} 
          trend={{ value: 100, isPositive: true, text: "tercatat di sistem" }}
        />
        <DashboardCard 
          title="Kategori Terbanyak" 
          value={stats.topCategory} 
          icon={<Package className="w-6 h-6 text-blue-500" />} 
          className="border-blue-100"
        />
        <DashboardCard 
          title="Peringatan Stok" 
          value={stats.lowStockItems} 
          icon={<AlertCircle className="w-6 h-6 text-red-500" />} 
          className={stats.lowStockItems > 0 ? "border-red-200 bg-red-50/30" : "border-emerald-100"}
          trend={stats.lowStockItems > 0 ? { value: stats.lowStockItems, isPositive: false, text: "barang perlu restock" } : undefined}
        />
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari nama barang..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-3 py-2 outline-none w-full sm:w-auto"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Pakan">Pakan</option>
              <option value="Obat">Obat</option>
              <option value="Peralatan">Peralatan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filter Lanjutan
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 w-64">Stok Saat Ini</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Update Terakhir</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada barang yang ditemukan di inventory.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const status = getStockStatus(item.stok, item.minStok);
                  const isLow = item.stok <= item.minStok;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", 
                          item.kategori === 'Pakan' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          item.kategori === 'Obat' ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-purple-50 border-purple-100 text-purple-600"
                        )}>
                          <Box className="w-4 h-4" />
                        </div>
                        {item.nama}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium border",
                          getCategoryBadge(item.kategori)
                        )}>
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-end justify-between">
                            <span className={cn("font-bold text-base", isLow ? "text-red-600" : "text-gray-900")}>
                              {item.stok} <span className="text-sm font-normal text-gray-500">{item.satuan}</span>
                            </span>
                            <span className="text-xs text-gray-400">Min: {item.minStok}</span>
                          </div>
                          {/* Progress Bar Indicator */}
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={cn("h-1.5 rounded-full transition-all", status.progress, item.stok === 0 && "w-0")}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit border",
                          status.style
                        )}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(item.terakhirUpdate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenStockUpdate(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors text-xs font-bold border border-emerald-200"
                            title="Update Stok (Masuk/Keluar)"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Stok
                          </button>
                          <div className="w-px h-6 bg-gray-200 mx-1 self-center hidden sm:block"></div>
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Barang"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenDelete(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus Barang"
                          >
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

      {/* CRUD Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit Data Barang" : "Tambah Barang Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input 
              required
              type="text" 
              value={formData.nama}
              onChange={e => setFormData({...formData, nama: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Contoh: Rumput Gajah"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                value={formData.kategori}
                onChange={e => setFormData({...formData, kategori: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="Pakan">Pakan</option>
                <option value="Obat">Obat</option>
                <option value="Peralatan">Peralatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input 
                required
                type="text" 
                value={formData.satuan}
                onChange={e => setFormData({...formData, satuan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="kg, liter, botol, dll"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.stok === 0 && !editingItem ? "" : formData.stok}
                onChange={e => setFormData({...formData, stok: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Minimum (Alert)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.minStok === 0 && !editingItem ? "" : formData.minStok}
                onChange={e => setFormData({...formData, minStok: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="10"
              />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              Simpan Barang
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Update Fast Action Modal */}
      <Modal 
        isOpen={isStockUpdateOpen} 
        onClose={() => setIsStockUpdateOpen(false)}
        title="Update Stok Cepat"
      >
        <form onSubmit={handleStockUpdate} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{editingItem?.nama}</p>
              <p className="text-xs text-gray-500">Stok saat ini: {editingItem?.stok} {editingItem?.satuan}</p>
            </div>
            <div className={cn("px-2.5 py-1 rounded-md text-xs font-semibold border", getCategoryBadge(editingItem?.kategori || ""))}>
              {editingItem?.kategori}
            </div>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setStockUpdateType("Masuk")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                stockUpdateType === "Masuk" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ArrowDownRight className="w-4 h-4" />
              Barang Masuk
            </button>
            <button
              type="button"
              onClick={() => setStockUpdateType("Keluar")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                stockUpdateType === "Keluar" ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ArrowUpRight className="w-4 h-4" />
              Barang Keluar
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah {stockUpdateType === "Masuk" ? "Ditambahkan" : "Dikurangi"}
            </label>
            <div className="relative">
              <input 
                required
                type="number" 
                min="1"
                value={stockUpdateAmount === 0 ? "" : stockUpdateAmount}
                onChange={e => setStockUpdateAmount(parseInt(e.target.value) || 0)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl text-lg font-bold focus:outline-none focus:ring-2 transition-all",
                  stockUpdateType === "Masuk" 
                    ? "border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-700" 
                    : "border-amber-200 focus:ring-amber-500/20 focus:border-amber-500 text-amber-700"
                )}
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {editingItem?.satuan}
              </span>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsStockUpdateOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className={cn(
                "px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm",
                stockUpdateType === "Masuk" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
              )}
            >
              Konfirmasi {stockUpdateType}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        title="Hapus Barang"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm border border-red-100">
            Apakah Anda yakin ingin menghapus <strong>{editingItem?.nama}</strong> dari inventory? 
            Tindakan ini tidak dapat dibatalkan.
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
