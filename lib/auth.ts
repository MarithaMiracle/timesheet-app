// lib/auth.ts (CORRECTED IMPORT FOR authOptions)
import { getServerSession } from "next-auth";
// CORRECTED LINE: Use named import { authOptions }
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function auth() {
  return getServerSession(authOptions);
}

export { authOptions };
