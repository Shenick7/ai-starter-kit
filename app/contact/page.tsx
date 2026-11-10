import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { OWNER_EMAIL } from "@/lib/util";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message to the person behind AI Starter Kit.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="prose">
      <h1>Contact</h1>
      <p className="muted">Questions, corrections, or a tool I should look at? Send a note.</p>
      <ContactForm />
      <p>Or email me directly: <a href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</a></p>
    </div>
  );
}
