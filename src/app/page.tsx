"use client";

import Link from "next/link";
import { MapPin, Users, TrendingUp, Shield, ArrowRight, Store, Star, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                <span>Platform UMKM Indonesia</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Tampilkan Bisnis Anda di{" "}
                <span className="gradient-text">Bursa</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Daftarkan UMKM Anda dan dapatkan visibilitas lebih luas. 
                Ribuan pelanggan potensial menunggu untuk menemukan bisnis Anda di peta interaktif Bursa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
                >
                  Daftarkan Bisnis Anda
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#benefits" 
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-gray-500">Gratis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">5 menit</div>
                  <div className="text-sm text-gray-500">Waktu pendaftaran</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">24 jam</div>
                  <div className="text-sm text-gray-500">Review cepat</div>
                </div>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="animate-fade-in-delay-1 hidden lg:block">
              <div className="relative">
                {/* Mock Phone/Map UI */}
                <div className="bg-white rounded-3xl shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-6 h-96 flex flex-col">
                    {/* Mock Map Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    
                    {/* Mock Search Bar */}
                    <div className="bg-white rounded-full px-4 py-2 shadow-sm flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-gray-400 text-sm">Cari UMKM di sekitar...</span>
                    </div>
                    
                    {/* Mock Business Cards */}
                    <div className="space-y-3 flex-1 overflow-hidden">
                      {[
                        { name: "Warung Bu Ani", rating: 4.8, category: "Makanan" },
                        { name: "Toko Batik Cantik", rating: 4.9, category: "Fashion" },
                        { name: "Kopi Nusantara", rating: 4.7, category: "Minuman" },
                      ].map((business, i) => (
                        <div 
                          key={i} 
                          className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">{business.name}</div>
                            <div className="text-xs text-gray-500">{business.category}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium">{business.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Your business could be here */}
                    <div className="mt-4 border-2 border-dashed border-emerald-300 rounded-xl p-3 text-center">
                      <span className="text-emerald-600 font-medium text-sm">
                        ✨ Bisnis Anda bisa tampil di sini!
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-bounce">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-gray-800">+250%</div>
                      <div className="text-gray-500">Visibilitas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Bergabung dengan Bursa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk membantu UMKM Indonesia berkembang dan menjangkau lebih banyak pelanggan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: "Tampil di Peta",
                description: "Bisnis Anda akan muncul di peta interaktif, mudah ditemukan pelanggan sekitar.",
                color: "emerald",
              },
              {
                icon: Users,
                title: "Jangkau Lebih Luas",
                description: "Dapatkan eksposur ke ribuan pengguna yang mencari produk dan jasa di sekitar mereka.",
                color: "blue",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                description: "Platform yang responsif, pelanggan bisa menemukan Anda dari mana saja.",
                color: "purple",
              },
              {
                icon: Shield,
                title: "100% Gratis",
                description: "Tidak ada biaya tersembunyi. Daftarkan bisnis Anda secara gratis selamanya.",
                color: "amber",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300 text-center group"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-${benefit.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`w-7 h-7 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Cara Mendaftar
            </h2>
            <p className="text-lg text-gray-600">
              Hanya butuh 3 langkah mudah untuk menampilkan bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Masuk dengan Google",
                description: "Satu klik dengan akun Google Anda. Tanpa password, cepat dan aman.",
              },
              {
                step: "02",
                title: "Isi Informasi Bisnis",
                description: "Lengkapi detail bisnis, lokasi, dan kontak Anda.",
              },
              {
                step: "03",
                title: "Tunggu Verifikasi",
                description: "Tim kami akan mereview dalam 24 jam. Setelah disetujui, bisnis Anda langsung tampil!",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card-elevated text-center">
                  <div className="text-5xl font-bold text-emerald-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Siap Mengembangkan Bisnis Anda?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Bergabunglah dengan ratusan UMKM lainnya yang sudah merasakan manfaat tampil di Bursa.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Daftarkan Bisnis Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Bursa</span>
            </div>
            <p className="text-sm">
              © 2026 Bursa UMKM. Platform untuk UMKM Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
