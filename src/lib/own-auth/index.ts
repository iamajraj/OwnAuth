import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../db";
import { session, user, USER } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function handleAuth(
  req: NextRequest,
  params: { params: { ownAuth: string[] } }
) {
  const {
    params: {
      ownAuth: [type, ...rest],
    },
  } = params;
  try {
    if (req.method === "POST") {
      switch (type) {
        case "login":
          return await authLogin(req);
        case "signup":
          return await authSignup(req);
        default:
          return NextResponse.json({
            message: "Invalid request",
          });
      }
    }

    if (req.method === "GET") {
      switch (type) {
        case "login":
          return NextResponse.redirect(new URL("/login", req.nextUrl));
        case "user":
          const searchParams = new URL(req.url).searchParams;
          const sessionId = searchParams.get("sessionId");

          if (!sessionId) {
            return error("please provide userid and session id", 400);
          }

          const u_session = (
            await db
              .select()
              .from(session)
              .where(eq(session.sessionId, sessionId))
          ).at(0);

          if (!u_session?.userId) {
            return error("invalid session id", 404);
          }

          const u_user = (
            await db.select().from(user).where(eq(user.id, u_session.userId))
          ).at(0);

          return NextResponse.json({
            user: u_user,
            error: false,
          });

        default:
          return NextResponse.json({
            message: "trying to get",
          });
      }
    }
  } catch (err) {
    let err_t = err as Error;
    return error(err_t.message, 500);
  }
}

async function authLogin(req: NextRequest) {
  try {
    let fd = await req.formData();
    const email = fd.get("email")?.toString();
    const password = fd.get("password")?.toString();

    if (!email || !password) {
      throw new Error("Email or Password missing");
    }
    if (email.trim() === "" || password.trim() === "") {
      throw new Error("Email or Password empty");
    }

    const user = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      throw new Error("Email or Password is invalid.");
    }

    if (user.password !== password) {
      throw new Error("Email or Password is invalid.");
    }

    const sessionId = await createSession(user.id);

    // return new Response(
    //   JSON.stringify({
    //     message: "Successfully logged in.",
    //   }),
    //   {
    //     status: 200,
    //     headers: {
    //       // "Set-Cookie": `sessionId=${sessionId}`,
    //       "Set-Cookie": `sessionId=abc`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    return NextResponse.redirect(new URL("/", req.nextUrl), {
      headers: {
        "Set-Cookie": `sessionId=${sessionId}; Path=/`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    let t_err = err as Error;
    return error(t_err.message, 500);
  }
}
async function authSignup(req: NextRequest) {
  try {
    // const { email, password } = (await req.json()) as {
    //   email: string;
    //   password: string;
    // };

    let fd = await req.formData();
    const email = fd.get("email")?.toString();
    const password = fd.get("password")?.toString();

    if (!email || !password) {
      throw new Error("Email or Password missing");
    }
    if (email.trim() === "" || password.trim() === "") {
      throw new Error("Email or Password empty");
    }

    const isUserExists = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (isUserExists) {
      throw new Error("Email already exists.");
    }

    const result = await db
      .insert(user)
      .values({
        email: email,
        password: password,
      })
      .returning({ id: user.id });

    if (result.length === 0) {
      throw new Error("Failed to create account");
    }

    const created_user = result[0];

    const sessionId = await createSession(created_user.id);

    return new Response(
      JSON.stringify({
        message: "Successfully account created.",
      }),
      {
        status: 201,
        headers: {
          "Set-Cookie": `sessionId=${sessionId}; Path=/`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    let t_err = err as Error;
    return error(t_err.message, 500);
  }
}

function error(msg: string, status: number = 400) {
  return NextResponse.json({ error: true, message: msg }, { status });
}

async function createSession(userId: number) {
  const sessionId = randomUUID();

  const result = (
    await db
      .insert(session)
      .values({
        sessionId: sessionId,
        userId: userId,
        expiresAt: new Date().getTime() / 1000 + 2 * 60 * 60,
      })
      .returning()
  ).at(0);

  return result?.sessionId;
}
