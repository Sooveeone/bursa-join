const BURSA_API_URL = process.env.NEXT_PUBLIC_BURSA_API_URL || "http://localhost:3000";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

// Hardcoded categories - keep in sync with bursa main app
export const CATEGORIES: Category[] = [
  { id: "food-beverage", name: "Makanan & Minuman", slug: "food-beverage", icon: "🍜" },
  { id: "grocery-convenience", name: "Toko Kelontong & Kebutuhan", slug: "grocery-convenience", icon: "🛒" },
  { id: "retail-fashion", name: "Retail & Fashion", slug: "retail-fashion", icon: "🛍️" },
  { id: "services", name: "Jasa & Layanan", slug: "services", icon: "🤲" },
  { id: "entertainment", name: "Hiburan", slug: "entertainment", icon: "🎱" },
  { id: "sports-fitness", name: "Olahraga & Kebugaran", slug: "sports-fitness", icon: "🏃" },
  { id: "handicrafts-souvenirs", name: "Kerajinan & Souvenir", slug: "handicrafts-souvenirs", icon: "🎨" },
  { id: "agriculture-fresh-produce", name: "Pertanian & Produk Segar", slug: "agriculture-fresh-produce", icon: "🌾" },
  { id: "health", name: "Kesehatan", slug: "health", icon: "🏥" },
  { id: "beauty", name: "Kecantikan", slug: "beauty", icon: "💅" },
  { id: "home-living", name: "Rumah & Interior", slug: "home-living", icon: "🏠" },
  { id: "property-rentals", name: "Properti & Sewa", slug: "property-rentals", icon: "🏘️" },
  { id: "education-training", name: "Pendidikan & Pelatihan", slug: "education-training", icon: "📚" },
  { id: "technology-digital", name: "Teknologi & Digital", slug: "technology-digital", icon: "💻" },
  { id: "other", name: "Lainnya", slug: "other", icon: "📦" },
];

export interface Submission {
  id: string;
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  isOnlineBusiness: boolean;
}

export interface SubmissionStatus {
  submissions: Submission[];
  canSubmitMore: boolean;
  remainingSlots: number;
  user: {
    email: string;
    name: string | null;
  };
}

export interface BusinessSubmission {
  name: string;
  description: string;
  ownerName: string;
  categorySlug: string;
  // Online business flag
  isOnlineBusiness: boolean;
  // Location fields - optional for online businesses
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber: string;
  whatsappNumber?: string;
  website?: string;
  // Operating hours
  operatingHours?: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  // Social media
  instagramHandle?: string;
  tiktokHandle?: string;
  facebookUrl?: string;
  // Media
  logoUrl?: string;
  photos?: string[];
}

// Check submission status
export async function checkSubmissionStatus(token: string): Promise<SubmissionStatus> {
  const response = await fetch(`${BURSA_API_URL}/api/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to check submission status");
  }
  
  return response.json();
}

// Submit a business
export async function submitBusiness(token: string, data: BusinessSubmission): Promise<{ success: boolean; business: { id: string; name: string; status: string } }> {
  const response = await fetch(`${BURSA_API_URL}/api/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit business");
  }
  
  return response.json();
}

