"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";

const MAX_MESSAGE_LENGTH = 280;

type PostInputProps = {
  name: string;
  image?: string | null;
};

type SelectedPostImage = {
  file: File;
  previewUrl: string;
};

export function PostInput({ name, image }: PostInputProps) {
  const [message, setMessage] = useState("");
  const [postImage, setPostImage] = useState<SelectedPostImage | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canPost = message.trim().length > 0 && !isPosting;

  useEffect(() => {
    const previewUrl = postImage?.previewUrl;

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [postImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setPostImage(
      file
        ? {
            file,
            previewUrl: URL.createObjectURL(file),
          }
        : null,
    );
  }

  function removePostImage() {
    setPostImage(null);

    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  async function handlePost(content: string, image: File | null) {
    const body = new FormData();

    body.set("message", content);

    if (image) {
      body.set("image", image);
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body,
    });

    if (!response.ok || response.redirected) {
      throw new Error("Failed to post");
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPost) return;

    const form = event.currentTarget;

    setIsPosting(true);
    setError("");

    try {
      await handlePost(message.trim(), postImage?.file ?? null);
      setMessage("");
      setPostImage(null);
      form.reset();
    } catch {
      setError("Could not post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-[#eceef0] bg-white px-5 py-5 sm:px-7"
    >
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#15171a] text-sm font-semibold text-white">
          {image ? (
            <Image
              src={`/api/images?key=${encodeURIComponent(image)}`}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            aria-label="Write a post"
            placeholder="What's happening?"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={3}
            className="w-full resize-none bg-transparent pt-2 text-lg text-[#15171a] outline-none placeholder:text-[#7a8087]"
          />

          {postImage && (
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#dfe3e6] bg-[#f4f5f6]">
              <Image
                src={postImage.previewUrl}
                alt={`Preview of ${postImage.file.name}`}
                width={1200}
                height={675}
                unoptimized
                className="max-h-80 w-full object-contain"
              />
              <button
                type="button"
                onClick={removePostImage}
                aria-label="Remove image"
                className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}

          <p className="mt-2 text-sm font-medium text-[#ed145b]">
            The faith of the world is now in your hands
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#eceef0] pt-3">
            <div className="flex min-w-0 items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full p-2 text-sm font-medium text-[#ed145b] transition-colors hover:bg-[#ed145b]/10">
                <ImagePlus aria-hidden="true" className="size-5" />
                <span className="sr-only">Add image</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>

              {postImage && (
                <span className="max-w-40 truncate text-sm text-[#7a8087]">
                  {postImage.file.name}
                </span>
              )}

              <span className="text-sm text-[#7a8087]" aria-live="polite">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>

            <button
              type="submit"
              disabled={!canPost}
              className="rounded-full bg-[#ed145b] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#d50f50] disabled:cursor-not-allowed disabled:bg-[#f7b3ca]"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
