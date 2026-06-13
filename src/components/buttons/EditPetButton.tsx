"use client";

import { useState } from "react";
import { PetRow } from "@/types";
import EditPetForm from "@/components/forms/EditPetForm";

interface EditPetButtonProps {
  pet: PetRow;
}

export default function EditPetButton({
  pet,
}: EditPetButtonProps) {
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
          : "Edit Pet"}
      </button>

      {isEditing && (
        <EditPetForm pet={pet} />
      )}
    </div>
  );
}