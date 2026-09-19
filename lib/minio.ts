import "server-only";

import { Client } from "minio";

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const minioBucket = getRequiredEnvironmentVariable("MINIO_BUCKET");

export const minioClient = new Client({
  endPoint: getRequiredEnvironmentVariable("MINIO_ENDPOINT"),
  port: Number(getRequiredEnvironmentVariable("MINIO_PORT")),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: getRequiredEnvironmentVariable("MINIO_ROOT_USER"),
  secretKey: getRequiredEnvironmentVariable("MINIO_ROOT_PASSWORD"),
});
