// Prompt library (Phase 5). All 38,950 prompts are original, written for
// Indian beginners in plain English. 950 are free on the site (25 per
// category); 38,000 more are in the paid packs (1,000 per category). They are NEUTRAL: each one works in
// any AI chat tool (ChatGPT, Claude, Gemini, Copilot and others). Nothing
// here was copied from any other prompt site.

import type { Prompt, PromptCategory } from "./prompt-types";
export type { Prompt, PromptCategory } from "./prompt-types";

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { slug: "art", label: "Art", emoji: "🎨", blurb: "Ideas, styles and inspiration for drawings, paintings and crafts.", caption: "Draw it, paint it, make it yours." },
  { slug: "business", label: "Business", emoji: "💼", blurb: "Plans, ideas and everyday help for small businesses.", caption: "Small business, big ideas." },
  { slug: "design", label: "Design", emoji: "🖌️", blurb: "Logos, posters, colours and layouts that look professional.", caption: "Make it look like a pro made it." },
  { slug: "finance", label: "Finance", emoji: "💰", blurb: "Budgets, saving, investing and money explained simply.", caption: "Money, made simple." },
  { slug: "hr", label: "HR", emoji: "👥", blurb: "Hiring, interviews, job posts and team messages.", caption: "Hire well, write it right." },
  { slug: "health", label: "Health", emoji: "💪", blurb: "Meal plans, workouts and healthy everyday habits.", caption: "Feel better, one small step at a time." },
  { slug: "learning", label: "Learning", emoji: "📚", blurb: "Study plans, simple explanations and exam practice.", caption: "Learn it once, remember it forever." },
  { slug: "legal", label: "Legal", emoji: "⚖️", blurb: "Everyday legal letters and documents, explained simply.", caption: "Paperwork, without the headache." },
  { slug: "marketing", label: "Marketing", emoji: "📣", blurb: "Ads, offers and campaigns that bring customers in.", caption: "Get noticed, get customers." },
  { slug: "seo", label: "SEO", emoji: "🔍", blurb: "Help people find your website on Google.", caption: "Be the first name on Google." },
  { slug: "social-media", label: "Social Media", emoji: "📱", blurb: "Posts, captions and reels for Instagram, YouTube and more.", caption: "Posts people actually stop for." },
  { slug: "writing", label: "Writing", emoji: "✍️", blurb: "Emails, stories, speeches and anything in words.", caption: "The right words, ready to copy." },
  { slug: "photo", label: "Photo", emoji: "📸", blurb: "Realistic AI photos and portraits — couples, family, festivals, travel and more.", caption: "Turn your photos into movie scenes." },
  { slug: "cooking", label: "Cooking", emoji: "🍳", blurb: "Recipes, meal ideas and kitchen help for everyday Indian cooking.", caption: "Cook something good today." },
  { slug: "travel", label: "Travel", emoji: "✈️", blurb: "Trip plans, packing lists and travel help for India and abroad.", caption: "Your next trip, planned in minutes." },
  { slug: "technology", label: "Technology", emoji: "💻", blurb: "Phones, apps, computers and everyday tech explained simply.", caption: "Tech, without the jargon." },
  { slug: "sports", label: "Sports", emoji: "⚽", blurb: "Training plans, match talk and sports explained for beginners.", caption: "Play smarter, cheer louder." },
  { slug: "parenting", label: "Parenting & Family", emoji: "👨‍👩‍👧", blurb: "Everyday help for parents and families with young children.", caption: "Little hands, big questions, simple answers." },
  { slug: "farming", label: "Farming & Agriculture", emoji: "🌾", blurb: "Crop plans, soil, water and selling produce, for Indian farmers.", caption: "Grow more, worry less." },
  { slug: "photography", label: "Photography", emoji: "📷", blurb: "Photo ideas, camera settings and editing for beginners.", caption: "Take photos worth keeping." },
  { slug: "music", label: "Music", emoji: "🎵", blurb: "Learning music, practice plans and songs for beginners.", caption: "Find your tune." },
  { slug: "home-living", label: "Home & Living", emoji: "🏠", blurb: "Cleaning, organising and running a home smoothly.", caption: "A home that runs itself." },
  { slug: "pets", label: "Pets & Animals", emoji: "🐶", blurb: "Everyday care, food and training for pets at home.", caption: "Happy pets, happy home." },
  { slug: "fashion", label: "Fashion & Style", emoji: "👗", blurb: "Outfits, colours and style ideas for everyday life in India.", caption: "Look good, feel good." },
  { slug: "personal-growth", label: "Personal Growth", emoji: "🌱", blurb: "Habits, confidence and becoming better every day.", caption: "A little better every day." },
  { slug: "real-estate", label: "Real Estate & Housing", emoji: "🏘️", blurb: "Buying, renting and managing a home in India.", caption: "Find your place, without the confusion." },
  { slug: "environment", label: "Environment & Gardening", emoji: "🌿", blurb: "Plants, kitchen gardens and caring for nature at home.", caption: "Grow something green." },
  { slug: "festivals", label: "Festivals & Culture", emoji: "🪔", blurb: "Festival plans, traditions and celebrations in India.", caption: "Celebrate it properly." },
  { slug: "teaching", label: "Teaching & Tutoring", emoji: "🧑‍🏫", blurb: "Lesson plans, explaining topics and running tuition classes.", caption: "Teach it so they get it." },
  { slug: "languages", label: "Languages", emoji: "🗣️", blurb: "Learning a new language, one small step at a time.", caption: "Say it in another language." },
  { slug: "science", label: "Science Explained", emoji: "🔬", blurb: "Everyday science explained in simple words, with examples.", caption: "Science, finally simple." },
  { slug: "history", label: "History & General Knowledge", emoji: "🏛️", blurb: "Indian and world history, simply told, plus GK practice.", caption: "The past, simply told." },
  { slug: "movies", label: "Movies & Entertainment", emoji: "🎬", blurb: "Films, shows and entertainment ideas for family time.", caption: "Family movie night, sorted." },
  { slug: "books", label: "Books & Reading", emoji: "📖", blurb: "Reading plans, book ideas and notes for book lovers.", caption: "Your next good read." },
  { slug: "shopping", label: "Shopping & Deals", emoji: "🛍️", blurb: "Smart shopping, comparing prices and avoiding traps.", caption: "Shop smart, spend less." },
  { slug: "vehicles", label: "Vehicles & Driving", emoji: "🚗", blurb: "Buying, driving and maintaining a car or bike in India.", caption: "Drive with confidence." },
  { slug: "weddings", label: "Weddings & Events", emoji: "💍", blurb: "Planning weddings and family functions, step by step.", caption: "Your big day, planned calmly." },
  { slug: "elder-care", label: "Elder Care", emoji: "👴", blurb: "Caring for elderly parents and grandparents at home.", caption: "Care that shows love." },
];

export function getPromptCategory(slug: string): PromptCategory | undefined {
  return PROMPT_CATEGORIES.find((c) => c.slug === slug);
}

export function promptsByCategory(slug: string): Prompt[] {
  return PROMPTS.filter((p) => p.category === slug);
}

export const FREE_PROMPTS_PER_CATEGORY = 25;

export function freePromptsByCategory(slug: string): Prompt[] {
  return PROMPTS.filter(
    (p) => p.category === slug && Number(p.id.split("-").pop()) <= FREE_PROMPTS_PER_CATEGORY
  );
}

export function packPromptCount(slug: string): number {
  return PROMPTS.filter((p) => p.category === slug).length - FREE_PROMPTS_PER_CATEGORY;
}

// First few paid prompts, for the locked preview on a category page.
// Only their titles are ever shown — the text stays in the paid pack.
export function previewPromptsByCategory(slug: string, n: number = 5): Prompt[] {
  return PROMPTS.filter(
    (p) => p.category === slug && Number(p.id.split("-").pop()) > FREE_PROMPTS_PER_CATEGORY
  ).slice(0, n);
}

import { ART_PROMPTS } from "./prompts-data/art";
import { BUSINESS_PROMPTS } from "./prompts-data/business";
import { DESIGN_PROMPTS } from "./prompts-data/design";
import { FINANCE_PROMPTS } from "./prompts-data/finance";
import { HR_PROMPTS } from "./prompts-data/hr";
import { HEALTH_PROMPTS } from "./prompts-data/health";
import { LEARNING_PROMPTS } from "./prompts-data/learning";
import { LEGAL_PROMPTS } from "./prompts-data/legal";
import { MARKETING_PROMPTS } from "./prompts-data/marketing";
import { SEO_PROMPTS } from "./prompts-data/seo";
import { SOCIAL_MEDIA_PROMPTS } from "./prompts-data/social-media";
import { WRITING_PROMPTS } from "./prompts-data/writing";
import { PHOTO_PROMPTS } from "./prompts-data/photo";
import { COOKING_PROMPTS } from "./prompts-data/cooking";
import { TRAVEL_PROMPTS } from "./prompts-data/travel";
import { TECHNOLOGY_PROMPTS } from "./prompts-data/technology";
import { SPORTS_PROMPTS } from "./prompts-data/sports";
import { PARENTING_PROMPTS } from "./prompts-data/parenting";
import { FARMING_PROMPTS } from "./prompts-data/farming";
import { PHOTOGRAPHY_PROMPTS } from "./prompts-data/photography";
import { MUSIC_PROMPTS } from "./prompts-data/music";
import { HOME_LIVING_PROMPTS } from "./prompts-data/home-living";
import { PETS_PROMPTS } from "./prompts-data/pets";
import { FASHION_PROMPTS } from "./prompts-data/fashion";
import { PERSONAL_GROWTH_PROMPTS } from "./prompts-data/personal-growth";
import { REAL_ESTATE_PROMPTS } from "./prompts-data/real-estate";
import { ENVIRONMENT_PROMPTS } from "./prompts-data/environment";
import { FESTIVALS_PROMPTS } from "./prompts-data/festivals";
import { TEACHING_PROMPTS } from "./prompts-data/teaching";
import { LANGUAGES_PROMPTS } from "./prompts-data/languages";
import { SCIENCE_PROMPTS } from "./prompts-data/science";
import { HISTORY_PROMPTS } from "./prompts-data/history";
import { MOVIES_PROMPTS } from "./prompts-data/movies";
import { BOOKS_PROMPTS } from "./prompts-data/books";
import { SHOPPING_PROMPTS } from "./prompts-data/shopping";
import { VEHICLES_PROMPTS } from "./prompts-data/vehicles";
import { WEDDINGS_PROMPTS } from "./prompts-data/weddings";
import { ELDER_CARE_PROMPTS } from "./prompts-data/elder-care";

export const PROMPTS: Prompt[] = [
  ...ART_PROMPTS,
  ...BUSINESS_PROMPTS,
  ...DESIGN_PROMPTS,
  ...FINANCE_PROMPTS,
  ...HR_PROMPTS,
  ...HEALTH_PROMPTS,
  ...LEARNING_PROMPTS,
  ...LEGAL_PROMPTS,
  ...MARKETING_PROMPTS,
  ...SEO_PROMPTS,
  ...SOCIAL_MEDIA_PROMPTS,
  ...WRITING_PROMPTS,
  ...PHOTO_PROMPTS,
  ...COOKING_PROMPTS,
  ...TRAVEL_PROMPTS,
  ...TECHNOLOGY_PROMPTS,
  ...SPORTS_PROMPTS,
  ...PARENTING_PROMPTS,
  ...FARMING_PROMPTS,
  ...PHOTOGRAPHY_PROMPTS,
  ...MUSIC_PROMPTS,
  ...HOME_LIVING_PROMPTS,
  ...PETS_PROMPTS,
  ...FASHION_PROMPTS,
  ...PERSONAL_GROWTH_PROMPTS,
  ...REAL_ESTATE_PROMPTS,
  ...ENVIRONMENT_PROMPTS,
  ...FESTIVALS_PROMPTS,
  ...TEACHING_PROMPTS,
  ...LANGUAGES_PROMPTS,
  ...SCIENCE_PROMPTS,
  ...HISTORY_PROMPTS,
  ...MOVIES_PROMPTS,
  ...BOOKS_PROMPTS,
  ...SHOPPING_PROMPTS,
  ...VEHICLES_PROMPTS,
  ...WEDDINGS_PROMPTS,
  ...ELDER_CARE_PROMPTS,
];

// Free prompts only (25 per category, IDs 1-25). Defined after PROMPTS so the
// array exists when this is evaluated.
export const FREE_PROMPTS: Prompt[] = PROMPTS.filter(
  (p) => Number(p.id.split("-").pop()) <= FREE_PROMPTS_PER_CATEGORY
);
