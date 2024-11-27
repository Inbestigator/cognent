import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const padRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pad.create({
        data: {
          name: input.name,
          collaborators: {
            create: { userId: ctx.session.user.id, role: "OWNER" },
          },
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(32),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pad.update({
        where: {
          id: input.id,
          collaborators: { some: { userId: ctx.session.user.id } },
        },
        data: {
          name: input.name,
          content: input.content,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pad.delete({
        where: {
          id: input,
          collaborators: {
            some: { userId: ctx.session.user.id, role: "OWNER" },
          },
        },
      });
    }),

  getPads: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pad.findMany({
      where: {
        collaborators: { some: { userId: ctx.session.user.id } },
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 300,
      },
    });
  }),

  getPad: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.pad.findFirst({
      where: { id: input },
      select: { id: true, name: true, content: true, collaborators: true },
      cacheStrategy: {
        ttl: 5,
        swr: 60,
      },
    });
  }),

  getCollaborators: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.collaborator.findMany({
        where: { padId: input },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        cacheStrategy: {
          ttl: 5,
          swr: 60,
        },
      });
    }),

  editCollaboratorRole: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(["OWNER", "EDITOR"]),
        ownerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (prisma) => {
        await prisma.collaborator.update({
          where: {
            id: input.id,
            role: "EDITOR",
            pad: {
              collaborators: {
                some: { userId: ctx.session.user.id, role: "OWNER" },
              },
            },
          },
          data: {
            role: input.role,
          },
        });

        if (input.role === "OWNER") {
          await prisma.collaborator.update({
            where: {
              id: input.ownerId,
              role: "OWNER",
              userId: ctx.session.user.id,
            },
            data: {
              role: "EDITOR",
            },
          });
        }
      });
    }),

  addCollaborator: protectedProcedure
    .input(
      z.object({
        padId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.collaborator.create({
        data: {
          user: { connect: { id: input.userId } },
          pad: {
            connect: {
              id: input.padId,
              collaborators: {
                none: { userId: input.userId },
                some: { userId: ctx.session.user.id, role: "OWNER" },
              },
            },
          },
        },
      });
    }),
});
