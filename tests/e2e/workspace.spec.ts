import { test, expect } from '@playwright/test';
test('student login, own directory, forbidden view and logout', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Preview identity' }).click();
  await page.getByRole('option', { name: 'Aarav Sharma · student', exact: true }).click();
  await page.getByRole('button', { name: 'Open workspace', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A clearer view of your college.' }),
  ).toBeVisible();
  await page.goto('/?view=students');
  await expect(page.getByRole('cell', { name: /Aarav Sharma/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Diya Sen/ })).toHaveCount(0);
  await page.goto('/?view=invoices');
  await expect(page.getByText('Online collection is disabled', { exact: false })).toBeVisible();
  await page.goto('/?view=applications');
  await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible();
  if (await page.getByRole('button', { name: 'Toggle navigation' }).isVisible())
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByLabel('Preview identity')).toBeVisible();
});
test('admin creates a notice and sees it after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Preview identity' }).click();
  await page.getByRole('option', { name: 'Ananya Sen · admin', exact: true }).click();
  await page.getByRole('button', { name: 'Open workspace', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A clearer view of your college.' }),
  ).toBeVisible();
  await page.goto('/?view=notices');
  await page.getByRole('button', { name: 'New record' }).click();
  const title = `Synthetic browser test ${Date.now()}`;
  await page.getByLabel('Notice title *').fill(title);
  await page
    .getByLabel('Message *')
    .fill('A synthetic test notice, safe to retain in the development database.');
  await page.getByRole('button', { name: 'Save record' }).click();
  await expect(page.getByText('Saved to the college record.')).toBeVisible();
  await page.getByLabel('Search Noticeboard').fill(title);
  await page.reload();
  await expect(page.getByRole('cell', { name: title, exact: true })).toBeVisible();
});
test('public approved content and explicit Bengali fallback render', async ({ page }) => {
  await page.goto('/institution/about?language=bn');
  await expect(
    page.getByText('A reviewed Bengali translation is not available.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About the institution' })).toBeVisible();
});
