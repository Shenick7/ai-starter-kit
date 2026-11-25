"use client";
import { useState } from "react";
import Link from "next/link";

// Buy panel for one category's 1,000-prompt pack (₹999).
// Three full prompts from the pack are shown as a free preview, plus a
// few locked titles; the other 997 paid prompts are never shown.
// Payment is by UPI; the buyer sends the payment screenshot on
// WhatsApp and Shenick shares the pack file there.
const UPI_ID = "9566977211@upi";
const UPI_LINK = "upi://pay?pa=9566977211@upi&pn=Shenick%20Jain&am=999&cu=INR";
const WHATSAPP_NUMBER = "919566977211";

// Free preview: 3 real prompts from each pack (IDs 31-33, right after
// the 5 locked-preview titles). Each sample shows in full on that
// pack's page as a free preview.
const PREVIEW_SAMPLES: Record<string, { title: string; text: string }[]> = {
  "art": [
    { title: "Continuous line drawing challenge", text: "Give me a continuous line drawing challenge where I draw [an object] without lifting my pencil from the paper. Explain how to start, where to slow down for details, and how to turn a wobbly first attempt into a confident second drawing." },
    { title: "Pencil grades explained simply", text: "Explain pencil grades from 2H to 8B in plain language for a beginner in India. Tell me which pencil to use for light sketching, dark shading and fine details, and suggest a small starter set under [₹ amount] with one practice exercise for each pencil." },
    { title: "Eraser techniques for highlights", text: "Teach me five eraser techniques to create highlights in a pencil drawing, including lifting light, shaping edges and cleaning smudges. Use [a subject] as the example, and give me a short practice task I can finish in 15 minutes at home." },
  ],
  "business": [
    { title: "Monthly profit calculation made simple", text: "Teach me how to calculate my monthly profit in a simple way, using total sales minus all costs and expenses. Use [my business] with example numbers I give, explain what to include and leave out, and show me a one-page monthly profit sheet." },
    { title: "Simple cash book for a small shop", text: "Show me how to keep a simple cash book for a small shop, with date, description, money in and money out. Give me a sample week using [my shop], explain how to close the book daily, and list three common mistakes to avoid." },
    { title: "Pricing a service for the first time", text: "Help me price a service for the first time, using my time, travel, materials and a fair profit margin. Use [my service] as the example, explain how to work out an hourly rate, and give me a simple formula I can reuse." },
  ],
  "design": [
    { title: "Graduation invitation design", text: "Design a proud graduation invitation for [name], ceremony on [date] at [place]. Suggest the colours, a cap and scroll motif, the main heading, and the exact wording with time and venue details." },
    { title: "Corporate event invitation", text: "Design a formal invitation for our company event [event name] on [date] at [venue]. Suggest a professional colour scheme, a clean layout, the headline, and the exact wording with agenda, time and dress code." },
    { title: "School admission poster", text: "Design a poster for school admissions for [school name], admissions open for classes [classes]. Describe the headline, the main photo idea, three reasons to join, the colours, and where to put the phone number." },
  ],
  "finance": [
    { title: "Budget after a salary cut", text: "My salary has dropped from ₹[old] to ₹[new] a month. Help me remake my family budget: what to cut first, what to protect, and how to manage EMIs and school fees until my income recovers." },
    { title: "Budget after a job loss", text: "I lost my job and have savings of ₹[amount] to live on. Help me make a tight monthly budget for the next three months, what to pause, and how to stretch the money while I look for work." },
    { title: "Budget for irregular income", text: "I earn different amounts each month, usually between ₹[low] and ₹[high]. Help me make a budget that works on my lowest month, how to save in good months, and what to do in a slow month." },
  ],
  "hr": [
    { title: "Job ad for a security guard", text: "Write a job ad for a security guard for a [shop / office / apartment] in [area]. Mention day or night shift, uniform, duties at the gate, salary, and weekly off. Ask for age, height and previous experience if any." },
    { title: "Job ad for a data entry operator", text: "Write a job ad for a data entry operator who can type in English and [Hindi / Tamil] and use Excel. Mention the work (bills, stock lists, customer records), office hours, salary, and a short typing test at interview." },
    { title: "Job ad for a telecaller", text: "Write a job ad for a telecaller to call existing customers about [offers / orders / reminders] from our office in [area]. Mention languages needed, calling hours, salary plus incentive, and that no field work is involved." },
  ],
  "health": [
    { title: "Fibre-rich Indian foods", text: "List 12 fibre-rich Indian foods and how to add them to daily meals without changing the menu too much. Explain in simple words why fibre helps digestion. This is general food information, not medical advice." },
    { title: "Foods for healthy skin", text: "List 12 everyday Indian foods that generally support healthy skin, with one line each on why they help. Add 3 daily habits like water and sleep. This is general food information, not medical advice." },
    { title: "Foods for strong hair", text: "List 12 everyday Indian foods that generally support strong hair, with one line each on the nutrient they give. Add 3 simple hair care habits. This is general food information, not medical advice." },
  ],
  "learning": [
    { title: "Learn Bengali basics", text: "Teach me Bengali basics for beginners, including greetings, numbers, and simple sentences for daily life in West Bengal. Explain the pronunciation in English letters, give examples I can use at home, and finish with a small quiz using [topic] as the theme." },
    { title: "Learn Gujarati phrases", text: "Teach me useful Gujarati phrases for daily conversation in Gujarat, including greetings, asking for prices, and ordering vegetarian food. Write each phrase in English letters with its meaning, and create a short market dialogue I can practise with [family member]." },
    { title: "Learn Punjabi basics", text: "Teach me Punjabi basics for beginners, including greetings, polite words, and simple sentences used in Punjab homes. Explain the pronunciation in English letters, give me a daily practice list, and add five easy questions to test myself after learning [topic]." },
  ],
  "legal": [
    { title: "Ancestral property basics", text: "Explain ancestral property basics in India in simple words, including what ancestral property means, who can claim a share, and how it is different from self-acquired property. Use a simple family example, and note that the rules can vary by religion and state. This is general information only, not legal advice." },
    { title: "Property partition basics family", text: "Explain property partition basics for a family in India in simple words, including how family members can divide a shared property by agreement or through court. Explain the common steps, the documents usually needed, and why a written agreement matters. This is general information only, not legal advice." },
    { title: "Property gift deed basics", text: "Explain a property gift deed in simple words, including what it is, when people use it, and the usual steps like preparing the deed, paying stamp duty, and registering it. Explain the difference from a sale in plain words, and remind me to get legal help before signing. This is general information only, not legal advice." },
  ],
  "marketing": [
    { title: "Pamphlet distribution plan", text: "Plan how to distribute 2,000 pamphlets for my [business] in [area] in one week. Say which streets, housing societies and shops to cover, the best time of day, and how to track which areas bring the most customers." },
    { title: "Shop board wording that sells", text: "My shop board only has my shop name. Suggest 5 short lines to add underneath for a [shop type] in [area] that tell passers-by what I sell, one special offer, and why they should stop. Each line must be under 8 words." },
    { title: "Newspaper ad for a local shop", text: "Write a small newspaper ad for my [business] in [local newspaper name]. Keep it under 60 words, include the offer, address, phone number and timings, and make the headline clear enough to read at a glance." },
  ],
  "seo": [
    { title: "Hindi keyword ideas", text: "My website is in English but many customers search in Hindi. Give me 15 Hindi search phrases for [topic / product] in simple Hindi words, with the English meaning, and say which pages could use them." },
    { title: "Tamil keyword ideas for local business", text: "My shop is in Tamil Nadu and serves Tamil-speaking customers. List 15 Tamil search phrases for [product / service] in simple Tamil, with the English meaning, and say where to use them on my website." },
    { title: "Seasonal keyword calendar", text: "My website sells [products]. Make a 12-month keyword calendar: which search terms rise in each month — Diwali, summer, exams, weddings — and what page or post I should prepare one month before each peak." },
  ],
  "social-media": [
    { title: "GRWM reel for a function", text: "Plan a get-ready-with-me reel for [a wedding / a festival / a family function]. List the clips in order from outfit to final look, the on-screen text for each clip, and one tip to keep the whole reel under 45 seconds." },
    { title: "Q and A reel with followers", text: "Help me plan a question-and-answer reel for my page about [topic]. Give me 8 questions followers often ask, a one-line answer for each, and the order to ask them so the reel stays fun and fast." },
    { title: "Myth-busting reel", text: "Write a short myth-busting reel script about [topic, e.g. homemade food / skincare / studying]. Pick 3 common myths, give the true fact for each in one line, and end with a line that invites viewers to share their own myth." },
  ],
  "writing": [
    { title: "Email to a courier company about a late parcel", text: "Write a polite email to a courier company about my parcel [tracking number] that was due on [date] but has not arrived. Ask for the current status, the new delivery date, and a reply by email today." },
    { title: "Email to electricity board about a wrong bill", text: "Write a polite email to the electricity board about a wrong bill for [month]. My consumer number is [number], the bill shows ₹[amount] but my usual bill is about ₹[amount]. Ask them to check the meter reading and send a corrected bill." },
    { title: "Email to internet provider about slow connection", text: "Write a polite email to my internet provider about very slow internet for the last [number] days. Give my customer ID, my plan speed, and the speed I am actually getting, and ask them to fix it or send a technician." },
  ],
  "photo": [
    { title: "Metro ride home in the rain", text: "Using the uploaded couple photo, create an ultra-realistic cinematic portrait (4:5). Preserve both faces exactly as they are in the original image, with no change to eyes, nose, mouth, jawline, skin tone or expressions. No face replacement, no face morphing, no facial modifications. Place the couple sitting together in a city metro train on a rainy evening, rain drops sliding down the window beside them and city lights blurring past outside. The man wears a light blue formal shirt with sleeves rolled up and the woman wears a peach coloured office kurta, her wet hair tucked behind one ear. They smile at each other over the top of a shared phone, tired after work but happy to be heading home together. Cool blue evening light mixes with the warm glow of the metro interior. Shallow depth of field, dreamy blurred background, professional DSLR photography quality, 8K resolution, sharp focus on faces, realistic skin details and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
    { title: "Green fields passing the window", text: "Create an ultra-realistic cinematic wide scene (16:9) using the uploaded couple photo. Keep both faces exactly as in the uploaded image, with the same eyes, nose, mouth, facial structure, skin tone and expressions. Do not alter, beautify, reshape or regenerate the faces. Place the couple seated by the large window of a daytime train, watching bright green paddy fields and palm trees slide past under a clear blue sky. The man wears a beige linen shirt and the woman wears a light green cotton saree with a simple silver necklace. Fresh morning sunlight fills the compartment and lights up their relaxed faces as they point at something interesting outside. Capture the calm joy of a slow countryside journey, the open sky and the green land stretching to the horizon. Bright natural light, soft shadows, shallow depth of field, professional DSLR photography quality, 8K resolution, sharp focus on faces, realistic skin details and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
    { title: "First train trip at sunrise", text: "Create an ultra-realistic cinematic Facebook post size (1:1) romantic portrait using the uploaded couple photo. Extract only the faces of both individuals from the uploaded image and seamlessly integrate them into a new scene while preserving their original face identity exactly. The eyes, nose, mouth, facial structure, skin tone, expressions, and unique facial features must remain completely unchanged. Do not alter, beautify, reshape, or regenerate the faces. Place the couple on a quiet railway platform at sunrise, standing close with their backpacks, the first light of the day painting the sky in soft orange and pink. The man wears a rust coloured t-shirt and the woman wears a white kurta with a denim jacket. They hold paper tickets and smile at each other with the excitement of their first trip together, a train waiting in the background with its lights still on. Capture the beginning of a journey and the happiness of starting it side by side. Premium cinematic photography, 8K resolution, sharp focus on faces, realistic skin details, magazine-quality editing, high dynamic range and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
  ],
};

// Buyer reviews. The "What buyers say" section stays hidden until at least
// one review is added here.
// TODO (Shenick): add your first buyer review to show the section.
const PACK_REVIEWS: { name: string; text: string }[] = [];

export default function PackBuyPanel({
  label,
  slug,
  previewTitles,
}: {
  label: string;
  slug: string;
  previewTitles: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the ID is shown as plain text to copy by hand.
    }
  }

  const waText = encodeURIComponent(
    `Hi Shenick, I paid ₹999 for the ${label} prompt pack (1,000 prompts). My payment reference (UTR): [paste it here]. I am attaching the payment screenshot.`
  );

  return (
    <section className="card featured" style={{ marginTop: 28 }}>
      <h2 style={{ marginTop: 0 }}>Get all 1,000 {label} prompts — ₹999</h2>
      <p>
        The 25 prompts above are free. The full pack has 1,000 {label.toLowerCase()} prompts —
        every one written for beginners, ready to copy into any AI tool.
      </p>
      {previewTitles.length > 0 && (
        <div>
          <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
            A peek inside the pack (locked — full text comes with the pack):
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            {previewTitles.map((t) => (
              <li key={t} className="muted" style={{ padding: "4px 0" }}>
                🔒 {t}
              </li>
            ))}
            <li className="muted" style={{ padding: "4px 0" }}>🔒 …and 995 more</li>
          </ul>
        </div>
      )}
      <h3 style={{ marginBottom: 6 }}>Free preview</h3>
      <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>
        Three full prompts from this pack — try them free before you buy.
      </p>
      {(PREVIEW_SAMPLES[slug] ?? []).map((s) => (
        <article key={s.title} className="card">
          <h3>{s.title}</h3>
          <p className="prompt">{s.text}</p>
        </article>
      ))}
      <div className="box">
        <h3 style={{ marginTop: 0 }}>What you get</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>1,000 prompts — one-time payment, no subscription.</li>
          <li>Format: PDF — one file with all the prompts.</li>
          <li>Delivery: on WhatsApp within 1 hour after payment is checked.</li>
          <li>Works in ChatGPT, Claude, Gemini and other AI tools.</li>
          <li>The 25 free prompts are included in the pack file too — 1,025 prompts in total.</li>
        </ul>
      </div>
      <h3 style={{ marginBottom: 6 }}>How to buy</h3>
      <ol style={{ marginTop: 0 }}>
        <li>
          <b>Pay ₹999 via UPI</b> — tap the button below (opens your UPI app), scan the QR code,
          or copy the UPI ID <code>{UPI_ID}</code>{" "}
          <button type="button" className="chip" onClick={copyUpi}>
            {copied ? "Copied ✓" : "Copy UPI ID"}
          </button>
        </li>
        <li>
          <b>Send your payment screenshot on WhatsApp</b> — tap the WhatsApp button and attach
          the screenshot of your payment there.
        </li>
        <li>
          <b>Shenick shares the full pack file with you on WhatsApp</b> (1,000 paid
          prompts + the 25 free prompts) after checking your payment.
        </li>
      </ol>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <a className="btn" href={UPI_LINK}>
          Pay ₹999 via UPI
        </a>
        <a
          className="btn ghost"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          I&apos;ve paid — send screenshot on WhatsApp
        </a>
      </p>
      <p style={{ margin: "4px 0 0" }}>
        <img
          src="/upi-qr-999.svg"
          alt="QR code to pay ₹999 via UPI for the prompt pack"
          width={180}
          height={180}
        />
      </p>
      <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>
        Pay only ₹999 for this pack. One-time payment, no subscription. Refunds: see our{" "}
        <Link href="/refund-policy">Refund policy</Link>.
      </p>
      <section className="faq" aria-label="Common questions">
        <h2>Common questions</h2>
        <details>
          <summary>How do I pay?</summary>
          <p>Pay ₹999 with UPI — tap “Pay ₹999 via UPI” above, scan the QR code, or copy the UPI ID into your UPI app. We don’t take card payments on this site.</p>
        </details>
        <details>
          <summary>When do I get it?</summary>
          <p>After we check your payment, Shenick shares the pack file with you on WhatsApp — within 1 hour.</p>
        </details>
        <details>
          <summary>What format?</summary>
          <p>PDF. You get one PDF file with all the prompts — the 1,000 paid prompts plus the 25 free prompts.</p>
        </details>
        <details>
          <summary>Can I get a refund?</summary>
          <p>No. All sales are final — prompt packs are digital files. If you paid and did not get your pack within 1 hour, message us on WhatsApp and we will send it. See our <Link href="/refund-policy">Refund policy</Link>.</p>
        </details>
        <details>
          <summary>Can I use these for my business?</summary>
          <p>Yes. You can use the prompts for your own personal and business work. You can’t resell the pack, share the pack file, or publish the prompts as your own. See the <Link href="/terms">Terms</Link> for the full licence.</p>
        </details>
      </section>
      {PACK_REVIEWS.length > 0 && (
        <section aria-label="What buyers say">
          <h2>What buyers say</h2>
          {PACK_REVIEWS.map((r) => (
            <blockquote key={r.name}>
              <p>{r.text}</p>
              <p className="muted">— {r.name}</p>
            </blockquote>
          ))}
        </section>
      )}
    </section>
  );
}
