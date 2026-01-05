"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[600px] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/20">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Bursa</span>
            <Link 
              href="/signup"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Daftar →
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Platform Bisnis Indonesia</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              Tampilkan bisnis Anda di{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Bursa
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Daftarkan bisnis Anda secara gratis dan dapatkan visibilitas lebih luas. 
              Pelanggan potensial menunggu untuk menemukan bisnis Anda.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 text-base sm:text-lg"
              >
                Daftarkan Bisnis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Gratis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">5 menit</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Pendaftaran</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">Mudah</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Proses</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: MapPin,
                title: "Tampil di Peta",
                description: "Bisnis Anda muncul di peta interaktif, mudah ditemukan pelanggan.",
              },
              {
                icon: Zap,
                title: "Proses Cepat",
                description: "Hanya butuh 5 menit untuk mendaftarkan bisnis Anda.",
              },
              {
                icon: Shield,
                title: "Gratis Selamanya",
                description: "Tidak ada biaya. Daftar gratis selamanya.",
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-12 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-12">Cara Mendaftar</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
              {[
                { step: "1", label: "Masuk dengan Google" },
                { step: "2", label: "Isi data bisnis" },
                { step: "3", label: "Selesai!" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20">
                      {item.step}
                    </div>
                    <span className="text-gray-300 text-sm sm:text-base">{item.label}</span>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-12 sm:mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Bursa</span>
            <p className="text-xs sm:text-sm text-gray-500">
              © 2026 Bursa. Platform untuk bisnis Indonesia.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
