import { auth } from "@/server/auth";
import AuthButton from "./auth-button";
import Link from "next/link";
import { Button } from "./ui/button";
import { Home } from "lucide-react";

export default async function SiteHeader() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full justify-between bg-background p-2">
      <Link href="/" className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="Home">
          <Home />
        </Button>
      </Link>
      <AuthButton shouldLogout={session !== null} />
    </header>
  );
}
