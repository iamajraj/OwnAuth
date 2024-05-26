"use client";

import { useUser } from "@/lib/own-auth/react/client";

export default function Home() {
  const user = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello {user?.email}</h1>
    </main>
  );
}
