import { test, expect } from '@playwright/test';
import { leerCarrito, sinErroresLiquid, vaciarCarrito } from './utilidades';

const BOTON_ANADIR = '[data-testid="standalone-add-to-cart"]';

test.describe('Ficha de producto y carrito', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await vaciarCarrito(page);
  });

  test('elegir 150 cm y Gris perla añade esa variante exacta', async ({ page }) => {
    await page.goto('/products/juego-sabanas-percal-200-hilos');
    await sinErroresLiquid(page);

    const idVariante = page.locator('form[action="/cart/add"] input[name="id"]').first();
    const idInicial = await idVariante.inputValue();

    await page.getByRole('radio', { name: '150 cm', exact: true }).check();
    await page.getByRole('radio', { name: 'Gris perla', exact: true }).check();
    // El formulario debe apuntar a otra variante, o se añadiría la de 90 cm.
    await expect(idVariante).not.toHaveValue(idInicial);

    await page.locator(BOTON_ANADIR).click();

    await expect.poll(async () => (await leerCarrito(page)).item_count).toBe(1);
    const { items } = await leerCarrito(page);
    expect(items[0].variant_title).toContain('150 cm');
    expect(items[0].variant_title).toContain('Gris perla');
  });

  test('en la ficha el precio es el de la variante, sin "Desde"', async ({ page }) => {
    await page.goto('/products/colcha-bouti-reversible');
    const precio = page.locator('main .price').first();
    await expect(precio).toBeVisible();
    await expect(precio).not.toContainText('Desde');
  });

  test('desde el carrito se llega al checkout', async ({ page }) => {
    await page.goto('/products/sabana-bajera-ajustable-algodon');
    await page.locator(BOTON_ANADIR).click();
    await expect.poll(async () => (await leerCarrito(page)).item_count).toBeGreaterThan(0);

    await page.goto('/cart');
    // Solo se comprueba que el checkout de Shopify carga: completar el pago
    // requiere la pasarela de pruebas y puede toparse con la protección
    // antibots del checkout.
    await Promise.all([
      page.waitForURL(/\/checkouts?\//, { timeout: 60_000 }),
      page.locator('[name="checkout"]').filter({ visible: true }).first().click(),
    ]);
  });
});
