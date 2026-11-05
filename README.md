# BookNook

BookNook is a neighbourhood book-sharing application. Readers can browse books, view availability, and borrow a copy for seven days. Signed-in members can also add books to the shared catalogue.

## Features

- Home page with a featured-library carousel, recently added books, borrowing steps, and category links.
- Responsive layouts for mobile, tablet, and desktop screens.
- All-books catalogue and individual book detail pages.
- Email/password registration and login, plus Google and GitHub sign-in.
- Protected book details, add-book, My Books, My Borrows, and profile pages.
- Book borrowing with a confirmation dialog, available-copy updates, and duplicate active-borrow prevention.
- My Borrows table with book covers, borrow dates, due dates, and a return action.
- Light and dark themes.
- Warm paper-and-library-green palette with terracotta accents and coordinated elevated surfaces in light and dark themes; Inter body text and Playfair Display headings.
- Add-book form with book details, copy count, add date, and cover-image upload UI.

My Books lists only books whose `addedByEmail` matches the signed-in member and supports editing or deleting those books. Books with an active borrow cannot be deleted. The My Borrows page lists the signed-in member's active borrows and lets them return a book.

> **Live site:** The deployment link will be added after the project is hosted.

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Swiper.js hero slider
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

Create a `.env.local` file in the project root for MongoDB, the books backend, and OAuth sign-in:

```env
MONGODB_ADAPTER_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
NEXT_PUBLIC_API_URL=http://localhost:8000
IMGBB_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

Add an ImgBB API key to enable book-cover uploads. Keep credentials server-side and do not add a `NEXT_PUBLIC_` prefix to secret values. `NEXT_PUBLIC_API_URL` is intentionally public because it only contains the Books backend base URL. Configure the matching callback URLs in the Google and GitHub OAuth applications for the local and deployed app URLs.

`NEXT_PUBLIC_API_URL` is the base URL of the separate Books backend. Change its value for the deployed backend.

The `POST /api/upload-image` route accepts an image in multipart form data under the `image` field and returns an `imageUrl`. It requires a signed-in session and uploads the file to ImgBB using the server-side `IMGBB_API_KEY`.

## Books backend

Book catalogue requests use a separately running backend; start that service separately because it is not included in this repository. Set `NEXT_PUBLIC_API_URL` to the backend base URL in `.env`.

The frontend expects these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/all-books` | Return an array of books |
| `GET` | `/all-books/:id` | Return one book, or `404` if it does not exist |
| `POST` | `/add-books` | Save a book as JSON |
| `POST` | `/borrow-book/:id` | Decrement a book's available copies |
| `DELETE` | `/borrowed-books/:id` | Return a borrowed book and increment its available copies |
| `PATCH` | `/all-books/:id` | Update a book from JSON and return the MongoDB update result |
| `DELETE` | `/all-books/:id` | Delete a book by ID and return the MongoDB delete result |

Book records are expected to contain:

```text
_id, title, author, category, image, description,
totalCopies, availableCopies, addedBy, addedByEmail, createdAt
```

The add-book form currently saves to this backend and also keeps a browser-local copy. If the backend save fails, the form reports that it was saved locally; that local copy is not used by the server-rendered catalogue. The Home page reads the newest six books from the shared MongoDB collection with a database sort and limit.
The Books backend initializes new books with all `totalCopies` available. Borrowing is the operation that reduces `availableCopies`.

## Borrowing and authentication data

- Better Auth stores its data in the `book-nook-client-auth` MongoDB database.
- The borrowing route uses the `bookstore` database, with `book-nook` for books and `book-borrows` for borrow records.
- `POST /api/books/:id/borrow` requires a signed-in session, reserves one active borrow per member/book, and forwards the copy decrement to the Books backend's `POST /borrow-book/:id` endpoint. `POST /api/books/:id/return` verifies the active borrow, forwards the copy increment to `DELETE /borrowed-books/:id`, and deletes the borrow record after the backend succeeds.
- `PATCH` and `DELETE /api/my-books/:id` require a signed-in owner match. The PATCH route forwards validated book updates to the books backend and preserves the number of copies already borrowed. The DELETE route forwards deletion to the books backend and blocks deletion while any copies are borrowed.
- Borrowing creates a unique index to prevent the same member from having multiple active borrows of one book.
- Email/password registration requires at least six characters, including an uppercase and a lowercase letter.

## Project structure

```text
src/
  app/
    api/                 Auth, image-upload, and borrowing route handlers
    add-book/            Protected add-book page and form
    books/               Assignment's public catalogue and private detail routes
    all-books/           Existing catalogue/detail route compatibility
    loading.tsx          Shared loading indicator
    not-found.tsx        Custom 404 page
    login/               Login page
    my-books/            Signed-in member's own books
    my-borrows/          Signed-in member's borrow table and return action
    profile/             Account and linked social providers
    register/            Registration page
  components/
    auth/                Authentication form and route protection
    books/               Reusable book card
    home/                Home page sections
    layout/              Navigation and footer
    shared/              Shared loading UI
    theme/               Theme provider and toggle
    ui/                  Reusable UI primitives
  lib/                   Auth setup, book types, API URL, and utilities
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
