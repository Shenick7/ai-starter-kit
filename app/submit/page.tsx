import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/tools";
import { SubmitToolForm } from "@/components/Forms";

export const metadata: Metadata = { title: "Submit an AI tool", description: "Suggest a beginner-friendly AI tool for the directory. Every submission is reviewed by a human.", alternates: { canonical: "/submit" } };

export default function Submit() {
  return (
    <div className="prose">
      <h1>Submit an AI tool</h1>
      <p className="muted">Made or love a beginner-friendly AI tool? Send it in. Every submission is checked by a person before it goes live, and we verify free-plan details on the tool's own site. Free listings are always free.</p>
      <SubmitToolForm categories={CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))} />
    </div>
  );
}
