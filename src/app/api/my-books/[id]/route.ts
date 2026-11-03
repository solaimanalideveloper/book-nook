import { ObjectId } from "mongodb";

import { CATEGORIES } from "@/lib/books";
import { auth, client } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getOwnerFilter(id: string, email: string) {
  return {
    _id: new ObjectId(id),
    $expr: {
      $eq: [
        {
          $toLower: {
            $trim: { input: { $ifNull: ["$addedByEmail", ""] } },
          },
        },
        email.trim().toLowerCase(),
      ],
    },
  };
}

function getCopies(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to edit your books." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid book ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid book details." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const title = typeof values.title === "string" ? values.title.trim() : "";
  const author = typeof values.author === "string" ? values.author.trim() : "";
  const description =
    typeof values.description === "string" ? values.description.trim() : "";
  const category =
    typeof values.category === "string" ? values.category : "";
  const totalCopies = Number(values.totalCopies);

  if (
    !title ||
    !author ||
    !description ||
    !CATEGORIES.some((item) => item === category) ||
    !Number.isInteger(totalCopies) ||
    totalCopies < 1
  ) {
    return Response.json(
      { error: "Enter a title, author, category, description, and valid copy count." },
      { status: 400 },
    );
  }

  const books = client.db("bookstore").collection("book-nook");
  const ownerFilter = getOwnerFilter(id, session.user.email);

  try {
    const book = await books.findOne(ownerFilter);
    if (!book) {
      return Response.json({ error: "Book not found in your books." }, { status: 404 });
    }

    const currentTotal = getCopies(book.totalCopies);
    const currentAvailable = getCopies(book.availableCopies, currentTotal);
    const borrowedCopies = currentTotal - currentAvailable;

    if (borrowedCopies < 0) {
      return Response.json(
        { error: "The stored copy counts are invalid; the book cannot be edited." },
        { status: 409 },
      );
    }

    if (totalCopies < borrowedCopies) {
      return Response.json(
        {
          error: `At least ${borrowedCopies} copies are currently borrowed; total copies cannot be lower than that.`,
        },
        { status: 409 },
      );
    }

    const updateResult = await books.updateOne(
      {
        ...ownerFilter,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      },
      {
        $set: {
          title,
          author,
          category,
          description,
          totalCopies,
          availableCopies: totalCopies - borrowedCopies,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return Response.json(
        { error: "The book changed while you were editing. Refresh and try again." },
        { status: 409 },
      );
    }

    return Response.json({
      book: {
        _id: id,
        title,
        author,
        category,
        description,
        image: typeof book.image === "string" ? book.image : "",
        totalCopies,
        availableCopies: totalCopies - borrowedCopies,
        addedByEmail: session.user.email,
      },
    });
  } catch (error) {
    console.error("Could not update member book:", error);
    return Response.json(
      { error: "Could not update the book. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to delete your books." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid book ID." }, { status: 400 });
  }

  const books = client.db("bookstore").collection("book-nook");
  const borrows = client.db("bookstore").collection("book-borrows");
  const ownerFilter = getOwnerFilter(id, session.user.email);

  try {
    const book = await books.findOne(ownerFilter);
    if (!book) {
      return Response.json({ error: "Book not found in your books." }, { status: 404 });
    }

    const activeBorrows = await borrows.countDocuments({
      bookId: id,
      status: "borrowed",
    });
    const totalCopies = getCopies(book.totalCopies);
    const availableCopies = getCopies(book.availableCopies, totalCopies);

    if (activeBorrows > 0 || availableCopies !== totalCopies) {
      return Response.json(
        { error: "This book cannot be deleted while copies are borrowed." },
        { status: 409 },
      );
    }

    const deleteResult = await books.deleteOne({
      ...ownerFilter,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });

    if (deleteResult.deletedCount === 0) {
      return Response.json(
        { error: "The book changed while you were deleting it. Refresh and try again." },
        { status: 409 },
      );
    }

    return Response.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Could not delete member book:", error);
    return Response.json(
      { error: "Could not delete the book. Please try again." },
      { status: 500 },
    );
  }
}
