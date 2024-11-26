"use client";

import type { Pad } from "@prisma/client";
import DeleteButton from "../delete-button";
import ShareButton from "../share-button";
import { GripVertical } from "lucide-react";

export default function SideTools({
  pad,
  isReadonly,
}: {
  pad: Pad;
  isReadonly: boolean;
}) {
  return (
    <div className="group fixed right-0 top-1/3 z-50 flex translate-x-14 flex-col gap-2 rounded-lg border bg-card p-2 transition-all hover:-translate-x-2">
      <div className="absolute inset-0 group-hover:hidden" />
      <div className="absolute -left-5 top-2 flex h-10 w-5 items-center justify-center rounded-l-lg border border-r-0 bg-card text-muted-foreground">
        <GripVertical className="size-5" />
      </div>
      {!isReadonly && <DeleteButton id={pad.id} />}
      <ShareButton {...pad} />
    </div>
  );
}
