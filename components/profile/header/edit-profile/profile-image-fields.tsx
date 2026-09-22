"use client";

import ProfilePictureView from "@/components/profile-picture-view";
import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ProfileImageCropper } from "./profile-image-cropper";

type ImageKind = "avatar" | "banner";
type ImageField = "profilePictureImage" | "profileBannerImage";
type PendingCrop = { kind: ImageKind; url: string };

type ProfileImageFieldsProps = {
  name: string;
  id: string;
  profilePictureUrl?: string | null;
  bannerUrl?: string | null;
  onChange: (field: ImageField, file: File) => void;
  onRemove: (kind: ImageKind) => void;
  onCroppingChange: (isCropping: boolean) => void;
};

const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function ProfileImageFields({
  id,
  name,
  profilePictureUrl,
  bannerUrl,
  onChange,
  onRemove,
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

  function removeImage(kind: ImageKind) {
    releaseUrl(previews[kind]);
    setPreviews((current) => ({ ...current, [kind]: null }));
    onRemove(kind);
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
        {previews.banner && (
          <button
            type="button"
            onClick={() => removeImage("banner")}
            aria-label="Remove banner"
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/65 text-white hover:bg-black/80"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
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
        <ProfilePictureView
          imageUrl={previews.avatar}
          userId={id}
          name={name}
        />
        {previews.avatar && (
          <button
            type="button"
            onClick={() => removeImage("avatar")}
            aria-label="Remove profile picture"
            className="absolute right-1 top-1 z-10 grid size-7 place-items-center rounded-full bg-black/65 text-white hover:bg-black/80"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
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
