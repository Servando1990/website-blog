export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}

export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}