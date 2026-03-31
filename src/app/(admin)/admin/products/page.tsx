import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/lib/admin/products'
import StatusBadge from '@/components/admin/StatusBadge'
import ProductActions from './ProductActions'

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-16 flex flex-col items-center gap-4">
          <p className="text-white/40 text-base">No products yet.</p>
          <Link href="/admin/products/new" className="text-[#8B5CF6] text-sm hover:text-[#a78bfa] transition-colors duration-150">Add your first product →</Link>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left text-white/35 text-xs font-semibold px-5 py-3.5">Product</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden sm:table-cell">Price</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden md:table-cell">Stock</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5">Status</th>
                <th className="text-right text-white/35 text-xs font-semibold px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                        {(() => {
                          const imgs: string[] = Array.isArray(p.images) ? p.images : []
                          const src: string = p.image || imgs[0] || ''
                          return src ? <Image src={src} alt={p.name} fill className="object-cover" sizes="40px" unoptimized={src.startsWith('http')} /> : null
                        })()}
                      </div>
                      <div>
                        <p className="text-white font-medium leading-tight">{p.name}</p>
                        <p className="text-white/35 text-xs mt-0.5">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-white/70">{p.price_display || `₹${p.price}`}</td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={p.stock < 10 ? 'text-red-400 font-medium' : 'text-white/70'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <ProductActions id={p.id} name={p.name} />
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
