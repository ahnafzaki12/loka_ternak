import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaksi, JenisTransaksi } from "../lib/types/keuangan";
import { KeuanganRepository } from "../lib/repositories/keuanganRepository";

export function useKeuangan() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterBulan, setFilterBulan] = useState<string>("Semua");
  const [filterJenis, setFilterJenis] = useState<JenisTransaksi | "Semua">("Semua");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await KeuanganRepository.getTransaksi();
      setTransaksi(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaksi = async (trx: Omit<Transaksi, "id">) => {
    try {
      await KeuanganRepository.addTransaksi(trx);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaksi = async (id: string) => {
    try {
      await KeuanganRepository.deleteTransaksi(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // --- Derived Data (Filtered) ---
  const filteredTransaksi = useMemo(() => {
    return transaksi.filter((t) => {
      // Filter Bulan (Format YYYY-MM)
      if (filterBulan !== "Semua") {
        const trxMonth = t.tanggal.substring(0, 7);
        if (trxMonth !== filterBulan) return false;
      }
      // Filter Jenis
      if (filterJenis !== "Semua" && t.jenis !== filterJenis) return false;
      return true;
    });
  }, [transaksi, filterBulan, filterJenis]);

  // --- Metrics ---
  const metrics = useMemo(() => {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    filteredTransaksi.forEach(t => {
      if (t.jenis === "Pemasukan") totalPemasukan += t.nominal;
      if (t.jenis === "Pengeluaran") totalPengeluaran += t.nominal;
    });

    return {
      totalPemasukan,
      totalPengeluaran,
      labaBersih: totalPemasukan - totalPengeluaran
    };
  }, [filteredTransaksi]);

  return {
    transaksi: filteredTransaksi,
    rawTransaksi: transaksi, // In case needed for global options
    metrics,
    isLoading,
    error,
    filterBulan,
    setFilterBulan,
    filterJenis,
    setFilterJenis,
    addTransaksi,
    deleteTransaksi,
    refresh: fetchData
  };
}
