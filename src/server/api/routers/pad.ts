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
          createdBy: { connect: { id: ctx.session.user.id } },
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
        where: { id: input.id, createdBy: { id: ctx.session.user.id } },
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
        where: { id: input, createdBy: { id: ctx.session.user.id } },
      });
    }),

  getPads: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pad.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getPad: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.pad.findFirst({
      where: { id: input },
    });
  }),
});
