"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ProfileImageCropper } from "./profile-image-cropper";

type ImageKind = "avatar" | "banner";
type ImageField = "profilePictureImage" | "profileBannerImage";
type PendingCrop = { kind: ImageKind; url: string };

type ProfileImageFieldsProps = {
  name: string;
  profilePictureUrl?: string | null;
  bannerUrl?: string | null;
  onChange: (field: ImageField, file: File) => void;
  onCroppingChange: (isCropping: boolean) => void;
};

const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function ProfileImageFields({
  name,
  profilePictureUrl,
  bannerUrl,
  onChange,
  onCroppingChange,
}: ProfileImageFieldsProps) {
  const [previews, setPreviews] = useState({
    avatar: profilePictureUrl,
    banner: bannerUrl,
  });
  const [pendingCrop, setPendingCrop] = useState<PendingCrop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const objectUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  function releaseUrl(url: string | null | undefined) {
    if (url && objectUrls.current.delete(url)) URL.revokeObjectURL(url);
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>, kind: ImageKind) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!acceptedImageTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF photo.");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setPendingCrop({ kind, url });
    onCroppingChange(true);
  }

  function cancelCrop() {
    releaseUrl(pendingCrop?.url);
    setPendingCrop(null);
    onCroppingChange(false);
  }

  function completeCrop(file: File) {
    if (!pendingCrop) return;
    const { kind } = pendingCrop;
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    releaseUrl(previews[kind]);
    releaseUrl(pendingCrop.url);
    setPreviews((current) => ({ ...current, [kind]: url }));
    onChange(
      kind === "avatar" ? "profilePictureImage" : "profileBannerImage",
      file,
    );
    setPendingCrop(null);
    onCroppingChange(false);
  }

  if (pendingCrop) {
    return (
      <ProfileImageCropper
        imageUrl={pendingCrop.url}
        kind={pendingCrop.kind}
        onCancel={cancelCrop}
        onComplete={completeCrop}
      />
    );
  }

  return (
    <div>
      <div className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 sm:h-44">
        {previews.banner && (
          // Blob URLs need a regular image element for immediate local previews.
          <img
            src={previews.banner}
            alt="Banner preview"
            className="size-full object-cover"
          />
        )}
        <label className="absolute inset-0 grid cursor-pointer place-items-center focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-950">
          <span className="flex items-center gap-2 rounded-full bg-black/65 px-4 py-2 text-sm font-bold text-white">
            <Camera className="size-4" /> Change banner
          </span>
          <input
            type="file"
            accept={acceptedImageTypes.join(",")}
            aria-label="Choose banner photo"
            onChange={(event) => selectImage(event, "banner")}
            className="sr-only"
          />
        </label>
      </div>

      <div className="relative -mt-10 ml-4 size-24 overflow-hidden rounded-full border-4 border-white bg-slate-200">
        {previews.avatar ? (
          <img
            src={previews.avatar}
            alt="Profile picture preview"
            className="size-full object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center text-3xl font-bold text-slate-500">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <label className="absolute inset-0 grid cursor-pointer place-items-center rounded-full bg-black/35 text-white focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-950">
          <Camera className="size-6" aria-hidden="true" />
          <input
            type="file"
            accept={acceptedImageTypes.join(",")}
            aria-label="Choose profile picture"
            onChange={(event) => selectImage(event, "avatar")}
            className="sr-only"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
