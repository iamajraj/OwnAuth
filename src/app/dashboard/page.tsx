"use client";

import { useUser } from "@/lib/own-auth/react/client";
import React from "react";

type Props = {};

function Dashboard({}: Props) {
  const user = useUser();
  return (
    <div>
      <h1>Dashboard</h1>

      <h1>Hello, {user?.email}!</h1>
    </div>
  );
}

export default Dashboard;
