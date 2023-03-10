import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { toast, Toaster } from "react-hot-toast";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getSession, getUser, sessionStorage } from "./session.server";
import { useEffect } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Cojos app",
  viewport: "width=device-width,initial-scale=1",
});

type ToastMessage = { type: "success" | "error"; message: string } | string;
type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  toastMessage: ToastMessage;
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);
  const toastMessage: ToastMessage = session.get("toastMessage") || null;

  return json<LoaderData>(
    {
      user: await getUser(request),
      toastMessage,
    },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export default function App() {
  const { toastMessage } = useLoaderData() as LoaderData;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    if (typeof toastMessage === "object") {
      toast[toastMessage.type](toastMessage.message);
    }

    if (typeof toastMessage === "string") {
      toast.success(toastMessage);
    }
  }, [toastMessage]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
