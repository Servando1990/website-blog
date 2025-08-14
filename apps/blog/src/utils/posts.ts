import { getCollection } from 'astro:content';

export async function getAllPosts() {
  const posts = await getCollection('posts');

  return posts
    .filter(post => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();

  return posts.filter(post =>
    post.data.categories.some(
      cat => cat.toLowerCase() === category.toLowerCase()
    )
  );
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const categories = new Set<string>();

  posts.forEach(post => {
    post.data.categories.forEach(category => {
      categories.add(category);
    });
  });

  return Array.from(categories).sort();
}

export function getCategoryPostCount(posts: Array<{data: {categories: string[]}}>, category: string): number {
  return posts.filter(post =>
    post.data.categories.some(
      (cat: string) => cat.toLowerCase() === category.toLowerCase()
    )
  ).length;
}
