'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

type Comment = {
  id:         string
  post_slug:  string
  user_id:    string
  user_name:  string
  body:       string
  created_at: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] text-sm font-bold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function CommentSection({ slug }: { slug: string }) {
  const { user, openModal } = useAuth()
  const supabase = createClient()

  const [comments, setComments] = useState<Comment[]>([])
  const [body,     setBody]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [posting,  setPosting]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', slug)
        .order('created_at', { ascending: false })
      setComments(data ?? [])
      setLoading(false)
    }
    load()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { openModal(); return }
    if (!body.trim()) { setError('Please write something.'); return }
    setError('')
    setPosting(true)

    const userName = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Anonymous'
    const newComment: Comment = {
      id:         crypto.randomUUID(),
      post_slug:  slug,
      user_id:    user.id,
      user_name:  userName,
      body:       body.trim(),
      created_at: new Date().toISOString(),
    }

    // Optimistic insert
    setComments((prev) => [newComment, ...prev])
    setBody('')

    const { error: dbError } = await supabase.from('blog_comments').insert({
      post_slug:  slug,
      user_id:    user.id,
      user_name:  userName,
      body:       newComment.body,
    })

    if (dbError) {
      // Roll back optimistic update
      setComments((prev) => prev.filter((c) => c.id !== newComment.id))
      setError('Failed to post comment. Please try again.')
    }
    setPosting(false)
  }

  return (
    <section id="comments" className="mt-12 scroll-mt-24">
      <h2 className="text-white text-xl font-semibold mb-6">
        Comments <span className="text-white/30 font-normal">({comments.length})</span>
      </h2>

      {/* Comment form */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-5 mb-8">
        {user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-1">
              <Avatar name={user.user_metadata?.name ?? user.email ?? 'U'} />
              <span className="text-white/60 text-sm">
                {user.user_metadata?.name ?? user.email}
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-white/25 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#8B5CF6]/50 transition-colors duration-200 resize-none"
            />
            {error && <p className="text-[#FF6523] text-xs">{error}</p>}
            <button
              type="submit"
              disabled={posting}
              className="self-start bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              {posting ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-white/45 text-sm">Sign in to join the conversation.</p>
            <button
              onClick={openModal}
              className="self-start sm:self-auto inline-flex items-center bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              Sign in
            </button>
          </div>
        )}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">Be the first to comment.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar name={c.user_name} />
              <div className="flex-1 bg-[#0F0F0F] border border-white/[0.07] rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-white text-sm font-semibold">{c.user_name}</span>
                  <span className="text-white/25 text-xs">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
