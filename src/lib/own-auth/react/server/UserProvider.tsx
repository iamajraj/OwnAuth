import { USER, session, user } from "@/lib/db/schema";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";
import UserContextProvider from "../client/internal/UserContext";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

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
  const u_session = (
    await db
      .select()
      .from(session)
      .where(eq(session.sessionId, sesId))
  ).at(0);

  if (!u_session?.userId) {
    return null;
  }

  if (u_session?.expiresAt < new Date().getTime() / 1000) {
    await db.delete(session).where(eq(session.sessionId, sesId));
    return null;
  }

  const u_user = (
    await db.select().from(user).where(eq(user.id, u_session.userId))
  ).at(0);

  return u_user ?? null
}

export default UserProvider;
