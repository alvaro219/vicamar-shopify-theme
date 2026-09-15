import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {
  test('móvil: el cajón lleva de SHOP a Sábanas Bajeras', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'El cajón lateral es la navegación de móvil');

    await page.goto('/');
    await page.locator('#Details-menu-drawer-container > summary').click();
    await page.locator('#HeaderDrawer-shop').click();

    // Acotado al cajón: detrás, la portada también enlaza "Sábanas Bajeras"
    // desde las tarjetas de categoría y cuenta como visible.
    const enlace = page
      .locator('#Details-menu-drawer-container')
      .getByRole('link', { name: 'Sábanas Bajeras', exact: true })
      .filter({ visible: true });
    await expect(enlace).toBeVisible();
    await enlace.click();

    await expect(page).toHaveURL(/\/collections\/sabanas-bajeras/);
  });

  test('escritorio: SHOP muestra su flecha y abre el mega menú', async ({ page, isMobile }) => {
    test.skip(isMobile, 'El mega menú es la navegación de escritorio');

    await page.goto('/');
    // La flecha se hizo visible a propósito: sin ella SHOP parece un enlace normal.
    await expect(page.locator('.menu-list__disclosure').first()).toBeVisible();

    await page.locator('.menu-list__link', { hasText: 'SHOP' }).hover();
    // Acotado al menú de la cabecera: la portada también enlaza "Sábanas Bajeras"
    // desde las tarjetas de categoría.
    await expect(
      page
        .getByTestId('header-menu-overflow-list')
        .getByRole('link', { name: 'Sábanas Bajeras', exact: true })
        .filter({ visible: true }),
    ).toBeVisible();
  });
});
