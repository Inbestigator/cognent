import { auth } from "@/server/auth";
import TitlePrompter from "@/components/editor/title-prompter";
import { redirect } from "next/navigation";

export default async function NewPad() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <TitlePrompter />;
}
