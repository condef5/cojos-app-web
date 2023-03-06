import { playerAll } from "~/models/player.server";
import { json } from "@remix-run/server-runtime";
import { PlayerTable } from "~/components/PlayerTable";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const players = await playerAll({ orderBy: { level: "desc" } });
  return json({ players });
}

export default function PlayerIndexPage() {
  const { players } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto ">
      <header className="bg-img pt-4">
        <h1 className="block p-2 text-2xl uppercase text-yellow-500 drop-shadow-md">
          Cojos de tingo maria
        </h1>
      </header>
      <PlayerTable
        // @ts-ignore
        players={players}
        updatePlayer={() => {}}
        className="mt-5 max-w-[640px] p-2"
      />
    </div>
  );
}
