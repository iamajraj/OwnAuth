import { NextRequest, NextResponse } from "next/server";
import { USER } from "../db/schema";
import { cookies } from "next/headers";

export function ownAuthMiddleware(
  callback?: (
    req: NextRequest,
    user: USER | null
  ) => Promise<NextResponse<unknown>> | NextResponse<unknown>
) {
  return async (req: NextRequest) => {
    const sessionId = cookies().get("sessionId")?.value;
    console.log("SES", sessionId);
    let user: null | USER = null;
    if (sessionId) {
      user = await getUser(sessionId);
    }
    if (callback) {
      return await callback(req, user);
    }
  };
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
