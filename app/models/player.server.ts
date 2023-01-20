import { prisma } from "~/db.server";

export type { Player } from "@prisma/client";

export function playerAll() {
  return prisma.player.findMany({
    orderBy: { updatedAt: "desc" },
  });
}
