"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

type ProfileImageCropperProps = {
  imageUrl: string;
  kind: "avatar" | "banner";
  onCancel: () => void;
  onComplete: (file: File) => void;
};

async function cropImage(
  imageUrl: string,
  area: Area,
  kind: "avatar" | "banner",
) {
  const image = new Image();
  image.src = imageUrl;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = kind === "avatar" ? 512 : 1500;
  canvas.height = kind === "avatar" ? 512 : 500;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to prepare this photo.");

  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("Unable to crop this photo."));
    }, "image/png");
  });

  return new File([blob], `${kind}.png`, { type: blob.type });
}

export function ProfileImageCropper({
  imageUrl,
  kind,
  onCancel,
  onComplete,
}: ProfileImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUsePhoto() {
    if (!area || isCropping) return;
    setIsCropping(true);
    setError(null);
    try {
      onComplete(await cropImage(imageUrl, area, kind));
    } catch {
      setError("Unable to crop this photo. Try another image.");
      setIsCropping(false);
    }
  }

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-bold text-gray-950">
          {kind === "avatar" ? "Crop profile picture" : "Crop banner"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Drag your photo to position it and adjust the zoom.
        </p>
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl bg-gray-950 sm:h-80">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={kind === "avatar" ? 1 : 3}
          cropShape={kind === "avatar" ? "round" : "rect"}
          showGrid={kind === "banner"}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_area, pixels) => setArea(pixels)}
          mediaProps={{
            onError: () =>
              setError("Unable to open this photo. Try another image."),
          }}
        />
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="mt-3 block w-full accent-gray-950"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isCropping}
          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUsePhoto}
          disabled={!area || isCropping || !!error}
          className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {isCropping ? "Cropping…" : "Use photo"}
        </button>
      </div>
    </div>
  );
}
