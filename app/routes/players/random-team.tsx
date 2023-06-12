import type { Player } from "~/models/player.server";
import { findPlayers, generateTeams } from "~/models/player.server";
import { playerAll } from "~/models/player.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { getSession, sessionStorage } from "~/session.server";
import React from "react";
import _ from "lodash";

function teamWeight(team: Player[]) {
  return team.reduce((sum, player: Player) => sum + player.level, 0);
}

type LoaderData = {
  errors: Record<string, string>;
  missing?: { player: string; possibleFind?: string }[];
  possibleTeams?: Player[][];
  meta?: {
    lowestTeamWeight: number;
    bestTeamWeight: number;
    maxTries: number;
  };
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const list = formData.get("list") as string;
  const playerPerTeam = parseInt(formData.get("playerPerTeam") as string);

  if (typeof list !== "string" || list.length === 0) {
    return json(
      {
        errors: { list: "list is required" },
        missing: [],
      },
      { status: 400 }
    );
  }

  if (!playerPerTeam || playerPerTeam < 0) {
    return json(
      {
        errors: { playerPerTeam: "playerPerTeam is required" },
        missing: [],
      },
      { status: 400 }
    );
  }

  let players = list
    .split("\n")
    .filter(Boolean)
    .map((line) =>
      line
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/gi, "")
        .trim()
        .toLowerCase()
    );

  const data = await findPlayers(players);

  if (data.missing.length > 0) {
    return json(
      {
        errors: {},
        missing: data.missing,
      },
      { status: 400 }
    );
  }

  const session = await getSession(request);
  const { possibleTeams, meta } = generateTeams(data.present, playerPerTeam);

  if (!possibleTeams) {
    session.flash("toastMessage", {
      message: "No se pudo generar equipos, intenta de nuevo",
      type: "error",
    });
    return json({ errors: {}, missing: null }, { status: 400 });
  }

  session.flash("toastMessage", 'Equipos generados con éxito!"');
  return json<LoaderData>(
    { possibleTeams, meta, errors: {}, missing: [] },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function loader() {
  const players = await playerAll();
  return json({ players });
}

export default function PlayerIndexPage() {
  const actionData = useActionData() as LoaderData;
  const [initList, setInitList] = React.useState("");
  const transition = useTransition();
  const colors = ["#FFB84C", "#98D8AA", "#393646", "tomato"];

  React.useEffect(() => {
    const value = localStorage.getItem("list") || "";
    setInitList(value);
  }, []);

  React.useEffect(() => {
    if (!initList) return;

    localStorage.setItem("list", initList);
  }, [initList]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>{actionData?.errors?.list}</div>
      <Form method="post">
        <div className="sm:max-w-md">
          <label className="flex w-full flex-col gap-1">
            <div className="mb-2 flex items-center justify-between">
              <span>Lista: </span>
              <input
                name="playerPerTeam"
                type="text"
                placeholder="Player por equipo"
                className="radius border p-2"
                defaultValue="7"
                required
              />
            </div>
            <textarea
              name="list"
              required
              rows={10}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-sm"
              onChange={(e) => {
                setInitList(e.target.value);
              }}
              value={initList}
            />
          </label>
        </div>

        <div className="mt-4 text-left">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {transition.state === "submitting" ? "Generando..." : "Generar"}
          </button>
        </div>
      </Form>
      {actionData?.missing && actionData?.missing?.length > 0 && (
        <div>
          <h2 className="mb-2  text-red-400">Jugadores no identificados</h2>

          <ol className="list-decimal">
            {actionData?.missing.map(({ player, possibleFind }) => (
              <li key={player}>
                {player}{" "}
                {possibleFind && (
                  <span
                    onClick={(event) => {
                      const regPlayer = new RegExp(player, "i");
                      setInitList(initList.replace(regPlayer, possibleFind));
                      event?.target?.parentElement?.remove();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    ({possibleFind})
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {actionData?.possibleTeams && actionData?.possibleTeams?.length > 0 && (
        <div className="flex gap-8 p-4">
          {actionData?.possibleTeams.map((team, index) => (
            <div key={index} className="flex flex-1 flex-col p-2">
              <h3 className="my-2  font-bold text-gray-700" style={{ color: colors[index] }}>
                Equipo {index + 1} -{" "}
                <span className="font-normal">{teamWeight(team)}</span>
              </h3>
              <ol className="flex list-decimal flex-col gap-1">
                {_.sortBy(team, ["level"])
                  .reverse()
                  .map((player: Player) => (
                    <li key={player.id}>
                      {player.name} -{" "}
                      <span className="text-sm">{player.level}</span>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
