'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function BlogActions({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
    setConfirmDelete(false)
  }

  return (
    <>
      <div className="flex items-center gap-1 justify-end">
        <Link
          href={`/admin/blog/${id}`}
          className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors duration-150"
        >
          Edit
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-40"
        >
          Delete
        </button>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete post"
        message={`"${title}" will be permanently deleted. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}
