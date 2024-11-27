import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findMany({
        where: {
          name: {
            mode: "insensitive",
            startsWith: input,
          },
        },
        take: 10,
        select: {
          id: true,
          name: true,
        },
        cacheStrategy: {
          ttl: 30,
          swr: 300,
        },
      });
    }),
});
