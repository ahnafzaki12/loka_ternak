import { Transaksi } from "../types/keuangan";

// Mock Data representing transactions over the last 30 days
let mockTransaksi: Transaksi[] = [];

// Seed mock data
const today = new Date();
for (let i = 29; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(today.getDate() - i);
  const dateStr = d.toISOString().split('T')[0];

  // Daily Operational Expenses
  if (i % 3 === 0) {
    mockTransaksi.push({
      id: `trx-out-1-${i}`,
      tanggal: dateStr,
      jenis: "Pengeluaran",
      kategori: "Pakan",
      nominal: 1500000 + Math.random() * 500000,
      keterangan: "Pembelian Konsentrat & Rumput"
    });
  }

  // Weekly Employee Salary
  if (i % 7 === 0) {
    mockTransaksi.push({
      id: `trx-out-2-${i}`,
      tanggal: dateStr,
      jenis: "Pengeluaran",
      kategori: "Gaji Karyawan",
      nominal: 3000000,
      keterangan: "Gaji Mingguan ABK"
    });
  }

  // Monthly Sales
  if (i % 15 === 0) {
    mockTransaksi.push({
      id: `trx-in-1-${i}`,
      tanggal: dateStr,
      jenis: "Pemasukan",
      kategori: "Penjualan Ternak",
      nominal: 15000000 + Math.random() * 5000000,
      keterangan: "Penjualan 5 Ekor Kambing Boer"
    });
  }

  // Random small income (Pupuk)
  if (i % 5 === 0) {
    mockTransaksi.push({
      id: `trx-in-2-${i}`,
      tanggal: dateStr,
      jenis: "Pemasukan",
      kategori: "Penjualan Pupuk",
      nominal: 500000 + Math.random() * 200000,
      keterangan: "Penjualan Pupuk Kandang"
    });
  }
}

export class KeuanganRepository {
  static async getTransaksi(): Promise<Transaksi[]> {
    // Sort descending by date
    return Promise.resolve([...mockTransaksi].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
  }

  static async addTransaksi(transaksi: Omit<Transaksi, "id">): Promise<Transaksi> {
    const newTrx: Transaksi = {
      ...transaksi,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockTransaksi.push(newTrx);
    return Promise.resolve(newTrx);
  }

  static async deleteTransaksi(id: string): Promise<void> {
    mockTransaksi = mockTransaksi.filter(t => t.id !== id);
    return Promise.resolve();
  }
}
