import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    text: string;
  };
  className?: string;
}

export default function DashboardCard({ title, value, icon, trend, className }: DashboardCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-xl text-gray-700">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className={cn(
            "font-medium px-2 py-0.5 rounded-md", 
            trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500">{trend.text}</span>
        </div>
      )}
    </div>
  );
}
