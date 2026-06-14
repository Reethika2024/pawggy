"use client";

import { useState } from "react";
import { UserAddressRow } from "@/types";
import EditAddressForm from "@/components/forms/EditAddressForm";

interface EditAddressButtonProps {
  address: UserAddressRow;
}

export default function EditAddressButton({
  address,
}: EditAddressButtonProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() =>
          setIsEditing(!isEditing)
        }
        className="text-xs font-semibold text-blue-600 hover:text-blue-500"
      >
        {isEditing
          ? "Cancel"
          : "Edit Address"}
      </button>

      {isEditing && (
        <EditAddressForm
          address={address}
        />
      )}
    </div>
  );
}