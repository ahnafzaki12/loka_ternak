"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("lokaternak7@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal masuk. Silakan coba lagi.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">
            Loka<span className="text-emerald-600">Ternak</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Selamat Datang</h1>
        <p className="text-gray-500 mb-8 text-base">Masuk untuk mengelola peternakan Anda.</p>

        {/* Social Buttons */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Lanjutkan dengan Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">Atau</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-12"
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

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="text-sm text-gray-600">Ingat saya</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-semibold text-gray-800 underline underline-offset-4 hover:text-emerald-600 transition-colors">
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/70 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-900/20 text-sm tracking-wide"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            Daftar Sekarang
          </Link>
        </p>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden lg:flex flex-1 items-center justify-end p-6">
        <div
          className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{
            background: `url('/farm_hero.png') center/cover no-repeat`,
            borderRadius: "2.5rem 2.5rem 2.5rem 2.5rem",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

          {/* Top text */}
          <div className="absolute top-8 left-0 right-0 text-center px-8">
            <p className="text-white font-semibold text-lg leading-snug drop-shadow-lg">
              Kelola ribuan hewan ternak Anda<br/>dengan mudah dan cerdas.
            </p>
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white">
              <p className="text-sm font-semibold">🌿 LokaTernak</p>
              <p className="text-xs opacity-80 mt-1">Platform manajemen peternakan modern untuk peternak Indonesia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
