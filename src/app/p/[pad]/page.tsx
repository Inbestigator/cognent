import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import Editor from "@/components/editor/editor";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    pad: string;
  }>;
}): Promise<Metadata> {
  const pad = await db.pad.findFirst({
    where: {
      id: (await params).pad,
    },
    include: {
      createdBy: true,
    },
  });

  if (!pad) {
    notFound();
  }

  return {
    title: {
      absolute: pad.name,
    },
    description: "",
    authors: [{ name: `${pad.createdBy.name}` }],
    openGraph: {
      type: "article",
      publishedTime: new Date(pad.createdAt).toISOString(),
    },
  };
}

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
    notFound();
  }

  return (
    <Editor
      pad={pad}
      readonly={!session || session.user.id !== pad.createdById}
    />
  );
}
