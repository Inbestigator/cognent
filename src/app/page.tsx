import Link from "next/link";
import { Github, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pads from "./pads/page";
import { auth } from "@/server/auth";
import AuthButton from "@/components/auth-button";

export default async function Home() {
  const session = await auth();

  if (session) {
    return <Pads />;
  }

  return (
    <section className="-mt-20 flex h-dvh flex-col items-center justify-center gap-4 pt-6 text-center">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
        Your thoughts, organized.
      </h1>
      <p className="max-w-3xl text-muted-foreground sm:text-xl">
        Cognent is a powerful note-taking tool that helps you organize your
        thoughts.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <AuthButton variant="default" asChild size="lg">
          <button>
            <StickyNote className="mr-1" />
            Get Started
          </button>
        </AuthButton>
        <Button asChild size="lg" variant="outline">
          <Link href="https://github.com/inbestigator/cognent">
            <Github className="mr-1" />
            GitHub
          </Link>
        </Button>
      </div>
      <footer className="absolute bottom-0 left-0 flex w-full justify-between p-2 text-sm text-muted-foreground">
        <p>
          Built by{" "}
          <Link
            href="https://github.com/inbestigator"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline-offset-4 hover:underline"
          >
            Inbestigator
          </Link>
          .
        </p>
        <Link
          href="https://github.com/inbestigator/cognent"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline-offset-4 hover:underline"
        >
          GitHub
        </Link>
      </footer>
    </section>
  );
}
