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
  "Mystery",
  "Self-Help",
  "Travel",
  "Art",
  "Others",
] as const;

const STORAGE_KEY = "booknook-books";

/** Mock store: books persist in localStorage until a real backend exists */
export function getBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
}

export function saveBook(book: Book) {
  try {
    const books = getBooks();
    books.unshift(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // storage unavailable — nothing to persist
  }
}

export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
