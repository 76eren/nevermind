import { Blobatar } from "blobatar/react";
import "blobatar/motion.css";

type ProfilePictureViewProps = {
  imageUrl?: string | null;
  userId: string;
  name: string;
};

export default function ProfilePictureView({
  imageUrl,
  userId,
  name,
}: ProfilePictureViewProps) {
  const imageSrc = imageUrl?.startsWith("blob:")
    ? imageUrl
    : imageUrl
      ? `/api/images?key=${encodeURIComponent(imageUrl)}`
      : null;

  return imageSrc ? (
    <img
      src={imageSrc}
      alt={`${name}'s profile picture`}
      className="size-full object-cover"
    />
  ) : (
    <div className="grid size-full place-items-center">
      <Blobatar name={userId} animate="always" />
    </div>
  );
}
