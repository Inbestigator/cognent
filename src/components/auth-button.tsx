import { signIn, signOut } from "@/server/auth";
import { Button } from "./ui/button";

export default function AuthButton({
  shouldLogout,
}: {
  shouldLogout?: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        if (shouldLogout) await signOut();
        else await signIn("github");
      }}
    >
      <Button type="submit">Sign {shouldLogout ? "out" : "in"}</Button>
    </form>
  );
}
