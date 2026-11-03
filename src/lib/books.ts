/**
 * Book data contract for BookNook — every added book follows this shape:
 * {
 *   title, author, category, image, description,
 *   totalCopies, availableCopies, addedBy, addedByEmail, createdAt
 * }
 */
export type Book = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: string;
  addedByEmail: string;
  createdAt: Date | string;
};

/** Categories available when adding a book */
export const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

const STORAGE_KEY = "booknook-books";

// Mock external store (localStorage-backed). Kept outside React state so
// components can subscribe via useSyncExternalStore — hydration-safe and
// lint-clean (no setState inside effects).
let store: Book[] = [];
let initialized = false;
const EMPTY: Book[] = [];
const listeners = new Set<() => void>();

function readStored(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
}

function ensureInit() {
  if (!initialized) {
    initialized = true;
    store = readStored();
  }
}

function getSnapshot(): Book[] {
  ensureInit();
  return store;
}

function getServerSnapshot(): Book[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage unavailable — session-only
  }
}

/** Save a book (newest first) and notify subscribers */
export function saveBook(book: Book) {
  ensureInit();
  store = [book, ...store];
  persist();
  for (const listener of listeners) listener();
}

export const subscribeToBooks = subscribe;
export const getBooksSnapshot = getSnapshot;
export const getBooksServerSnapshot = getServerSnapshot;

export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
