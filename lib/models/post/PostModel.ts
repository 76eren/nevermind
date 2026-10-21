export type PostModel = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  likeCount: number;
};
