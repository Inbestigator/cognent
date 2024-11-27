"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const deletePad = api.pad.delete.useMutation({
    onSuccess: async () => {
      await utils.pad.invalidate();
      router.push("/");
    },
  });

  return (
    <Button
      title="Delete Pad"
      onClick={() => {
        if (confirm("Are you sure you want to delete this pad?")) {
          deletePad.mutate(id);
        }
      }}
      variant="ghost"
      size="icon"
      disabled={deletePad.isPending}
      className="hover:bg-destructive hover:text-destructive-foreground"
    >
      {deletePad.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
