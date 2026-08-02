import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Telogica Limited",
  description: "How Telogica Limited collects, uses and protects your information.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="How we collect, use and safeguard your information." />
      <article className="container-x prose-legal max-w-3xl py-14">
        <Section title="Overview">
          <p>
            {site.name} ({site.legalNote}) respects your privacy. This policy explains what
            information we collect through this website and how we use it. By using this site you
            consent to the practices described here.
          </p>
        </Section>
        <Section title="Information we collect">
          <p>
            We collect information you voluntarily provide — such as your name, email, phone number
            and message — when you contact us or request a quote. Our site also uses cookies and
            similar technologies to remember preferences, analyse performance and improve our
            services.
          </p>
        </Section>
        <Section title="How we use information">
          <ul>
            <li>To respond to enquiries, quotes and support requests.</li>
            <li>To process and fulfil orders and provide after-sales service.</li>
            <li>To improve our website, products and customer experience.</li>
            <li>To comply with legal and regulatory obligations.</li>
          </ul>
        </Section>
        <Section title="Data sharing">
          <p>
            We do not sell your personal information. We may share data with trusted service
            providers who assist in operating our website and business, subject to confidentiality
            obligations, or where required by law.
          </p>
        </Section>
        <Section title="Contact">
          <p>
            For privacy questions, email <a href={`mailto:${site.email.support}`}>{site.email.support}</a> or
            write to us at {site.address.line1}, {site.address.line2}, {site.address.city}.
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
      <div className="mt-3 space-y-3 text-fog [&_a]:font-medium [&_a]:text-teal [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
