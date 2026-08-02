import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use | Telogica Limited",
  description: "Terms and conditions governing the use of the Telogica Limited website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" intro="The terms governing your use of this website and our services." />
      <article className="container-x max-w-3xl py-14">
        <Section title="Acceptance of terms">
          <p>
            These Terms &amp; Conditions describe how {site.name} ({site.legalNote}) operates this
            website and the services offered through it. By accessing or using this site, you agree
            to be bound by these terms.
          </p>
        </Section>
        <Section title="Products & quotations">
          <p>
            Product specifications, availability and images are provided for information and may
            change without notice. Many instruments are supplied on a quotation basis; prices and
            lead times are confirmed in a formal quotation issued by our sales team.
          </p>
        </Section>
        <Section title="Intellectual property">
          <p>
            All content on this site — including text, graphics, logos and the Telogica brand — is
            the property of {site.name} and protected by applicable laws. It may not be reproduced
            without written permission.
          </p>
        </Section>
        <Section title="Limitation of liability">
          <p>
            This website is provided on an &ldquo;as is&rdquo; basis. To the extent permitted by
            law, {site.name} is not liable for any indirect or consequential loss arising from use
            of this website.
          </p>
        </Section>
        <Section title="Governing law">
          <p>
            These terms are governed by the laws of India and subject to the exclusive jurisdiction
            of the courts of Hyderabad, Telangana.
          </p>
        </Section>
        <Section title="Contact">
          <p>
            Questions about these terms? Email <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>.
          </p>
        </Section>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-fog [&_a]:font-medium [&_a]:text-teal">{children}</div>
    </section>
  );
}
