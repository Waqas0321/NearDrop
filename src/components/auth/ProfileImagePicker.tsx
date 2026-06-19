"use client";

import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { readImageFile } from "@/lib/profile-storage";

interface ProfileImagePickerProps {
  value: string | null;
  onChange: (image: string | null) => void;
}

export function ProfileImagePicker({ value, onChange }: ProfileImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const dataUrl = await readImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
      onChange(null);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-background transition-all hover:border-primary/50 hover:bg-primary-light/30"
        aria-label="Choose profile photo"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-9 w-9 text-muted-light" strokeWidth={1.25} />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />

      <p className="mt-2 text-xs text-muted">
        {value ? "Tap to change photo" : "Add profile photo (optional, max 5MB)"}
      </p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setError(null);
          }}
          className="mt-1 text-xs text-muted-light transition-colors hover:text-danger"
        >
          Remove photo
        </button>
      )}
    </div>
  );
}
