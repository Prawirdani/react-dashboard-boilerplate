import { useContext } from "react";
import { AuthCtx } from "./AuthProvider";

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return ctx;
};
