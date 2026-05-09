"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Minggu 1", beratRataRata: 25 },
  { name: "Minggu 2", beratRataRata: 26.5 },
  { name: "Minggu 3", beratRataRata: 28 },
  { name: "Minggu 4", beratRataRata: 29.8 },
  { name: "Minggu 5", beratRataRata: 31.2 },
  { name: "Minggu 6", beratRataRata: 33 },
];

export default function WeightChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Grafik Berat Rata-rata</h3>
          <p className="text-sm text-gray-500">Perkembangan berat kambing per minggu</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
          <option>Per Minggu</option>
          <option>Per Bulan</option>
        </select>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorBerat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="beratRataRata"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBerat)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
