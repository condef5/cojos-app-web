import { Form, Link, Outlet } from "@remix-run/react";
import { useUser } from "~/utils";

export default function NotesPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/">Home</Link>
        </h1>
        <p className="ml-auto hidden pr-4 sm:block">{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="block h-full flex-wrap bg-white md:flex md:flex-nowrap">
        <div className="flex h-auto w-full flex-col border-r bg-gray-50 p-2 md:h-full md:w-80 gap-2">
          <Link to="/players">Player</Link>
          <Link to="/players">Add Player</Link>
        </div>

        <div className="flex-1 p-2 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
