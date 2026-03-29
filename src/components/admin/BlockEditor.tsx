'use client'

import { useState } from 'react'
import type { Block } from '@/lib/blog'

const INPUT  = "w-full bg-white/[0.04] border border-white/[0.1] focus:border-[#8B5CF6]/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/20"
const TEXTAREA = INPUT + " resize-none"
const SELECT = INPUT + " cursor-pointer"

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
    <div className="flex gap-2 items-start group">
      {/* Move handles */}
      <div className="flex flex-col gap-0.5 pt-2.5 shrink-0">
        <button onClick={() => onMove(-1)} disabled={isFirst}
          className="text-white/20 hover:text-white/50 disabled:opacity-0 cursor-pointer transition-colors duration-100">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button onClick={() => onMove(1)} disabled={isLast}
          className="text-white/20 hover:text-white/50 disabled:opacity-0 cursor-pointer transition-colors duration-100">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* Block type badge */}
      <span className="mt-2.5 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-white/25 w-16 text-right">
        {BLOCK_LABELS[block.type]}
      </span>

      {/* Block content */}
      <div className="flex-1 flex flex-col gap-2">
        {block.type === 'paragraph' && (
          <textarea rows={3} className={TEXTAREA} value={block.text}
            onChange={e => upd({ text: e.target.value })} placeholder="Paragraph text…" />
        )}
        {block.type === 'heading' && (
          <div className="flex gap-2">
            <select className={SELECT + ' w-20 shrink-0'} value={block.level}
              onChange={e => upd({ level: Number(e.target.value) as 2 | 3 })}>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
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
            <label className="flex items-center gap-2 text-white/50 text-xs cursor-pointer">
              <input type="checkbox" checked={block.ordered ?? false}
                onChange={e => upd({ ordered: e.target.checked })}
                className="accent-[#8B5CF6]" />
              Ordered list
            </label>
            {block.items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" className={INPUT} value={item}
                  onChange={e => {
                    const items = [...block.items]
                    items[idx] = e.target.value
                    upd({ items })
                  }}
                  placeholder={`Item ${idx + 1}`} />
                <button onClick={() => upd({ items: block.items.filter((_, j) => j !== idx) })}
                  className="text-white/25 hover:text-red-400 shrink-0 cursor-pointer transition-colors duration-150">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
          <div className="h-px bg-white/[0.08] rounded my-1" />
        )}
      </div>

      {/* Delete */}
      <button onClick={onDelete}
        className="mt-2.5 shrink-0 text-white/20 hover:text-red-400 cursor-pointer transition-colors duration-150">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
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
    <div className="flex flex-col gap-3">
      {value.map((block, i) => (
        <BlockRow key={i} block={block}
          onChange={b => update(i, b)}
          onDelete={() => remove(i)}
          onMove={dir => move(i, dir)}
          isFirst={i === 0}
          isLast={i === value.length - 1}
        />
      ))}

      <div className="flex items-center gap-2 pt-1">
        <select value={addType} onChange={e => setAddType(e.target.value as BlockType)}
          className={SELECT + ' max-w-[180px]'}>
          {(Object.keys(BLOCK_LABELS) as BlockType[]).map(t => (
            <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
          ))}
        </select>
        <button onClick={add}
          className="text-[#8B5CF6] text-xs font-medium hover:text-[#a78bfa] cursor-pointer transition-colors duration-150">
          + Add block
        </button>
      </div>
    </div>
  )
}
