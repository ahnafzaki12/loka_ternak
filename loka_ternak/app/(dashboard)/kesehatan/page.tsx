"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, Filter, HeartPulse, Syringe, Bell, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";
import Modal from "@/components/Modal";
import DashboardCard from "@/components/DashboardCard";
import { cn } from "@/lib/utils";
import { Ternak, KesehatanHistory, mockDataTernak } from "@/lib/mockData";

type FlattenedHealthRecord = KesehatanHistory & {
  ternakId: string;
  ternakTag: string;
};

export default function KesehatanPage() {
  const [data, setData] = useState<Ternak[]>(mockDataTernak);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState("Semua");
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form States
  const [editingRecord, setEditingRecord] = useState<FlattenedHealthRecord | null>(null);
  
  const [formData, setFormData] = useState<{
    ternakId: string;
    tanggal: string;
    tipe: "Penyakit" | "Vaksin" | "Reminder";
    kondisi: string;
    tindakan: string;
  }>({
    ternakId: "",
    tanggal: new Date().toISOString().split('T')[0],
    tipe: "Penyakit",
    kondisi: "",
    tindakan: ""
  });

  // Derived state: flattened records for easier display and CRUD
  const allRecords: FlattenedHealthRecord[] = useMemo(() => {
    return data.flatMap(ternak => 
      ternak.riwayatKesehatan.map(rekam => ({
        ...rekam,
        ternakId: ternak.id,
        ternakTag: ternak.tag
      }))
    ).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [data]);

  const filteredRecords = allRecords.filter(rec => {
    const matchesSearch = rec.kondisi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.tindakan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.ternakTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTagFilter === "Semua" || rec.ternakId === selectedTagFilter;
    
    return matchesSearch && matchesTag;
  });

  // Statistics
  const stats = useMemo(() => {
    const kambingSehat = data.filter(k => k.status === "Sehat").length;
    const totalPenyakit = allRecords.filter(r => r.tipe === "Penyakit").length;
    const totalVaksin = allRecords.filter(r => r.tipe === "Vaksin").length;
    
    return {
      kambingSehat,
      totalPenyakit,
      totalVaksin
    };
  }, [data, allRecords]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormData({
      ternakId: data[0]?.id || "",
      tanggal: new Date().toISOString().split('T')[0],
      tipe: "Penyakit",
      kondisi: "",
      tindakan: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec: FlattenedHealthRecord) => {
    setEditingRecord(rec);
    setFormData({
      ternakId: rec.ternakId,
      tanggal: rec.tanggal,
      tipe: rec.tipe,
      kondisi: rec.kondisi,
      tindakan: rec.tindakan
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (rec: FlattenedHealthRecord) => {
    setEditingRecord(rec);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    setData(prev => prev.map(ternak => {
      let updatedRiwayat = [...ternak.riwayatKesehatan];
      
      if (editingRecord) {
        // Remove from current owner if it was the owner
        updatedRiwayat = updatedRiwayat.filter(r => r.id !== editingRecord.id);
      }

      // Add to the new/current owner
      if (ternak.id === formData.ternakId) {
        updatedRiwayat.push({
          id: editingRecord ? editingRecord.id : Math.random().toString(36).substr(2, 9),
          tanggal: formData.tanggal,
          tipe: formData.tipe,
          kondisi: formData.kondisi,
          tindakan: formData.tindakan
        });
      }

      return {
        ...ternak,
        riwayatKesehatan: updatedRiwayat.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      };
    }));

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (editingRecord) {
      setData(prev => prev.map(ternak => {
        if (ternak.id === editingRecord.ternakId) {
          return {
            ...ternak,
            riwayatKesehatan: ternak.riwayatKesehatan.filter(r => r.id !== editingRecord.id)
          };
        }
        return ternak;
      }));
    }
    setIsDeleteOpen(false);
  };

  // UI Helpers
  const getBadgeStyle = (tipe: string) => {
    switch (tipe) {
      case "Penyakit": return "bg-red-50 text-red-700 border-red-100";
      case "Vaksin": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Reminder": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getIcon = (tipe: string) => {
    switch (tipe) {
      case "Penyakit": return <HeartPulse className="w-4 h-4" />;
      case "Vaksin": return <Syringe className="w-4 h-4" />;
      case "Reminder": return <Bell className="w-4 h-4" />;
      default: return <HeartPulse className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kesehatan</h1>
          <p className="text-gray-500 mt-1">Pantau riwayat medis, jadwal vaksin, dan pengingat kesehatan ternak.</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Catatan Medis
        </button>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Kambing Sehat" 
          value={stats.kambingSehat} 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} 
          trend={{ value: Math.round((stats.kambingSehat / Math.max(data.length, 1)) * 100), isPositive: true, text: "% dari total ternak" }}
        />
        <DashboardCard 
          title="Total Catatan Penyakit" 
          value={stats.totalPenyakit} 
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />} 
          className="border-red-100"
        />
        <DashboardCard 
          title="Riwayat Vaksinasi" 
          value={stats.totalVaksin} 
          icon={<Syringe className="w-6 h-6 text-blue-500" />} 
          className="border-blue-100"
        />
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari kondisi atau tindakan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <select
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-3 py-2 outline-none w-full sm:w-auto"
            >
              <option value="Semua">Semua Kambing</option>
              {data.map(t => (
                <option key={t.id} value={t.id}>{t.tag} ({t.jenis})</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">ID Tag</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Kondisi / Judul</th>
                <th className="px-6 py-4">Tindakan / Keterangan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada catatan kesehatan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={`${item.ternakId}-${item.id}`} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.ternakTag}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit border",
                        getBadgeStyle(item.tipe)
                      )}>
                        {getIcon(item.tipe)}
                        {item.tipe}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.kondisi}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-sm truncate" title={item.tindakan}>{item.tindakan}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(item)}
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

      {/* Create/Update Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingRecord ? "Edit Catatan Medis" : "Tambah Catatan Medis"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kambing</label>
              <select 
                required
                value={formData.ternakId}
                onChange={e => setFormData({...formData, ternakId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="" disabled>Pilih Kambing</option>
                {data.map(t => (
                  <option key={t.id} value={t.id}>{t.tag} - {t.jenis}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Catatan</label>
              <select 
                value={formData.tipe}
                onChange={e => setFormData({...formData, tipe: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="Penyakit">Penyakit</option>
                <option value="Vaksin">Vaksin</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input 
              required
              type="date" 
              value={formData.tanggal}
              onChange={e => setFormData({...formData, tanggal: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi / Judul</label>
            <input 
              required
              type="text" 
              value={formData.kondisi}
              onChange={e => setFormData({...formData, kondisi: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder={formData.tipe === 'Vaksin' ? 'Cth: Vaksin PMK' : 'Cth: Demam / Pincang'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan / Keterangan</label>
            <textarea 
              required
              value={formData.tindakan}
              onChange={e => setFormData({...formData, tindakan: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Jelaskan tindakan yang diberikan atau detail pengingat..."
              rows={3}
            />
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
        title="Hapus Catatan Medis"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm border border-red-100">
            Apakah Anda yakin ingin menghapus catatan <strong>{editingRecord?.kondisi}</strong> untuk kambing <strong>{editingRecord?.ternakTag}</strong>? 
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
