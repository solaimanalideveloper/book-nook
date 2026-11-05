# 📚 BookNook

BookNook একটি neighbourhood book-sharing application। পাঠকেরা বই খুঁজে দেখতে, বইয়ের বিস্তারিত জানতে এবং সাত দিনের জন্য বই ধার নিতে পারেন। লগইন করা সদস্যেরা নিজেদের বই শেয়ার করা ক্যাটালগে যোগ করতে পারেন।

🔗 **লাইভ সাইট:** [https://book-nook-sigma-ten.vercel.app](https://book-nook-sigma-ten.vercel.app)

## ✨ বৈশিষ্ট্য

- 🏠 হোমপেজে বইয়ের ছবির carousel, সম্প্রতি যোগ করা বই, ধার নেওয়ার নিয়ম এবং বইয়ের category-র লিংক।
- 📱 মোবাইল, ট্যাবলেট ও ডেস্কটপের জন্য responsive layout।
- 📚 সব বইয়ের তালিকা, বইয়ের বিস্তারিত পৃষ্ঠা এবং category অনুযায়ী বই খোঁজার সুবিধা।
- 🔐 ইমেইল/পাসওয়ার্ড দিয়ে নিবন্ধন ও লগইন, পাশাপাশি Google এবং GitHub দিয়ে sign-in।
- 🔒 Add Book, My Books, My Borrows, Profile এবং বইয়ের বিস্তারিত পৃষ্ঠা লগইন করা সদস্যদের জন্য সংরক্ষিত।
- ➕ নিজের বই যোগ করা, বইয়ের তথ্য সম্পাদনা করা এবং বই মুছে ফেলা। সক্রিয় borrow থাকলে বই মুছে ফেলা যায় না।
- 🔄 বই ধার নেওয়া ও ফেরত দেওয়ার সময় available copy-র সংখ্যা হালনাগাদ হয়; একই সদস্য একই বইয়ের একাধিক সক্রিয় borrow করতে পারেন না।
- 📋 My Borrows পাতায় ধার নেওয়া বই, ধার নেওয়ার তারিখ, ফেরত দেওয়ার শেষ তারিখ এবং বই ফেরত দেওয়ার সুবিধা।
- 🌓 Light ও dark theme।
- 🔔 সফল কাজ ও ত্রুটির বার্তা **React Toastify** toast দিয়ে দেখানো হয়।
- 🖼️ বইয়ের তথ্য, copy-র সংখ্যা, যোগ করার তারিখ এবং cover image upload-সহ বই যোগ করার form।
- 🗃️ My Books পাতায় শুধু লগইন করা সদস্যের যোগ করা বই দেখা যায়।
- 📖 Home page-এ MongoDB collection থেকে নতুন ছয়টি বই দেখানো হয়।

## 🛠️ প্রযুক্তি

- Next.js 16 App Router
- React 19 ও TypeScript
- Tailwind CSS v4
- Base UI primitive ব্যবহার করা shadcn/ui component
- Swiper.js hero carousel
- Better Auth ও MongoDB
- MongoDB driver
- React Toastify

## 🚀 নিজের কম্পিউটারে চালান

### প্রয়োজনীয় সফটওয়্যার ও সেবা

- ইনস্টল করা Next.js version-এর উপযোগী Node.js
- npm
- Authentication ও borrowing-এর জন্য MongoDB
- আলাদা Books backend service

### ইনস্টল ও চালানো

```bash
git clone <repository-link>
cd book-nook
npm install
npm run dev
```

তারপর ব্রাউজারে [http://localhost:3000](http://localhost:3000) খুলুন।

### Environment variable

Project root-এ `.env.local` ফাইল তৈরি করে প্রয়োজনীয় মান বসান:

```env
MONGODB_ADAPTER_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
NEXT_PUBLIC_API_URL=https://book-nook-server-side-ten.vercel.app
IMGBB_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

বইয়ের cover upload চালু করতে ImgBB API key যোগ করুন। Secret কখনো `NEXT_PUBLIC_` prefix দিয়ে রাখবেন না বা repository-তে commit করবেন না। `NEXT_PUBLIC_API_URL` public রাখা হয়েছে, কারণ এতে শুধু Books backend-এর base URL থাকে। Google ও GitHub OAuth application-এ local এবং deployed app-এর জন্য সঠিক callback URL configure করুন। Production-এ `BETTER_AUTH_URL`-এ deployed site-এর URL দিন।

`NEXT_PUBLIC_API_URL` হলো আলাদাভাবে deploy করা Books backend-এর base URL। Backend-এর URL বদলালে এই মানটিও বদলাতে হবে।

## 🔌 Books backend-এর ৮টি API

নিচের endpoint-গুলো আলাদা Books backend service-এর। `:id`-এর জায়গায় বইটির আসল MongoDB ID বসাতে হবে। উদাহরণ: `https://book-nook-server-side-ten.vercel.app/all-books/672abc1234567890abcdef12`।

| # | কাজ | Method | Endpoint |
|---|---|---|---|
| ১ | নতুন বই যোগ করা | `POST` | [`/add-books`](https://book-nook-server-side-ten.vercel.app/add-books) |
| ২ | সব বই দেখা | `GET` | [`/all-books`](https://book-nook-server-side-ten.vercel.app/all-books) |
| ৩ | একটি বই দেখা | `GET` | [`/all-books/:id`](https://book-nook-server-side-ten.vercel.app/all-books/:id) |
| ৪ | বইয়ের তথ্য আপডেট করা | `PATCH` | [`/all-books/:id`](https://book-nook-server-side-ten.vercel.app/all-books/:id) |
| ৫ | বই মুছে ফেলা | `DELETE` | [`/all-books/:id`](https://book-nook-server-side-ten.vercel.app/all-books/:id) |
| ৬ | বই borrow করা | `POST` | [`/borrow-book/:id`](https://book-nook-server-side-ten.vercel.app/borrow-book/:id) |
| ৭ | borrowed বই ফেরত দেওয়া | `DELETE` | [`/borrowed-books/:id`](https://book-nook-server-side-ten.vercel.app/borrowed-books/:id) |
| ৮ | বই return করা | `POST` | [`/return-book/:id`](https://book-nook-server-side-ten.vercel.app/return-book/:id) |

এই repository-র frontend/server route বর্তমানে borrow করার সময় `POST /borrow-book/:id` এবং ফেরত দেওয়ার সময় `DELETE /borrowed-books/:id` ব্যবহার করে। তালিকার `POST /return-book/:id` backend-এর দেওয়া অতিরিক্ত endpoint; বর্তমান frontend flow এটি call করে না।

বইয়ের record-এ সাধারণত নিচের তথ্যগুলো থাকে:

```text
_id, title, author, category, image, description,
totalCopies, availableCopies, addedBy, addedByEmail, createdAt
```

Backend নতুন বইয়ের সব copy available হিসেবে রাখে। Borrow হলে `availableCopies` কমে এবং return হলে বাড়ে।

## 🖼️ ছবি আপলোড

`POST /api/upload-image` route multipart form data-তে `image` field গ্রহণ করে এবং `imageUrl` ফেরত দেয়। এই route ব্যবহারের জন্য লগইন করা থাকতে হয় এবং server-এ `IMGBB_API_KEY` configure থাকতে হয়। ছবির সর্বোচ্চ আকার ৩২ MB। Cover image ImgBB-তে upload হয়।

## 📚 Books backend

বইয়ের catalog-এর request আলাদা backend service-এ যায়। Backend এই repository-তে অন্তর্ভুক্ত নয়, তাই সেটি আলাদাভাবে চালু করতে হবে। `NEXT_PUBLIC_API_URL`-এ backend-এর base URL বসান।

Add Book form backend-এ বই সংরক্ষণ করে এবং browser-এর local storage-এও একটি copy রাখে। Backend-এ save ব্যর্থ হলে form স্থানীয়ভাবে সংরক্ষণের বার্তা দেয়; তবে ওই local copy server-rendered catalog-এ ব্যবহার হয় না। Home page MongoDB collection থেকে sort ও limit করে নতুন ছয়টি বই আনে।

## 🔐 Authentication ও borrowing-এর তথ্য

- Better Auth-এর তথ্য `book-nook-client-auth` MongoDB database-এ রাখা হয়।
- Borrowing route `bookstore` database ব্যবহার করে; বইয়ের জন্য `book-nook` এবং borrow record-এর জন্য `book-borrows` collection ব্যবহৃত হয়।
- `POST /api/books/:id/borrow`-এ লগইন করা session প্রয়োজন। একই সদস্য ও বইয়ের একাধিক সক্রিয় borrow ঠেকাতে unique index তৈরি হয়। Route Books backend-এর `POST /borrow-book/:id` endpoint-এ copy কমানোর request পাঠায়।
- `POST /api/books/:id/return` সক্রিয় borrow যাচাই করে, Books backend-এর `DELETE /borrowed-books/:id` endpoint-এ copy ফেরত দেওয়ার request পাঠায় এবং backend সফল হলে borrow record মুছে দেয়।
- `PATCH` ও `DELETE /api/my-books/:id`-এ লগইন করা সদস্য বইটির মালিক কি না যাচাই করা হয়। PATCH ধার নেওয়া copy-র সংখ্যা অক্ষুণ্ণ রেখে update করে। কোনো copy ধার দেওয়া থাকলে DELETE বন্ধ থাকে।
- ইমেইল/পাসওয়ার্ডে নিবন্ধনের password কমপক্ষে ছয় অক্ষরের হতে হবে এবং তাতে অন্তত একটি uppercase ও একটি lowercase letter থাকতে হবে।

## 📁 Project-এর কাঠামো

```text
src/
  app/
    api/                 Authentication, image upload ও borrowing API route
    add-book/            লগইন-সুরক্ষিত বই যোগ করার পৃষ্ঠা ও form
    books/               Public catalog ও ব্যক্তিগত বইয়ের বিস্তারিত route
    all-books/           Catalog/detail route-এর পুরোনো compatibility
    loading.tsx          সবার জন্য loading indicator
    not-found.tsx        নিজস্ব 404 পৃষ্ঠা
    login/               লগইন পৃষ্ঠা
    my-books/            সদস্যের নিজের বইয়ের তালিকা
    my-borrows/          ধার নেওয়া বইয়ের তালিকা ও return action
    profile/             Account ও সংযুক্ত social provider
    privacy-policy/      Privacy Policy পৃষ্ঠা
    register/            নিবন্ধন পৃষ্ঠা
    terms-of-service/     Terms of Service পৃষ্ঠা
  components/
    auth/                Authentication form ও route protection
    books/               পুনর্ব্যবহারযোগ্য book card
    home/                হোমপেজের বিভিন্ন অংশ
    layout/              Navigation ও footer
    shared/              সাধারণ loading UI
    theme/               Theme provider ও toggle
    ui/                  পুনর্ব্যবহারযোগ্য UI component
  lib/                   Authentication setup, book type, API URL ও utility
```

## 🧰 চালানোর command

```bash
npm run dev       # Development server চালু করুন
npm run build     # Production build তৈরি ও যাচাই করুন
npm run start     # Production server চালু করুন
npm run lint      # ESLint চালান
npx tsc --noEmit  # TypeScript type পরীক্ষা করুন
```

এই project-এ বর্তমানে আলাদা test framework configure করা নেই।
