import "server-only";

import { Readable } from "node:stream";
import { minioBucket, minioClient } from "@/lib/storage/minio";

export type StoredImage = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  size: number;
  etag: string;
  lastModified: Date;
};

type UserImageType = "profile" | "banner";

const userImageKeyPattern =
  /^users\/[a-zA-Z0-9_-]+\/(profile|banner)\/[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$/i;

function validateImageKey(
  objectKey: string,
  expectedType?: UserImageType,
): void {
  const match = userImageKeyPattern.exec(objectKey);

  if (!match) {
    throw new Error("Invalid image object key");
  }

  const actualType = match[1] as UserImageType;

  if (expectedType && actualType !== expectedType) {
    throw new Error(
      `Expected a ${expectedType} image, but received a ${actualType} image`,
    );
  }
}

function getContentTypeFromKey(objectKey: string): string {
  const extension = objectKey.split(".").at(-1)?.toLowerCase();

  // TODO: extensions are hardcoded between this file and the upload file
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";

    case "png":
      return "image/png";

    case "webp":
      return "image/webp";

    default:
      return "application/octet-stream";
  }
}

export async function getImage(objectKey: string): Promise<StoredImage> {
  validateImageKey(objectKey);

  const imageInformation = await minioClient.statObject(minioBucket, objectKey);

  const nodeStream = await minioClient.getObject(minioBucket, objectKey);

  const contentType =
    imageInformation.metaData["content-type"] ??
    imageInformation.metaData["Content-Type"] ??
    getContentTypeFromKey(objectKey);

  return {
    body: Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>,
    contentType,
    size: imageInformation.size,
    etag: imageInformation.etag,
    lastModified: imageInformation.lastModified,
  };
}

// Expects object key to be of form: `users/${userId}/profile/${imageId}.${extension}`
export async function getProfilePicture(
  objectKey: string,
): Promise<StoredImage> {
  validateImageKey(objectKey, "profile");

  return getImage(objectKey);
}

// Expects object key to be of form: `users/${userId}/banner/${imageId}.${extension}`
export async function getBanner(objectKey: string): Promise<StoredImage> {
  validateImageKey(objectKey, "banner");

  return getImage(objectKey);
}
