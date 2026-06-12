"use client";

import { useState } from "react";
import { removePetProfileRecord } from "@/lib/actions/pet";

interface DeletePetButtonProps {
  petId: string;
}

export default function DeletePetButton({
  petId,
}: DeletePetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await removePetProfileRecord(petId);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-3 text-xs font-semibold text-red-600 hover:text-red-500"
    >
      {isDeleting ? "Deleting..." : "Delete Pet"}
    </button>
  );
}