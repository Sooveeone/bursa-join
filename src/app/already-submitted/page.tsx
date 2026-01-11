"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { checkSubmissionStatus, Submission } from "@/lib/api";
import { Store, CheckCircle, Clock, XCircle, Loader2, LogOut, Plus, Globe } from "lucide-react";

const MAX_BUSINESSES = 5;

export default function MyBusinessesPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [canSubmitMore, setCanSubmitMore] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/signup");
          return;
        }

        const status = await checkSubmissionStatus(session.access_token);
        
        // If user has no submissions, redirect to submit page
        if (status.submissions.length === 0) {
          router.push("/submit");
          return;
        }

        setSubmissions(status.submissions);
        setCanSubmitMore(status.canSubmitMore);
        setRemainingSlots(status.remainingSlots);
        setUserEmail(status.user.email);
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          <p className="text-gray-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: {
      icon: Clock,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      iconColor: "text-amber-400",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-400",
      title: "Sedang Ditinjau",
    },
    APPROVED: {
      icon: CheckCircle,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-400",
      title: "Disetujui",
    },
    REJECTED: {
      icon: XCircle,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      iconColor: "text-red-400",
      badgeBg: "bg-red-500/20",
      badgeText: "text-red-400",
      title: "Ditolak",
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Bursa
            </Link>
            
            <div className="flex items-center gap-3">
              {userEmail && (
                <span className="hidden sm:block text-sm text-gray-400">{userEmail}</span>
              )}
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Bisnis Saya
            </h1>
            <p className="text-gray-400">
              {submissions.length} dari {MAX_BUSINESSES} bisnis terdaftar
              {canSubmitMore && (
                <span className="text-emerald-400"> • {remainingSlots} slot tersisa</span>
              )}
            </p>
          </div>

          {/* Add New Business Button */}
          {canSubmitMore && (
            <Link
              href="/submit"
              className="mb-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Daftarkan Bisnis Baru</span>
            </Link>
          )}

          {/* Business List */}
          <div className="space-y-4">
            {submissions.map((submission) => {
              const config = statusConfig[submission.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={submission.id}
                  className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 sm:p-5 backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
                      {submission.isOnlineBusiness ? (
                        <Globe className={`w-6 h-6 ${config.iconColor}`} />
                      ) : (
                        <Store className={`w-6 h-6 ${config.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-white truncate">
                          {submission.name}
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText} w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.title}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                        {submission.isOnlineBusiness && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            Bisnis Online
                          </span>
                        )}
                        <span>
                          Didaftarkan: {new Date(submission.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Status-specific message */}
                      {submission.status === "PENDING" && (
                        <p className="text-xs text-gray-500 mt-2">
                          Sedang dalam proses review.
                        </p>
                      )}
                      {submission.status === "REJECTED" && (
                        <p className="text-xs text-red-400/80 mt-2">
                          Pendaftaran tidak disetujui. Hubungi bursa.app.id@gmail.com untuk informasi lebih lanjut.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Limit Reached Message */}
          {!canSubmitMore && (
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-gray-400 text-sm">
                Anda telah mencapai batas maksimal {MAX_BUSINESSES} bisnis per akun.
              </p>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <h3 className="font-medium text-gray-300 mb-2">Butuh bantuan?</h3>
            <p className="text-sm text-gray-500">
              Hubungi tim kami di{" "}
              <a href="mailto:bursa.app.id@gmail.com" className="text-emerald-400 hover:underline">
                bursa.app.id@gmail.com
              </a>
              {" "}jika Anda memiliki pertanyaan tentang bisnis Anda.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
