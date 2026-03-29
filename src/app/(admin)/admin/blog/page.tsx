import Image from 'next/image'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/admin/blog'
import StatusBadge from '@/components/admin/StatusBadge'
import BlogActions from './BlogActions'

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-16 flex flex-col items-center gap-4">
          <p className="text-white/40 text-base">No posts yet.</p>
          <Link href="/admin/blog/new" className="text-[#8B5CF6] text-sm hover:text-[#a78bfa] transition-colors duration-150">Write your first post →</Link>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left text-white/35 text-xs font-semibold px-5 py-3.5">Post</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden sm:table-cell">Category</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden md:table-cell">Date</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5">Status</th>
                <th className="text-right text-white/35 text-xs font-semibold px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                        {p.image && (
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium leading-tight line-clamp-1">{p.title}</p>
                        <p className="text-white/35 text-xs mt-0.5">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-white/60 text-xs">{p.category}</td>
                  <td className="px-4 py-4 hidden md:table-cell text-white/50 text-xs">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <BlogActions id={p.id} title={p.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
