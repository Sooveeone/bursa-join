"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { CATEGORIES, PRICE_TIERS, checkSubmissionStatus, submitBusiness } from "@/lib/api";
import { 
  User, Mail, LogOut, MapPin, Phone,
  Instagram, ArrowRight, ArrowLeft, Loader2, CheckCircle,
  AlertCircle, Building2, Image as ImageIcon, Globe
} from "lucide-react";
import dynamicImport from "next/dynamic";
import ImageUploader from "@/components/ImageUploader";
import OperatingHoursInput, { OperatingHours, getDefaultOperatingHours } from "@/components/OperatingHoursInput";

const LocationPicker = dynamicImport(
  () => import("@/components/LocationPicker"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-56 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-sm">Memuat peta...</span>
        </div>
      </div>
    )
  }
);

interface FormData {
  name: string;
  description: string;
  ownerName: string;
  categorySlug: string;
  priceRangeMin: string;
  priceRangeMax: string;
  isOnlineBusiness: boolean;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string;
  whatsappNumber: string;
  website: string;
  operatingHours: OperatingHours;
  instagramHandle: string;
  tiktokHandle: string;
  facebookUrl: string;
  logoUrl: string;
  photos: string[];
}

const STEP_ICONS = [Building2, MapPin, Phone, ImageIcon];
const STEP_LABELS = ["Info", "Lokasi", "Kontak", "Media"];

export default function SubmitPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ email: string; name: string | null } | null>(null);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    ownerName: "",
    categorySlug: "",
    priceRangeMin: "MODERATE",
    priceRangeMax: "MODERATE",
    isOnlineBusiness: false,
    address: "",
    city: "",
    district: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    phoneNumber: "",
    whatsappNumber: "",
    website: "",
    operatingHours: getDefaultOperatingHours(),
    instagramHandle: "",
    tiktokHandle: "",
    facebookUrl: "",
    logoUrl: "",
    photos: [],
  });

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/signup");
          return;
        }

        const status = await checkSubmissionStatus(session.access_token);
        
        // If user can't submit more businesses, redirect to dashboard
        if (!status.canSubmitMore) {
          router.push("/already-submitted");
          return;
        }

        setUserInfo(status.user);
        setFormData(prev => ({
          ...prev,
          ownerName: status.user.name || "",
        }));
        
        setLoading(false);
      } catch (err: any) {
        console.error("Init error:", err);
        setError("Gagal memuat data. Silakan refresh halaman.");
        setLoading(false);
      }
    }

    init();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signup");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  }, []);

  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      if (!formData.name.trim()) {
        setError("Nama bisnis wajib diisi");
        return false;
      }
      if (!formData.description.trim()) {
        setError("Deskripsi wajib diisi");
        return false;
      }
      if (!formData.ownerName.trim()) {
        setError("Nama pemilik wajib diisi");
        return false;
      }
      if (!formData.categorySlug) {
        setError("Kategori wajib dipilih");
        return false;
      }
    }
    if (stepNum === 2) {
      // Location validation only for physical (non-online) businesses
      if (!formData.isOnlineBusiness) {
        if (!formData.address.trim()) {
          setError("Alamat wajib diisi");
          return false;
        }
        if (!formData.city.trim()) {
          setError("Kota wajib diisi");
          return false;
        }
        if (formData.latitude === null || formData.longitude === null) {
          setError("Lokasi di peta wajib dipilih");
          return false;
        }
      }
    }
    if (stepNum === 3) {
      if (!formData.phoneNumber.trim()) {
        setError("Nomor telepon wajib diisi");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setError(null);
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (step !== 4) {
      console.log("Blocked submission - not on step 4");
      return;
    }
    
    if (!validateStep(4)) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/signup");
        return;
      }

      await submitBusiness(session.access_token, {
        name: formData.name,
        description: formData.description,
        ownerName: formData.ownerName,
        categorySlug: formData.categorySlug,
        priceRangeMin: formData.priceRangeMin as "BUDGET" | "MODERATE" | "PRICEY" | "PREMIUM",
        priceRangeMax: formData.priceRangeMax as "BUDGET" | "MODERATE" | "PRICEY" | "PREMIUM",
        isOnlineBusiness: formData.isOnlineBusiness,
        // Location fields - only include if not an online business
        address: formData.isOnlineBusiness ? undefined : formData.address,
        city: formData.isOnlineBusiness ? undefined : formData.city,
        district: formData.district || undefined,
        postalCode: formData.postalCode || undefined,
        latitude: formData.isOnlineBusiness ? undefined : formData.latitude!,
        longitude: formData.isOnlineBusiness ? undefined : formData.longitude!,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber || undefined,
        website: formData.website || undefined,
        operatingHours: formData.operatingHours,
        instagramHandle: formData.instagramHandle || undefined,
        tiktokHandle: formData.tiktokHandle || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        photos: formData.photos.length > 0 ? formData.photos : undefined,
      });

      router.push("/success");
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[600px] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/20">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Bursa
            </Link>
            
            {/* User badge */}
            {userInfo && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{userInfo.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
          <div className="w-full max-w-2xl">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map((s, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <div key={s} className="flex items-center">
                    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                      <div className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300
                        ${step >= s 
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                          : "bg-white/5 text-gray-500 border border-white/10"
                        }
                      `}>
                        {step > s ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      <span className={`text-[10px] sm:text-xs transition-colors ${step >= s ? "text-emerald-400" : "text-gray-500"}`}>
                        {STEP_LABELS[i]}
                      </span>
                    </div>
                    {s < 4 && (
                      <div className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 mb-4 sm:mb-5 rounded-full transition-colors ${
                        step > s ? "bg-emerald-500" : "bg-white/10"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 flex items-center gap-2.5 sm:gap-3 backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5">
                <h1 className="text-lg sm:text-xl font-semibold text-white">
                  {step === 1 && "Informasi Bisnis"}
                  {step === 2 && "Lokasi Bisnis"}
                  {step === 3 && "Kontak"}
                  {step === 4 && "Foto & Media"}
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {step === 1 && "Ceritakan tentang bisnis Anda"}
                  {step === 2 && (formData.isOnlineBusiness ? "Bisnis online tidak memerlukan lokasi" : "Dimana lokasi bisnis Anda?")}
                  {step === 3 && "Bagaimana pelanggan menghubungi Anda?"}
                  {step === 4 && "Tambahkan foto dan sosial media"}
                </p>
              </div>

              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-4 sm:p-6">
                {/* Step 1: Business Info */}
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Nama Bisnis <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Warung Makan Bu Ani"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Deskripsi <span className="text-emerald-400">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ceritakan produk atau jasa yang ditawarkan..."
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Nama Pemilik <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Nama Anda"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Kategori <span className="text-emerald-400">*</span>
                      </label>
                      <select
                        name="categorySlug"
                        value={formData.categorySlug}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#1a1f1d]">Pilih kategori...</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.slug} value={category.slug} className="bg-[#1a1f1d]">
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Kisaran Harga <span className="text-emerald-400">*</span>
                      </label>
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                        Pilih rentang harga produk/jasa Anda
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] sm:text-xs text-gray-400 mb-1">Dari</label>
                          <select
                            name="priceRangeMin"
                            value={formData.priceRangeMin}
                            onChange={(e) => {
                              const newMin = e.target.value;
                              const minIndex = PRICE_TIERS.findIndex(t => t.value === newMin);
                              const maxIndex = PRICE_TIERS.findIndex(t => t.value === formData.priceRangeMax);
                              // Auto-adjust max if min is higher
                              if (minIndex > maxIndex) {
                                setFormData(prev => ({ ...prev, priceRangeMin: newMin, priceRangeMax: newMin }));
                              } else {
                                setFormData(prev => ({ ...prev, priceRangeMin: newMin }));
                              }
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                          >
                            {PRICE_TIERS.map((tier) => (
                              <option key={tier.value} value={tier.value} className="bg-[#1a1f1d]">
                                {tier.label} - {tier.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs text-gray-400 mb-1">Sampai</label>
                          <select
                            name="priceRangeMax"
                            value={formData.priceRangeMax}
                            onChange={(e) => {
                              const newMax = e.target.value;
                              const minIndex = PRICE_TIERS.findIndex(t => t.value === formData.priceRangeMin);
                              const maxIndex = PRICE_TIERS.findIndex(t => t.value === newMax);
                              // Auto-adjust min if max is lower
                              if (maxIndex < minIndex) {
                                setFormData(prev => ({ ...prev, priceRangeMin: newMax, priceRangeMax: newMax }));
                              } else {
                                setFormData(prev => ({ ...prev, priceRangeMax: newMax }));
                              }
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                          >
                            {PRICE_TIERS.map((tier) => (
                              <option key={tier.value} value={tier.value} className="bg-[#1a1f1d]">
                                {tier.label} - {tier.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Online Business Toggle */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData.isOnlineBusiness}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOnlineBusiness: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-white/10 rounded-full peer-checked:bg-emerald-500 transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            Bisnis Online
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Aktifkan jika bisnis Anda beroperasi secara online sepenuhnya tanpa lokasi fisik
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                  <div className="space-y-4 sm:space-y-5 animate-fade-in">
                    {formData.isOnlineBusiness ? (
                      /* Online Business - No location required */
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                          <Globe className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Bisnis Online</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                          Karena bisnis Anda si secara online, tidak perlu menambahkan lokasi fisik. 
                          Lanjutkan ke langkah berikutnya.
                        </p>
                      </div>
                    ) : (
                      /* Physical Business - Location required */
                      <>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                            Alamat Lengkap <span className="text-emerald-400">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 sm:left-3.5 sm:top-3.5 w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="Jl. Sudirman No. 52, Mall Grand Indonesia Lt. 3, Unit 3A"
                              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                              Kota/Kabupaten <span className="text-emerald-400">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="Jakarta Selatan"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                              Kecamatan
                            </label>
                            <input
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              placeholder="Kebayoran Baru"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                            Kode Pos
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="12190"
                            maxLength={5}
                            className="w-full sm:w-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                            Lokasi di Peta <span className="text-emerald-400">*</span>
                          </label>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                            Pilih lokasi bisnis Anda dengan tepat agar pelanggan dapat menemukan Anda
                          </p>
                          <LocationPicker
                            latitude={formData.latitude}
                            longitude={formData.longitude}
                            onLocationChange={handleLocationChange}
                          />
                          {formData.latitude && formData.longitude && (
                            <p className="text-[10px] sm:text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              Lokasi dipilih
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Contact */}
                {step === 3 && (
                  <div className="space-y-4 sm:space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Nomor Telepon <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="08123456789"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        WhatsApp
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <input
                          type="tel"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="Kosongkan jika sama"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.bisnisanda.com"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                        />
                      </div>
                    </div>

                    <OperatingHoursInput
                      value={formData.operatingHours}
                      onChange={(hours) => setFormData(prev => ({ ...prev, operatingHours: hours }))}
                    />
                  </div>
                )}

                {/* Step 4: Photos & Social Media */}
                {step === 4 && (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    <ImageUploader
                      label="Logo Bisnis"
                      hint="Upload logo (200x200 piksel)"
                      value={formData.logoUrl}
                      onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url as string }))}
                      multiple={false}
                    />

                    <ImageUploader
                      label="Foto Bisnis"
                      hint="Upload foto produk atau tempat usaha"
                      value={formData.photos}
                      onChange={(urls) => setFormData(prev => ({ ...prev, photos: urls as string[] }))}
                      multiple={true}
                      maxFiles={5}
                    />

                    <div className="pt-3 sm:pt-4 border-t border-white/5">
                      <h3 className="font-medium text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm">Sosial Media</h3>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="relative">
                          <Instagram className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="instagramHandle"
                            value={formData.instagramHandle}
                            onChange={handleChange}
                            placeholder="@instagram"
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>

                        <div className="relative">
                          <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          <input
                            type="text"
                            name="tiktokHandle"
                            value={formData.tiktokHandle}
                            onChange={handleChange}
                            placeholder="@tiktok"
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>

                        <div className="relative">
                          <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <input
                            type="url"
                            name="facebookUrl"
                            value={formData.facebookUrl}
                            onChange={handleChange}
                            placeholder="facebook.com/..."
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 mt-4 sm:mt-6">
                      <h3 className="font-medium text-emerald-400 mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Ringkasan
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bisnis</span>
                          <span className="text-white truncate ml-2">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kategori</span>
                          <span className="text-white">
                            {CATEGORIES.find(c => c.slug === formData.categorySlug)?.name || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Harga</span>
                          <span className="text-white">
                            {formData.priceRangeMin === formData.priceRangeMax 
                              ? PRICE_TIERS.find(t => t.value === formData.priceRangeMin)?.label
                              : `${PRICE_TIERS.find(t => t.value === formData.priceRangeMin)?.label} - ${PRICE_TIERS.find(t => t.value === formData.priceRangeMax)?.label}`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Lokasi</span>
                          <span className="text-white">
                            {formData.isOnlineBusiness ? (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Online
                              </span>
                            ) : formData.city || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Kembali
                    </button>
                  ) : (
                    <div />
                  )}
                  
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 text-sm"
                    >
                      Lanjutkan
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-emerald-600 text-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
