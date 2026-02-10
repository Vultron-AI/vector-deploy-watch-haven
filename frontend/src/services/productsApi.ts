/**
 * Products API Service
 */

import { api, PaginatedResponse } from './api'
import type { Category, ProductListItem, ProductDetail } from '@/types'

export interface ProductFilters {
  category?: string
  search?: string
  is_featured?: boolean
  ordering?: string
  page?: number
}

export const productsApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/products/categories/')
    return response.data
  },

  /**
   * Get products with optional filtering
   */
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<ProductListItem>> => {
    const params: Record<string, string | number | boolean> = {}

    if (filters?.category) {
      params.category = filters.category
    }
    if (filters?.search) {
      params.search = filters.search
    }
    if (filters?.is_featured !== undefined) {
      params.is_featured = filters.is_featured
    }
    if (filters?.ordering) {
      params.ordering = filters.ordering
    }
    if (filters?.page) {
      params.page = filters.page
    }

    const response = await api.get<PaginatedResponse<ProductListItem>>('/api/products/', { params })
    return response.data
  },

  /**
   * Get all products (unpaginated)
   */
  getAllProducts: async (filters?: Omit<ProductFilters, 'page'>): Promise<ProductListItem[]> => {
    const allProducts: ProductListItem[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await productsApi.getProducts({ ...filters, page })
      allProducts.push(...response.results)
      hasMore = response.next !== null
      page++
    }

    return allProducts
  },

  /**
   * Get a single product by ID
   */
  getProduct: async (id: string): Promise<ProductDetail> => {
    const response = await api.get<ProductDetail>(`/api/products/${id}/`)
    return response.data
  },

  /**
   * Get a single product by slug
   */
  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const response = await api.get<ProductDetail>(`/api/products/by-slug/${slug}/`)
    return response.data
  },
}
