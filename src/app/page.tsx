import { LatestPost } from "@/components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import AuthButton from "@/components/auth-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.pad.getPads.prefetch();
  }

  return (
    <HydrateClient>
      <Card>
        <CardHeader>
          {session && <span>Logged in as {session.user?.name}</span>}
          <AuthButton shouldLogout={session !== null} />
        </CardHeader>
        <CardContent>{session?.user && <LatestPost />}</CardContent>
      </Card>
    </HydrateClient>
  );
}
