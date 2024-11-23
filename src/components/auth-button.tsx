import { signIn, signOut } from "@/server/auth";
import { Button, type ButtonProps } from "./ui/button";
import { User, LogOut } from "lucide-react";

export default function AuthButton({
  shouldLogout,
  ...props
}: ButtonProps & {
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
      <Button
        variant="ghost"
        size="icon"
        title={`Sign ${shouldLogout ? "out" : "in"}`}
        type="submit"
        {...props}
      >
        {props.children ?? (shouldLogout ? <LogOut /> : <User />)}
      </Button>
    </form>
  );
}
