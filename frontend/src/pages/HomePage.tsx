/**
 * HomePage Component
 *
 * Main landing page with category navigation and product grid.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryNav } from '@/components/CategoryNav'
import { ProductGrid } from '@/components/ProductGrid'
import { productsApi } from '@/services/productsApi'
import type { Category, ProductListItem } from '@/types'

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const selectedCategory = searchParams.get('category')

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productsApi.getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true)
      setError(null)
      try {
        const response = await productsApi.getProducts({
          category: selectedCategory || undefined,
        })
        setProducts(response.results)
      } catch (err) {
        setError('Failed to load products')
        console.error('Failed to load products:', err)
      } finally {
        setIsLoadingProducts(false)
      }
    }
    loadProducts()
  }, [selectedCategory])

  const handleSelectCategory = (categorySlug: string | null) => {
    if (categorySlug) {
      setSearchParams({ category: categorySlug })
    } else {
      setSearchParams({})
    }
  }

  const handleProductClick = (product: ProductListItem) => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-[var(--color-fg)] mb-4">
          Discover Your Perfect Timepiece
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          Explore our curated collection of luxury watches from the world's finest brands.
        </p>
      </section>

      {/* Category Navigation */}
      <section>
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          isLoading={isLoadingCategories}
        />
      </section>

      {/* Error Message */}
      {error && (
        <div className="text-center py-8">
          <p className="text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Product Grid */}
      <section>
        <ProductGrid
          products={products}
          isLoading={isLoadingProducts}
          onProductClick={handleProductClick}
        />
      </section>
    </div>
  )
}
