'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  value:    string
  onChange: (url: string) => void
  label?:   string
  compact?: boolean
}

export default function ImageUpload({ value, onChange, label, compact = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [urlMode,   setUrlMode]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const height = compact ? 'h-28' : 'h-40'

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-white/55 text-xs font-semibold uppercase tracking-[0.12em]">{label}</label>
      )}

      <div className={`relative ${height} rounded-xl overflow-hidden border border-white/[0.1] bg-white/[0.03] group cursor-pointer`}
        onClick={() => !urlMode && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
      >
        {value ? (
          <>
            <Image src={value} alt="Preview" fill className="object-cover" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
              <button onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Replace
              </button>
              <button onClick={e => { e.stopPropagation(); onChange('') }}
                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Remove
              </button>
            </div>
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin" />
            <p className="text-white/40 text-xs">Uploading…</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 group-hover:bg-[#8B5CF6]/5 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:border-[#8B5CF6]/30 transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-[#8B5CF6]/70 transition-colors duration-200">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-white/40 text-xs group-hover:text-white/60 transition-colors duration-200">Drop or click to upload</p>
          </div>
        )}
      </div>

      {/* URL paste row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onClick={e => e.stopPropagation()}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste image URL / /public path"
          className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#8B5CF6]/40 placeholder-white/25 transition-colors duration-150"
        />
        {value && (
          <button onClick={() => onChange('')}
            className="text-white/35 hover:text-white/60 text-xs cursor-pointer transition-colors duration-150 shrink-0">
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}
