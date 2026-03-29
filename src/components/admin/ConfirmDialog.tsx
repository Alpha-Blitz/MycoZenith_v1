'use client'

import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open:       boolean
  title:      string
  message:    string
  confirmLabel?: string
  onConfirm:  () => void
  onCancel:   () => void
  dangerous?: boolean
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, dangerous = true,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#111111] border border-white/[0.1] rounded-2xl p-6 w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex items-center gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/[0.1] hover:border-white/25 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={[
              'px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-150 cursor-pointer',
              dangerous
                ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25'
                : 'bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#8B5CF6] border border-[#8B5CF6]/25',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
