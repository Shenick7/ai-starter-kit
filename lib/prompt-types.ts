export type PromptCategory = {
  slug: string;
  label: string;
  emoji: string;
  blurb: string;
  // One catchy caption under the category title on the prompts page.
  // All 38 captions are set (13 by Shenick's answers, 25 written by Muse).
  caption?: string;
};

export type Prompt = {
  id: string;
  title: string;
  category: string; // PromptCategory slug
  text: string;
  useCase?: string; // what this prompt is for (shown separately from the text)
};
