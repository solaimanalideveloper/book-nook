import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "Information used by BookNook",
    content:
      "When you create an account, BookNook processes the name, email address, profile photo URL, and authentication details you provide. If you add books or borrow them, the related book and borrowing records are also processed so the library features can work.",
  },
  {
    title: "How information is used",
    content:
      "Account information is used to sign you in, protect member-only pages, associate books with their contributors, and manage borrowing and returns. Book listings may show the contributor's name and email address to visitors.",
  },
  {
    title: "Storage and service providers",
    content:
      "BookNook uses MongoDB for authentication and borrowing records, and a separate Books API for catalogue data. Google or GitHub may process information when you choose one of those sign-in options. Book-cover images selected for upload are sent to ImgBB. Those providers handle data under their own privacy terms.",
  },
  {
    title: "Sessions and cookies",
    content:
      "BookNook uses an authentication session cookie to keep you signed in and to authorize member actions. You can sign out to end your session.",
  },
  {
    title: "Your choices and questions",
    content:
      "You can choose whether to create an account, use social sign-in, or upload a cover image. For questions about your account information or this policy, contact hello@booknook.com.",
  },
  {
    title: "Policy updates",
    content:
      "This policy may be updated as BookNook changes. Any revised version will be posted on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 border-b border-border pb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          How BookNook handles information when you use the service.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {section.content}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground">
        This project notice is informational and is not legal advice. Review it
        for your jurisdiction before using BookNook as a production service.
      </p>
    </main>
  );
}
