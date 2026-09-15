import { test, expect } from '@playwright/test';
import { sinErroresLiquid } from './utilidades';

test.describe('Listado de colección', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collections/juegos-de-cama');
  });

  test('las tarjetas muestran precio "Desde" y los tamaños en cm', async ({ page }) => {
    const principal = page.locator('main');

    // El precio sube con el tamaño de cama: sin "Desde" la tarjeta llevaría a engaño.
    await expect(principal.locator('.price').first()).toContainText('Desde');

    const tamanos = principal.locator('.tamanos-disponibles').first();
    await expect(tamanos).toBeVisible();
    await expect(tamanos).toContainText(/90 · 105 · 135 · 150 · 180 cm/);

    await sinErroresLiquid(page);
  });

  test('móvil: rejilla a dos columnas y filtros en cajón', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Comportamiento específico de móvil');

    const columnas = await page
      .locator('.product-grid')
      .first()
      .evaluate(rejilla => getComputedStyle(rejilla).gridTemplateColumns.trim().split(/\s+/).length);
    expect(columnas).toBe(2);

    await expect(page.getByRole('button', { name: /^Filtro/ }).filter({ visible: true }).first()).toBeVisible();
  });
});
