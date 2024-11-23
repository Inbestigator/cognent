import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const deletePad = api.pad.delete.useMutation({
    onSuccess: async () => {
      await utils.pad.invalidate();
    },
  });

  return (
    <Button
      onClick={() => {
        if (confirm("Are you sure you want to delete this pad?")) {
          deletePad.mutate(id);
          router.push("/");
        }
      }}
      variant="destructive"
      size="icon"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
