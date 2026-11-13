import type { Faq } from "@/lib/faq";

// Visible FAQ block. Uses native <details> so it works with no JavaScript.
export default function FaqBlock({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="faq" aria-label="Common questions">
      <h2>Common questions</h2>
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
