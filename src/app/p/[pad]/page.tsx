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
      collaborators: {
        include: {
          user: true,
        },
      },
    },
    cacheStrategy: {
      ttl: 300,
      swr: 300,
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
    authors: pad.collaborators.map((c) => ({
      name: c.user.name?.toString(),
    })),
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

  const collabMember = pad.collaborators.find(
    (c) => c.userId === session?.user.id,
  );

  return (
    <Editor
      pad={pad}
      isOwner={collabMember?.role === "OWNER"}
      isReadonly={!collabMember}
    />
  );
}
