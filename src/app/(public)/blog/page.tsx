export const dynamic = 'force-dynamic'

import { POSTS, type Post } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'
import BlogGrid from './BlogGrid'

function mapDbRowToPost(row: Record<string, unknown>): Post {
  return {
    slug:                row.slug as string,
    image:               row.image as string,
    category:            row.category as string,
    title:               row.title as string,
    excerpt:             row.excerpt as string,
    date:                row.published_at
      ? new Date(row.published_at as string).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
      : '',
    readTime:            row.read_time as string,
    author:              row.author as Post['author'],
    tags:                (row.tags as string[]) ?? [],
    likeCount:           (row.like_count as number) ?? 0,
    commentCount:        (row.comment_count as number) ?? 0,
    relatedProductSlugs: (row.related_product_slugs as string[]) ?? [],
    relatedPostSlugs:    (row.related_post_slugs as string[]) ?? [],
    references:          (row.post_references as Post['references']) ?? [],
    content:             (row.content as Post['content']) ?? [],
  }
}

export default async function BlogPage() {
  let posts: Post[] = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (!error && data && data.length > 0) {
      posts = data.map(mapDbRowToPost)
    }
  } catch { /* ignore — fallback below */ }

  if (posts.length === 0) {
    posts = POSTS
  }

  return <BlogGrid posts={posts} />
}
