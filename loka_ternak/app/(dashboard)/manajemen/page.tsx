"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import Modal from "@/components/Modal";
import DashboardCard from "@/components/DashboardCard";
import { cn } from "@/lib/utils";
import { Ternak, mockDataTernak } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function ManajemenTernak() {
  const router = useRouter();
  const [data, setData] = useState<Ternak[]>(mockDataTernak);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected item for Edit/Delete
  const [selectedItem, setSelectedItem] = useState<Ternak | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Ternak>>({
    tag: "", jenis: "", berat: 0, tinggi: 0, kelamin: "Jantan", status: "Sehat"
  });

  // Filtered Data
  const filteredData = data.filter(item => 
    item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalKambing = data.length;
  const kambingSehat = data.filter(k => k.status === "Sehat").length;
  const kambingSakit = data.filter(k => k.status === "Sakit" || k.status === "Pemulihan").length;

  // Chart Data
  const breedCount = data.reduce((acc, curr) => {
    acc[curr.jenis] = (acc[curr.jenis] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const chartData = Object.keys(breedCount).map(key => ({
    name: key,
    populasi: breedCount[key]
  }));

  // Handlers
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData({ tag: "", jenis: "", berat: 0, tinggi: 0, kelamin: "Jantan", status: "Sehat" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: Ternak) => {
    e.stopPropagation();
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, item: Ternak) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      // Update
      setData(data.map(item => item.id === selectedItem.id ? { ...item, ...formData } as Ternak : item));
    } else {
      // Create
      const newItem: Ternak = {
        ...formData as Ternak,
        id: Math.random().toString(36).substr(2, 9),
        umurBulan: 0,
        tanggalLahir: new Date().toISOString().split('T')[0],
        riwayatPertumbuhan: [],
        riwayatPakan: [],
        riwayatKesehatan: [],
        aktivitas: []
      };
      setData([...data, newItem]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setData(data.filter(item => item.id !== selectedItem.id));
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/manajemen/${id}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Ternak</h1>
          <p className="text-gray-500 mt-1">Pantau performa dan kelola data kambing di peternakan Anda.</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Ternak
        </button>
      </header>

      {/* Powerful Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Populasi" 
          value={totalKambing} 
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} 
          trend={{ value: 5, isPositive: true, text: "dari bulan lalu" }}
        />
        <DashboardCard 
          title="Kambing Sehat" 
          value={kambingSehat} 
          icon={<Activity className="w-6 h-6 text-blue-600" />} 
          className="border-blue-100"
        />
        <DashboardCard 
          title="Perlu Perhatian (Sakit/Pemulihan)" 
          value={kambingSakit} 
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} 
          className="border-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Ras Kambing</h3>
          <div className="h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} allowDecimals={false} />
                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="populasi" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-100 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari ID Tag atau Jenis..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-b-2xl overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto h-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">ID Tag</th>
                    <th className="px-6 py-4">Jenis/Ras</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Berat (kg)</th>
                    <th className="px-6 py-4">Tinggi (cm)</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Tidak ada data ternak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleRowClick(item.id)}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-emerald-700">{item.tag}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <div>{item.jenis}</div>
                          <div className="text-xs text-gray-400">{item.kelamin}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium",
                            item.status === "Sehat" && "bg-emerald-50 text-emerald-700",
                            item.status === "Sakit" && "bg-red-50 text-red-700",
                            item.status === "Pemulihan" && "bg-amber-50 text-amber-700"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{item.berat}</td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{item.tinggi}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => handleOpenEdit(e, item)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => handleOpenDelete(e, item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Update Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={selectedItem ? "Edit Data Ternak" : "Tambah Data Ternak"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Tag</label>
            <input 
              required
              type="text" 
              value={formData.tag}
              onChange={e => setFormData({...formData, tag: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Contoh: KMB-005"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis/Ras</label>
              <input 
                required
                type="text" 
                value={formData.jenis}
                onChange={e => setFormData({...formData, jenis: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Contoh: Etawa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
              <input 
                required
                type="number" 
                step="0.1"
                min="0"
                value={formData.berat || ""}
                onChange={e => setFormData({...formData, berat: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Contoh: 45.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
              <input 
                required
                type="number" 
                step="0.1"
                min="0"
                value={formData.tinggi || ""}
                onChange={e => setFormData({...formData, tinggi: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Contoh: 75"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select 
                value={formData.kelamin}
                onChange={e => setFormData({...formData, kelamin: e.target.value as "Jantan" | "Betina"})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Kesehatan</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as "Sehat" | "Sakit" | "Pemulihan"})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="Sehat">Sehat</option>
                <option value="Sakit">Sakit</option>
                <option value="Pemulihan">Pemulihan</option>
              </select>
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
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        title="Hapus Data Ternak"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
            Apakah Anda yakin ingin menghapus ternak dengan ID Tag <strong>{selectedItem?.tag}</strong>? 
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
              Ya, Hapus Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
