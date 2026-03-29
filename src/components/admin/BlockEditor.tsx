'use client'

import { useState } from 'react'
import type { Block } from '@/lib/blog'

const INPUT    = "w-full bg-white/[0.06] border border-white/[0.1] focus:border-[#8B5CF6]/60 text-white text-sm rounded-lg px-3 py-2 outline-none transition-colors duration-150 placeholder-white/30"
const TEXTAREA = INPUT + " resize-none"

type BlockType = Block['type']

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: 'Paragraph',
  heading:   'Heading',
  quote:     'Quote',
  product:   'Product',
  image:     'Image',
  list:      'List',
  divider:   'Divider',
}

const BLOCK_COLORS: Record<BlockType, string> = {
  paragraph: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  heading:   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  quote:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  product:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  image:     'bg-pink-500/20 text-pink-300 border-pink-500/30',
  list:      'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  divider:   'bg-white/10 text-white/40 border-white/20',
}

const BLOCK_LEFT: Record<BlockType, string> = {
  paragraph: 'bg-blue-500',
  heading:   'bg-purple-500',
  quote:     'bg-amber-500',
  product:   'bg-emerald-500',
  image:     'bg-pink-500',
  list:      'bg-cyan-500',
  divider:   'bg-white/20',
}

function makeEmpty(type: BlockType): Block {
  switch (type) {
    case 'paragraph': return { type: 'paragraph', text: '' }
    case 'heading':   return { type: 'heading', level: 2, text: '' }
    case 'quote':     return { type: 'quote', text: '', attribution: '' }
    case 'product':   return { type: 'product', slug: '' }
    case 'image':     return { type: 'image', src: '', alt: '', caption: '' }
    case 'list':      return { type: 'list', ordered: false, items: [''] }
    case 'divider':   return { type: 'divider' }
  }
}

function BlockRow({ block, onChange, onDelete, onMove, isFirst, isLast }: {
  block: Block
  onChange: (b: Block) => void
  onDelete: () => void
  onMove: (dir: -1 | 1) => void
  isFirst: boolean
  isLast: boolean
}) {
  function upd(patch: Partial<Block>) {
    onChange({ ...block, ...patch } as Block)
  }

  return (
    <div className="flex gap-0 group">
      {/* Colored left border */}
      <div className={`w-0.5 rounded-full shrink-0 ${BLOCK_LEFT[block.type]}`} />

      <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-r-xl rounded-bl-xl ml-2 overflow-hidden">
        {/* Block header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            {/* Move buttons */}
            <div className="flex gap-0.5">
              <button onClick={() => onMove(-1)} disabled={isFirst}
                className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 disabled:opacity-0 cursor-pointer transition-colors duration-100 rounded hover:bg-white/[0.06]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button onClick={() => onMove(1)} disabled={isLast}
                className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 disabled:opacity-0 cursor-pointer transition-colors duration-100 rounded hover:bg-white/[0.06]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
            {/* Type badge */}
            <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${BLOCK_COLORS[block.type]}`}>
              {BLOCK_LABELS[block.type]}
            </span>
          </div>

          {/* Delete */}
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all duration-150">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Block content */}
        <div className="p-3 flex flex-col gap-2">
          {block.type === 'paragraph' && (
            <textarea rows={3} className={TEXTAREA} value={block.text}
              onChange={e => upd({ text: e.target.value })} placeholder="Paragraph text…" />
          )}
          {block.type === 'heading' && (
            <div className="flex gap-2">
              <div className="relative shrink-0">
                <select
                  className="admin-select w-24 shrink-0 bg-[#0F0F0F] border border-white/[0.1] focus:border-[#8B5CF6]/60 text-white text-sm rounded-lg px-3 py-2 outline-none transition-colors duration-150 cursor-pointer"
                  value={block.level}
                  onChange={e => upd({ level: Number(e.target.value) as 2 | 3 })}
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              </div>
              <input type="text" className={INPUT} value={block.text}
                onChange={e => upd({ text: e.target.value })} placeholder="Heading text…" />
            </div>
          )}
          {block.type === 'quote' && (
            <>
              <textarea rows={2} className={TEXTAREA} value={block.text}
                onChange={e => upd({ text: e.target.value })} placeholder="Quote text…" />
              <input type="text" className={INPUT} value={block.attribution ?? ''}
                onChange={e => upd({ attribution: e.target.value })} placeholder="Attribution (optional)" />
            </>
          )}
          {block.type === 'product' && (
            <input type="text" className={INPUT} value={block.slug}
              onChange={e => upd({ slug: e.target.value })} placeholder="Product slug (e.g. lions-mane)" />
          )}
          {block.type === 'image' && (
            <>
              <input type="text" className={INPUT} value={block.src}
                onChange={e => upd({ src: e.target.value })} placeholder="Image URL or /public path" />
              <div className="flex gap-2">
                <input type="text" className={INPUT} value={block.alt}
                  onChange={e => upd({ alt: e.target.value })} placeholder="Alt text" />
                <input type="text" className={INPUT} value={block.caption ?? ''}
                  onChange={e => upd({ caption: e.target.value })} placeholder="Caption (optional)" />
              </div>
            </>
          )}
          {block.type === 'list' && (
            <>
              <label className="flex items-center gap-2 text-white/60 text-xs cursor-pointer">
                <input type="checkbox" checked={block.ordered ?? false}
                  onChange={e => upd({ ordered: e.target.checked })}
                  className="accent-[#8B5CF6]" />
                Ordered list
              </label>
              {block.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-white/25 text-xs w-4 text-right shrink-0">{block.ordered ? `${idx + 1}.` : '•'}</span>
                  <input type="text" className={INPUT} value={item}
                    onChange={e => {
                      const items = [...block.items]
                      items[idx] = e.target.value
                      upd({ items })
                    }}
                    placeholder={`Item ${idx + 1}`} />
                  <button onClick={() => upd({ items: block.items.filter((_, j) => j !== idx) })}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0 cursor-pointer transition-all duration-150">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
              <button onClick={() => upd({ items: [...block.items, ''] })}
                className="self-start text-[#8B5CF6] text-xs font-medium hover:text-[#a78bfa] cursor-pointer transition-colors duration-150">
                + Add item
              </button>
            </>
          )}
          {block.type === 'divider' && (
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-white/20 text-xs">divider</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BlockEditor({ value, onChange }: {
  value: Block[]
  onChange: (blocks: Block[]) => void
}) {
  const [addType, setAddType] = useState<BlockType>('paragraph')

  function update(i: number, b: Block) {
    const next = [...value]; next[i] = b; onChange(next)
  }
  function remove(i: number) {
    onChange(value.filter((_, j) => j !== i))
  }
  function move(i: number, dir: -1 | 1) {
    const next = [...value]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  function add() {
    onChange([...value, makeEmpty(addType)])
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 border border-dashed border-white/[0.08] rounded-xl">
          <p className="text-white/30 text-sm">No blocks yet</p>
          <p className="text-white/20 text-xs">Select a type below and click Add block</p>
        </div>
      )}

      {value.map((block, i) => (
        <BlockRow key={i} block={block}
          onChange={b => update(i, b)}
          onDelete={() => remove(i)}
          onMove={dir => move(i, dir)}
          isFirst={i === 0}
          isLast={i === value.length - 1}
        />
      ))}

      {/* Add block toolbar */}
      <div className="flex items-center gap-2 pt-2">
        <select
          value={addType}
          onChange={e => setAddType(e.target.value as BlockType)}
          className="flex-1 admin-select bg-[#0F0F0F] border border-white/[0.12] text-white/80 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#8B5CF6]/50 transition-colors duration-150 cursor-pointer"
        >
          {(Object.keys(BLOCK_LABELS) as BlockType[]).map(t => (
            <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
          ))}
        </select>
        <button onClick={add}
          className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer shrink-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add block
        </button>
      </div>
    </div>
  )
}
