// Shared content cross-referencing system

export interface ContentReference {
  title: string;
  url: string;
  description?: string;
  type: 'blog-post' | 'website-page' | 'external';
  tags?: string[];
}

// Blog post references that can be used in website content
export const blogPosts: Record<string, ContentReference> = {
  'building-ai-powered-apps': {
    title: 'Building AI-Powered Applications: A Practical Guide',
    url: 'https://servando.co/posts/building-ai-powered-apps',
    description: 'Learn how to integrate AI capabilities into your applications with practical examples and best practices.',
    type: 'blog-post',
    tags: ['AI', 'Software Engineering', 'Tutorial']
  },
  'llm-prompt-engineering-basics': {
    title: 'LLM Prompt Engineering Basics',
    url: 'https://servando.co/posts/llm-prompt-engineering-basics',
    description: 'Master the fundamentals of prompt engineering for large language models.',
    type: 'blog-post',
    tags: ['LLM', 'AI', 'Prompt Engineering']
  },
  'welcome-to-my-blog': {
    title: 'Welcome to My Blog',
    url: 'https://servando.co/posts/welcome-to-my-blog',
    description: 'Introduction to Servando\'s technical blog covering AI, ML, and software engineering.',
    type: 'blog-post',
    tags: ['Personal', 'Blogging']
  }
};

// Website pages that can be referenced in blog posts
export const websitePages: Record<string, ContentReference> = {
  'home': {
    title: 'ControlThrive - AI Consulting Services',
    url: 'https://controlthrive.com',
    description: 'Transform AI/ML confusion into competitive advantage with strategic consulting and RAG implementation training.',
    type: 'website-page',
    tags: ['AI Consulting', 'Services']
  }
};

// Utility functions for content cross-referencing
export function getBlogPostReference(slug: string): ContentReference | null {
  return blogPosts[slug] || null;
}

export function getWebsitePageReference(slug: string): ContentReference | null {
  return websitePages[slug] || null;
}

export function getAllBlogPosts(): ContentReference[] {
  return Object.values(blogPosts);
}

export function getAllWebsitePages(): ContentReference[] {
  return Object.values(websitePages);
}

// Helper to create markdown links
export function createMarkdownLink(reference: ContentReference): string {
  return `[${reference.title}](${reference.url})`;
}

// Helper to create HTML links
export function createHtmlLink(reference: ContentReference, className?: string): string {
  const classAttr = className ? ` class="${className}"` : '';
  const titleAttr = reference.description ? ` title="${reference.description}"` : '';
  return `<a href="${reference.url}"${classAttr}${titleAttr}>${reference.title}</a>`;
}

// Search content by tags
export function searchContentByTag(tag: string): ContentReference[] {
  const allContent = [...getAllBlogPosts(), ...getAllWebsitePages()];
  return allContent.filter(content => 
    content.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

// Get related content based on tags
export function getRelatedContent(currentTags: string[], limit: number = 3): ContentReference[] {
  const allContent = [...getAllBlogPosts(), ...getAllWebsitePages()];
  
  return allContent
    .filter(content => 
      content.tags?.some(tag => 
        currentTags.some(currentTag => 
          tag.toLowerCase().includes(currentTag.toLowerCase())
        )
      )
    )
    .slice(0, limit);
}