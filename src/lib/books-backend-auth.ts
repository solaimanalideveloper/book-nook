import { auth } from "@/lib/auth";

export async function getBooksBackendHeaders(requestHeaders: Headers) {
  const { token } = await auth.api.getToken({ headers: requestHeaders });
  return { Authorization: `Bearer ${token}` };
}
