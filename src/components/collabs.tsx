"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Users } from "lucide-react";
import { Badge } from "./ui/badge";
import UserSearch from "./user-search";

export function FallbackCollabs() {
  return (
    <Button title="Loading Collaborators" variant="ghost" size="icon" disabled>
      <Users />
    </Button>
  );
}

export default function Collabs({ id }: { id: string }) {
  const [collaborators] = api.pad.getCollaborators.useSuspenseQuery(id);
  const utils = api.useUtils();
  const editCollaboratorRole = api.pad.editCollaboratorRole.useMutation({
    onSuccess: async () => {
      await utils.pad.invalidate();
      await utils.pad.getCollaborators.invalidate();
    },
  });

  if (!collaborators) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="View Collaborators" variant="ghost" size="icon">
          <Users />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collaborators</DialogTitle>
          <DialogDescription>
            These users have edit access to this pad.
          </DialogDescription>
        </DialogHeader>
        {collaborators.map((collaborator) => (
          <div
            className="flex items-center justify-between"
            key={collaborator.id}
          >
            {collaborator.user.name}
            {collaborator.role === "EDITOR" && (
              <Button
                size="sm"
                variant="secondary"
                title="Promote to Owner"
                disabled={editCollaboratorRole.isPending}
                onClick={() =>
                  editCollaboratorRole.mutate({
                    id: collaborator.id,
                    role: "OWNER",
                    ownerId: collaborators.find((c) => c.role === "OWNER")!.id,
                  })
                }
              >
                Promote
              </Button>
            )}
            {collaborator.role === "OWNER" && <Badge>Owner</Badge>}
          </div>
        ))}
        <UserSearch id={id} />
      </DialogContent>
    </Dialog>
  );
}
