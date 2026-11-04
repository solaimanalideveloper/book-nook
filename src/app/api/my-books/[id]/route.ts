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

    const availableCopies = totalCopies - borrowedCopies;
    const backendResponse = await fetch(
      `http://localhost:8000/all-books/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          description,
          totalCopies,
          availableCopies,
        }),
        cache: "no-store",
      },
    );
    const backendResult: unknown = await backendResponse.json();

    if (!backendResponse.ok) {
      return Response.json(
        {
          error:
            typeof backendResult === "object" &&
            backendResult !== null &&
            "error" in backendResult &&
            typeof backendResult.error === "string"
              ? backendResult.error
              : `The books API responded with status ${backendResponse.status}.`,
        },
        { status: backendResponse.status === 404 ? 404 : 502 },
      );
    }

    if (
      typeof backendResult === "object" &&
      backendResult !== null &&
      "matchedCount" in backendResult &&
      backendResult.matchedCount === 0
    ) {
      return Response.json({ error: "Book not found." }, { status: 404 });
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
        availableCopies,
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

    if (activeBorrows > 0) {
      return Response.json(
        {
          error: `This book has ${activeBorrows} active borrow${activeBorrows === 1 ? "" : "s"}. Return all borrowed copies before deleting it.`,
        },
        { status: 409 },
      );
    }

    if (availableCopies !== totalCopies) {
      return Response.json(
        {
          error: `Only ${availableCopies} of ${totalCopies} copies are available. Return all borrowed copies before deleting this book.`,
        },
        { status: 409 },
      );
    }

    const backendResponse = await fetch(
      `http://localhost:8000/all-books/${encodeURIComponent(id)}`,
      { method: "DELETE", cache: "no-store" },
    );

    let backendResult: unknown;
    try {
      backendResult = await backendResponse.json();
    } catch {
      return Response.json(
        { error: "The books API returned an invalid response." },
        { status: 502 },
      );
    }

    if (!backendResponse.ok) {
      const backendError =
        typeof backendResult === "object" &&
        backendResult !== null &&
        "error" in backendResult &&
        typeof backendResult.error === "string"
          ? backendResult.error
          : `The books API responded with status ${backendResponse.status}.`;

      return Response.json(
        { error: backendError },
        { status: backendResponse.status === 404 ? 404 : 502 },
      );
    }

    if (
      typeof backendResult !== "object" ||
      backendResult === null ||
      !("deletedCount" in backendResult) ||
      typeof backendResult.deletedCount !== "number"
    ) {
      return Response.json(
        { error: "The books API returned an invalid delete result." },
        { status: 502 },
      );
    }

    if (backendResult.deletedCount === 0) {
      return Response.json(
        { error: "The book changed while you were deleting it. Refresh and try again." },
        { status: 409 },
      );
    }

    if (backendResult.deletedCount !== 1) {
      return Response.json(
        { error: "The books API returned an invalid delete result." },
        { status: 502 },
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
