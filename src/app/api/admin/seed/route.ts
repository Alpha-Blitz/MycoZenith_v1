import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PRODUCTS } from '@/lib/products'
import { POSTS } from '@/lib/blog'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[₹,]/g, '')) || 0
}

export async function POST() {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const errors: string[] = []
  let productsSeeded = 0
  let postsSeeded = 0

  // ── Seed products ─────────────────────────────────────────────
  for (const p of PRODUCTS) {
    const price = parsePrice(p.price)
    const payload = {
      slug:                p.slug,
      name:                p.name,
      tag:                 p.tag,
      description:         p.description,
      long_description:    p.longDescription,
      price,
      compare_price:       null,
      price_display:       p.price,
      image:               p.image,
      images:              p.images,
      rating:              p.rating,
      review_count:        p.reviewCount,
      serving_size:        p.servingSize,
      extract:             p.extract,
      beta_glucan:         p.betaGlucan,
      stock:               100,
      status:              'active',
      hero_bullets:        p.heroBullets,
      description_bullets: p.descriptionBullets,
      benefits:            p.benefits,
      how_to_use:          p.howToUse,
      testimonials:        p.testimonials,
      faq:                 p.faq,
    }

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'slug' })

    if (error) errors.push(`product ${p.slug}: ${error.message}`)
    else productsSeeded++
  }

  // ── Seed blog posts ────────────────────────────────────────────
  for (const post of POSTS) {
    const payload = {
      slug:                  post.slug,
      title:                 post.title,
      excerpt:               post.excerpt,
      image:                 post.image,
      category:              post.category,
      tags:                  post.tags,
      read_time:             post.readTime,
      status:                'published',
      published_at:          new Date().toISOString(),
      author:                post.author,
      content:               post.content,
      related_product_slugs: post.relatedProductSlugs,
      related_post_slugs:    post.relatedPostSlugs,
      post_references:       post.references,
      like_count:            post.likeCount,
      comment_count:         post.commentCount,
    }

    const { error } = await supabase
      .from('blog_posts')
      .upsert(payload, { onConflict: 'slug' })

    if (error) errors.push(`post ${post.slug}: ${error.message}`)
    else postsSeeded++
  }

  return NextResponse.json({
    productsSeeded,
    postsSeeded,
    errors: errors.length ? errors : undefined,
  })
}
