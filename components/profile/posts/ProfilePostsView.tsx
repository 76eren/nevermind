"use client";

// This component is used to display a user's posts on their profile page.
// I will not re-use this component for the home screen as it doesn't make sense to show the user's own posts on the home page

import Post, { type PostModel } from "@/components/post";
import { useEffect, useState } from "react";

type ProfilePostsViewProps = {
  username: string;
  firstname: string;
  lastname: string;
  profilePictureUrl: string | null;
};

type PostResponse = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePostsView({
  username,
  firstname,
  lastname,
  profilePictureUrl,
}: ProfilePostsViewProps) {
  const [posts, setPosts] = useState<PostModel[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      try {
        const response = await fetch(
          `/api/user/${encodeURIComponent(username)}/posts`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts (${response.status})`);
        }

        const data = (await response.json()) as PostResponse[];

        setPosts(
          data.map((post) => ({
            id: post.id,
            content: post.content,
            imageUrl: post.image,
            authorId: post.authorId,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          })),
        );
        setError("");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching posts:", error);
        setError("Could not load this user's posts.");
      }
    }

    void fetchPosts();

    return () => controller.abort();
  }, [username]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-18">
        <p role="alert" className="text-lg font-semibold text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="flex flex-col items-center justify-center py-18">
        <p className="text-lg text-[#687078]">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-18">
        <p className="text-2xl font-bold">This user has no posts yet</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Post
          userId={post.authorId}
          key={post.id}
          post={post}
          username={username}
          firstName={firstname}
          lastName={lastname}
          profilePictureUrl={profilePictureUrl}
        />
      ))}
    </div>
  );
}
