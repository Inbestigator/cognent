import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const padRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1).max(50), content: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pad.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getPads: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pad.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),
});
