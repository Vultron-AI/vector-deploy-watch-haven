/**
 * TypeScript interfaces for API data types
 */

// Category types
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  product_count: number
}

// Product types
export interface ProductListItem {
  id: string
  name: string
  slug: string
  price: string
  image: string
  brand: string
  category_name: string
  is_featured: boolean
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string
  price: string
  formatted_price: string
  image: string
  brand: string
  sku: string
  stock_quantity: number
  is_in_stock: boolean
  is_active: boolean
  is_featured: boolean
  category: Category
  created_at: string
  updated_at: string
}

// Cart types
export interface CartItem {
  product_id: string
  product: ProductListItem
  quantity: number
  line_total: string
}

export interface Cart {
  items: CartItem[]
  subtotal: string
  item_count: number
}

export interface CartResponse {
  message: string
  item_count: number
  subtotal: string
}

// Order types
export interface OrderItem {
  id: string
  product: string
  product_name: string
  product_price: string
  quantity: number
  line_total: string
}

export interface Order {
  id: string
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  customer_full_name: string
  shipping_address_line1: string
  shipping_address_line2: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
  shipping_address: string
  subtotal: string
  shipping_cost: string
  tax: string
  total: string
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// Checkout types
export interface CheckoutData {
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone?: string
  shipping_address_line1: string
  shipping_address_line2?: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
  card_number: string
  card_expiry: string
  card_cvc: string
}

// API Response types
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
