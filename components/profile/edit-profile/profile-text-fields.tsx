"use client";

import { useId } from "react";
import type { EditProfileTextValues } from "./types";

type ProfileTextFieldsProps = {
  values: EditProfileTextValues;
  onChange: (field: keyof EditProfileTextValues, value: string) => void;
};

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-950 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950";

export function ProfileTextFields({
  values,
  onChange,
}: ProfileTextFieldsProps) {
  const fieldId = useId();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["name", "Display name"],
            ["firstName", "First name"],
            ["lastName", "Last name"],
          ] as const
        ).map(([field, label]) => (
          <label
            key={field}
            htmlFor={`${fieldId}-${field}`}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            <input
              id={`${fieldId}-${field}`}
              name={field}
              type="text"
              required
              value={values[field]}
              onChange={(event) => onChange(field, event.target.value)}
              className={inputClassName}
            />
          </label>
        ))}
      </div>

      <label
        htmlFor={`${fieldId}-bio`}
        className="block text-sm font-medium text-gray-700"
      >
        Bio
        <textarea
          id={`${fieldId}-bio`}
          name="bio"
          rows={3}
          value={values.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          className={`${inputClassName} resize-y`}
        />
      </label>
    </>
  );
}
