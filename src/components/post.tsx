"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function LatestPost() {
  const [latestPads] = api.pad.getPads.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const createPost = api.pad.create.useMutation({
    onSuccess: async () => {
      await utils.pad.invalidate();
      setName("");
    },
  });

  return (
    <>
      {latestPads[0] ? (
        <p>Your most recent pad: {latestPads[0].name}</p>
      ) : (
        <p>You have no pads yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name, content });
        }}
        className="flex w-fit flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
}
