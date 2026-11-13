// Seed data. Every free-plan claim below was read from the tool's own pricing/help page
// (sourceUrl) on 10 Nov 2026. Plans change often: re-check the source before editing.
export type Verdict = "yes" | "mostly" | "trial" | "no";

export type Tool = {
  slug: string;
  name: string;
  url: string;
  categories: string[]; // first = primary
  tagline: string;
  what: string;
  start: string[];
  freePlan: string;
  verdict: Verdict;
  verdictNote: string;
  sourceUrl: string;
  pick?: boolean; // top beginner pick for its primary category
  affiliateUrl?: string; // per-owner tracking link; never affects verdict or free-plan text
};

// Affiliate links (Phase 4). Every affiliate tracking link is unique to the site
// owner, so no genuine link can be written here until the owner joins each
// programme and pastes their own link. Programmes verified 14 Nov 2026 —
// the owner applies at each programme page, gets approved, and pastes the
// unique link they are given into this map (slug -> full tracking URL):
//   OPEN, joinable now: Grammarly (grammarly.com/affiliates, Impact/CJ),
//     Descript (descript.com/affiliate, PartnerStack, $25/subscriber),
//     ElevenLabs (elevenlabs.io/affiliates, PartnerStack, 22% for 12 months),
//     QuillBot (quillbot.com/affiliates, Impact, up to 20%),
//     Make (make.com/en/affiliates, 50% first payment + 20% for 23 months),
//     Lovable (lovable.dev/partners/affiliates, Impact, up to $100/subscriber),
//     Gamma (help.gamma.app affiliate article, PartnerStack, ~25-30% first year),
//     Runway Rewards (runway.com/rewards, $15/subscriber — code-based, no link),
//     Adobe (adobe.com/affiliates, Partnerize, approval required).
//   GATED (audience/approval needed): HeyGen (5K+ followers, up to 30% 6 months),
//     Zapier (partner tracks only, no public self-serve programme).
//   CLOSED to new applicants: Canva (Canvassador closed), Notion (enrolment not
//     open), Leonardo.Ai (closed 7 Apr 2026).
//   NO cash affiliate programme found: ChatGPT/OpenAI, Claude, Gemini, Copilot,
//     Mistral, Perplexity, NotebookLM, Khanmigo, CapCut, IFTTT, Bolt, Fathom,
//     Suno, Midjourney, Google AI Studio. Otter.ai: conflicting evidence —
//     Otter's own referral page offers credits only, so treated as no programme.
// Until a link is pasted here, /go/[slug] keeps using the plain tool URL and
// no affiliate label is shown anywhere on the site.
export const AFFILIATE_URLS: Record<string, string> = {};

export const CATEGORIES = [
  { slug: "write", label: "Write", emoji: "✍️", blurb: "Emails, essays, captions and cleaner writing." },
  { slug: "slides", label: "Make slides", emoji: "📊", blurb: "Presentations and visuals from a short prompt." },
  { slug: "video", label: "Edit video", emoji: "🎬", blurb: "Cut, caption and create videos without pro skills." },
  { slug: "study", label: "Study & research", emoji: "📚", blurb: "Understand topics, notes and sources faster." },
  { slug: "images", label: "Make images", emoji: "🎨", blurb: "Pictures, logos and designs from words." },
  { slug: "audio", label: "Voice & music", emoji: "🎵", blurb: "Songs, voiceovers and narration." },
  { slug: "automate", label: "Automate stuff", emoji: "⚙️", blurb: "Let apps do repetitive tasks for you." },
  { slug: "meetings", label: "Meeting notes", emoji: "📝", blurb: "Record, transcribe and summarise calls." },
  { slug: "build", label: "Build an app", emoji: "🛠️", blurb: "Make a website or app by describing it." },
] as const;

export const VERDICT_LABEL: Record<Verdict, string> = {
  yes: "Free plan is enough to start",
  mostly: "Free plan works, with limits",
  trial: "Free credits or trial only",
  no: "No free plan",
};

export const TOOLS: Tool[] = [
  {
    slug: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com", categories: ["write", "study"], pick: true,
    tagline: "The best-known AI chat assistant: ask anything, get a written answer.",
    what: "ChatGPT by OpenAI is a chat assistant. You type a question or task in plain language and it writes an answer: an email draft, an explanation, a plan, a list of ideas. It also works on your phone, including by voice.",
    start: ["Go to chatgpt.com or install the app and sign up with email or Google.", "Type a real task, e.g. \"Write a polite email asking my landlord to fix the tap\".", "Reply with changes like \"shorter\" or \"more friendly\" until it fits.", "Copy the result and always read it before you send it."],
    freePlan: "OpenAI says the free version of ChatGPT is available to everyone. Paid plans (Go, Plus, Pro) add more messages, uploads, image creation and newer models.",
    verdict: "yes", verdictNote: "For everyday writing and questions the free version is plenty.",
    sourceUrl: "https://openai.com/chatgpt/pricing/",
  },
  {
    slug: "claude", name: "Claude", url: "https://claude.ai", categories: ["write", "study"],
    tagline: "A careful, clear AI writing and thinking partner from Anthropic.",
    what: "Claude is a chat assistant from Anthropic. It is especially good at long documents, clear writing and thoughtful explanations. It can search the web, create files and make simple slides and docs.",
    start: ["Sign up free at claude.ai (web, desktop or mobile).", "Paste a long article or upload a PDF and ask \"Summarise this in 5 bullet points\".", "Ask follow-up questions about it.", "Try \"Rewrite my message so it sounds calm and professional\"."],
    freePlan: "Free ($0): chat on web, desktop and mobile with limited usage every 5 hours and every week; web search, file creation, memory, Artifacts and connectors are included. Pro is $20/month billed monthly ($17/month billed annually).",
    verdict: "mostly", verdictNote: "Great for daily use; heavy users hit the 5-hour limit.",
    sourceUrl: "https://claude.com/pricing",
  },
  {
    slug: "gemini", name: "Google Gemini", url: "https://gemini.google.com", categories: ["write", "study", "images"],
    tagline: "Google's AI assistant, free with any Google account.",
    what: "Gemini is Google's chat assistant. It answers questions, drafts text, explains photos you upload, creates images and can run Deep Research reports. If you already use Gmail, you already have an account.",
    start: ["Open gemini.google.com and sign in with your Google account.", "Snap a photo of homework or a confusing bill and ask \"Explain this simply\".", "Try Deep Research: \"Compare 3 budget phones under ₹20,000\".", "Save useful prompts as a Gem for reuse."],
    freePlan: "Free ($0 with a Google Account): Flash-Lite model, image generation and editing, Deep Research, Gemini Live, Canvas and Gems, plus 15 GB Google storage. Paid Google AI Plus/Pro/Ultra plans raise limits.",
    verdict: "yes", verdictNote: "Generous free tier, especially if you live in Google apps.",
    sourceUrl: "https://gemini.google/subscriptions/",
  },
  {
    slug: "copilot", name: "Microsoft Copilot", url: "https://copilot.microsoft.com", categories: ["write", "images"],
    tagline: "Microsoft's free AI assistant for chat, images and voice.",
    what: "Copilot is Microsoft's AI assistant. Chat with it on the web, in Windows or on your phone to draft text, answer questions and create images. Paid Microsoft 365 plans add Copilot inside Word, Excel and Outlook.",
    start: ["Go to copilot.microsoft.com and sign in with a Microsoft account.", "Ask it to plan something: \"A 3-day Jaipur trip on a student budget\".", "Ask it to create an image for a birthday invite.", "Use voice mode on your phone for hands-free questions."],
    freePlan: "Microsoft says Copilot is free with a signed-in Microsoft account. Paid plans offer higher usage and Copilot in Office apps (free one-month trial offered).",
    verdict: "yes", verdictNote: "Free chat is enough; pay only if you want it inside Word/Excel.",
    sourceUrl: "https://copilot.microsoft.com/",
  },
  {
    slug: "mistral", name: "Mistral", url: "https://mistral.ai", categories: ["write"],
    tagline: "A European AI assistant with a free plan for chat and search.",
    what: "Mistral is a French AI company. Its assistant does chat, web search and content creation, and it also offers coding tools for developers.",
    start: ["Visit mistral.ai and create a free account.", "Ask a question you'd normally Google and compare the answer.", "Ask it to translate a paragraph into another language.", "Check its cited sources for anything important."],
    freePlan: "Mistral's FAQ says its Free plan provides limited access to its latest models, chat, search, creation and coding tools, plus Mistral Studio.",
    verdict: "mostly", verdictNote: "Fine to try; limits apply.",
    sourceUrl: "https://mistral.ai/pricing",
  },
  {
    slug: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai", categories: ["study"], pick: true,
    tagline: "An AI search engine that answers with sources you can click.",
    what: "Perplexity works like Google, but instead of ten blue links it writes a short answer and shows numbered sources so you can check where each fact came from.",
    start: ["Open perplexity.ai (no account needed to try).", "Ask a real question, e.g. \"Is it safe to charge my phone overnight?\".", "Click the numbered sources to verify the answer.", "Ask a follow-up in the same thread."],
    freePlan: "Perplexity's help centre says the Free plan includes its Best search mode and a limited number of Pro Searches; paid plans let you pick advanced models.",
    verdict: "yes", verdictNote: "Free is enough for everyday research.",
    sourceUrl: "https://www.perplexity.ai/help-center/en/articles/10354919-what-is-perplexity-pro",
  },
  {
    slug: "gemini-notebook", name: "Gemini Notebook (NotebookLM)", url: "https://notebooklm.google", categories: ["study"],
    tagline: "Upload your notes or PDFs and chat with them, or hear them as a podcast.",
    what: "Google's research notebook (formerly NotebookLM). You add your own sources (PDFs, docs, links) and it answers only from them, makes study guides and can turn them into an audio summary you can listen to.",
    start: ["Go to notebooklm.google and sign in with Google.", "Create a notebook and upload your class notes or a PDF.", "Ask \"Make me 10 quiz questions from this\".", "Click Audio Overview to hear a spoken summary."],
    freePlan: "Without a paid AI plan you get up to 100 notebooks and 50 sources per notebook (per Google's help page); paid Google AI plans raise these limits.",
    verdict: "yes", verdictNote: "The free limits cover most students.",
    sourceUrl: "https://support.google.com/notebooklm/answer/16213268",
  },
  {
    slug: "khanmigo", name: "Khanmigo", url: "https://www.khanmigo.ai", categories: ["study"],
    tagline: "Khan Academy's AI tutor that guides you instead of giving answers.",
    what: "Khanmigo is an AI tutor and teaching assistant from the non-profit Khan Academy. It nudges learners towards the answer step by step, and helps teachers plan lessons.",
    start: ["Visit khanmigo.ai and choose Learners, Parents or Teachers.", "Teachers can sign up for free.", "Ask it to explain a maths step you're stuck on.", "Let it quiz you instead of telling you the answer."],
    freePlan: "Teachers can sign up for free. Khanmigo's site says a payment is required for parents and learners.",
    verdict: "no", verdictNote: "Free for teachers only; learners and parents pay.",
    sourceUrl: "https://www.khanmigo.ai/",
  },
  {
    slug: "grammarly", name: "Grammarly", url: "https://www.grammarly.com", categories: ["write"],
    tagline: "Fixes spelling, grammar and tone wherever you type.",
    what: "Grammarly checks your writing as you type in the browser, email and documents. It underlines mistakes, suggests clearer wording and tells you how your tone comes across.",
    start: ["Create a free account at grammarly.com.", "Install the browser extension.", "Write an email as usual and accept the underlined fixes.", "Try an AI prompt like \"make this more concise\"."],
    freePlan: "Free ($0): spelling and grammar corrections, tone detection and 100 AI prompts. Pro is $12/month (USD) for more.",
    verdict: "yes", verdictNote: "The free version catches most everyday mistakes.",
    sourceUrl: "https://www.grammarly.com/plans",
  },
  {
    slug: "quillbot", name: "QuillBot", url: "https://quillbot.com", categories: ["write", "study"],
    tagline: "Rephrase, summarise and grammar-check text in one place.",
    what: "QuillBot rewrites sentences in different styles (paraphrasing), summarises long text and fixes basic grammar. Students use it to understand and reword readings.",
    start: ["Open quillbot.com — you can start without paying.", "Paste a paragraph into the Paraphraser.", "Switch between modes to see different rewrites.", "Use Summarizer on a long article."],
    freePlan: "Free ($0): paraphrase up to 125 words in 2 modes, basic grammar fixes, basic summaries, limited humanizer and AI detector.",
    verdict: "mostly", verdictNote: "Good for short text; the 125-word limit bites on essays.",
    sourceUrl: "https://quillbot.com/premium",
  },
  {
    slug: "notion", name: "Notion", url: "https://www.notion.com", categories: ["write", "study"],
    tagline: "Notes, to-do lists and docs in one app, with built-in AI.",
    what: "Notion is a flexible notes and planning app. You can keep notes, to-do lists, trackers and simple websites in one place, and use Notion AI to draft or summarise pages.",
    start: ["Sign up free at notion.com.", "Pick a template, like a reading list or habit tracker.", "Type / on a page to add a checklist or table.", "Try Notion AI on a page to summarise it."],
    freePlan: "Free ($0) for individuals organising personal projects. Notion AI is offered as a trial; full AI comes with paid plans.",
    verdict: "mostly", verdictNote: "Free for notes; AI beyond the trial needs a paid plan.",
    sourceUrl: "https://www.notion.com/pricing",
  },
  {
    slug: "gamma", name: "Gamma", url: "https://gamma.app", categories: ["slides"], pick: true,
    tagline: "Type a topic, get a ready-made slide deck in a minute.",
    what: "Gamma creates presentations, documents and simple web pages from a short prompt. You describe what you need and it writes and designs the slides, which you can then edit.",
    start: ["Sign up free at gamma.app (no card needed).", "Click Create and type \"8 slides on saving money for college students\".", "Review the outline, then generate.", "Edit text and export to PDF, PPTX or Google Slides."],
    freePlan: "Free ($0): 400 credits at signup, up to 10 slides per prompt, import PDF/PPTX and export to PDF, PPTX, PNG and Google Slides. Plus is $9/seat/month and removes Gamma branding.",
    verdict: "trial", verdictNote: "One-time credits: enough for a few decks to test it.",
    sourceUrl: "https://gamma.app/pricing",
  },
  {
    slug: "canva", name: "Canva", url: "https://www.canva.com", categories: ["slides", "images", "video"],
    tagline: "Drag-and-drop design for posters, slides and social posts, with AI.",
    what: "Canva is an easy online design tool with millions of templates. Its AI features can write text, generate images and resize designs, so you can make posters, slides, invites and reels without design skills.",
    start: ["Sign up free at canva.com.", "Search a template, e.g. \"Instagram post sale\".", "Click text to change it and drag in your photos.", "Download or share directly."],
    freePlan: "Free (US$0): 1.6M+ templates, 4.7M+ elements, 1 Brand Kit (3 colours) and limited access to Canva's AI features.",
    verdict: "yes", verdictNote: "Free covers most personal design jobs; AI use is limited.",
    sourceUrl: "https://www.canva.com/pricing/",
  },
  {
    slug: "napkin", name: "Napkin AI", url: "https://www.napkin.ai", categories: ["slides"],
    tagline: "Turns your text into diagrams and visuals for slides.",
    what: "Napkin reads a paragraph of text and suggests diagrams, flowcharts and infographics that explain it, which you can drop into slides or documents.",
    start: ["Sign up free at napkin.ai.", "Paste a paragraph explaining a process.", "Click the spark icon to see visual suggestions.", "Export as PNG or PDF."],
    freePlan: "Free ($0, forever): 500 AI credits per week, unlimited editing, imports and PNG/PDF exports, with Napkin branding on visuals.",
    verdict: "yes", verdictNote: "Weekly credits are plenty for occasional use.",
    sourceUrl: "https://www.napkin.ai/pricing",
  },
  {
    slug: "capcut", name: "CapCut", url: "https://www.capcut.com", categories: ["video"], pick: true,
    tagline: "Free, easy video editor with templates and auto-captions.",
    what: "CapCut is a video editor for phone, desktop and web. It's popular for short videos thanks to ready-made templates, auto-captions and AI editing helpers.",
    start: ["Install the CapCut app or open it online — no credit card needed.", "Pick a template and drop in your clips.", "Add auto-captions.", "Export and post to Reels, Shorts or WhatsApp status."],
    freePlan: "CapCut's pricing page lists a Free plan to \"start with the basics\", including free templates. Pro and paid AI video generation cost extra.",
    verdict: "mostly", verdictNote: "Basics are free; advanced AI features are paid.",
    sourceUrl: "https://www.capcut.com/pricing",
  },
  {
    slug: "descript", name: "Descript", url: "https://www.descript.com", categories: ["video", "audio"],
    tagline: "Edit video by editing the transcript, like a Word document.",
    what: "Descript transcribes your video or podcast, then lets you cut it by deleting words from the text. It also removes filler words like \"um\".",
    start: ["Sign up free at descript.com.", "Upload a short video of yourself talking.", "Delete sentences in the transcript to cut the video.", "Use the filler-word remover, then export."],
    freePlan: "Free ($0): 60 media minutes per month to record, edit and mix audio and video.",
    verdict: "mostly", verdictNote: "One hour a month is enough to learn and do small projects.",
    sourceUrl: "https://www.descript.com/pricing",
  },
  {
    slug: "runway", name: "Runway", url: "https://runwayml.com", categories: ["video"],
    tagline: "Create short AI video clips from text or an image.",
    what: "Runway is an AI video studio. You describe a scene or upload an image and it generates a short video clip. Creators use it for effects and B-roll.",
    start: ["Sign up free at runwayml.com.", "Upload an image and describe the movement you want.", "Generate and download the clip.", "Watch your credit balance: each generation uses credits."],
    freePlan: "Free ($0): 125 one-time credits and 5 GB storage to try a selection of models. Standard is $15/month.",
    verdict: "trial", verdictNote: "Credits are one-time, so treat it as a trial.",
    sourceUrl: "https://runwayml.com/pricing",
  },
  {
    slug: "heygen", name: "HeyGen", url: "https://www.heygen.com", categories: ["video"],
    tagline: "Make talking-presenter videos from a script, in 30+ languages.",
    what: "HeyGen turns a written script into a video with a realistic AI presenter (avatar). You can also translate videos into other languages.",
    start: ["Sign up free at heygen.com (no credit card).", "Pick a ready-made presenter.", "Paste a short script and choose a language.", "Generate a video under one minute."],
    freePlan: "Free ($0): 3 watermarked videos a month, up to 1 minute each, 500+ presenters and 30+ languages. Creator is $29/month.",
    verdict: "trial", verdictNote: "Good for testing; watermark means paid for real use.",
    sourceUrl: "https://www.heygen.com/pricing",
  },
  {
    slug: "adobe-firefly", name: "Adobe Firefly", url: "https://firefly.adobe.com", categories: ["images", "video"],
    tagline: "Adobe's image and video generator, designed for commercial-safe use.",
    what: "Firefly is Adobe's AI for generating and editing images, video and audio from text prompts. It's built into Photoshop and Adobe Express too.",
    start: ["Go to firefly.adobe.com and sign in with a free Adobe account.", "Type a prompt like \"watercolour Diwali card with diyas\".", "Pick a style and generate.", "Download your favourite."],
    freePlan: "Firefly Free: limited free daily generations for images and video. Paid Standard and Pro plans add more.",
    verdict: "mostly", verdictNote: "Daily free generations suit casual use.",
    sourceUrl: "https://www.adobe.com/products/firefly/plans.html",
  },
  {
    slug: "ideogram", name: "Ideogram", url: "https://ideogram.ai", categories: ["images"], pick: true,
    tagline: "Image generator that is good at putting readable text in pictures.",
    what: "Ideogram creates images from text prompts and is known for getting words right inside images, useful for posters, logos and thumbnails.",
    start: ["Sign up at ideogram.ai using Google, Apple or Microsoft (needed for free credits).", "Type \"Poster that says 'Garage Sale Sunday' in bold retro letters\".", "Generate and pick the best version.", "Download it."],
    freePlan: "Free: 30 credits a week if you sign in with Google, Apple or Microsoft. Email-and-password accounts don't get free credits.",
    verdict: "mostly", verdictNote: "Weekly credits are enough for a few designs.",
    sourceUrl: "https://docs.ideogram.ai/plans-and-pricing/available-plans",
  },
  {
    slug: "leonardo", name: "Leonardo.Ai", url: "https://leonardo.ai", categories: ["images"],
    tagline: "AI art generator with daily free tokens.",
    what: "Leonardo generates images in many styles (realistic, anime, product shots) from prompts, with lots of style presets.",
    start: ["Sign up free at leonardo.ai.", "Choose a preset style.", "Type your prompt and generate.", "Note that free creations are public."],
    freePlan: "Free ($0/month): 150 fast tokens per day, automatic model choice, basic quality settings; creations are public.",
    verdict: "mostly", verdictNote: "Daily tokens are fine for hobby use; images are public.",
    sourceUrl: "https://leonardo.ai/pricing/",
  },
  {
    slug: "midjourney", name: "Midjourney", url: "https://www.midjourney.com", categories: ["images"],
    tagline: "Famous for beautiful, artistic AI images. Paid only.",
    what: "Midjourney is one of the best-known AI image generators, loved for its artistic style. You use it on its website.",
    start: ["Look at examples on midjourney.com first.", "If you decide to pay, start on the Basic plan.", "Type a prompt and pick from 4 results.", "Upscale or vary the one you like."],
    freePlan: "No free plan listed. Plans: Basic $10/month, Standard $30, Pro $60, Mega $120 (cheaper billed annually).",
    verdict: "no", verdictNote: "Try a free tool like Ideogram or Firefly first.",
    sourceUrl: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
  },
  {
    slug: "suno", name: "Suno", url: "https://suno.com", categories: ["audio"], pick: true,
    tagline: "Describe a song and it writes and sings it for you.",
    what: "Suno creates full songs (music plus vocals) from a short description or your own lyrics. Great for birthday songs, jingles and fun.",
    start: ["Sign up free at suno.com.", "Type \"Happy birthday song for my friend Riya, Bollywood style\".", "Listen to the versions it makes.", "Share the one you like."],
    freePlan: "Free Plan: song generation with Suno's best free model; commercial use of songs requires a paid plan.",
    verdict: "yes", verdictNote: "Free is perfect for personal fun; pay if you'll use songs commercially.",
    sourceUrl: "https://suno.com/pricing",
  },
  {
    slug: "elevenlabs", name: "ElevenLabs", url: "https://elevenlabs.io", categories: ["audio"],
    tagline: "Realistic AI voiceovers from text, in many languages.",
    what: "ElevenLabs turns text into natural-sounding speech, which is handy for voiceovers, narration and accessibility. It also does speech-to-text and sound effects.",
    start: ["Sign up free at elevenlabs.io.", "Open Text to Speech and paste a short script.", "Pick a voice and generate.", "Download the audio for your video."],
    freePlan: "Free ($0): 10k credits per month across text to speech, speech to text, sound effects and more, plus 3 Studio projects.",
    verdict: "mostly", verdictNote: "Enough for short voiceovers each month.",
    sourceUrl: "https://elevenlabs.io/pricing",
  },
  {
    slug: "zapier", name: "Zapier", url: "https://zapier.com", categories: ["automate"], pick: true,
    tagline: "Connect your apps so tasks happen automatically.",
    what: "Zapier links apps like Gmail, Google Sheets and WhatsApp Business so that when something happens in one, an action happens in another (a \"Zap\"). Its AI Copilot can build the Zap from a description.",
    start: ["Sign up free at zapier.com.", "Describe a task: \"When I get an email with an invoice, save the attachment to Google Drive\".", "Connect the two apps when asked.", "Turn the Zap on and test it."],
    freePlan: "Free forever ($0): unlimited two-step Zaps, Tables and Forms, 100 tasks per month, and Zapier Copilot.",
    verdict: "mostly", verdictNote: "100 tasks a month covers simple personal automations.",
    sourceUrl: "https://zapier.com/pricing",
  },
  {
    slug: "make", name: "Make", url: "https://www.make.com", categories: ["automate"],
    tagline: "Visual drag-and-drop automations between apps.",
    what: "Make (formerly Integromat) lets you build automations by connecting app blocks on a visual canvas. It's more flexible than Zapier but takes a little longer to learn.",
    start: ["Sign up free at make.com.", "Start from a template scenario.", "Connect your apps and run it once.", "Schedule it to run automatically."],
    freePlan: "Free plan: 1,000 credits per month (each action uses credits).",
    verdict: "mostly", verdictNote: "Good for learning and light automations.",
    sourceUrl: "https://www.make.com/en/pricing",
  },
  {
    slug: "ifttt", name: "IFTTT", url: "https://ifttt.com", categories: ["automate"],
    tagline: "Simple \"if this, then that\" automations for phones and smart homes.",
    what: "IFTTT runs small automations called Applets, like \"if it rains tomorrow, send me a notification\" or \"save my Instagram photos to Drive\".",
    start: ["Install the IFTTT app or open ifttt.com.", "Browse popular Applets.", "Turn one on and connect the services.", "Create your own with the Create button."],
    freePlan: "Free ($0/month): 1,000 credits per month, all features unlocked, unlimited Applets and all services.",
    verdict: "yes", verdictNote: "Free is plenty for personal automations.",
    sourceUrl: "https://ifttt.com/plans",
  },
  {
    slug: "lovable", name: "Lovable", url: "https://lovable.dev", categories: ["build"], pick: true,
    tagline: "Describe an app or website in plain English and it builds it.",
    what: "Lovable is an AI app builder. You chat about what you want (\"a booking page for my tuition classes\") and it writes the code, shows a live preview and can publish it.",
    start: ["Sign up free at lovable.dev.", "Describe a small website in one or two sentences.", "Ask for changes in chat, e.g. \"make the button blue\".", "Publish and share the link."],
    freePlan: "Free plan includes 5 credits per day, up to 30 per month (from Lovable's plans and credits docs).",
    verdict: "trial", verdictNote: "Enough to build a small first project slowly.",
    sourceUrl: "https://docs.lovable.dev/introduction/plans-and-credits",
  },
  {
    slug: "bolt", name: "Bolt", url: "https://bolt.new", categories: ["build"],
    tagline: "Build and host web apps by chatting, right in your browser.",
    what: "Bolt (bolt.new) is an AI that builds full web apps from a prompt and hosts them for you, with databases included.",
    start: ["Open bolt.new and sign up free (no card).", "Type what you want to build.", "Watch it create the app and preview it.", "Ask for fixes in chat, then deploy."],
    freePlan: "Free ($0, no card): 300K tokens daily, 1M tokens per month, website hosting with Bolt branding, 10 MB file uploads.",
    verdict: "mostly", verdictNote: "Fine for small personal projects.",
    sourceUrl: "https://bolt.new/pricing",
  },
  {
    slug: "google-ai-studio", name: "Google AI Studio", url: "https://aistudio.google.com", categories: ["build"],
    tagline: "Google's free playground to try Gemini models and build with them.",
    what: "AI Studio is where you can experiment with Google's latest Gemini models, test prompts and get an API key if you want to build your own AI app.",
    start: ["Go to aistudio.google.com and sign in with Google.", "Pick a model and type a prompt.", "Try uploading an image or file.", "Click Get code when you're ready to build."],
    freePlan: "No cost to start: limited access to certain models with input and output tokens at no cost; paid plan for higher limits.",
    verdict: "yes", verdictNote: "Free is enough to learn and prototype.",
    sourceUrl: "https://gemini.google/subscriptions/",
  },
  {
    slug: "otter", name: "Otter.ai", url: "https://otter.ai", categories: ["meetings"], pick: true,
    tagline: "Live transcripts and AI summaries of your meetings and lectures.",
    what: "Otter records and transcribes meetings on Zoom, Google Meet and Teams, or in-person conversations on your phone, then gives you an AI summary.",
    start: ["Sign up free at otter.ai or install the app.", "Connect your calendar or tap record in a lecture.", "Read the live transcript.", "Ask Otter's AI chat \"what were the action items?\"."],
    freePlan: "Basic (free): 300 monthly transcription minutes, live transcription, speaker identification, AI chat and 3 lifetime file imports.",
    verdict: "mostly", verdictNote: "5 hours a month covers light use.",
    sourceUrl: "https://otter.ai/pricing",
  },
  {
    slug: "fathom", name: "Fathom", url: "https://www.fathom.ai", categories: ["meetings"],
    tagline: "Free AI notetaker that summarises your video calls.",
    what: "Fathom joins your video calls, records them and writes instant summaries so you can focus on the conversation.",
    start: ["Sign up free at fathom.ai.", "Connect your Zoom, Meet or Teams calendar.", "Have a call as normal.", "Open the summary right after the call."],
    freePlan: "Free plan (free forever): unlimited recordings, instant call summaries and integrations.",
    verdict: "yes", verdictNote: "Very generous free plan for individuals.",
    sourceUrl: "https://www.fathom.ai/pricing",
  },
];

export function toolsByCategory(cat: string) {
  return TOOLS.filter((t) => t.categories.includes(cat));
}
