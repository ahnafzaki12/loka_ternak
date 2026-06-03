"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  
  const isFormValid = hasMinLength && hasSpecialChar && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Password berhasil diubah. Silakan masuk dengan password baru Anda.");
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        
        {/* Icon */}
        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-8">
          <Lock className="w-6 h-6 text-gray-800" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
          Atur Password Baru
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
          Password baru Anda harus berbeda dari password yang digunakan sebelumnya.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {message && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200 text-center font-medium">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Password Baru
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-12 placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-12 placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 transition-colors ${hasMinLength ? 'text-emerald-500' : 'text-gray-300'}`} />
              <span className={`text-sm transition-colors ${hasMinLength ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Minimal 8 karakter</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 transition-colors ${hasSpecialChar ? 'text-emerald-500' : 'text-gray-300'}`} />
              <span className={`text-sm transition-colors ${hasSpecialChar ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Mengandung minimal satu karakter spesial</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-900/20 text-sm tracking-wide mt-4"
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
