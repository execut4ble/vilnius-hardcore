import removeMd from "remove-markdown";

const toText = (markdown: string) => {
  return removeMd(markdown);
};

export { toText as markdownToText };
