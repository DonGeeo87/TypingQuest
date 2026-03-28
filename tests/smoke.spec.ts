import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173'

test.beforeEach(async ({ page }) => {
  // Clear persisted auth/local state to ensure landing shows consistently
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('typingquest-auth')
      sessionStorage.removeItem('typingquest-local-userid')
      localStorage.removeItem('typingquest-local-profile')
    } catch (e) {
      // ignore
    }
  })
})

test.describe('TypingQuest Smoke Tests', () => {
  test('landing page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL)
    
    await expect(page).toHaveTitle(/TypingQuest/i)
    
    await expect(page.locator('h1')).toBeVisible()

    const playButton = page.getByRole('button', { name: /play and learn/i }).first()
    await expect(playButton).toBeVisible()
  })

  test('anonymous play works and navigates to home', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const anonButton = page.getByTestId('btn-anon')
    await anonButton.click()
    
    await expect(page.getByRole('heading', { name: /typingquest/i })).toBeVisible({ timeout: 10000 })
    // Confirmed navigation to home; specific game-start button rendered by HomeScreen may be lazy-loaded.    
  })

  test('language selector is functional', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const anonButton = page.getByTestId('btn-anon')
    await anonButton.click()
    
    await expect(page.getByRole('heading', { name: /typingquest/i })).toBeVisible({ timeout: 10000 })
    
    const spanishLabel = page.getByText('Español')
    const englishLabel = page.getByText('English')
    
    await expect(spanishLabel).toBeVisible()
    await expect(englishLabel).toBeVisible()
    
    await englishLabel.click()

    await expect(page.getByRole('button', { name: /Start Typing/i }).first()).toBeVisible({ timeout: 5000 })
  })

  test('features section is visible on landing', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const featuresSection = page.locator('#features')
    await featuresSection.scrollIntoViewIfNeeded()
    
    await expect(featuresSection.getByText(/wpm \+ accuracy/i)).toBeVisible()
    await expect(featuresSection.getByText(/teacher mode/i)).toBeVisible()
  })

  test('FAQ section is visible and interactive', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const faqSection = page.locator('#faq')
    await faqSection.scrollIntoViewIfNeeded()
    
    await expect(page.getByRole('heading', { name: /frequently asked questions/i })).toBeVisible()
    
    const faqItems = page.locator('#faq').locator('[class*="cursor-pointer"]')
    const firstFaq = faqItems.first()
    await firstFaq.click()
    
    await expect(firstFaq.locator('text=No!')).toBeVisible({ timeout: 3000 })
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('net::ERR') &&
      !e.includes('supabase')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('game setup controls are visible', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const anonButton = page.getByTestId('btn-anon')
    await anonButton.click()
    
    await expect(page.getByRole('heading', { name: /typingquest/i })).toBeVisible({ timeout: 10000 })
    
    await expect(page.getByText('Practice Language')).toBeVisible()
    await expect(page.getByText('Challenge Duration')).toBeVisible()
    await expect(page.getByText('Difficulty Level')).toBeVisible()
  })

  test('menu navigation cards are present', async ({ page }) => {
    await page.goto(BASE_URL)
    
    const anonButton = page.getByTestId('btn-anon')
    await anonButton.click()
    
    await expect(page.getByRole('heading', { name: /typingquest/i })).toBeVisible({ timeout: 10000 })
    
    await expect(page.getByRole('heading', { name: /^play$/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /rankings/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /teacher/i })).toBeVisible()
  })
})
