import { createPlayer } from "~/models/player.server";
import { playerAll } from "~/models/player.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, useActionData } from "@remix-run/react";
import { getSession, sessionStorage } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const level = parseInt(formData.get("level") as string);

  if (!name) {
    return json(
      { errors: { name: "Name is required", level: null } },
      { status: 400 }
    );
  }

  if (!level) {
    return json(
      { errors: { name: null, level: "Level is required" } },
      { status: 400 }
    );
  }

  const player = await createPlayer({ level, name });

  const session = await getSession(request);
  session.flash("toastMessage", `${player.name} player was created`);

  return redirect(`/players`, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function loader() {
  const players = await playerAll();
  return json({ players });
}

export default function PlayerIndexPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Nombre: </span>
            <input
              name="name"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-errormessage={
                actionData?.errors?.name ? "level-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Nivel: </span>
            <input
              name="level"
              type="number"
              min="1"
              max="10"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.level ? true : undefined}
              aria-errormessage={
                actionData?.errors?.level ? "level-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.level && (
            <div className="pt-1 text-red-700" id="level-error">
              {actionData.errors.level}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Guardar
          </button>
        </div>
      </Form>
    </div>
  );
}
