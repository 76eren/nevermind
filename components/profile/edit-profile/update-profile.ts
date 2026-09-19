import type { EditProfileFormValues, EditProfileTextValues } from "./types";

export async function updateProfile(
  values: EditProfileFormValues,
  initialValues: EditProfileTextValues,
) {
  const requestBody = new FormData();

  for (const field of ["name", "firstName", "lastName", "bio"] as const) {
    if (values[field] !== initialValues[field]) {
      requestBody.set(field, values[field]);
    }
  }

  if (values.profilePictureImage) {
    requestBody.set("profilePictureImage", values.profilePictureImage);
  }
  if (values.profileBannerImage) {
    requestBody.set("profileBannerImage", values.profileBannerImage);
  }

  if ([...requestBody.keys()].length === 0) return;

  const response = await fetch("/api/user", {
    method: "PATCH",
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error("Failed to update profile.");
  }
}
