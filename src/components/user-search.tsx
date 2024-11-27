"use client";

import { Loader2 } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function UserSearch({ id }: { id: string }) {
  const [search, setSearch] = useState("");
  const utils = api.useUtils();
  const addCollab = api.pad.addCollaborator.useMutation({
    onSuccess: async () => {
      await utils.pad.getCollaborators.invalidate();
      await utils.pad.getPad.invalidate();
    },
  });
  const { data: users, isPending } = api.user.getUsers.useQuery(search);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Add a user..."
      />
      <CommandList>
        {search && isPending && (
          <div className="flex h-[4.25rem] w-full items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {search && users && (
          <>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name ?? ""}
                  onSelect={async () => {
                    await addCollab.mutateAsync({
                      padId: id,
                      userId: user.id,
                    });
                    setSearch("");
                  }}
                >
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
