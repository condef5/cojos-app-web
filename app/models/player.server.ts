import { rankItem } from "@tanstack/match-sorter-utils";
import type { Player } from "@prisma/client";
import { prisma } from "~/db.server";
import _ from "lodash";

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

export async function findPlayers(data: string[]) {
  const players = await prisma.player.findMany({});

  let present: Player[] = [];
  let missing: string[] = [];

  data.forEach((name) => {
    const foundPlayer = players.find((player) => {
      return player.name.toLowerCase() === name.toLowerCase();
    });

    if (foundPlayer) {
      present.push(foundPlayer);
    } else {
      const possibleFind = players.find((player) => {
        let itemRank = rankItem(player.name, name);

        return itemRank.passed;
      });

      missing.push(
        name + (possibleFind ? `posible -> ${possibleFind.name}` : "")
      );
    }
  });

  return { present, missing };
}

function teamWeight(team: Player[]) {
  return team.reduce((sum, player: Player) => sum + player.level, 0);
}

export function generateTeams(team: Player[], playerPerTeam: number) {
  let possibleTeams: Player[][] = [];

  for (let i = 0; i < 10000; i++) {
    possibleTeams = _.chunk(_.shuffle(team), playerPerTeam);
    const possibleTeamsWeights = possibleTeams.map((team) => teamWeight(team));
    const lowestTeamWeight = Math.min(...possibleTeamsWeights);
    const bestTeamWeight = Math.max(...possibleTeamsWeights);

    if (bestTeamWeight - lowestTeamWeight <= 1) {
      return {
        possibleTeams,
        meta: { lowestTeamWeight, bestTeamWeight, maxTries: i },
      };
    }
  }

  return { possibleTeams: null, meta: null };
}
