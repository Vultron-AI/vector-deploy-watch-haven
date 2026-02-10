/**
 * E2E Tests - Cart functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test('empty cart displays appropriate message', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Should show empty cart message
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()

    // Should have continue shopping button
    await expect(page.getByRole('button', { name: /continue shopping/i })).toBeVisible()
  })

  test('continue shopping button navigates to home', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Click continue shopping
    await page.getByRole('button', { name: /continue shopping/i }).click()

    // Should navigate to home
    await expect(page).toHaveURL('/')
  })
})
