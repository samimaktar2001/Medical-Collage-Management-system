import { test, expect } from '@playwright/test';

test('custom public filter selects the clicked option and submits its value', async ({ page }) => {
  await page.goto('/institution/notices');
  const category = page.getByRole('combobox', { name: 'Category', exact: true });
  await category.click();
  await page.getByRole('option', { name: 'Admissions', exact: true }).click();
  await expect(category).toHaveText('Admissions');
  await page.getByRole('button', { name: 'Filter notices', exact: true }).click();
  await expect(page).toHaveURL(/category=Admissions/);
  await expect(page.getByRole('status')).toContainText('1 current notices');
  await page.reload();
  await expect(category).toHaveText('Admissions');
});

test('multi-word keyboard typeahead selects the intended preview identity', async ({ page }) => {
  await page.goto('/');
  const identity = page.getByRole('combobox', { name: 'Preview identity' });
  await identity.pressSequentially('Dr. Neha');
  await identity.press('Enter');
  await expect(identity).toHaveText('Dr. Neha Paul · committee');
});

test('Escape preserves dirty form and dropdown Escape does not close dialog', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Preview identity' }).click();
  await page.getByRole('option', { name: 'Aarav Sharma · student', exact: true }).click();
  await page.getByRole('button', { name: 'Open workspace', exact: true }).click();
  await page.getByRole('heading', { name: 'A clearer view of your college.' }).waitFor();
  await page.goto('/?view=requests');
  await page.getByRole('button', { name: 'New record', exact: true }).click();
  const select = page.getByRole('combobox', { name: 'Request type', exact: true });
  await select.click();
  await select.press('Escape');
  await expect(page.getByRole('heading', { name: 'New student requests' })).toBeVisible();
  await page.getByLabel('Subject *', { exact: true }).fill('Unsaved synthetic QA');
  await page.getByLabel('Subject *', { exact: true }).press('Escape');
  await expect(page.getByText('Discard the unsaved changes in this form?')).toBeVisible();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel('Subject *', { exact: true })).toHaveValue('Unsaved synthetic QA');
});
