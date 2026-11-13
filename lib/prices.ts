// Sponsor slot prices. No server-only imports here: the inquiry form
// (a client component) reads the labels from this file.
// Featured: $29/month (about ₹2,700), as priced since launch.
// Bar: half the featured price ($29 / 2 = $14.50, rounded to $15).
// Newsletter: low opening price while the subscriber list is small.
export const FEATURED_PRICE_USD = 29;
export const FEATURED_PRICE_INR = 2700; // approx $29 at ~93.9 INR/USD on 2026-11-10, rounded
export const FEATURED_PRICE_LABEL = "$29/month (about ₹2,700)";
export const BAR_PRICE_USD = 15;
export const BAR_PRICE_INR = 1400; // approx $15 at ~93.9 INR/USD, rounded
export const BAR_PRICE_LABEL = "$15/month (about ₹1,400)";
export const NEWSLETTER_PRICE_USD = 9;
export const NEWSLETTER_PRICE_INR = 850; // approx $9 at ~93.9 INR/USD, rounded
export const NEWSLETTER_PRICE_LABEL = "$9/month (about ₹850)";
export const SPONSOR_PRICE_LABEL: Record<string, string> = { featured: FEATURED_PRICE_LABEL, bar: BAR_PRICE_LABEL, newsletter: NEWSLETTER_PRICE_LABEL };
export const SPONSOR_DEFAULT_PRICE_INR: Record<string, number> = { featured: FEATURED_PRICE_INR, bar: BAR_PRICE_INR, newsletter: NEWSLETTER_PRICE_INR };
