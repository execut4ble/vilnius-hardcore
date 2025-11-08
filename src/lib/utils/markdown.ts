const toText = (markdown: string) => {
  return (
    markdown
      // Remove code blocks,
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove images ![alt](url)
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Replace links [text](url) with text
      .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
      // Remove bold/italic markers
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove headings, keep text
      .replace(/^#+\s*(.*)$/gm, "$1")
      // Remove blockquotes
      .replace(/^>\s*(.*)$/gm, "$1")
      // Remove list markers
      .replace(/^(\s*[-*+] )/gm, "- ")
      // Collapse multiple blank lines
      .replace(/\n{2,}/g, "\n\n")
      .trim()
  );
};

export { toText as markdownToText };
