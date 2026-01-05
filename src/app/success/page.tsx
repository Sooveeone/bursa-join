"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Store, CheckCircle, Clock, Bell, MapPin, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  // Confetti effect on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ["#10b981", "#059669", "#34d399", "#6ee7b7"],
      });

      // Confetti from right
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#10b981", "#059669", "#34d399", "#6ee7b7"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Bursa</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12 animate-fade-in-delay-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-lg text-gray-600">
            Terima kasih telah mendaftarkan bisnis Anda di Bursa.
            <br />
            Tim kami akan segera meninjau pendaftaran Anda.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8 animate-fade-in-delay-2">
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <span className="font-semibold text-amber-800">Status: Menunggu Review</span>
              <p className="text-sm text-amber-600">Estimasi waktu: 24 jam</p>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Apa yang terjadi selanjutnya?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Tim kami meninjau data bisnis Anda</h3>
                  <p className="text-sm text-gray-500">Kami akan memeriksa kelengkapan dan keakuratan informasi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Anda menerima notifikasi email</h3>
                  <p className="text-sm text-gray-500">Kami akan memberitahu status pendaftaran via email</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Bisnis Anda tampil di peta Bursa</h3>
                  <p className="text-sm text-gray-500">Setelah disetujui, pelanggan dapat menemukan bisnis Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-8 animate-fade-in-delay-3">
          <h3 className="font-semibold mb-2">💡 Tips untuk meningkatkan visibilitas</h3>
          <ul className="text-sm text-emerald-100 space-y-1">
            <li>• Pastikan foto bisnis Anda menarik dan berkualitas</li>
            <li>• Lengkapi informasi jam operasional</li>
            <li>• Respon cepat pesan dari pelanggan</li>
            <li>• Minta pelanggan memberikan ulasan</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-3">
          <Link 
            href="/"
            className="btn-secondary text-center"
          >
            Kembali ke Beranda
          </Link>
          <a 
            href="https://bursa.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Kunjungi Bursa
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Share Section */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">
            Punya teman yang juga punya UMKM? Ajak mereka bergabung!
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Daftar Bisnis di Bursa",
                  text: "Daftarkan bisnis UMKM kamu di Bursa dan jangkau lebih banyak pelanggan!",
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert("Link berhasil disalin!");
              }
            }}
            className="text-emerald-600 font-medium hover:text-emerald-700"
          >
            Bagikan Link Pendaftaran →
          </button>
        </div>
      </main>
    </div>
  );
}

