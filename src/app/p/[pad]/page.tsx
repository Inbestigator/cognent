import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import Editor from "@/components/editor/editor";
import { notFound } from "next/navigation";

export default async function PadPage({
  params,
}: {
  params: Promise<{
    pad: string;
  }>;
}) {
  const session = await auth();
  const pad = await api.pad.getPad((await params).pad);

  if (!pad) {
    return notFound();
  }

  return (
    <Editor
      pad={pad}
      readonly={!session || session.user.id !== pad.createdById}
    />
  );
}
