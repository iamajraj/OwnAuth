"use client";

import { USER } from "@/lib/db/schema";
import React, { PropsWithChildren, useContext } from "react";
import { createContext } from "react";

type UserProps = {
  user: USER | null;
};

type Props = PropsWithChildren<UserProps>;

const UserContext = createContext<UserProps>({
  user: null,
});

function UserContextProvider({ children, user }: Props) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext).user;
}

export default UserContextProvider;
