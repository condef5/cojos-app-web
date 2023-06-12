import { rankItem } from "@tanstack/match-sorter-utils";
import type { Player } from "@prisma/client";
import { prisma } from "~/db.server";
import _ from "lodash";

export type { Player };

export function playerAll(options = {}) {
  return prisma.player.findMany({
    orderBy: { updatedAt: "desc" },
    ...options,
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
  let missing: { player: string; possibleFind?: string }[] = [];

  data.forEach((name) => {
    const foundPlayer = players.find((player) => {
      return player.name.toLowerCase() === name.toLowerCase();
    });

    if (foundPlayer) {
      present.push(foundPlayer);
    } else {
      const possibleFind = players.find((player) => {
        let itemRank;

        if (player.name.length > name.length) {
          itemRank = rankItem(player.name.toLowerCase(), name.toLowerCase());
        } else {
          itemRank = rankItem(name.toLowerCase(), player.name.toLowerCase());
        }

        return itemRank.passed;
      });

      missing.push({ player: name, possibleFind: possibleFind?.name });
    }
  });

  return { present, missing };
}

function teamWeight(team: Player[]) {
  return team.reduce((sum, player: Player) => sum + player.level, 0);
}

const badRelations: Record<Player["name"], String[]> = {
  "Luis simon": ["Bruce go", "Lucho go"],
  "Bruce go": ["Cato", "Lucho go"],
  Cato: ["Terry", "Ronaldo el bicho"],
  Joshi: ["Ronaldo A", "Ronaldo el bicho"],
  Alpaquitay: ["Milo", "Davis"],
  Gaspar: ["Milo"],
  Terry: ["Ivan Canta", "Anibal Diaz"],
};

const goodRelations: Record<Player["name"], String[]> = {
  "Luis simon": ["Joshi"],
  // "Ronaldo A": ["Ricardo", "Ivan Canta"],
};

function meetConditions(possibleTeams: Player[][]) {
  for (const team of possibleTeams) {
    for (const player of team) {
      const badRelationsList = badRelations[player.name];

      if (badRelationsList) {
        for (let i = 0; i < badRelationsList.length; i++) {
          const avoidPlayer = badRelationsList[i];
          if (
            team.some((p) => p.name.toLowerCase() === avoidPlayer.toLowerCase())
          ) {
            return false;
          }
        }
      }
    }
  }

  for (const team of possibleTeams) {
    for (const player of team) {
      const gooRelationList = goodRelations[player.name];

      if (gooRelationList) {
        for (let i = 0; i < gooRelationList.length; i++) {
          const avoidPlayer = gooRelationList[i];
          if (
            !team.some(
              (p) => p.name.toLowerCase() === avoidPlayer.toLowerCase()
            )
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

export function generateTeams(team: Player[], playerPerTeam: number) {
  let possibleTeams: Player[][] = [];

  for (let i = 0; i < 1_000_000; i++) {
    possibleTeams = _.chunk(_.shuffle(team), playerPerTeam);
    const possibleTeamsWeights = possibleTeams.map((team) => teamWeight(team));
    const lowestTeamWeight = Math.min(...possibleTeamsWeights);
    const bestTeamWeight = Math.max(...possibleTeamsWeights);

    if (
      bestTeamWeight - lowestTeamWeight <= 1 &&
      meetConditions(possibleTeams)
    ) {
      return {
        possibleTeams,
        meta: { lowestTeamWeight, bestTeamWeight, maxTries: i },
      };
    }
  }

  return { possibleTeams: null, meta: null };
}
