import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type SESSION_T = {
  email: string;
};

type USER_T = {
  email: string;
  password: string;
};

let AUTH_SESSIONS: Record<string, SESSION_T> = {
  abc: {
    email: "akmalraj07@gmail.com",
  },
};

let USERS: Record<string, USER_T> = {
  "akmalraj07@gmail.com": {
    email: "akmalraj07@gmail.com",
    password: "123",
  },
};

export default async function handleAuth(
  req: NextRequest,
  params: { params: { ownAuth: string[] } }
) {
  const {
    params: {
      ownAuth: [type, ...rest],
    },
  } = params;

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
      default:
        return NextResponse.json({
          message: "trying to get",
        });
    }
  }
}

async function authLogin(req: NextRequest) {
  try {
    // let { email, password } = (await req.json()) as {
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

    if (!USERS[email]) {
      throw new Error("Email or Password is invalid.");
    }

    const user = USERS[email];

    if (user.password !== password) {
      throw new Error("Email or Password is invalid.");
    }

    const sessionId = createSession(user);

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
        // "Set-Cookie": `sessionId=${sessionId}`,
        "Set-Cookie": `sessionId=abc; Path=/`,
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
    const { email, password } = (await req.json()) as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      throw new Error("Email or Password missing");
    }
    if (email.trim() === "" || password.trim() === "") {
      throw new Error("Email or Password empty");
    }

    if (USERS[email]) {
      throw new Error("Email already exists.");
    }

    const user = {
      email: email,
      password: password,
    };
    USERS[email] = user;

    const sessionId = createSession(user);

    return new Response(
      JSON.stringify({
        message: "Successfully account created.",
      }),
      {
        status: 201,
        headers: {
          "Set-Cookie": `sessionId=${sessionId}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    let t_err = err as Error;
    return error(t_err.message, 500);
  }
}

export function ownAuthMiddleware(
  callback?: (req: NextRequest, user: USER_T | null) => void
) {
  return (req: NextRequest) => {
    const sessionId = cookies().get("sessionId")?.value;
    let user = null;
    if (sessionId) {
      const session = findSession(sessionId);
      if (session) {
        user = USERS[session.email];
      }
    }

    if (callback) {
      return callback(req, user);
    }
  };
}

function error(msg: string, status: number = 400) {
  return NextResponse.json({ error: true, message: msg }, { status });
}

function findSession(sesId: string) {
  return AUTH_SESSIONS[sesId];
}

function createSession(user: USER_T) {
  const sessionId = randomUUID();
  AUTH_SESSIONS[sessionId] = {
    email: user.email,
  };
  return sessionId;
}
