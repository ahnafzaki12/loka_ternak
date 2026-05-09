import { useState, useEffect, useCallback } from "react";
import { Pakan, PenggunaanPakan } from "../lib/types/pakan";
import { PakanRepository } from "../lib/repositories/pakanRepository";

export function usePakan() {
  const [pakanList, setPakanList] = useState<Pakan[]>([]);
  const [penggunaanList, setPenggunaanList] = useState<PenggunaanPakan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [pakan, penggunaan] = await Promise.all([
        PakanRepository.getPakanList(),
        PakanRepository.getPenggunaanList()
      ]);
      setPakanList(pakan);
      setPenggunaanList(penggunaan);
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

  const addPakan = async (pakan: Omit<Pakan, "id">) => {
    try {
      await PakanRepository.addPakan(pakan);
      await fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updatePakan = async (pakan: Pakan) => {
    try {
      await PakanRepository.updatePakan(pakan);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deletePakan = async (id: string) => {
    try {
      await PakanRepository.deletePakan(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const catatPenggunaan = async (penggunaan: Omit<PenggunaanPakan, "id">) => {
    try {
      await PakanRepository.catatPenggunaan(penggunaan);
      await fetchData(); // Refresh data so stock updates
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    pakanList,
    penggunaanList,
    isLoading,
    error,
    addPakan,
    updatePakan,
    deletePakan,
    catatPenggunaan,
    refresh: fetchData
  };
}
