# BookNook

BookNook is a neighbourhood book-sharing application. Readers can browse books, view availability, and borrow a copy for seven days. Signed-in members can also add books to the shared catalogue.

## Features

- Home page with a featured-library carousel, recently added books, borrowing steps, and category links.
- Responsive layouts for mobile, tablet, and desktop screens.
- All-books catalogue and individual book detail pages.
- Email/password registration and login, plus Google and GitHub sign-in.
- Protected add-book and profile pages.
- Book borrowing for signed-in members, with available-copy updates and duplicate active-borrow prevention.
- Light and dark themes.
- Warm paper-and-library-green palette with terracotta accents and coordinated elevated surfaces in light and dark themes; Inter body text and Playfair Display headings.
- Add-book form with book details, copy count, add date, and cover-image upload UI.

> **Implementation status:** My Books lists only books whose `addedByEmail` matches the signed-in member and supports editing or deleting those books. Books with an active borrow cannot be deleted. My Borrows is still a placeholder; the borrowing API records borrows, but the UI for listing or returning them is not implemented yet.

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS v4
- shadcn/ui components using Base UI primitives
- Better Auth with MongoDB
- MongoDB driver

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- npm
- MongoDB for authentication and borrowing
- The separate books backend described below

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root for MongoDB and OAuth sign-in:

```env
MONGODB_ADAPTER_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
IMGBB_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Add an ImgBB API key to enable book-cover uploads. Keep credentials server-side. Do not add a `NEXT_PUBLIC_` prefix to these values. Configure the matching callback URLs in the Google and GitHub OAuth applications for the local and deployed app URLs.

The `POST /api/upload-image` route accepts an image in multipart form data under the `image` field and returns an `imageUrl`. It requires a signed-in session and uploads the file to ImgBB using the server-side `IMGBB_API_KEY`.

## Books backend

Book catalogue requests currently use a separately running backend at `http://localhost:8000`. Start that service separately; it is not included in this repository.

The frontend expects these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/all-books` | Return an array of books |
| `GET` | `/all-books/:id` | Return one book, or `404` if it does not exist |
| `POST` | `/add-books` | Save a book as JSON |
| `PATCH` | `/all-books/:id` | Update a book from JSON and return the MongoDB update result |
| `DELETE` | `/all-books/:id` | Delete a book by ID and return the MongoDB delete result |

Book records are expected to contain:

```text
_id, title, author, category, image, description,
totalCopies, availableCopies, addedBy, addedByEmail, createdAt
```

The add-book form currently saves to this backend and also keeps a browser-local copy. If the backend save fails, the form reports that it was saved locally; that local copy is not used by the server-rendered catalogue.
The Books backend initializes new books with all `totalCopies` available. Borrowing is the operation that reduces `availableCopies`.

## Borrowing and authentication data

- Better Auth stores its data in the `book-nook-client-auth` MongoDB database.
- The borrowing route uses the `bookstore` database, with `book-nook` for books and `book-borrows` for borrow records.
- `POST /api/books/:id/borrow` requires a signed-in session. A successful borrow reduces `availableCopies` and sets a due date seven days later.
- `PATCH` and `DELETE /api/my-books/:id` require a signed-in owner match. The PATCH route forwards validated book updates to the books backend and preserves the number of copies already borrowed. The DELETE route forwards deletion to the books backend and blocks deletion while any copies are borrowed.
- Borrowing uses a MongoDB transaction and creates a unique index to prevent the same member from having multiple active borrows of one book. MongoDB transactions require a replica set or a compatible managed MongoDB deployment.
- Email/password registration requires at least eight characters, including an uppercase and a lowercase letter.

## Project structure

```text
src/
  app/
    api/                 Auth and borrowing route handlers
    add-book/            Protected add-book page and form
    all-books/           Catalogue and book detail pages
    login/               Login page
    my-books/            Signed-in member's own books
    my-borrows/          Placeholder for borrow history
    profile/             Account and linked social providers
    register/            Registration page
  components/
    auth/                Authentication form and route protection
    books/               Reusable book card
    home/                Home page sections
    layout/              Navigation and footer
    theme/               Theme provider and toggle
    ui/                  Reusable UI primitives
  lib/                   Auth setup, book types, and utilities
```

## Available commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Run the production server
npm run lint      # Run ESLint
npx tsc --noEmit  # Check TypeScript types
```

There is currently no test framework configured in the project.
