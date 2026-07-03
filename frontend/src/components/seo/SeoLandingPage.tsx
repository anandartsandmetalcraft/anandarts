import Link from "next/link";
import Schema from "@/components/shared/Schema";
import { absoluteUrl } from "@/lib/seo";

type Faq = {
  question: string;
  answer: string;
};

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  path: string;
  primaryCta?: string;
  secondaryCta?: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: Faq[];
};

export default function SeoLandingPage({
  eyebrow,
  title,
  intro,
  path,
  primaryCta = "Browse Collections",
  secondaryCta = "Request Custom Work",
  sections,
  faqs,
}: SeoLandingPageProps) {
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: absoluteUrl(path),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-28 pb-20">
      <Schema type="FAQPage" data={faqSchema} />
      <Schema type="WebPage" data={breadcrumbSchema} />

      <section className="border-y border-black/5 bg-[#11100D] px-6 py-16 text-center text-[#E8E1D5] md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 font-ui text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-brand-gold)]">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-3xl font-ui text-base leading-8 text-[#B8AEA0] md:text-lg">
            {intro}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="rounded-full bg-[var(--color-brand-gold)] px-8 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#11100D] transition hover:bg-[#F0D080]"
            >
              {primaryCta}
            </Link>
            <Link
              href="/custom-commissions"
              className="rounded-full border border-white/20 px-8 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-8 px-6 py-16 md:grid-cols-3 md:px-12">
        {sections.map((section) => (
          <article key={section.title} className="border-t border-black/10 pt-6">
            <h2 className="font-display text-2xl text-[var(--color-brand-char)]">{section.title}</h2>
            <p className="mt-4 font-ui text-sm leading-7 text-[#6F675C]">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-[980px] px-6 md:px-12">
        <div className="border-t border-black/10 py-14">
          <h2 className="font-display text-3xl text-[var(--color-brand-char)]">Quick Answers</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-char)]">
                  {faq.question}
                </h3>
                <p className="mt-3 font-ui text-sm leading-7 text-[#6F675C]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

