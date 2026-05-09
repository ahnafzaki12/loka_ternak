export type JenisTransaksi = "Pemasukan" | "Pengeluaran";

export type KategoriPemasukan = "Penjualan Ternak" | "Penjualan Susu" | "Penjualan Pupuk" | "Lainnya";
export type KategoriPengeluaran = "Pakan" | "Gaji Karyawan" | "Obat & Vitamin" | "Operasional" | "Lainnya";

export interface Transaksi {
  id: string;
  tanggal: string; // YYYY-MM-DD
  jenis: JenisTransaksi;
  kategori: KategoriPemasukan | KategoriPengeluaran;
  nominal: number;
  keterangan: string;
}
