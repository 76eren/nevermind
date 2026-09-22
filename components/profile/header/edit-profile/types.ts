export type EditProfileTextValues = {
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
};

export type EditProfileFormValues = EditProfileTextValues & {
  profilePictureImage: File | null;
  profileBannerImage: File | null;
  removeProfilePicture: boolean;
  removeProfileBanner: boolean;
};
