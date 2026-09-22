"use client";

import ProfilePictureView from "@/components/profile-picture-view";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { useState } from "react";

export type PostModel = {
  id: string;
  content: string;
  imageUrl?: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type PostProps = {
  userId: string;
  post: PostModel;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
};

// This is a single post, can be used on both profile and home page. This is
// not a comment, which will use a different format.
export default function Post({
  userId,
  post,
  username,
  firstName,
  lastName,
  profilePictureUrl,
}: PostProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const createdAt = new Date(post.createdAt);

  function handleCommentClick() {
    setIsCommenting((currentValue) => !currentValue);
  }

  function handleRepostClick() {
    setIsReposted((currentValue) => !currentValue);
  }

  function handleLikeClick() {
    setIsLiked((currentValue) => !currentValue);
  }

  return (
    <article className="border-b border-[#eceef0] bg-white px-5 py-4 text-[#15171a] transition-colors hover:bg-[#fafafa] sm:px-7 overflow-hidden">
      <div className="flex gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#15171a] text-sm font-bold text-white"
        >
          <ProfilePictureView
            imageUrl={profilePictureUrl}
            userId={userId}
            name={`${firstName} ${lastName}`.trim() || username}
          />
        </div>

        <div className="min-w-0 flex-1">
          <header className="flex min-w-0 items-center gap-1 text-[15px]">
            <span className="truncate font-bold">
              {firstName} {lastName}
            </span>
            <span className="truncate text-[#687078]">@{username}</span>
            <span aria-hidden="true" className="text-[#687078]">
              ·
            </span>
            <time
              dateTime={createdAt.toISOString()}
              title={createdAt.toLocaleString("en-US", { timeZone: "UTC" })}
              className="shrink-0 text-[#687078]"
            >
              {formatPostDate(createdAt)}
            </time>
          </header>

          <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-5">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#dfe3e6] bg-[#f4f5f6]">
              <img
                src={getPostImageSrc(post.imageUrl)}
                alt="Post attachment"
                loading="lazy"
                className="max-h-[32rem] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-3 flex max-w-md items-center justify-between text-[#687078]">
            <button
              type="button"
              onClick={handleCommentClick}
              aria-expanded={isCommenting}
              aria-controls={`comment-${post.id}`}
              className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-[#1d9bf0] focus-visible:text-[#1d9bf0] focus-visible:outline-none"
            >
              <span className="rounded-full p-2 transition-colors group-hover:bg-[#1d9bf0]/10 group-focus-visible:bg-[#1d9bf0]/10">
                <MessageCircle aria-hidden="true" className="size-[18px]" />
              </span>
              <span>Reply</span>
            </button>

            <button
              type="button"
              onClick={handleRepostClick}
              aria-pressed={isReposted}
              className={`group inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline-none ${
                isReposted
                  ? "text-[#00a65a]"
                  : "hover:text-[#00a65a] focus-visible:text-[#00a65a]"
              }`}
            >
              <span className="rounded-full p-2 transition-colors group-hover:bg-[#00a65a]/10 group-focus-visible:bg-[#00a65a]/10">
                <Repeat2 aria-hidden="true" className="size-[18px]" />
              </span>
              <span>{isReposted ? "Reposted" : "Repost"}</span>
            </button>

            <button
              type="button"
              onClick={handleLikeClick}
              aria-pressed={isLiked}
              className={`group inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline-none ${
                isLiked
                  ? "text-[#ed145b]"
                  : "hover:text-[#ed145b] focus-visible:text-[#ed145b]"
              }`}
            >
              <span className="rounded-full p-2 transition-colors group-hover:bg-[#ed145b]/10 group-focus-visible:bg-[#ed145b]/10">
                <Heart
                  aria-hidden="true"
                  className={`size-[18px] ${isLiked ? "fill-current" : ""}`}
                />
              </span>
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
          </div>

          {isCommenting && (
            <div
              id={`comment-${post.id}`}
              className="mt-3 flex items-end gap-3"
            >
              <label htmlFor={`comment-input-${post.id}`} className="sr-only">
                Write a reply
              </label>
              <textarea
                id={`comment-input-${post.id}`}
                autoFocus
                rows={1}
                maxLength={280}
                placeholder="Post your reply"
                className="min-h-10 flex-1 resize-none rounded-xl border border-[#dfe3e6] bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-[#7a8087] focus:border-[#ed145b]"
              />
              <button
                type="button"
                onClick={() => setIsCommenting(false)}
                className="rounded-full bg-[#ed145b] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#d50f50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed145b]"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getPostImageSrc(imageUrl: string) {
  if (
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `/api/images?key=${encodeURIComponent(imageUrl)}`;
}
