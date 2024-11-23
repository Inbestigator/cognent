"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

export default function TitlePrompter() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const router = useRouter();
  const createPad = api.pad.create.useMutation({
    onSuccess: async (data) => {
      await utils.pad.invalidate();
      router.push(`/p/${data.id}`);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPad.mutate({ name });
      }}
      className="flex w-full flex-col gap-2"
    >
      <Badge variant="secondary" className="w-fit rounded-lg">
        {createPad.isPending || createPad.isSuccess ? "Saving..." : "Unsaved"}
      </Badge>
      <input
        disabled={createPad.isPending}
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-5xl font-extrabold focus:outline-none"
        minLength={1}
        maxLength={32}
      />
    </form>
  );
}
