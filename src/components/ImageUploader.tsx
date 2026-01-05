"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  hint?: string;
  bucket?: string;
  folder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  label,
  hint,
  bucket = "umkm-images",
  folder = "submissions",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Normalize value to array
  const images = multiple 
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (value && typeof value === "string" ? [value] : []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max files
    if (multiple && images.length + files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} foto`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("File harus berupa gambar");
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Ukuran file maksimal 5MB");
        }

        // Generate unique filename
        const ext = file.name.split(".").pop();
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Gagal mengupload gambar");
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      // Update value
      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Gagal mengupload gambar");
    } finally {
      setUploading(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {hint && (
        <p className="text-sm text-gray-500 mb-3">{hint}</p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className={`grid gap-3 mb-3 ${multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className={`w-full object-cover rounded-lg border border-gray-200 ${
                  multiple ? "h-24" : "h-32"
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {(multiple ? images.length < maxFiles : images.length === 0) && (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors ${
            uploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleUpload}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="text-sm text-gray-500">Mengupload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <span className="text-emerald-600 font-medium">Klik untuk upload</span>
                <span className="text-gray-500"> atau drag & drop</span>
              </div>
              <span className="text-xs text-gray-400">
                PNG, JPG hingga 5MB {multiple && `(maks. ${maxFiles} foto)`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

