import { ObjectId } from "mongodb";

import { auth, client } from "@/lib/auth";
import { getApiUrl } from "@/lib/api-url";
import { getBooksBackendHeaders } from "@/lib/books-backend-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to borrow a book." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid book ID." }, { status: 400 });
  }

  const books = client.db("bookstore").collection("book-nook");
  const borrows = client.db("bookstore").collection("book-borrows");
  const bookId = new ObjectId(id);
  let reservationId: ObjectId | null = null;

  try {
    await borrows.createIndex(
      { bookId: 1, userId: 1, status: 1 },
      {
        name: "unique-active-borrow-per-user",
        unique: true,
        partialFilterExpression: { status: "borrowed" },
      },
    );

    const book = await books.findOne(
      { _id: bookId },
      {
        projection: {
          title: 1,
          author: 1,
          category: 1,
          image: 1,
        },
      },
    );
    if (!book) {
      return Response.json({ error: "Book not found." }, { status: 404 });
    }

    const borrowedAt = new Date();
    const dueAt = new Date(borrowedAt);
    dueAt.setDate(dueAt.getDate() + 7);

    const reservation = await borrows.insertOne({
      bookId: bookId.toHexString(),
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCategory: book.category,
      bookImage: book.image,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      borrowedAt,
      dueAt,
      status: "borrowed",
    });
    reservationId = reservation.insertedId;

    const backendResponse = await fetch(
      getApiUrl(`/borrow-book/${encodeURIComponent(id)}`),
      {
        method: "POST",
        headers: await getBooksBackendHeaders(request.headers),
        cache: "no-store",
      },
    );

    if (!backendResponse.ok) {
      let backendError = `The books API responded with status ${backendResponse.status}.`;
      try {
        const backendResult: unknown = await backendResponse.json();
        if (
          typeof backendResult === "object" &&
          backendResult !== null &&
          "error" in backendResult &&
          typeof backendResult.error === "string"
        ) {
          backendError = backendResult.error;
        }
      } catch {
        // Keep the status-based error when the backend response is not JSON.
      }

      await borrows.deleteOne({ _id: reservationId });
      reservationId = null;
      return Response.json(
        { error: backendError },
        { status: backendResponse.status === 404 ? 404 : 409 },
      );
    }

    return Response.json({
      message: `You borrowed "${book.title}".`,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return Response.json(
        { error: "You have already borrowed this book." },
        { status: 409 },
      );
    }

    if (reservationId) {
      try {
        await borrows.deleteOne({ _id: reservationId });
      } catch (cleanupError) {
        console.error("Could not clear failed book borrow:", cleanupError);
      }
    }

    console.error("Could not save book borrow:", error);
    return Response.json(
      { error: "Could not borrow this book. Please try again." },
      { status: 500 },
    );
  }
}
