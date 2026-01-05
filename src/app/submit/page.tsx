"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { CATEGORIES, checkSubmissionStatus, submitBusiness } from "@/lib/api";
import { 
  Store, User, Mail, LogOut, MapPin, Phone,
  Instagram, ArrowRight, ArrowLeft, Loader2, CheckCircle,
  AlertCircle
} from "lucide-react";
import dynamicImport from "next/dynamic";
import ImageUploader from "@/components/ImageUploader";

// Dynamically import map component to avoid SSR issues
const LocationPicker = dynamicImport(
  () => import("@/components/LocationPicker"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-sm">Memuat peta...</span>
        </div>
      </div>
    )
  }
);

const BUSINESS_SIZES = [
  { value: "MICRO", label: "Usaha Mikro", description: "Omset < Rp 300 juta/tahun" },
  { value: "SMALL", label: "Usaha Kecil", description: "Omset Rp 300 juta - 2.5 miliar/tahun" },
  { value: "MEDIUM", label: "Usaha Menengah", description: "Omset Rp 2.5 - 50 miliar/tahun" },
] as const;

interface FormData {
  name: string;
  description: string;
  ownerName: string;
  businessSize: "MICRO" | "SMALL" | "MEDIUM";
  categorySlug: string;
  address: string;
  city: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string;
  whatsappNumber: string;
  // Social media
  instagramHandle: string;
  tiktokHandle: string;
  facebookUrl: string;
  // Media
  logoUrl: string;
  photos: string[];
}

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
    businessSize: "MICRO",
    categorySlug: "",
    address: "",
    city: "",
    district: "",
    latitude: null,
    longitude: null,
    phoneNumber: "",
    whatsappNumber: "",
    instagramHandle: "",
    tiktokHandle: "",
    facebookUrl: "",
    logoUrl: "",
    photos: [],
  });

  // Check auth and submission status
  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/signup");
          return;
        }

        // Check submission status
        const status = await checkSubmissionStatus(session.access_token);
        
        if (status.hasSubmission) {
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

  // Prevent Enter key from submitting the form in input fields
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // IMPORTANT: Only allow submission from step 4
    // This prevents accidental submissions during step navigation
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
        businessSize: formData.businessSize,
        categorySlug: formData.categorySlug,
        address: formData.address,
        city: formData.city,
        district: formData.district || undefined,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber || undefined,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Bursa</span>
          </Link>
          
          {/* Steps Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s 
                    ? "bg-emerald-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-6 h-1 transition-colors ${
                    step > s ? "bg-emerald-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info Card */}
        {userInfo && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-emerald-600 font-medium">Mendaftar sebagai:</p>
              <p className="font-semibold text-gray-900">{userInfo.name || "Pengguna Baru"}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {userInfo.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-emerald-600 text-sm hover:text-emerald-700 underline"
            >
              Bukan Anda?
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 1 && "Informasi Bisnis"}
              {step === 2 && "Lokasi Bisnis"}
              {step === 3 && "Kontak"}
              {step === 4 && "Foto & Sosial Media"}
            </h1>
            <p className="text-gray-600 mt-1">
              {step === 1 && "Ceritakan tentang bisnis Anda"}
              {step === 2 && "Dimana lokasi bisnis Anda?"}
              {step === 3 && "Bagaimana pelanggan bisa menghubungi Anda?"}
              {step === 4 && "Tambahkan foto dan link sosial media (opsional)"}
            </p>
          </div>

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6">
            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Bisnis *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Warung Makan Bu Ani"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Bisnis *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ceritakan tentang bisnis Anda, produk atau jasa yang ditawarkan..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemilik *
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Nama Anda"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="businessSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Skala Usaha
                    </label>
                    <select
                      id="businessSize"
                      name="businessSize"
                      value={formData.businessSize}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {BUSINESS_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Bisnis *
                  </label>
                  <select
                    id="categorySlug"
                    name="categorySlug"
                    value={formData.categorySlug}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih kategori...</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Kota/Kabupaten *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Contoh: Jakarta Selatan"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                      Kecamatan
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Contoh: Kebayoran Baru"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi di Peta *
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Klik pada peta atau geser marker untuk menentukan lokasi bisnis Anda
                  </p>
                  <LocationPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationChange={handleLocationChange}
                  />
                  {formData.latitude && formData.longitude && (
                    <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Lokasi dipilih: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="08123456789"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="08123456789 (opsional)"
                      className="input-field pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika sama dengan nomor telepon
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Photos & Social Media */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                {/* Logo */}
                <ImageUploader
                  label="Logo Bisnis (opsional)"
                  hint="Upload logo bisnis Anda. Ukuran yang disarankan: 200x200 piksel"
                  value={formData.logoUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url as string }))}
                  multiple={false}
                />

                {/* Photos */}
                <ImageUploader
                  label="Foto Bisnis (opsional)"
                  hint="Upload foto produk, tempat usaha, atau kegiatan bisnis Anda"
                  value={formData.photos}
                  onChange={(urls) => setFormData(prev => ({ ...prev, photos: urls as string[] }))}
                  multiple={true}
                  maxFiles={5}
                />

                {/* Social Media */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Sosial Media (opsional)</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="instagramHandle" className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="instagramHandle"
                          name="instagramHandle"
                          value={formData.instagramHandle}
                          onChange={handleChange}
                          placeholder="@username"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tiktokHandle" className="block text-sm font-medium text-gray-700 mb-2">
                        TikTok
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <input
                          type="text"
                          id="tiktokHandle"
                          name="tiktokHandle"
                          value={formData.tiktokHandle}
                          onChange={handleChange}
                          placeholder="@username"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <input
                          type="url"
                          id="facebookUrl"
                          name="facebookUrl"
                          value={formData.facebookUrl}
                          onChange={handleChange}
                          placeholder="https://facebook.com/bisnis-anda"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Ringkasan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nama Bisnis:</span>
                      <span className="font-medium text-gray-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kategori:</span>
                      <span className="font-medium text-gray-900">
                        {CATEGORIES.find(c => c.slug === formData.categorySlug)?.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lokasi:</span>
                      <span className="font-medium text-gray-900">{formData.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Foto:</span>
                      <span className="font-medium text-gray-900">
                        {formData.photos.length > 0 ? `${formData.photos.length} foto` : "Tidak ada"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali
                </button>
              ) : (
                <div />
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center gap-2"
                >
                  Lanjutkan
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Pendaftaran
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

