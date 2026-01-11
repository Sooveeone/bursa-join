"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0f0d] text-white relative overflow-hidden flex items-center justify-center">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[400px] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-delay-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Terima kasih telah mendaftarkan bisnis Anda di Bursa.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden mb-8 animate-fade-in-delay-2">
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-semibold text-amber-400 text-sm sm:text-base">Menunggu Review</span>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <p className="text-gray-400 text-sm">
              Tim kami akan meninjau pendaftaran Anda.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 animate-fade-in-delay-3">
          <Link 
            href="/"
            className="w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Share Section */}
        <div className="text-center mt-10 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs sm:text-sm mb-3">
            Punya teman yang juga punya bisnis?
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Daftar Bisnis di Bursa",
                  text: "Daftarkan bisnis kamu di Bursa dan jangkau lebih banyak pelanggan!",
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert("Link berhasil disalin!");
              }
            }}
            className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors text-sm"
          >
            Bagikan Link Pendaftaran →
          </button>
        </div>
      </div>
    </div>
  );
}





