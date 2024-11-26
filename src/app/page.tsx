import Link from "next/link";
import { Github, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pads from "./pads/page";
import { auth } from "@/server/auth";
import AuthButton from "@/components/auth-button";

export default async function Home() {
  const session = await auth();

  if (session) {
    return <Pads />;
  }

  return (
    <div className="absolute inset-0 snap-y snap-mandatory p-2 sm:overflow-y-scroll">
      <section className="flex h-screen snap-start flex-col items-center justify-center gap-4 text-center">
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
      </section>
      <section className="hidden h-screen snap-start flex-col items-center justify-center gap-4 sm:flex">
        <div className="mx-auto flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl sm:text-3xl md:text-6xl">Features</h2>
          <p className="text-muted-foreground sm:text-lg">
            Everything you need to organize your thoughts and boost your
            productivity.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rich Text Editor</CardTitle>
              <CardDescription>
                Write and format your content with a powerful WYSIWYG editor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Create beautiful documents with support for markdown, code blocks,
              and more.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                Work together with your team in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Share your documents and collaborate with others seamlessly.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Source</CardTitle>
              <CardDescription>Free and open source forever.</CardDescription>
            </CardHeader>
            <CardContent>
              Contribute to the project and make it better for everyone.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Start with pre-built templates.</CardDescription>
            </CardHeader>
            <CardContent>
              Create and share your own templates to get started quickly.
            </CardContent>
          </Card>
        </div>
        <footer className="pb-2">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/inbestigator"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Inbestigator
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/inbestigator/cognent"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </footer>
      </section>
    </div>
  );
}
