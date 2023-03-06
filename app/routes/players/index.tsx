import { updatePlayer } from "~/models/player.server";
import { playerAll } from "~/models/player.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { PlayerTable } from "~/components/PlayerTable";
import { getSession, sessionStorage } from "~/session.server";

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const playerId = formData.get("playerId") as string;
  const level = formData.get("level") as string;

  if (!playerId) return redirect("/players");

  const session = await getSession(request);

  if (!isNumeric(level)) {
    session.flash("toastMessage", { message: `Invalid level`, type: "error" });

    return json(
      {},
      {
        status: 400,
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      }
    );
  }

  const player = await updatePlayer(playerId, parseInt(level));

  session.flash("toastMessage", `Player ${player.name}  updated`);

  return json(
    {},
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
  const { players } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  function updatePlayer(index: number, column: string, level: string) {
    const player = players[index];

    // @ts-ignore
    if (player[column] === level) return;

    const formData = new FormData();
    formData.set("playerId", player.id);
    formData.set(column, level);

    submit(formData, {
      method: "post",
      action: "/players?index",
    });
  }

  return (
    <div>
      <PlayerTable
        // @ts-ignore
        players={players}
        updatePlayer={updatePlayer}
        className="p-2"
      />
    </div>
  );
}
