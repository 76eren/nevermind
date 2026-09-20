"use client";

import Image from "next/image";
import { useState, type SubmitEvent } from "react";

const MAX_MESSAGE_LENGTH = 280;

type PostInputProps = {
  name: string;
  image?: string | null;
};
export function PostInput({ name, image }: PostInputProps) {
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const canPost = message.trim().length > 0 && !isPosting;

  async function handlePost(content: string) {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok || response.redirected) {
      throw new Error("Failed to post");
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPost) return;

    setIsPosting(true);
    setError("");

    try {
      await handlePost(message.trim());
      setMessage("");
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

          <p className="mt-2 text-sm font-medium text-[#ed145b]">
            The faith of the world is now in your hands
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#eceef0] pt-3">
            <span className="text-sm text-[#7a8087]" aria-live="polite">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>

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
