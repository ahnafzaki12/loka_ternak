export type PertumbuhanHistory = {
  tanggal: string;
  berat: number;
  tinggi: number;
};

export type PakanHistory = {
  id: string;
  tanggal: string;
  waktu: string;
  jenisPakan: string;
  jumlah: string;
};

export type KesehatanHistory = {
  id: string;
  tanggal: string;
  tipe: "Penyakit" | "Vaksin" | "Reminder";
  kondisi: string;
  tindakan: string;
};

export type AktivitasHistory = {
  id: string;
  tanggal: string;
  waktu: string;
  aktivitas: string;
};

export type Ternak = {
  id: string;
  tag: string;
  jenis: string;
  berat: number; // Berat saat ini
  tinggi: number;
  kelamin: "Jantan" | "Betina";
  status: "Sehat" | "Sakit" | "Pemulihan";
  umurBulan: number;
  tanggalLahir: string;
  riwayatPertumbuhan: PertumbuhanHistory[];
  riwayatPakan: PakanHistory[];
  riwayatKesehatan: KesehatanHistory[];
  aktivitas: AktivitasHistory[];
};

export const mockDataTernak: Ternak[] = [
  { 
    id: "1", 
    tag: "KMB-001", 
    jenis: "Etawa", 
    berat: 45.5, 
    tinggi: 75, 
    kelamin: "Jantan", 
    status: "Sehat",
    umurBulan: 24,
    tanggalLahir: "2024-05-10",
    riwayatPertumbuhan: [
      { tanggal: "Minggu 1", berat: 42.0, tinggi: 72 },
      { tanggal: "Minggu 2", berat: 43.5, tinggi: 73 },
      { tanggal: "Minggu 3", berat: 44.2, tinggi: 74 },
      { tanggal: "Minggu 4", berat: 45.5, tinggi: 75 },
    ],
    riwayatPakan: [
      { id: "p1", tanggal: "2026-05-06", waktu: "07:00", jenisPakan: "Rumput Gajah", jumlah: "2 kg" },
      { id: "p2", tanggal: "2026-05-06", waktu: "16:00", jenisPakan: "Konsentrat", jumlah: "500 gr" },
      { id: "p3", tanggal: "2026-05-05", waktu: "07:00", jenisPakan: "Rumput Gajah", jumlah: "2 kg" },
    ],
    riwayatKesehatan: [
      { id: "kmb1-k1", tanggal: "2026-04-15", tipe: "Vaksin", kondisi: "Vaksinasi Rutin", tindakan: "Diberikan Vaksin PMK" },
      { id: "kmb1-k2", tanggal: "2026-02-10", tipe: "Reminder", kondisi: "Pemeriksaan Kesehatan", tindakan: "Sehat, diberikan vitamin" },
    ],
    aktivitas: [
      { id: "a1", tanggal: "2026-05-06", waktu: "08:00", aktivitas: "Dilepas di padang rumput" },
      { id: "a2", tanggal: "2026-05-06", waktu: "15:00", aktivitas: "Kembali ke kandang" },
    ]
  },
  { 
    id: "2", 
    tag: "KMB-002", 
    jenis: "Boer", 
    berat: 38.0, 
    tinggi: 68, 
    kelamin: "Betina", 
    status: "Sehat",
    umurBulan: 18,
    tanggalLahir: "2024-11-20",
    riwayatPertumbuhan: [
      { tanggal: "Minggu 1", berat: 35.0, tinggi: 65 },
      { tanggal: "Minggu 2", berat: 36.2, tinggi: 66 },
      { tanggal: "Minggu 3", berat: 37.1, tinggi: 67 },
      { tanggal: "Minggu 4", berat: 38.0, tinggi: 68 },
    ],
    riwayatPakan: [
      { id: "p1", tanggal: "2026-05-06", waktu: "07:00", jenisPakan: "Rumput Odot", jumlah: "1.5 kg" },
      { id: "p2", tanggal: "2026-05-06", waktu: "16:00", jenisPakan: "Konsentrat", jumlah: "400 gr" },
    ],
    riwayatKesehatan: [
      { id: "kmb2-k1", tanggal: "2026-04-20", tipe: "Reminder", kondisi: "Pemeriksaan Kehamilan", tindakan: "USG, Positif hamil 1 bulan" },
    ],
    aktivitas: [
      { id: "a1", tanggal: "2026-05-06", waktu: "08:00", aktivitas: "Dilepas di area khusus betina" },
    ]
  },
  { 
    id: "3", 
    tag: "KMB-003", 
    jenis: "Kacang", 
    berat: 25.2, 
    tinggi: 55, 
    kelamin: "Betina", 
    status: "Pemulihan",
    umurBulan: 12,
    tanggalLahir: "2025-05-15",
    riwayatPertumbuhan: [
      { tanggal: "Minggu 1", berat: 26.0, tinggi: 55 },
      { tanggal: "Minggu 2", berat: 25.5, tinggi: 55 },
      { tanggal: "Minggu 3", berat: 24.8, tinggi: 55 },
      { tanggal: "Minggu 4", berat: 25.2, tinggi: 55 },
    ],
    riwayatPakan: [
      { id: "p1", tanggal: "2026-05-06", waktu: "07:00", jenisPakan: "Rumput Segar", jumlah: "1 kg" },
      { id: "p2", tanggal: "2026-05-06", waktu: "12:00", jenisPakan: "Vitamin & Obat", jumlah: "1 dosis" },
    ],
    riwayatKesehatan: [
      { id: "kmb3-k1", tanggal: "2026-05-01", tipe: "Penyakit", kondisi: "Diare ringan", tindakan: "Diberikan obat antidiare dan dipisahkan" },
      { id: "kmb3-k2", tanggal: "2026-05-05", tipe: "Penyakit", kondisi: "Masa pemulihan", tindakan: "Kondisi membaik, feses mulai normal" },
    ],
    aktivitas: [
      { id: "a1", tanggal: "2026-05-06", waktu: "08:00", aktivitas: "Istirahat di kandang isolasi" },
    ]
  },
  { 
    id: "4", 
    tag: "KMB-004", 
    jenis: "Saanen", 
    berat: 50.1, 
    tinggi: 80, 
    kelamin: "Jantan", 
    status: "Sakit",
    umurBulan: 36,
    tanggalLahir: "2023-05-10",
    riwayatPertumbuhan: [
      { tanggal: "Minggu 1", berat: 52.5, tinggi: 80 },
      { tanggal: "Minggu 2", berat: 51.8, tinggi: 80 },
      { tanggal: "Minggu 3", berat: 51.0, tinggi: 80 },
      { tanggal: "Minggu 4", berat: 50.1, tinggi: 80 },
    ],
    riwayatPakan: [
      { id: "p1", tanggal: "2026-05-06", waktu: "08:00", jenisPakan: "Rumput Layu", jumlah: "1 kg" },
    ],
    riwayatKesehatan: [
      { id: "kmb4-k1", tanggal: "2026-05-04", tipe: "Penyakit", kondisi: "Pincang kaki depan", tindakan: "Pemeriksaan kuku, ditemukan infeksi" },
      { id: "kmb4-k2", tanggal: "2026-05-05", tipe: "Penyakit", kondisi: "Perawatan Infeksi", tindakan: "Pembersihan luka dan pemberian antibiotik" },
    ],
    aktivitas: [
      { id: "a1", tanggal: "2026-05-06", waktu: "08:00", aktivitas: "Tidur di kandang karantina" },
    ]
  },
];

export const getTernakById = (id: string): Ternak | undefined => {
  return mockDataTernak.find(t => t.id === id);
};
