import { USER } from "@/lib/db/schema";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";
import UserContextProvider from "../client/UserContext";

type Props = PropsWithChildren<{}>;

async function UserProvider({ children }: Props) {
  const sessionId = cookies().get("sessionId")?.value;
  let user: null | USER = null;
  if (sessionId) {
    user = await getUser(sessionId);
  }

  return <UserContextProvider user={user}>{children}</UserContextProvider>;
}

async function getUser(sesId: string) {
  const userResponse = await fetch(
    `http:/localhost:3000/api/auth/user?sessionId=${sesId}`
  );
  if (userResponse.ok) {
    return ((await userResponse.json()) as { user?: USER })?.user ?? null;
  } else {
    return null;
  }
}

export default UserProvider;
