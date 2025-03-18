import { User } from "@prisma/client";
import { createContext, useContext } from "react";

export const ProfileContext = createContext<User | undefined>(undefined);

export function useProfileContext() {
  const user = useContext(ProfileContext);

  if (user === undefined) {
    throw new Error("useProfileContext must be used with a ProfileContext");
  }

  return user;
}
