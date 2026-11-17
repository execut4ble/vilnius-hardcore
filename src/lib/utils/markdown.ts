import removeMd from "remove-markdown";

const toText = (markdown: string) => {
  const blocks = markdown.split(/\n{2,}/);
  const cleaned = blocks.map((b) => removeMd(b)).join("\n\n");
  return cleaned;
};

// A short single-line excerpt for <meta> / og / twitter description tags.
// Collapses all whitespace, then cuts at a word boundary just under `max` and
// adds an ellipsis. Returns undefined when there is no text so the tag can fall
// back to the site default.
const excerpt = (
  text: string | null | undefined,
  max = 160,
): string | undefined => {
  if (!text) return undefined;
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return trimmed + "…";
};

export { toText as markdownToText, excerpt };
