import "server-only";

import { randomUUID } from "node:crypto";
import { minioBucket, minioClient } from "@/lib/storage/minio";

const supportedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SupportedImageType = keyof typeof supportedImageTypes;
type UserImageType = "profile" | "banner";

export type UploadedImage = {
  imageId: string;
  objectKey: string;
  etag: string;
  versionId: string | null;
  contentType: SupportedImageType;
  size: number;
};

const maximumFileSizes: Record<UserImageType, number> = {
  profile: 5 * 1024 * 1024,
  banner: 10 * 1024 * 1024,
};

function validateUserId(userId: string): void {
  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
    throw new Error("Invalid user ID");
  }
}

function validateImage(
  file: File,
  imageType: UserImageType,
): asserts file is File & { type: SupportedImageType } {
  if (!(file.type in supportedImageTypes)) {
    throw new Error("Only JPEG, PNG and WebP images are allowed");
  }

  if (file.size === 0) {
    throw new Error("The image is empty");
  }

  if (file.size > maximumFileSizes[imageType]) {
    const maximumMegabytes = maximumFileSizes[imageType] / 1024 / 1024;

    throw new Error(`The image cannot be larger than ${maximumMegabytes} MB`);
  }
}

async function uploadUserImage(
  userId: string,
  imageType: UserImageType,
  file: File,
): Promise<UploadedImage> {
  validateUserId(userId); // Should not even be necessary but whatever feeling cute rn

  validateImage(file, imageType);

  const imageId = randomUUID();
  const extension = supportedImageTypes[file.type];

  const objectKey = `users/${userId}/${imageType}/${imageId}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await minioClient.putObject(
    minioBucket,
    objectKey,
    buffer,
    buffer.length,
    {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  );

  return {
    imageId,
    objectKey,
    etag: result.etag,
    versionId: result.versionId ?? null,
    contentType: file.type,
    size: file.size,
  };
}

// Saves image to: `users/${userId}/profile/${imageId}.${extension}`
export function uploadProfilePicture(
  userId: string,
  file: File,
): Promise<UploadedImage> {
  return uploadUserImage(userId, "profile", file);
}

// Saves image to: `users/${userId}/banner/${imageId}.${extension}`
export function uploadBanner(
  userId: string,
  file: File,
): Promise<UploadedImage> {
  return uploadUserImage(userId, "banner", file);
}
