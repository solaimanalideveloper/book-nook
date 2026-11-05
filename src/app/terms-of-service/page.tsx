import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const sections = [
  {
    title: "Using BookNook",
    content:
      "BookNook helps members discover, share, and borrow books. You must provide accurate account information, keep your sign-in details secure, and use the service only in ways you are legally allowed to.",
  },
  {
    title: "Books and member content",
    content:
      "You are responsible for the accuracy and appropriateness of the book details and images you submit, and must have permission to share any content you upload. BookNook may remove content that is inaccurate, unlawful, or disruptive to the service.",
  },
  {
    title: "Borrowing and returns",
    content:
      "A borrow is subject to availability. The current service sets a seven-day borrowing period. Members are responsible for returning borrowed books promptly and coordinating any exchange directly with the relevant book contributor.",
  },
  {
    title: "Acceptable use",
    content:
      "Do not misuse the service, attempt to access another member's account or data, interfere with the site, or submit content that violates another person's rights or applicable law.",
  },
  {
    title: "Availability and changes",
    content:
      "BookNook is provided as available. Features may change, and temporary interruptions can occur. BookNook does not guarantee that a listed book will remain available or that every listing is accurate.",
  },
  {
    title: "Contact",
    content:
      "Questions about these terms can be sent to hello@booknook.com.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 border-b border-border pb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Basic terms for using the BookNook community book-sharing service.
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
        These project terms are informational and are not legal advice. Review
        them for your jurisdiction before using BookNook as a production
        service.
      </p>
    </main>
  );
}
