"use client";
import { signOut } from "next-auth/react";

export const LogOut = async () => {
  await signOut({ redirectTo: "/" });
};
