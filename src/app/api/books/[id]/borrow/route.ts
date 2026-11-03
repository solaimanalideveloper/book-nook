import { ObjectId } from "mongodb";

import { auth, client } from "@/lib/auth";

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

  const mongoSession = client.startSession();
  const bookId = new ObjectId(id);
  let borrowedBookTitle = "";

  try {
    const borrows = client.db("bookstore").collection("book-borrows");
    await borrows.createIndex(
      { bookId: 1, userId: 1, status: 1 },
      {
        name: "unique-active-borrow-per-user",
        unique: true,
        partialFilterExpression: { status: "borrowed" },
      },
    );

    await mongoSession.withTransaction(async () => {
      const book = await client
        .db("bookstore")
        .collection("book-nook")
        .findOneAndUpdate(
          {
            _id: bookId,
            $expr: {
              $gt: [
                {
                  $convert: {
                    input: { $ifNull: ["$availableCopies", "$totalCopies"] },
                    to: "int",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
          [
            {
              $set: {
                availableCopies: {
                  $subtract: [
                    {
                      $convert: {
                        input: { $ifNull: ["$availableCopies", "$totalCopies"] },
                        to: "int",
                        onError: 0,
                        onNull: 0,
                      },
                    },
                    1,
                  ],
                },
              },
            },
          ],
          { session: mongoSession },
        );

      if (!book) {
        throw new Error("BOOK_UNAVAILABLE");
      }

      borrowedBookTitle = book.title;
      const borrowedAt = new Date();
      const dueAt = new Date(borrowedAt);
      dueAt.setDate(dueAt.getDate() + 7);

      await borrows.insertOne(
          {
            bookId: bookId.toHexString(),
            bookTitle: book.title,
            userId: session.user.id,
            userName: session.user.name,
            userEmail: session.user.email,
            borrowedAt,
            dueAt,
            status: "borrowed",
          },
          { session: mongoSession },
        );
    });

    return Response.json({
      message: `You borrowed "${borrowedBookTitle}".`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "BOOK_UNAVAILABLE") {
      return Response.json(
        { error: "This book is unavailable or has no copies left." },
        { status: 409 },
      );
    }

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

    console.error("Could not save book borrow:", error);
    return Response.json(
      { error: "Could not borrow this book. Please try again." },
      { status: 500 },
    );
  } finally {
    await mongoSession.endSession();
  }
}
