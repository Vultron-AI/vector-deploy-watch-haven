/**
 * ProductPage Component
 *
 * Displays a single product's details.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProductDetail } from '@/components/ProductDetail'
import { productsApi } from '@/services/productsApi'
import { useCart } from '@/hooks/useCart'
import { useToast, ToastProvider } from '@/components/ui'
import type { ProductDetail as ProductDetailType } from '@/types'

function ProductPageContent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [product, setProduct] = useState<ProductDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const data = await productsApi.getProduct(id)
        setProduct(data)
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await addItem(productId, quantity)
      toast({
        title: 'Added to Cart',
        description: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart`,
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'error',
      })
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <ProductDetail
      product={product}
      isLoading={isLoading}
      onAddToCart={handleAddToCart}
      onBack={handleBack}
    />
  )
}

export function ProductPage() {
  return (
    <ToastProvider position="top-center">
      <ProductPageContent />
    </ToastProvider>
  )
}
