import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/lib/admin/blog'
import BlogPostForm from '@/components/admin/BlogPostForm'
import type { Block } from '@/lib/blog'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)
  if (!post) notFound()

  const author = (post.author as Record<string, string>) ?? {}

  const initialData = {
    title:                 post.title,
    slug:                  post.slug,
    excerpt:               post.excerpt ?? '',
    image:                 post.image ?? '',
    category:              post.category ?? '',
    tags:                  (post.tags as string[] ?? []).join(', '),
    read_time:             post.read_time ?? '',
    status:                (post.status as 'published' | 'draft') ?? 'draft',
    published_at:          post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
    author_name:           author.name ?? '',
    author_role:           author.role ?? '',
    author_bio:            author.bio ?? '',
    author_avatar:         author.avatar ?? '',
    content:               (post.content as Block[]) ?? [],
    related_product_slugs: (post.related_product_slugs as string[] ?? []).join(', '),
    related_post_slugs:    (post.related_post_slugs as string[] ?? []).join(', '),
    references:            (post.post_references as { label: string; title: string; url: string }[]) ?? [],
    meta_title:            post.meta_title ?? '',
    meta_description:      post.meta_description ?? '',
  }

  return (
    <div>
      <h1 className="text-white font-semibold text-lg mb-6">Edit Post</h1>
      <BlogPostForm initialData={initialData} id={id} />
    </div>
  )
}
