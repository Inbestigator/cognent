"use client";

import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { defaultExtensions } from "./extensions";
import { handleCommandNavigation } from "novel/extensions";
import { useState } from "react";
import { api } from "@/trpc/react";
import type { Pad } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import DeleteButton from "../delete-button";
import { Badge } from "../ui/badge";

const extensions = [...defaultExtensions];

export default function Editor({
  pad,
  readonly,
}: {
  pad: Pad;
  readonly?: boolean;
}) {
  const [saveStatus, setSaveStatus] = useState("Saved");
  const utils = api.useUtils();
  const [name, setName] = useState(pad.name);
  const [content, setContent] = useState(
    JSON.parse(pad.content) as JSONContent,
  );
  const editPad = api.pad.edit.useMutation({
    onSuccess: async () => {
      await utils.pad.invalidate();
    },
  });

  const debouncedUpdate = useDebouncedCallback(async () => {
    setSaveStatus("Saving...");
    await editPad.mutateAsync({
      id: pad.id,
      name,
      content: JSON.stringify(content),
    });
    setSaveStatus("Saved");
  }, 1000);

  return (
    <div className="flex flex-col gap-2">
      {!readonly && (
        <>
          <Badge variant="secondary" className="w-fit rounded-lg">
            {saveStatus}
          </Badge>
          <div className="group relative">
            <input
              type="text"
              placeholder="Title"
              value={name}
              className="w-full text-5xl font-extrabold focus:outline-none"
              onChange={(e) => {
                setName(e.target.value);
                void debouncedUpdate();
                setSaveStatus("Unsaved");
              }}
              minLength={1}
              maxLength={32}
            />
            <div className="absolute right-0 top-0 flex h-full items-center gap-2 opacity-0 transition-all group-hover:translate-x-full group-hover:opacity-100">
              <DeleteButton id={pad.id} />
            </div>
          </div>
        </>
      )}
      {readonly && <h1 className="text-5xl font-extrabold">{name}</h1>}
      <div className="relative">
        <EditorRoot>
          <EditorContent
            editable={!readonly}
            immediatelyRender={false}
            extensions={extensions}
            initialContent={content}
            onUpdate={({ editor }) => {
              setContent(editor.getJSON());
              void debouncedUpdate();
              setSaveStatus("Unsaved");
            }}
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full break-words text-wrap",
              },
            }}
          />
        </EditorRoot>
        {content.content?.length === 0 && (
          <div className="prose-headings:font-title font-default prose prose-lg absolute top-0 -z-10 animate-in fade-in-0 dark:prose-invert">
            <p className="text-muted-foreground">Start typing...</p>
          </div>
        )}
      </div>
    </div>
  );
}
