"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Jika email tersebut terdaftar, kami telah mengirimkan tautan untuk mengatur ulang password.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        
        {/* Icon */}
        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-8">
          <KeyRound className="w-6 h-6 text-gray-800" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
          Lupa Password?
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
          Masukkan alamat email Anda. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200 text-center font-medium">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              placeholder="Masukkan alamat email Anda"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-900/20 text-sm tracking-wide"
          >
            {loading ? "Memproses..." : "Atur ulang password"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke login
          </Link>
        </div>

      </div>
    </div>
  );
}
