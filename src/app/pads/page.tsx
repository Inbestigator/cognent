import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

export default async function Pads() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const pads = await api.pad.getPads();

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" asChild>
        <Link href="/new">
          <Plus /> New Pad
        </Link>
      </Button>
      <div className="overflow-hidden rounded-lg">
        {pads.map((pad) => (
          <Link href={`/p/${pad.id}`} key={pad.id} passHref>
            <div className="flex items-center justify-between border-b p-4 transition-colors hover:bg-muted/30 hover:opacity-80">
              <p className="font-medium">{pad.name}</p>
              <div className="flex items-center gap-2">
                {formatDistanceToNowStrict(pad.updatedAt, {
                  addSuffix: true,
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
