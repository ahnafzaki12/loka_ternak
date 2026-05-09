import { Pakan, PenggunaanPakan } from "../types/pakan";

// Initial Mock Data
let mockPakan: Pakan[] = [
  { id: "1", nama: "Rumput Gajah", kategori: "Hijauan", stokKg: 1500, batasKritisKg: 200, hargaPerKg: 500 },
  { id: "2", nama: "Rumput Odot", kategori: "Hijauan", stokKg: 180, batasKritisKg: 200, hargaPerKg: 600 },
  { id: "3", nama: "Konsentrat A", kategori: "Konsentrat", stokKg: 500, batasKritisKg: 100, hargaPerKg: 4000 },
  { id: "4", nama: "Vitamin B-Complex", kategori: "Vitamin/Obat", stokKg: 15, batasKritisKg: 5, hargaPerKg: 50000 },
];

let mockPenggunaan: PenggunaanPakan[] = [];

// Seed some usage data for the chart (last 7 days)
const today = new Date();
for (let i = 6; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(today.getDate() - i);
  const dateStr = d.toISOString().split('T')[0];
  
  mockPenggunaan.push(
    { id: `p1-${i}`, idPakan: "1", tanggal: dateStr, jumlahKg: 50 + Math.random() * 20 },
    { id: `p3-${i}`, idPakan: "3", tanggal: dateStr, jumlahKg: 10 + Math.random() * 5 }
  );
}

// Repository Class simulating an asynchronous Database/API
export class PakanRepository {
  static async getPakanList(): Promise<Pakan[]> {
    return Promise.resolve([...mockPakan]);
  }

  static async getPenggunaanList(): Promise<PenggunaanPakan[]> {
    return Promise.resolve([...mockPenggunaan]);
  }

  static async addPakan(pakan: Omit<Pakan, "id">): Promise<Pakan> {
    const newPakan: Pakan = {
      ...pakan,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockPakan.push(newPakan);
    return Promise.resolve(newPakan);
  }

  static async updatePakan(pakan: Pakan): Promise<Pakan> {
    mockPakan = mockPakan.map(p => p.id === pakan.id ? p : p);
    return Promise.resolve(pakan);
  }

  static async deletePakan(id: string): Promise<void> {
    mockPakan = mockPakan.filter(p => p.id !== id);
    return Promise.resolve();
  }

  static async catatPenggunaan(penggunaan: Omit<PenggunaanPakan, "id">): Promise<PenggunaanPakan> {
    // 1. Deduct Stock
    const pakanIndex = mockPakan.findIndex(p => p.id === penggunaan.idPakan);
    if (pakanIndex === -1) {
      return Promise.reject(new Error("Pakan tidak ditemukan"));
    }
    
    if (mockPakan[pakanIndex].stokKg < penggunaan.jumlahKg) {
      return Promise.reject(new Error("Stok tidak mencukupi"));
    }

    mockPakan[pakanIndex].stokKg -= penggunaan.jumlahKg;

    // 2. Record Usage
    const newPenggunaan: PenggunaanPakan = {
      ...penggunaan,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockPenggunaan.push(newPenggunaan);

    return Promise.resolve(newPenggunaan);
  }
}
