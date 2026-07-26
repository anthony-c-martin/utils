import { test, expect } from '@playwright/test';

// The app uses a HashRouter, so routes live under `/#/...`.

test.describe('navigation', () => {
  test('home page loads and nav links work', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: "Ant's Utils" })).toBeVisible();
    await expect(page.getByText('minimal utilities')).toBeVisible();

    const links = [
      'Text Utils',
      'Conversions',
      'Baking',
      'QR Code',
      'Quick Share',
      'Generation',
      'Matter',
    ];
    for (const name of links) {
      await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });
});

test('text utils: base64 encode', async ({ page }) => {
  await page.goto('/#/textutils');
  await page.getByRole('textbox').first().fill('hello');
  await page.getByRole('button', { name: 'Base64 Encode' }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue('aGVsbG8=');
});

test('conversions: celsius to fahrenheit', async ({ page }) => {
  await page.goto('/#/conversions');
  await page.locator('input:not([readonly])').first().fill('100');
  await expect(page.locator('input[readonly]').first()).toHaveValue('212');
});

test('baking: produces a converted amount', async ({ page }) => {
  await page.goto('/#/baking');
  const output = page.locator('input[readonly]').first();
  await expect(output).toHaveValue(/\d/);
});

test('qr code: renders a canvas for a url', async ({ page }) => {
  await page.goto('/#/qrcode');
  await page.getByRole('textbox').fill('https://example.com');
  await expect(page.locator('canvas')).toBeVisible();
});

test('quick share: builds a shareable link', async ({ page }) => {
  await page.goto('/#/quickshare');
  await page.getByRole('textbox').first().fill('some shared text');
  await expect(page.locator('input[readonly]').first()).toHaveValue(/\?data=/);
});

test('generation: creates a guid', async ({ page }) => {
  await page.goto('/#/generation');
  await page.getByRole('button', { name: 'Generate GUID' }).click();
  await expect(page.locator('input[readonly]').first()).toHaveValue(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('matter: decodes an identifier', async ({ page }) => {
  await page.goto('/#/matter');
  await page.getByPlaceholder('Enter a Matter identifier (e.g. MT:...)').fill('MT:ABBB5FPJ01YL2A3C400');
  await expect(page.getByText('Manual Pairing Code')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});
