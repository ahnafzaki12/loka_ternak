export interface Pakan {
  id: string;
  nama: string;
  kategori: "Hijauan" | "Konsentrat" | "Vitamin/Obat";
  stokKg: number;
  batasKritisKg: number;
  hargaPerKg: number;
}

export interface PenggunaanPakan {
  id: string;
  idPakan: string;
  tanggal: string;
  jumlahKg: number;
  keterangan?: string;
}
