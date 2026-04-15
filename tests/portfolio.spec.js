import { test, expect } from '@playwright/test'

test.describe('3D Portfolio', () => {

  test('page loads without console errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForTimeout(2000)

    expect(errors).toEqual([])
  })

  test('canvas element is rendered', async ({ page }) => {
    await page.goto('/')
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
    const box = await canvas.boundingBox()
    expect(box.width).toBeGreaterThan(100)
    expect(box.height).toBeGreaterThan(100)
  })

  test('canvas fills the viewport', async ({ page }) => {
    await page.goto('/')
    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()
    const viewport = page.viewportSize()
    expect(box.width).toBeCloseTo(viewport.width, 0)
    expect(box.height).toBeCloseTo(viewport.height, 0)
  })

  test('navigation dots are rendered for all 10 projects', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    const dots = page.locator('#nav-dots .nav-dot')
    await expect(dots).toHaveCount(10)
  })

  test('nav dots have aria labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    const firstDot = page.locator('#nav-dots .nav-dot').first()
    const label = await firstDot.getAttribute('aria-label')
    expect(label).toContain('Navigate to')
  })

  test('audio toggle button is present', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    const audioBtn = page.locator('#audio-toggle')
    await expect(audioBtn).toBeVisible()
    await expect(audioBtn).toHaveAttribute('aria-label', 'Toggle ambient audio')
  })

  test('clicking a nav dot opens the overlay', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const firstDot = page.locator('#nav-dots .nav-dot').first()
    await firstDot.click()

    await page.waitForTimeout(2000)

    const overlay = page.locator('#project-overlay')
    await expect(overlay).toBeAttached()

    const title = page.locator('#project-overlay .overlay-title')
    const titleText = await title.textContent()
    expect(titleText.length).toBeGreaterThan(0)
  })

  test('overlay shows project details with tech tags', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const firstDot = page.locator('#nav-dots .nav-dot').first()
    await firstDot.click()
    await page.waitForTimeout(2000)

    const description = page.locator('#project-overlay .overlay-description')
    const descText = await description.textContent()
    expect(descText.length).toBeGreaterThan(10)

    const tags = page.locator('#project-overlay .tech-tag')
    const tagCount = await tags.count()
    expect(tagCount).toBeGreaterThan(0)
  })

  test('overlay close button dismisses overlay', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const firstDot = page.locator('#nav-dots .nav-dot').first()
    await firstDot.click()
    await page.waitForTimeout(2000)

    const closeBtn = page.locator('#project-overlay .overlay-close')
    await closeBtn.click()
    await page.waitForTimeout(1000)

    const overlay = page.locator('#project-overlay')
    await expect(overlay).toHaveCSS('opacity', '0')
  })

  test('Escape key dismisses overlay', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const firstDot = page.locator('#nav-dots .nav-dot').first()
    await firstDot.click()
    await page.waitForTimeout(2000)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)

    const overlay = page.locator('#project-overlay')
    await expect(overlay).toHaveCSS('opacity', '0')
  })

  test('clicking different nav dots shows different projects', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const dots = page.locator('#nav-dots .nav-dot')

    await dots.nth(0).click()
    await page.waitForTimeout(2000)
    const title1 = await page.locator('#project-overlay .overlay-title').textContent()

    const closeBtn = page.locator('#project-overlay .overlay-close')
    await closeBtn.click()
    await page.waitForTimeout(1500)

    await dots.nth(3).click()
    await page.waitForTimeout(2500)
    const title2 = await page.locator('#project-overlay .overlay-title').textContent()

    expect(title1).not.toEqual(title2)
  })

  test('nav dot gets active class when clicked', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const secondDot = page.locator('#nav-dots .nav-dot').nth(1)
    await secondDot.click()
    await page.waitForTimeout(500)

    await expect(secondDot).toHaveClass(/active/)
  })

  test('canvas accepts pointer events without errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForTimeout(1500)

    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()

    await canvas.click({ position: { x: box.width / 2, y: box.height / 2 } })
    await page.waitForTimeout(500)
    await canvas.click({ position: { x: box.width * 0.3, y: box.height / 2 } })
    await page.waitForTimeout(500)

    expect(errors).toEqual([])
  })

  test('page has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('3D Portfolio')
  })

  test('no WebGL context lost errors', async ({ page }) => {
    const errors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('WebGL')) {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(3000)

    expect(errors).toEqual([])
  })

  test('overlay has pointer-events none when hidden', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const firstDot = page.locator('#nav-dots .nav-dot').first()
    await firstDot.click()
    await page.waitForTimeout(2000)

    const closeBtn = page.locator('#project-overlay .overlay-close')
    await closeBtn.click()
    await page.waitForTimeout(1000)

    const overlay = page.locator('#project-overlay')
    await expect(overlay).toHaveCSS('pointer-events', 'none')
  })

})
