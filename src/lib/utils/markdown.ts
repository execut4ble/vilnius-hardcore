import removeMd from "remove-markdown";

const toText = (markdown: string) => {
  const blocks = markdown.split(/\n{2,}/);
  const cleaned = blocks.map((b) => removeMd(b)).join("\n\n");
  return cleaned;
};

export { toText as markdownToText };
