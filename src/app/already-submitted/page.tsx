"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { checkSubmissionStatus } from "@/lib/api";
import { Store, CheckCircle, Clock, XCircle, ArrowRight, Loader2, LogOut } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AlreadySubmittedPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/signup");
          return;
        }

        const status = await checkSubmissionStatus(session.access_token);
        
        if (!status.hasSubmission) {
          router.push("/submit");
          return;
        }

        setSubmission(status.submission);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        router.push("/signup");
      }
    }

    checkStatus();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signup");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
      title: "Sedang Ditinjau",
      description: "Bisnis Anda sedang dalam proses review oleh tim kami. Biasanya membutuhkan waktu 24 jam.",
    },
    APPROVED: {
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500",
      title: "Disetujui",
      description: "Selamat! Bisnis Anda sudah tampil di peta Bursa dan dapat ditemukan oleh pelanggan.",
    },
    REJECTED: {
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      title: "Ditolak",
      description: "Maaf, pendaftaran bisnis Anda tidak dapat disetujui. Silakan hubungi tim kami untuk informasi lebih lanjut.",
    },
  };

  const config = submission ? statusConfig[submission.status] : statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Bursa</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${config.bgColor} flex items-center justify-center`}>
            <StatusIcon className={`w-10 h-10 ${config.iconColor}`} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Anda Sudah Mendaftar
          </h1>
          <p className="text-gray-600">
            Anda sudah mendaftarkan bisnis di Bursa
          </p>
        </div>

        {submission && (
          <div className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-6 mb-8`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0`}>
                <Store className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {submission.name}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.iconColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.title}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {config.description}
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  Didaftarkan pada: {new Date(submission.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Apa selanjutnya?</h3>
          
          <div className="space-y-4">
            {submission?.status === "PENDING" && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tim kami akan meninjau pendaftaran Anda</p>
                    <p className="text-sm text-gray-500">Proses review biasanya membutuhkan waktu 24 jam</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Anda akan menerima notifikasi via email</p>
                    <p className="text-sm text-gray-500">Kami akan memberitahu setelah bisnis Anda disetujui</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bisnis Anda akan tampil di peta Bursa</p>
                    <p className="text-sm text-gray-500">Pelanggan dapat mulai menemukan bisnis Anda</p>
                  </div>
                </div>
              </>
            )}

            {submission?.status === "APPROVED" && (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Bisnis Anda sudah aktif di Bursa! Pelanggan sekarang dapat menemukan Anda di peta.
                </p>
                <a
                  href="https://bursa.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Lihat di Bursa
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            )}

            {submission?.status === "REJECTED" && (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Jika Anda merasa ini adalah kesalahan atau ingin informasi lebih lanjut, silakan hubungi tim kami.
                </p>
                <a
                  href="mailto:support@bursa.app"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Hubungi Support
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Kembali ke beranda
          </Link>
        </div>
      </main>
    </div>
  );
}

