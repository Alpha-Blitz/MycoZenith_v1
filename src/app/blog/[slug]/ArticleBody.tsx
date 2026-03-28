import Image from 'next/image'
import { headingId } from '@/lib/blog'
import type { Block } from '@/lib/blog'
import InlineProductCard from './InlineProductCard'

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i} className="text-white/70 text-base leading-[1.85] mb-5">
                {block.text}
              </p>
            )

          case 'heading':
            if (block.level === 2) {
              return (
                <h2
                  key={i}
                  id={headingId(block.text)}
                  className="text-white text-2xl font-semibold tracking-tight mt-10 mb-4 scroll-mt-24"
                >
                  {block.text}
                </h2>
              )
            }
            return (
              <h3
                key={i}
                id={headingId(block.text)}
                className="text-white text-lg font-semibold tracking-tight mt-7 mb-3 scroll-mt-24"
              >
                {block.text}
              </h3>
            )

          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-4 border-[#8B5CF6] pl-5 my-8 py-1"
              >
                <p className="text-white/65 text-base leading-relaxed italic mb-2">
                  "{block.text}"
                </p>
                {block.attribution && (
                  <cite className="text-white/35 text-xs not-italic">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            )

          case 'product':
            return <InlineProductCard key={i} slug={block.slug} />

          case 'list':
            if (block.ordered) {
              return (
                <ol key={i} className="list-decimal list-inside flex flex-col gap-2 my-6 ml-1">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-white/70 text-base leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              )
            }
            return (
              <ul key={i} className="flex flex-col gap-2 my-6">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-white/70 text-base leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )

          case 'image':
            return (
              <figure key={i} className="my-8">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 65vw"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-white/35 text-xs text-center mt-3">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'divider':
            return <hr key={i} className="border-white/[0.08] my-10" />

          default:
            return null
        }
      })}
    </div>
  )
}
