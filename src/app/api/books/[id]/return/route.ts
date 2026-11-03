import { ObjectId } from "mongodb";

import { auth, client } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to return a book." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid book ID." }, { status: 400 });
  }

  const borrows = client.db("bookstore").collection("book-borrows");
  const activeBorrow = {
    bookId: new ObjectId(id).toHexString(),
    userId: session.user.id,
    status: "borrowed",
  };
  const returnLock = { ...activeBorrow, returnInProgress: { $ne: true } };

  try {
    const reservation = await borrows.updateOne(returnLock, {
      $set: { returnInProgress: true },
    });
    if (reservation.matchedCount === 0) {
      return Response.json(
        { error: "No active borrow was found, or its return is already in progress." },
        { status: 409 },
      );
    }

    let backendResponse: Response;
    try {
      backendResponse = await fetch(
        `http://localhost:8000/borrowed-books/${encodeURIComponent(id)}`,
        { method: "DELETE", cache: "no-store" },
      );
    } catch (error) {
      await borrows.updateOne(
        { ...activeBorrow, returnInProgress: true },
        { $unset: { returnInProgress: "" } },
      );
      throw error;
    }

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

      await borrows.updateOne(
        { ...activeBorrow, returnInProgress: true },
        { $unset: { returnInProgress: "" } },
      );
      return Response.json(
        { error: backendError },
        { status: backendResponse.status === 404 ? 404 : 409 },
      );
    }

    const completed = await borrows.deleteOne(
      { ...activeBorrow, returnInProgress: true },
    );
    if (completed.deletedCount !== 1) {
      console.error("Book was returned but its borrow record could not be deleted:", id);
      return Response.json(
        { error: "The book was returned, but your borrow record could not be deleted." },
        { status: 500 },
      );
    }

    return Response.json({ message: "Book returned successfully." });
  } catch (error) {
    console.error("Could not return book:", error);
    return Response.json(
      { error: "Could not return this book. Please try again." },
      { status: 500 },
    );
  }
}
