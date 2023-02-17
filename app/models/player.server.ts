import type { Player } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Player };

export function playerAll() {
  return prisma.player.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function updatePlayer(playerId: Player["id"], level: number) {
  return prisma.player.update({
    where: {
      id: playerId,
    },
    data: {
      level,
    },
  });
}

export function createPlayer(data: Pick<Player, "level" | "name">) {
  return prisma.player.create({
    data,
  });
}
