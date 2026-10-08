import { test, expect } from '@playwright/test';

test('home has working content and downloadable resume', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Making AI systems/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Published work.' })).toBeVisible();
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('/projects/inferscope/');
  const social = await request.get('/social-card.png');
  expect(social.ok()).toBeTruthy();
  const resume = await request.get('/resume/Neeraj_Solanki_Resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('pdf');
  for (const slug of ['inferscope', 'chai', 'flare']) {
    const response = await request.get(`/projects/${slug}/`);
    expect(response.ok()).toBeTruthy();
  }
});

test('project filtering and chart controls work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Inference', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await expect(
    page.locator('.project-card:visible').getByRole('heading', { name: 'InferScope' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(3);
  await page.goto('/projects/inferscope/');
  await page.getByRole('button', { name: 'System throughput' }).click();
  await expect(page.locator('#chart-label')).toHaveText('System output tokens per second');
  await expect(page.locator('#chart-values')).toContainText('181.7');
});

test('command palette opens with keyboard and navigates', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Navigate portfolio' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search navigation commands' }).fill('chai');
  await expect(page.locator('#command-results a:visible')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/projects\/chai/);
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigate portfolio' })).toBeHidden();
});

test('theme, mobile navigation, and viewport layout work', async ({ page, isMobile }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', after!);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await page
      .getByRole('navigation', { name: 'Mobile' })
      .getByRole('link', { name: 'Work' })
      .click();
    await expect(page).toHaveURL(/#work$/);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflow).toBe(false);
});

test('reduced motion does not hide content or controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open command palette' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'InferScope' })).toBeVisible();
});

test('case studies fit narrow viewports', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['inferscope', 'chai', 'flare']) {
    await page.goto(`/projects/${slug}/`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `${slug} should fit the viewport`).toBe(false);
  }
});
