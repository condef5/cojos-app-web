import { updatePlayer } from "~/models/player.server";
import { playerAll } from "~/models/player.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { PlayerTable } from "~/components/PlayerTable";
import toast from "react-hot-toast";
import { useEffect } from "react";

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const playerId = formData.get("playerId") as string;
  const level = formData.get("level") as string;

  if (!playerId) return redirect("/players");

  if (!isNumeric(level)) {
    return json({ message: `Invalid level`, error: true });
  }

  const player = await updatePlayer(playerId, parseInt(level));

  return json({ message: `player ${player.name}  updated` });
}

export async function loader() {
  const players = await playerAll();
  return json({ players });
}

export default function PlayerIndexPage() {
  const { players } = useLoaderData<typeof loader>();
  const data = useActionData();
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

  useEffect(() => {
    if (data?.message) {
      if (data?.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    }
  }, [data]);

  return (
    <div>
      {/* @ts-ignore */}
      <PlayerTable players={players} updatePlayer={updatePlayer} />
    </div>
  );
}
