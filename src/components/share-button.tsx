"use client";

import { Share } from "lucide-react";
import { Button } from "./ui/button";
import type { Pad } from "@prisma/client";

export default function ShareButton(pad: Pad) {
  return (
    <Button
      title="Share Pad"
      onClick={() => {
        try {
          void navigator.share({
            title: pad.name,
            url: `https://cognent.vercel.app/p/${pad.id}`,
          });
        } catch {
          void navigator.clipboard.writeText(
            `https://cognent.vercel.app/p/${pad.id}`,
          );
        }
      }}
      variant="secondary"
      size="icon"
    >
      <Share className="size-4" />
    </Button>
  );
}
