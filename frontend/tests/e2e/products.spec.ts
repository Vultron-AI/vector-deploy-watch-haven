/**
 * E2E Tests - Product browsing functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('displays product catalog on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Header should be visible
    await expect(page.locator('header')).toBeVisible()

    // Should have the store logo/name
    await expect(page.locator('header').getByText(/ChronoLux/i)).toBeVisible()
  })

  test('can navigate to cart page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on cart icon in header
    await page.locator('header a[href="/cart"]').click()

    // Should be on cart page
    await expect(page).toHaveURL(/\/cart/)
  })

  test('cart page shows empty state when no items', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Should show empty cart message
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })
})
