'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  value:    string
  onChange: (url: string) => void
  label?:   string
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
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

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-white/60 text-xs font-semibold uppercase tracking-[0.12em]">{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex flex-col items-center justify-center gap-2 bg-white/[0.03] border border-dashed border-white/[0.15] hover:border-[#8B5CF6]/40 rounded-xl cursor-pointer transition-colors duration-200 overflow-hidden"
        style={{ minHeight: 120 }}
      >
        {value ? (
          <>
            <div className="relative w-full h-32">
              <Image src={value} alt="Preview" fill className="object-cover rounded-xl" />
            </div>
            <p className="text-white/35 text-xs pb-2">Click to replace</p>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-5 h-5 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin" />
            <p className="text-white/40 text-xs">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-white/35 text-xs">Drop image or click to upload</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
      {value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL"
            className="flex-1 bg-white/[0.04] border border-white/[0.1] text-white/70 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#8B5CF6]/50"
          />
          <button onClick={() => onChange('')} className="text-white/30 hover:text-white/60 text-xs cursor-pointer">Clear</button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
