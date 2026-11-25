export type PromptCategory = {
  slug: string;
  label: string;
  emoji: string;
  blurb: string;
  // One catchy caption under the category title on the prompts page.
  // TODO (Shenick): send the 13 captions; add each one as caption: "...".
  caption?: string;
};

export type Prompt = {
  id: string;
  title: string;
  category: string; // PromptCategory slug
  text: string;
  useCase?: string; // what this prompt is for (shown separately from the text)
};
