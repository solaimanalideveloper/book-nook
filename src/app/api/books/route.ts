import { CATEGORIES } from "@/lib/books";
import { getApiUrl } from "@/lib/api-url";
import { auth } from "@/lib/auth";
import { getBooksBackendHeaders } from "@/lib/books-backend-auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to add a book." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid book details." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Invalid book details." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const totalCopies = Number(body.totalCopies);
  const createdAt =
    typeof body.createdAt === "string" &&
    Number.isFinite(new Date(body.createdAt).getTime())
      ? new Date(body.createdAt).toISOString()
      : new Date().toISOString();

  if (
    !title ||
    !author ||
    !description ||
    !image ||
    !CATEGORIES.some((item) => item === category) ||
    !Number.isInteger(totalCopies) ||
    totalCopies < 1
  ) {
    return Response.json(
      { error: "Enter valid book details and a copy count of at least one." },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(getApiUrl("/add-books"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getBooksBackendHeaders(request.headers)),
      },
      body: JSON.stringify({
        title,
        author,
        category,
        image,
        description,
        totalCopies,
        availableCopies: totalCopies,
        addedBy: session.user.name,
        addedByEmail: session.user.email,
        createdAt,
      }),
      cache: "no-store",
    });

    let result: unknown;
    try {
      result = await backendResponse.json();
    } catch {
      return Response.json(
        { error: "The books API returned an invalid response." },
        { status: 502 },
      );
    }

    return Response.json(result, { status: backendResponse.status });
  } catch (error) {
    console.error("Could not add book to the Books API:", error);
    return Response.json(
      { error: "Could not reach the Books API. Please try again." },
      { status: 502 },
    );
  }
}
