import React from "react";

type Props = {};

function Login({}: Props) {
  return (
    <div>
      <h1>Login</h1>
      <form
        action="/api/auth/login"
        method="post"
        className="flex flex-col gap-2 w-max"
      >
        <label>Email</label>
        <input name="email" type="email" />
        <label>Password</label>
        <input name="password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
