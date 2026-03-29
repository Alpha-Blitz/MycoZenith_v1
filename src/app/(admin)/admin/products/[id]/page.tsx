import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/admin/products'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  // Normalise JSONB arrays → typed arrays expected by ProductForm
  const initialData = {
    ...product,
    description_bullets: (product.description_bullets as string[] ?? []).map((t: string) => ({ text: t })),
  }

  return (
    <div>
      <h1 className="text-white font-semibold text-lg mb-6">Edit Product</h1>
      <ProductForm initialData={initialData} id={id} />
    </div>
  )
}
