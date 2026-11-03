export type BookNookUser = {
  name: string;
  email: string;
};

const USER_STORAGE_KEY = "booknook-user";

export function getStoredUser(): BookNookUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<BookNookUser>;
    if (!parsed.name || !parsed.email) return null;

    return { name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

export function saveStoredUser(user: BookNookUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(USER_STORAGE_KEY);
}
