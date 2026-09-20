import { getImage, StoredImage } from "@/lib/storage/images-retrieval";

export const runtime = "nodejs";

function isMinioNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "NoSuchKey" || error.code === "NotFound";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const objectKey = url.searchParams.get("key");

  if (!objectKey) {
    return Response.json(
      {
        message: "Image key is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const image: StoredImage = await getImage(objectKey);
    const etag = `"${image.etag}"`;

    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new Response(image.body, {
      status: 200,
      headers: {
        "Content-Type": image.contentType,
        "Content-Length": image.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
        "Last-Modified": image.lastModified.toUTCString(),
      },
    });
  } catch (error) {
    console.log("Error fetching image:", error);
    if (isMinioNotFoundError(error)) {
      return Response.json(
        {
          message: "Image not found",
        },
        {
          status: 404,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Invalid image object key")
    ) {
      return Response.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    console.error("Could not fetch image from MinIO:", error);

    return Response.json(
      {
        message: "Could not fetch image",
      },
      {
        status: 500,
      },
    );
  }
}
