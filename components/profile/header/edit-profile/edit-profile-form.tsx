"use client";

import { X } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProfileImageFields } from "./profile-image-fields";
import { ProfileTextFields } from "./profile-text-fields";
import type { EditProfileFormValues, EditProfileTextValues } from "./types";

type EditProfileFormProps = {
  id: string;
  initialValues: EditProfileTextValues;
  profilePictureUrl?: string | null;
  bannerUrl?: string | null;
  onClose: () => void;
  onApply: (values: EditProfileFormValues) => void | Promise<void>;
};

export function EditProfileForm({
  id,
  initialValues,
  profilePictureUrl,
  bannerUrl,
  onClose,
  onApply,
}: EditProfileFormProps) {
  const [values, setValues] = useState<EditProfileFormValues>({
    ...initialValues,
    profilePictureImage: null,
    profileBannerImage: null,
    removeProfilePicture: false,
    removeProfileBanner: false,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function updateText(field: keyof EditProfileTextValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    setIsApplying(true);
    setSubmitError(null);
    try {
      await onApply(values);
      setIsApplying(false);
    } catch {
      setSubmitError("Unable to update your profile. Try again.");
      setIsApplying(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isApplying) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isApplying) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-hidden rounded-2xl border-0 bg-white p-0 text-gray-950 shadow-2xl backdrop:bg-black/50"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 id={headingId} className="text-xl font-bold">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            aria-label="Close edit profile"
            className="grid size-9 place-items-center rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </header>

        <form action={handleSubmit} className="overflow-y-auto">
          <div className={isCropping ? "" : "space-y-5 p-5 sm:p-6"}>
            <ProfileImageFields
              id={id}
              name={values.name}
              profilePictureUrl={profilePictureUrl}
              bannerUrl={bannerUrl}
              onChange={(field, file) =>
                setValues((current) => ({
                  ...current,
                  [field]: file,
                  [field === "profilePictureImage"
                    ? "removeProfilePicture"
                    : "removeProfileBanner"]: false,
                }))
              }
              onRemove={(kind) =>
                setValues((current) => ({
                  ...current,
                  [kind === "avatar"
                    ? "profilePictureImage"
                    : "profileBannerImage"]: null,
                  [kind === "avatar"
                    ? "removeProfilePicture"
                    : "removeProfileBanner"]: true,
                }))
              }
              onCroppingChange={setIsCropping}
            />

            {!isCropping && (
              <>
                <ProfileTextFields values={values} onChange={updateText} />
                {submitError && (
                  <p role="alert" className="text-sm text-red-600">
                    {submitError}
                  </p>
                )}
                <footer className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isApplying}
                    className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="rounded-full bg-gray-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isApplying ? "Applying…" : "Apply"}
                  </button>
                </footer>
              </>
            )}
          </div>
        </form>
      </div>
    </dialog>,
    document.body,
  );
}
